#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
function walk(dir){
  const out=[]; for(const n of fs.readdirSync(dir)){ const p=path.join(dir,n); if(fs.statSync(p).isDirectory()) out.push(...walk(p)); else out.push(p);} return out;
}
const md = walk(process.cwd()).filter(f=>f.endsWith('.md'));
const endpoints=new Set(); const routes=new Set(); const apis=new Set();
for(const f of md){ try{ const c=fs.readFileSync(f,'utf8'); const lines=c.split(/\r?\n/); for(const l of lines){ if(/\b(GET|POST|PUT|DELETE|PATCH)\b/.test(l) || /\/api\//.test(l)) { endpoints.add(`${f}: ${l.trim()}`); apis.add(`${f}: ${l.trim()}`); } if(/route\b|routes\b/i.test(f) || /\/api\//.test(l) || /\/v1\//.test(l)) { routes.add(`${f}: ${l.trim()}`); } }
} catch(e){} }
fs.writeFileSync('ENDPOINT.md', '# Aggregated Endpoints\n\n'+Array.from(endpoints).join('\n'));
fs.writeFileSync('ROUTES.md', '# Aggregated Routes\n\n'+Array.from(routes).join('\n'));
fs.writeFileSync('API.md', '# Aggregated API References\n\n'+Array.from(apis).join('\n'));
fs.writeFileSync('APIs_1.md', '# APIs_1 aggregated\n\n'+Array.from(apis).join('\n'));
console.log('Docs updated.');
