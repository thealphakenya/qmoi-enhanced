#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class SmartLinter {
  constructor() {
    this.projectRoot = join(__dirname, '..');
    this.logsDir = join(this.projectRoot, 'logs');
    this.ensureLogsDir();
    this.fixesApplied = 0;
    this.filesModified = new Set();
  }

  ensureLogsDir() {
    if (!existsSync(this.logsDir)) {
      mkdirSync(this.logsDir, { recursive: true });
    }
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [SMART-LINT-${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    
    const logFile = join(this.logsDir, 'smart-lint.log');
    writeFileSync(logFile, logMessage + '\n', { flag: 'a' });
  }

  async runESLint() {
    try {
      const output = execSync('yarn lint', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return { success: true, output: '' };
    } catch (error) {
      return { success: false, output: error.stdout || error.stderr || '' };
    }
  }

  parseErrors(output) {
    const lines = output.split('\n');
    const errors = [];
    let currentFile = '';

    for (const line of lines) {
      // Extract file path
      const fileMatch = line.match(/^(.+?)\s+✖/);
      if (fileMatch) {
        currentFile = fileMatch[1].trim();
        continue;
      }

      // Parse error details
      const errorMatch = line.match(/^\s*(\d+):(\d+)\s+(error|warning)\s+(.+?)\s+(.+)$/);
      if (errorMatch) {
        const [, lineNum, colNum, severity, rule, message] = errorMatch;
        errors.push({
          file: currentFile,
          line: parseInt(lineNum),
          column: parseInt(colNum),
          severity,
          rule,
          message: message.trim()
        });
      }
    }

    return errors;
  }

  readFile(filePath) {
    try {
      return readFileSync(filePath, 'utf8');
    } catch (error) {
      this.log(`Error reading file ${filePath}: ${error.message}`, 'error');
      return null;
    }
  }

  writeFile(filePath, content) {
    try {
      writeFileSync(filePath, content, 'utf8');
      this.filesModified.add(filePath);
      this.log(`Fixed file: ${filePath}`, 'success');
      return true;
    } catch (error) {
      this.log(`Error writing file ${filePath}: ${error.message}`, 'error');
      return false;
    }
  }

  fixUnusedImports(filePath, errors) {
    const content = this.readFile(filePath);
    if (!content) return false;

    const unusedImportErrors = errors.filter(e => 
      e.file === filePath && 
      (e.rule.includes('no-unused-vars') || e.rule.includes('import/no-unused-modules'))
    );

    if (unusedImportErrors.length === 0) return false;

    let modified = false;
    let newContent = content;

    // Remove unused imports
    for (const error of unusedImportErrors) {
      const lines = newContent.split('\n');
      const lineIndex = error.line - 1;
      
      if (lineIndex >= 0 && lineIndex < lines.length) {
        const line = lines[lineIndex];
        
        // Check if this is an import statement
        if (line.includes('import') && line.includes('from')) {
          // Remove the entire import line
          lines.splice(lineIndex, 1);
          newContent = lines.join('\n');
          modified = true;
          this.fixesApplied++;
        }
      }
    }

    if (modified) {
      return this.writeFile(filePath, newContent);
    }

    return false;
  }

  fixMissingSemicolons(filePath, errors) {
    const content = this.readFile(filePath);
    if (!content) return false;

    const semicolonErrors = errors.filter(e => 
      e.file === filePath && 
      e.rule.includes('semi')
    );

    if (semicolonErrors.length === 0) return false;

    let modified = false;
    let newContent = content;

    for (const error of semicolonErrors) {
      const lines = newContent.split('\n');
      const lineIndex = error.line - 1;
      
      if (lineIndex >= 0 && lineIndex < lines.length) {
        const line = lines[lineIndex];
        
        // Add semicolon if missing
        if (!line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}')) {
          lines[lineIndex] = line + ';';
          newContent = lines.join('\n');
          modified = true;
          this.fixesApplied++;
        }
      }
    }

    if (modified) {
      return this.writeFile(filePath, newContent);
    }

    return false;
  }

  fixQuotes(filePath, errors) {
    const content = this.readFile(filePath);
    if (!content) return false;

    const quoteErrors = errors.filter(e => 
      e.file === filePath && 
      e.rule.includes('quotes')
    );

    if (quoteErrors.length === 0) return false;

    let modified = false;
    let newContent = content;

    for (const error of quoteErrors) {
      const lines = newContent.split('\n');
      const lineIndex = error.line - 1;
      
      if (lineIndex >= 0 && lineIndex < lines.length) {
        const line = lines[lineIndex];
        
        // Replace double quotes with single quotes
        const newLine = line.replace(/"/g, "'");
        if (newLine !== line) {
          lines[lineIndex] = newLine;
          newContent = lines.join('\n');
          modified = true;
          this.fixesApplied++;
        }
      }
    }

    if (modified) {
      return this.writeFile(filePath, newContent);
    }

    return false;
  }

  fixTrailingSpaces(filePath, errors) {
    const content = this.readFile(filePath);
    if (!content) return false;

    const trailingSpaceErrors = errors.filter(e => 
      e.file === filePath && 
      e.rule.includes('trailing-spaces')
    );

    if (trailingSpaceErrors.length === 0) return false;

    const lines = content.split('\n');
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      const originalLine = lines[i];
      const trimmedLine = originalLine.trimEnd();
      
      if (originalLine !== trimmedLine) {
        lines[i] = trimmedLine;
        modified = true;
        this.fixesApplied++;
      }
    }

    if (modified) {
      const newContent = lines.join('\n');
      return this.writeFile(filePath, newContent);
    }

    return false;
  }

  fixEOL(filePath, errors) {
    const content = this.readFile(filePath);
    if (!content) return false;

    const eolErrors = errors.filter(e => 
      e.file === filePath && 
      e.rule.includes('eol-last')
    );

    if (eolErrors.length === 0) return false;

    let newContent = content;
    
    // Ensure file ends with newline
    if (!newContent.endsWith('\n')) {
      newContent += '\n';
      this.fixesApplied++;
      return this.writeFile(filePath, newContent);
    }

    return false;
  }

  fixIndentation(filePath, errors) {
    const content = this.readFile(filePath);
    if (!content) return false;

    const indentErrors = errors.filter(e => 
      e.file === filePath && 
      e.rule.includes('indent')
    );

    if (indentErrors.length === 0) return false;

    const lines = content.split('\n');
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trimStart();
      
      if (trimmedLine.length > 0) {
        // Calculate proper indentation (2 spaces per level)
        const indentLevel = this.calculateIndentLevel(lines, i);
        const properIndent = '  '.repeat(indentLevel);
        
        if (line !== properIndent + trimmedLine) {
          lines[i] = properIndent + trimmedLine;
          modified = true;
          this.fixesApplied++;
        }
      }
    }

    if (modified) {
      const newContent = lines.join('\n');
      return this.writeFile(filePath, newContent);
    }

    return false;
  }

  calculateIndentLevel(lines, currentIndex) {
    let level = 0;
    
    // Look at previous lines to determine context
    for (let i = currentIndex - 1; i >= 0; i--) {
      const line = lines[i].trim();
      
      if (line.endsWith('{')) {
        level++;
      } else if (line.startsWith('}')) {
        level--;
      } else if (line.includes('function') || line.includes('class') || line.includes('if') || line.includes('for') || line.includes('while')) {
        if (!line.endsWith(';')) {
          level++;
        }
      }
    }
    
    return Math.max(0, level);
  }

  async applySmartFixes(errors) {
    this.log('Applying smart fixes...', 'info');

    // Group errors by file
    const errorsByFile = {};
    for (const error of errors) {
      if (!errorsByFile[error.file]) {
        errorsByFile[error.file] = [];
      }
      errorsByFile[error.file].push(error);
    }

    // Apply fixes for each file
    for (const [filePath, fileErrors] of Object.entries(errorsByFile)) {
      const fullPath = join(this.projectRoot, filePath);
      
      // Apply various fix strategies
      this.fixUnusedImports(fullPath, fileErrors);
      this.fixMissingSemicolons(fullPath, fileErrors);
      this.fixQuotes(fullPath, fileErrors);
      this.fixTrailingSpaces(fullPath, fileErrors);
      this.fixEOL(fullPath, fileErrors);
      this.fixIndentation(fullPath, fileErrors);
    }

    this.log(`Applied ${this.fixesApplied} smart fixes across ${this.filesModified.size} files`, 'success');
  }

  async run() {
    this.log('🚀 Starting Smart Lint Process...', 'info');

    // Step 1: Run ESLint to get current errors
    const lintResult = await this.runESLint();
    
    if (lintResult.success) {
      this.log('✅ No linting errors found!', 'success');
      return;
    }

    // Step 2: Parse errors
    const errors = this.parseErrors(lintResult.output);
    this.log(`Found ${errors.length} linting issues`, 'info');

    // Step 3: Apply smart fixes
    await this.applySmartFixes(errors);

    // Step 4: Run ESLint again to check remaining errors
    const finalResult = await this.runESLint();
    
    if (finalResult.success) {
      this.log('🎉 All errors have been automatically fixed!', 'success');
    } else {
      const remainingErrors = this.parseErrors(finalResult.output);
      this.log(`Smart fixes applied. ${remainingErrors.length} issues remain that require manual attention.`, 'warning');
      
      // Display remaining errors
      console.log('\n📋 Remaining Issues:');
      remainingErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.file}:${error.line}:${error.column} - ${error.rule}: ${error.message}`);
      });
    }

    // Step 5: Generate summary
    console.log('\n📊 Smart Lint Summary:');
    console.log(`   Fixes Applied: ${this.fixesApplied}`);
    console.log(`   Files Modified: ${this.filesModified.size}`);
    console.log(`   Remaining Issues: ${finalResult.success ? 0 : this.parseErrors(finalResult.output).length}`);
  }
}

// Run the smart linter
const smartLinter = new SmartLinter();
smartLinter.run().catch(error => {
  console.error('Fatal error in smart linter:', error);
  process.exit(1);
}); 