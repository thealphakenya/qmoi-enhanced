// scripts/fallback-assets.js
import fs from 'fs';
import path from 'path';

const installersDir = path.join("public", "installers");
const qrPath = path.join("public", "qmoiai_qrcode.png");

fs.mkdirSync(installersDir, { recursive: true });

if (!fs.existsSync(qrPath)) {
  const defaultQR = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAABWEsSIAAAAAXNSR0IArs4c6QAAAOZJREFUWMPt0TEOgzAMBEG7F///zrbTxrN9ogHTK5gYiYPL7vIgTIlZQAAKq7hTI5EwLIlpAz0UHo3S9GClTjXqTAb5mavsnlzmSVlAUWJkrsCSX8QHyxhzZNhEXLDLiwJtVQg+g9iSSxJGaxuFfZhGkxDOjxKiw1HqNMtHo92ad7Pt3UQXL8mgk94LtMEmkv4ng5F8ZLGs4IQf7M1DFiyZ9cRO0FrXZKAAAAAElFTkSuQmCC",
    "base64"
  );
  fs.writeFileSync(qrPath, defaultQR);
  console.log("📎 Fallback QR code placeholder created.");
}

const testReadme = path.join("public", "installers", "README.txt");
fs.writeFileSync(testReadme, `Installer assets for QMOI Alpha AI\nGenerated on ${new Date().toISOString()}`);
console.log("📝 Installer README.txt created.");
