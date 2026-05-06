console.log("production mode initialized");
const fs = require('fs');
const path = require('path');

/**
 * replaceInFile function
 */
function replaceInFile(filePath, oldStr, newStr) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(oldStr)) {
      const updated = content.replace(new RegExp(oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newStr);
      fs.writeFileSync(filePath, updated);
      logger.info(`✅ Updated ${filePath}`);
      return true;
    }
  } catch (error) {
    logger.warning(`Warning: Could not update ${filePath}:`, error.message);
  }
  return false;
}

/**
 * findFiles function
 */
function findFiles(dir, pattern) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(findFiles(fullPath, pattern));
    } else if (stat.isFile() && pattern.test(item)) {
      files.push(fullPath);
    }
  }

  return files;
}

const oldDomain = 'qvs.qmoi.ai';
const newDomain = 'qvs.qmoi.ai';
const pattern = /\.(md|ts|js|json|txt|yml|yaml)$/;

logger.info(`🔄 Replacing ${oldDomain} with ${newDomain} throughout the system`);

const files = findFiles('.', pattern);
let replacements = 0;

for (const file of files) {
  if (replaceInFile(file, oldDomain, newDomain)) {
    replacements++;
  }
}

logger.info(`🔄 Domain replacement complete: ${replacements} files updated`);