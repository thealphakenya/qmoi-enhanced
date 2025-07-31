// scripts/splash-animations.js
const fs = require("fs");
const path = require("path");

const splashHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>QMOI Alpha AI</title>
  <style>
    html, body {
      margin: 0; padding: 0; background: #1e1e3c; height: 100%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-family: 'Segoe UI', sans-serif;
    }
    .loader {
      width: 200px; height: 200px;
      border: 12px solid rgba(255, 255, 255, 0.1);
      border-top: 12px solid #5a1478;
      border-radius: 50%;
      animation: spin 1.2s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .label {
      position: absolute; top: 60%; font-size: 24px;
    }
  </style>
</head>
<body>
  <div class="loader"></div>
  <div class="label">Launching QMOI Alpha AI...</div>
</body>
</html>
`;

const outPath = path.join("public", "splash.html");
fs.writeFileSync(outPath, splashHtml);
console.log(`🎬 Splash animation HTML saved at ${outPath}`);
