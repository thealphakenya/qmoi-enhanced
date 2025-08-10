// scripts/log-summary.js
import fs from 'fs';

console.log('📋 QMOI App Build Summary:');

const summaryFile = 'logs/app-summary.log';
if (!fs.existsSync('logs')) fs.mkdirSync('logs');

let log = `🕒 Report: ${new Date().toLocaleString()}\n`;

const apps = fs.readdirSync('Qmoi_apps', { withFileTypes: true });

for (const platform of apps) {
  if (platform.isDirectory()) {
    const subapps = fs.readdirSync(`Qmoi_apps/${platform.name}`);
    for (const file of subapps) {
      const filePath = `Qmoi_apps/${platform.name}/${file}`;
      const sizeMB = fs.statSync(filePath).size / (1024 * 1024);
      log += `✅ ${platform.name} - ${file}: ${sizeMB.toFixed(2)} MB\n`;
    }
  }
}

fs.writeFileSync(summaryFile, log);
console.log(log);
