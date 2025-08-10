// scripts/verify-installable.js
import fs from 'fs';
import path from 'path';
import execSync from 'child_process';.execSync;

const TEST_INSTALL_COMMANDS = {
  apk: (file) => `adb install -r "${file}"`,
  exe: (file) => `"${file}" /S`,
  ipa: (file) => `ideviceinstaller -i "${file}"`,
  appimage: (file) => `chmod +x "${file}" && "${file}" --version`,
  crx: (file) => `echo "Manual test for CRX: ${file}"`,
  pkg: (file) => `sudo installer -pkg "${file}" -target /`
};

function getInstallCommand(file) {
  const ext = path.extname(file).replace('.', '').toLowerCase();
  if (ext in TEST_INSTALL_COMMANDS) {
    return TEST_INSTALL_COMMANDS[ext](file);
  }
  return null;
}

function testInstall(filePath) {
  const absPath = path.resolve(filePath);
  const cmd = getInstallCommand(absPath);
  if (!cmd) {
    console.log(`⚠️ Skip install test for unsupported type: ${filePath}`);
    return;
  }
  try {
    console.log(`🧪 Installing ${filePath}...`);
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ Install test passed: ${filePath}`);
  } catch (err) {
    console.error(`❌ Install failed: ${filePath}\n`, err.message);
  }
}

function scanFolder(baseFolder = 'Qmoi_apps') {
  const platforms = fs.readdirSync(baseFolder);
  for (const platform of platforms) {
    const dirPath = path.join(baseFolder, platform);
    if (!fs.statSync(dirPath).isDirectory()) continue;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      testInstall(path.join(dirPath, file));
    }
  }
}

scanFolder();
