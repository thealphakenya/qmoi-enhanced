import fs from 'fs';
import { execSync } from 'child_process';

const changelogPath = 'CHANGELOG.md';

if (!fs.existsSync(changelogPath)) {
  console.log('CHANGELOG.md not found. Generating from commits...');
  const log = execSync('conventional-changelog -p angular -r 0').toString();
  fs.writeFileSync(changelogPath, log);
  console.log('CHANGELOG.md generated successfully.');
} else {
  console.log('CHANGELOG.md exists. Skipping.');
}
