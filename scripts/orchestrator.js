#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
function run(cmd){ console.log('> '+cmd); try{ return execSync(cmd,{stdio:'inherit'}); } catch(e){ /* continue */ }}
// 1. run initial type-check
run('npx tsc --noEmit 2> /tmp/tsc_output.txt || true');
// 2. count errors
let out=''; try { out = require('fs').readFileSync('/tmp/tsc_output.txt','utf8'); } catch(e) { out=''; }
const matches = (out.match(/error TS/g)||[]).length;
console.log('TS errors detected:', matches);
// 3. run autoheal
run('node scripts/autoheal.js');
// 4. update docs
run('node scripts/update-docs.js');
// 5. re-run type-check
run('npx tsc --noEmit 2> /tmp/tsc_output_after.txt || true');
const after = require('fs').readFileSync('/tmp/tsc_output_after.txt','utf8');
const afterCount = (after.match(/error TS/g)||[]).length;
console.log('TS errors after autoheal:', afterCount);
// 6. update ALLERRORS.md simple section
try{
  const md = fs.readFileSync('ALLERRORS.md','utf8');
  const updated = md.replace(/Last scan: .*\n/,'Last scan: '+new Date().toISOString()+'\n');
  fs.writeFileSync('ALLERRORS.md', updated);
  console.log('ALLERRORS.md updated timestamp');
}catch(e){ console.error('Failed to update ALLERRORS.md', e.message); }
console.log('Orchestrator completed.');
