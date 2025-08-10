// scripts/generate-installer-assets.js
import fs from 'fs';
import path from 'path';

const installerDir = path.join("public", "installers");
fs.mkdirSync(installerDir, { recursive: true });

fs.copyFileSync("public/icon.ico", path.join(installerDir, "icon.ico"));
fs.copyFileSync("public/qmoiai_qrcode.png", path.join(installerDir, "qmoiai_qrcode.png"));
fs.copyFileSync("public/splash.html", path.join(installerDir, "splash.html"));

console.log("📦 Installer assets prepared in public/installers/");