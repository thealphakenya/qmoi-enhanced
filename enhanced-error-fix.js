/* eslint-env node */
// enhanced-error-fix.ts
import { execSync } from 'child_process';
import path from 'path';
import axios from 'axios';

const maxTries = 10;
let lastLint = '', lastType = '', lastTest = '';
let allClean = false;

for (let i = 0; i < maxTries; i++) {
  console.log(`\n--- QMOI Auto-Dev: Auto-fix round ${i + 1} ---`);
  try {
    execSync('npx eslint . --fix', { stdio: 'inherit' });
  } catch (e) {
    console.warn('ESLint --fix encountered issues, continuing...');
  }
  try {
    execSync('npx prettier --write .', { stdio: 'inherit' });
  } catch (e) {
    console.warn('Prettier encountered issues, continuing...');
  }
  try {
    lastLint = execSync('npx eslint .', { encoding: 'utf8' });
    console.log('ESLint output:', lastLint);
  } catch (e) {
    lastLint = e.stdout ? e.stdout.toString() : e.message;
    console.warn('ESLint errors remain.');
  }
  try {
    lastType = execSync('npx tsc --noEmit', { encoding: 'utf8' });
    console.log('TypeScript output:', lastType);
  } catch (e) {
    lastType = e.stdout ? e.stdout.toString() : e.message;
    console.warn('Type errors remain.');
  }
  try {
    lastTest = execSync('npm test', { encoding: 'utf8' });
    console.log('Test output:', lastTest);
  } catch (e) {
    lastTest = e.stdout ? e.stdout.toString() : e.message;
    console.warn('Test failures remain.');
  }
  if (!lastLint.match(/error|fail|not defined|parsing/i) && !lastType.match(/error|fail|not defined|parsing/i) && lastTest.match(/pass|success|all tests passed/i)) {
    allClean = true;
    console.log('All errors fixed and tests passing!');
    break;
  }
}

if (!allClean) {
  console.log('\nQMOI Auto-Dev: Some errors could not be auto-fixed. Manual intervention required.');
  console.log('Final Lint Output:', lastLint);
  console.log('Final Type Output:', lastType);
  console.log('Final Test Output:', lastTest);
} else {
  console.log('\nQMOI Auto-Dev: Codebase is clean!');
}

module.exports = { fixFile };
