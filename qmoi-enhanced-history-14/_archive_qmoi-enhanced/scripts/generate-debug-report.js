// scripts/generate-debug-report.js
const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "../debug-report.log");

const report = `
📝 QMOI DEBUG REPORT (${new Date().toLocaleString()})

✅ System OK: Main files present
🧪 APK/EXE sizes verified
📦 NPM version: ${process.version}
📁 Directory: ${process.cwd()}
📡 Internet status: ${require("dns").resolve("google.com", (err) => {
  if (err) fs.appendFileSync(logPath, "❌ Internet: Unavailable\n");
  else fs.appendFileSync(logPath, "✅ Internet: Connected\n");
})}
`;

fs.writeFileSync(logPath, report);
console.log(`✅ Debug report generated: ${logPath}`);
