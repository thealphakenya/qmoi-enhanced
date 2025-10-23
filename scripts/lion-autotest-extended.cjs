#!/usr/bin/env node
// Extended Lion autotest orchestrator
// - runs lint, unit tests, node-scoped tests
// - sets up and runs E2E/UI tests (Playwright/Cypress) if present
// - runs multi-platform builds where configured
// - conservative: only runs commands that exist in package.json or files that exist

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const track = require('./track.cjs');

function writeTrack(component, level, message, data) {
  try { track.writeTrack(component, level, message, data); } catch(err){ console.error('track write failed', err); }
}

function run(cmd, args, opts = {}){
  writeTrack('lion-autotest-extended', 'info', `run ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, Object.assign({ stdio: 'inherit', shell: true, cwd: process.cwd() }, opts));
  if(r.error) throw r.error;
  if(r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} exited ${r.status}`);
  return r.status;
}

function packageJson(){
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(),'package.json'),'utf8')); } catch(e){ return null; }
}

async function main(){
  writeTrack('lion-autotest-extended','info','started',{cwd:process.cwd()});
  const pkg = packageJson();
  // 1. lint if available
  try{
    if(pkg && pkg.scripts && (pkg.scripts.lint || pkg.scripts['lint:fix'])){
      writeTrack('lion-autotest-extended','info','running-lint');
      run('npm','run lint');
    } else if(fs.existsSync('.eslintrc') || fs.existsSync('.eslintrc.js')){
      writeTrack('lion-autotest-extended','info','running-eslint-cli');
      run('npx','eslint . --ext .js,.cjs,.ts,.tsx');
    } else {
      writeTrack('lion-autotest-extended','info','skip-lint','no-lint-config');
    }
  }catch(err){ writeTrack('lion-autotest-extended','error','lint-failed',{error: String(err)}); }

  // 2. run node-scoped tests
  try{
    if(pkg && pkg.scripts && pkg.scripts['test:node']){
      writeTrack('lion-autotest-extended','info','running-test-node');
      run('npm','run test:node');
    } else if(pkg && pkg.scripts && pkg.scripts.test){
      writeTrack('lion-autotest-extended','info','running-test');
      run('npm','run test');
    } else {
      writeTrack('lion-autotest-extended','info','skip-tests','no-test-script');
    }
  }catch(err){ writeTrack('lion-autotest-extended','error','tests-failed',{error:String(err)}); }

  // 3. Setup and run E2E/UI tests if present
  try{
    const hasPlaywright = pkg && ((pkg.devDependencies && pkg.devDependencies.playwright) || (pkg.dependencies && pkg.dependencies.playwright));
    const hasCypress = pkg && ((pkg.devDependencies && pkg.devDependencies.cypress) || (pkg.dependencies && pkg.dependencies.cypress));
    if(hasPlaywright){
      writeTrack('lion-autotest-extended','info','playwright-detected');
      // ensure browsers installed
      try{ run('npx','playwright install --with-deps'); } catch(e){ writeTrack('lion-autotest-extended','warn','playwright-install-failed',{error:String(e)}); }
      // run tests if script exists
      if(pkg.scripts && pkg.scripts['test:e2e']){ run('npm','run test:e2e'); }
      else { run('npx','playwright test'); }
    } else if(hasCypress){
      writeTrack('lion-autotest-extended','info','cypress-detected');
      if(pkg.scripts && pkg.scripts['test:e2e']){ run('npm','run test:e2e'); }
      else { run('npx','cypress','run'); }
    } else {
      writeTrack('lion-autotest-extended','info','no-e2e-detected');
    }
  }catch(err){ writeTrack('lion-autotest-extended','error','e2e-failed',{error:String(err)}); }

  // 4. Run multi-platform builds if configured
  try{
    const buildScriptExists = pkg && pkg.scripts && (pkg.scripts.build || pkg.scripts['build:app'] || pkg.scripts['build:android'] || pkg.scripts['build:ios']);
    const hasElectronConfig = fs.existsSync(path.join(process.cwd(),'electron-builder.json')) || fs.existsSync(path.join(process.cwd(),'electron-builder.yml'));
    if(buildScriptExists || hasElectronConfig){
      writeTrack('lion-autotest-extended','info','starting-builds');
      // prefer explicit scripts
      if(pkg.scripts && pkg.scripts['build:all']){ run('npm','run build:all'); }
      if(pkg.scripts && pkg.scripts.build){ run('npm','run build'); }
      if(pkg.scripts && pkg.scripts['build:app']){ run('npm','run build:app'); }
      // electron
      if(hasElectronConfig){
        writeTrack('lion-autotest-extended','info','electron-config-found');
        try{ run('npx','electron-builder -c electron-builder.json'); } catch(e){ writeTrack('lion-autotest-extended','warn','electron-build-failed',{error:String(e)}); }
      }
      // android/ios placeholders
      if(pkg.scripts && pkg.scripts['build:android']){ run('npm','run build:android'); }
      if(pkg.scripts && pkg.scripts['build:ios']){ run('npm','run build:ios'); }
    } else {
      writeTrack('lion-autotest-extended','info','skip-builds','no-build-scripts');
    }
  }catch(err){ writeTrack('lion-autotest-extended','error','builds-failed',{error:String(err)}); }

  // 5. run repo-inspector and autofix dry-run
  try{
    const inspector = path.join(process.cwd(),'scripts','repo-inspector.cjs');
    if(fs.existsSync(inspector)){
      writeTrack('lion-autotest-extended','info','running-repo-inspector');
      run('node', ['scripts/repo-inspector.cjs', '--dry-run']);
    } else writeTrack('lion-autotest-extended','info','no-repo-inspector');
  }catch(err){ writeTrack('lion-autotest-extended','error','repo-inspector-failed',{error:String(err)}); }

  writeTrack('lion-autotest-extended','info','completed');
}

main().catch(err=>{ writeTrack('lion-autotest-extended','fatal','uncaught',{error:String(err)}); console.error(err); process.exit(1); });
