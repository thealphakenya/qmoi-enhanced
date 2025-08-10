const QRCode = require("qrcode");
const fs = require("fs");
const os = require("os");
const path = require("path");
const interfaces = os.networkInterfaces();

function getLocalIP() {
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "127.0.0.1";
}

(async () => {
  const ip = getLocalIP();
  const url = `http://${ip}:8000`;
  const outputPath = path.join("public", "qmoiai_qrcode.png");
  await QRCode.toFile(outputPath, url);
  console.log(`✅ QR Code generated at ${outputPath} for ${url}`);
})();
