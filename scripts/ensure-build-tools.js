// scripts/ensure-build-tools.js
import { execSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';

function execCmd(cmd, options = {}) {
  try {
    execSync(cmd, { stdio: 'inherit', ...options });
    return true;
  } catch (err) {
    console.warn(`⚠️ Command failed: ${cmd}\n${err.message}`);
    return false;
  }
}

function getUserPythonScriptsDir() {
  const home = os.homedir();
  const major = process.version.match(/^v(\d+)/)?.[1] || '3';
  return path.join(home, 'AppData', 'Roaming', 'Python', `Python3${major}`, 'Scripts');
}

console.log('🛠️ Checking required tools...\n');

// ✅ Check Python
if (!execCmd('python --version')) {
  console.error('❌ Python is not installed or not in PATH.\n👉 Download from https://www.python.org/downloads/');
  process.exit(1);
}

// ✅ Check pip
if (!execCmd('pip --version')) {
  console.error('❌ pip not found. Make sure to install Python with "Add to PATH" and enable pip.');
  process.exit(1);
}

// ✅ Check or install PyInstaller
let pyInstallerInstalled = execCmd('pyinstaller --version');
if (!pyInstallerInstalled) {
  console.log('⏳ PyInstaller not found. Attempting to install with pip...');
  const installed = execCmd('python -m pip install --user pyinstaller');
  const scriptsDir = getUserPythonScriptsDir();

  const pyinstallerPath = path.join(scriptsDir, os.platform() === 'win32' ? 'pyinstaller.exe' : 'pyinstaller');
  if (installed && fs.existsSync(pyinstallerPath)) {
    console.log(`✅ PyInstaller installed to: ${pyinstallerPath}`);
    process.env.PATH += `${path.delimiter}${scriptsDir}`;
  } else {
    console.error('❌ Failed to install PyInstaller. Try running:\n   python -m pip install --user pyinstaller');
    process.exit(1);
  }
}

// ✅ Check for Visual Studio Build Tools
if (os.platform() === 'win32') {
  console.log('\n🪟 Verifying Visual Studio Build Tools...');

  try {
    execCmd('where cl');
    console.log('✅ C++ Build Tools found (cl.exe)');
  } catch {
    console.warn('⚠️ C++ Build Tools not found.');
    console.warn('👉 Please manually install "Desktop development with C++" from Visual Studio Installer:\nhttps://visualstudio.microsoft.com/downloads/');
  }
}

console.log('\n✅ All required build tools are ready.\n');
