#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { parse } from '@babel/parser';
import recast from 'recast';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.argv[2] || process.cwd();
const dryRun = process.argv.includes('--dry-run');
const logFile = path.join(__dirname, 'convert-require-to-import.log');

// Logging utility
function log(message) {
  fs.mkdirSync(__dirname, { recursive: true });
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${message}\n`);
}

// Get git-tracked files
function getGitTrackedFiles() {
  try {
    const output = execSync('git ls-files', { cwd: projectRoot, encoding: 'utf-8' });
    return new Set(output.split('\n').filter(Boolean).map(f => path.resolve(projectRoot, f)));
  } catch (err) {
    console.error(chalk.red(`❌ Error getting git-tracked files: ${err.message}`));
    process.exit(1);
  }
}

const trackedFiles = getGitTrackedFiles();

function isRequireCall(node) {
  return (
    node?.type === 'CallExpression' &&
    node.callee?.type === 'Identifier' &&
    node.callee.name === 'require' &&
    node.arguments.length === 1 &&
    node.arguments[0].type === 'StringLiteral'
  );
}

function convertRequiresToImports(ast, filePath) {
  const importDeclarations = [];
  const body = ast.program.body;
  const removeIndices = [];

  body.forEach((node, idx) => {
    if (node.type === 'VariableDeclaration' && node.declarations.length === 1) {
      const decl = node.declarations[0];
      const init = decl.init;
      if (isRequireCall(init)) {
        const moduleName = init.arguments[0].value;
        try {
          if (decl.id.type === 'ObjectPattern') {
            const specifiers = decl.id.properties.map((prop) =>
              recast.types.builders.importSpecifier(prop.key)
            );
            importDeclarations.push({
              index: idx,
              node: recast.types.builders.importDeclaration(
                specifiers,
                recast.types.builders.stringLiteral(moduleName)
              ),
            });
            removeIndices.push(idx);
            return;
          }
          if (decl.id.type === 'Identifier') {
            importDeclarations.push({
              index: idx,
              node: recast.types.builders.importDeclaration(
                [recast.types.builders.importDefaultSpecifier(decl.id)],
                recast.types.builders.stringLiteral(moduleName)
              ),
            });
            removeIndices.push(idx);
            return;
          }
        } catch (err) {
          log(`Failed to convert in ${filePath}: ${err.message}`);
        }
      }
    }
  });

  for (let i = removeIndices.length - 1; i >= 0; i--) {
    body.splice(removeIndices[i], 1);
  }

  importDeclarations.reverse().forEach(({ node }) => {
    body.unshift(node);
  });
}

function processFile(filePath, results) {
  const absPath = path.resolve(filePath);
  const ext = path.extname(filePath);
  if (!['.js', '.ts', '.mjs'].includes(ext)) {
    results.push({ status: 'ignore', file: filePath, reason: 'unsupported extension' });
    return;
  }

  if (!trackedFiles.has(absPath)) {
    results.push({ status: 'skip', file: filePath, reason: 'untracked file' });
    log(`Skipped untracked file: ${filePath}`);
    return;
  }

  let code;
  try {
    code = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    results.push({ status: 'error', file: filePath, reason: `read error: ${err.message}` });
    log(`Failed to read file ${filePath}: ${err.message}`);
    return;
  }

  if (!code.includes('require(')) {
    results.push({ status: 'ignore', file: filePath, reason: 'no require found' });
    return;
  }

  let ast;
  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: [
        'typescript',
        'jsx',
        'classProperties',
        'dynamicImport',
        'optionalChaining',
        'nullishCoalescingOperator',
      ],
    });
  } catch (err) {
    results.push({ status: 'error', file: filePath, reason: `parse error: ${err.message}` });
    log(`Parse error in ${filePath}: ${err.message}`);
    return;
  }

  if (dryRun) {
    results.push({ status: 'convert', file: filePath, reason: 'would convert' });
    return;
  }

  convertRequiresToImports(ast, filePath);

  const output = recast.print(ast).code;
  const backupPath = `${filePath}.bak`;

  try {
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      log(`Backup created: ${backupPath}`);
    }
    fs.writeFileSync(filePath, output, 'utf-8');
    results.push({ status: 'convert', file: filePath });
    log(`Converted: ${filePath}`);
  } catch (err) {
    results.push({ status: 'error', file: filePath, reason: `write error: ${err.message}` });
    log(`Write error in ${filePath}: ${err.message}`);
  }
}

function walkDir(dir, results) {
  console.log(`Scanning directory: ${dir}`);
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Skip external or build folders to avoid dependency parsing and irrelevant files
      if (['node_modules', '.git', 'dist', 'build', 'out'].includes(file)) {
        console.log(`Skipping directory: ${fullPath}`);
        continue;
      }
      walkDir(fullPath, results);
    } else {
      processFile(fullPath, results);
    }
  }
}

function printResults(results) {
  console.log('');
  console.log(chalk.bold(`🔍 Scanning for require() in: ${projectRoot}${dryRun ? ' (dry-run mode)' : ''}`));
  console.log('');

  const statusMap = {
    convert: chalk.green('✅ Convert'),
    skip: chalk.yellow('⚠️  Skip   '),
    ignore: chalk.gray('🚫 Ignore '),
    error: chalk.red('❌ Error  '),
  };

  const table = results.map(r => `${statusMap[r.status]}  ${r.file}${r.reason ? ` (${r.reason})` : ''}`);
  console.log(table.join('\n'));

  console.log('\n📊 Summary:');
  const counts = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  console.log(`   ✅ Converted:        ${counts.convert || 0}`);
  console.log(`   ⚠️ Skipped untracked: ${counts.skip || 0}`);
  console.log(`   🚫 Ignored:          ${counts.ignore || 0}`);
  console.log(`   ❌ Errors:           ${counts.error || 0}`);
  console.log('\n✨ Conversion complete. See convert-require-to-import.log for details.');

  // Fail with exit code 1 if dry-run and any skipped files detected
  if (dryRun) {
    const skipped = results.some(r => r.status === 'skip');
    if (skipped) {
      console.error(chalk.yellow('\n⚠️  Dry-run detected skipped files. Commit or remove them before running full conversion.'));
      process.exit(1);
    }
  }
}

const results = [];
walkDir(projectRoot, results);
printResults(results);
