// scripts/splash-animations.js
import fs from 'fs';
import path from 'path';
const splashHTML = `<!DOCTYPE html>
<html><head><style>
body { background: black; margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; }
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
div {
  font-family: Arial; font-size: 2rem; color: white;
  animation: fadeIn 1s ease-out forwards;
}
</style></head><body>
  <div>✨ Launching QMOI Alpha AI...</div>
</body></html>`;

const outputPath = path.join("public", "splash.html");
fs.writeFileSync(outputPath, splashHTML);
console.log(`🎬 Splash animation HTML saved at ${outputPath}`);