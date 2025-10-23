#!/usr/bin/env node
// Multi-platform build orchestrator (conservative)
// - Detects electron config, npm build scripts, and mobile build scripts
// - Runs existing scripts where available; does NOT create keys or upload
// - Writes tracks

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const track = require('./track.cjs');

function writeTrack(component, level, message, data){
  try{ track.writeTrack(component, level, message, data); }catch(e){ console.error('track write failed', e); }
}

function run(cmd, args){
  writeTrack('build-all-platforms','info',`run ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true });
  if(r.error) throw r.error;
  if(r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} exited ${r.status}`);
}

function pkg(){
  try{ return JSON.parse(fs.readFileSync(path.join(process.cwd(),'package.json'),'utf8')); }catch(e){ return null; }
}

async function main(){
  writeTrack('build-all-platforms','info','started');
  const p = pkg();
  const hasElectronConfig = fs.existsSync(path.join(process.cwd(),'electron-builder.json')) || fs.existsSync(path.join(process.cwd(),'electron-builder.yml')) || fs.existsSync(path.join(process.cwd(),'electron-builder.js'));

  try{
    if(p && p.scripts){
      if(p.scripts['build:all']){ writeTrack('build-all-platforms','info','run-script','build:all'); run('npm',['run','build:all']); }
      if(p.scripts.build){ writeTrack('build-all-platforms','info','run-script','build'); run('npm',['run','build']); }
      if(p.scripts['build:desktop']){ writeTrack('build-all-platforms','info','run-script','build:desktop'); run('npm',['run','build:desktop']); }
      if(p.scripts['build:android']){ writeTrack('build-all-platforms','info','run-script','build:android'); run('npm',['run','build:android']); }
      if(p.scripts['build:ios']){ writeTrack('build-all-platforms','info','run-script','build:ios'); run('npm',['run','build:ios']); }
    }

    if(hasElectronConfig){
      writeTrack('build-all-platforms','info','electron-config-found');
      try{ run('npx',['electron-builder','-c','electron-builder.json']); }catch(e){ writeTrack('build-all-platforms','warn','electron-builder-failed',{error:String(e)}); }
    }

    // detect Android/iOS native folders
    if(fs.existsSync('android') || fs.existsSync('android/app')){
      writeTrack('build-all-platforms','info','android-project-detected');
      if(fs.existsSync('gradlew') || fs.existsSync('android/gradlew')){
        writeTrack('build-all-platforms','info','running-gradle-build');
        try{ run('bash',['-lc','(cd android && ./gradlew assembleRelease)']); }catch(e){ writeTrack('build-all-platforms','warn','gradle-build-failed',{error:String(e)}); }
      } else {
        writeTrack('build-all-platforms','info','no-gradlew','skip-android-native-build');
      }
    }

    if(fs.existsSync('ios') || fs.existsSync('ios/Podfile')){
      writeTrack('build-all-platforms','info','ios-project-detected');
      // iOS builds require macOS and signing; we skip actual archive but run pod install if in CI mac
      if(fs.existsSync('ios/Podfile')){
        try{ run('bash',['-lc','(cd ios && pod install || true)']); }catch(e){ writeTrack('build-all-platforms','warn','pod-install-failed',{error:String(e)}); }
      }
    }
  }catch(err){ writeTrack('build-all-platforms','error','build-failed',{error:String(err)}); }

  writeTrack('build-all-platforms','info','completed');
}

main().catch(err=>{ writeTrack('build-all-platforms','fatal','uncaught',{error:String(err)}); console.error(err); process.exit(1); });
