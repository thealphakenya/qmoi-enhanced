const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

function isNewFeature(filePath) {
  // Simple heuristic: new .ts, .tsx, .js, .py, or .md file in watched dirs
  return /\.(ts|tsx|js|py|md)$/.test(filePath);
}

function generateStub(filePath) {
  // Example: create a stub if not present (expand as needed)
  if (filePath.endsWith('.md')) return;
  const stubContent = `// Auto-generated stub for ${path.basename(filePath)}\n// TODO: Implement feature\n`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, stubContent);
  }
}

function updateDocs(filePath) {
  // Example: append to FEATURESINDEX.md (expand as needed)
  const docPath = path.join('docs', 'FEATURESINDEX.md');
  const entry = `- ${filePath} (auto-detected)\n`;
  fs.appendFileSync(docPath, entry);
}

chokidar.watch(['src/', 'components/', 'devices/'], { ignored: /node_modules|\.git/ })
  .on('add', filePath => {
    if (isNewFeature(filePath)) {
      generateStub(filePath);
      updateDocs(filePath);
      console.log(`[AUTO] Stub and docs updated for ${filePath}`);
    }
  });

console.log('[QMOI AUTO-WATCHER] Watching for new features...'); 