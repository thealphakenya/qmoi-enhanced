import fs from 'fs';
import path from 'path';

function generateStub(filePath) {
  if (filePath.endsWith('.md')) return;
  const stubContent = `// Auto-generated stub for ${path.basename(filePath)}\n// TODO: Implement feature\n`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, stubContent);
  }
}

function updateDocs(filePath) {
  const docPath = path.join('docs', 'FEATURESINDEX.md');
  const entry = `- ${filePath} (auto-detected)\n`;
  fs.appendFileSync(docPath, entry);
}

module.exports = { generateStub, updateDocs }; 