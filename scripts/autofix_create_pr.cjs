#!/usr/bin/env node
const { execSync } = require('child_process');
const branch = 'autofix/' + Date.now();
console.log('Creating branch', branch);
execSync(`git checkout -b ${branch}`, { stdio: 'inherit' });
try {
  execSync('npx eslint --fix "src/**/*.ts"', { stdio: 'inherit' });
} catch (e) {
  console.error('eslint --fix failed or no eslint configured.');
}
console.log('Files fixed (if any). Review and push the branch manually to create a PR.');
