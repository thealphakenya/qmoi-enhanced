#!/usr/bin/env node
// Setup helper for E2E tests (Playwright/Cypress)
// - Detects Playwright or Cypress in package.json
// - Installs dependencies and browsers when necessary (npx playwright install)
// - Prints summary and writes tracks

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const track = require('./track.cjs');

function writeTrack(component, level, message, data){
  try { track.writeTrack(component, level, message, data); } catch(e){ console.error('track failed', e); }
}

function run(cmd, args){
  writeTrack('setup-e2e','info',`run ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true });
  if(r.error) throw r.error;
  if(r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed ${r.status}`);
}

function pkg(){
  try{ return JSON.parse(fs.readFileSync(path.join(process.cwd(),'package.json'),'utf8')); }catch(e){ return null; }
}

async function main(){
  writeTrack('setup-e2e','info','started');
  const p = pkg();
  const hasPlaywright = p && ((p.devDependencies && p.devDependencies.playwright) || (p.dependencies && p.dependencies.playwright));
  const hasCypress = p && ((p.devDependencies && p.devDependencies.cypress) || (p.dependencies && p.dependencies.cypress));

  if(hasPlaywright){
    writeTrack('setup-e2e','info','playwright-detected');
    try{ run('npx',['playwright','install']); writeTrack('setup-e2e','info','playwright-install-success'); }catch(e){ writeTrack('setup-e2e','error','playwright-install-failed',{error:String(e)}); }
  }
  if(hasCypress){
    writeTrack('setup-e2e','info','cypress-detected');
    // Cypress automatically downloads browsers during first run; optionally run an install step
    try{ run('npx',['cypress','install']); writeTrack('setup-e2e','info','cypress-install-success'); }catch(e){ writeTrack('setup-e2e','warn','cypress-install-failed',{error:String(e)}); }
  }
  if(!hasPlaywright && !hasCypress){ writeTrack('setup-e2e','info','no-e2e-framework-detected'); }
  writeTrack('setup-e2e','info','completed');
}

main().catch(err=>{ writeTrack('setup-e2e','fatal','uncaught',{error:String(err)}); console.error(err); process.exit(1); });
