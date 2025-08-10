// scripts/generate-release-json.js
import { execSync } from 'child_process';
import fs from 'fs';

const version = 'v' + new Date().toISOString().split('T')[0].replace(/-/g, '.');
const title = `QMOI ${version} Auto Release`;
const changelog = execSync('git log -1 --pretty=format:"%h - %s [%an]"').toString();

const content = {
  version,
  title,
  changelog: `🔄 Latest Commit:\n${changelog}`
};

fs.writeFileSync('release.json', JSON.stringify(content, null, 2));
console.log(`✅ Auto-generated release.json`);
