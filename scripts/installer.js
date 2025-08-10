/* eslint-env node */
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const termsPath = path.join(__dirname, '../QTEAMTERMS.md');

function showTerms() {
  const terms = fs.readFileSync(termsPath, 'utf-8');
  console.log('\n=== QTEAM TERMS AND REGULATIONS ===\n');
  console.log(terms);
}

function askAgreement() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('\nDo you agree to all the above terms and grant all permissions required? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'yes');
    });
  });
}

async function main() {
  showTerms();
  const agreed = await askAgreement();
  if (!agreed) {
    console.log('You must agree to the terms to install and use this application. Exiting.');
    process.exit(1);
  }
  // Simulate requesting all permissions
  console.log('\nRequesting all necessary device permissions...');
  setTimeout(() => {
    console.log('All permissions granted. Setup complete!');
    console.log('Welcome to Alpha-Q-AI! 🚀');
  }, 1500);
}

main(); 