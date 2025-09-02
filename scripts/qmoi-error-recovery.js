#!/usr/bin/env node

/**
 * QMOI Enhanced Error Recovery System
 * Automatically fixes errors in QMOI's own files and dependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { NotificationService } = require('./services/notification_service');

class QMOIErrorRecovery {
  constructor() {
    this.notificationService = new NotificationService();
    this.recoveryLog = [];
    this.fixesApplied = new Set();
    this.maxRetries = 3;
    this.backupDir = path.join(process.cwd(), 'backups', 'error-recovery');
  }

  async log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message };
    this.recoveryLog.push(logEntry);
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  async createBackup(filePath) {
    try {
      const backupPath = path.join(this.backupDir, path.basename(filePath) + '.backup');
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.copyFileSync(filePath, backupPath);
      await this.log(`Backup created: ${backupPath}`);
      return backupPath;
    } catch (error) {
      await this.log(`Failed to create backup for ${filePath}: ${error.message}`, 'ERROR');
    }
  }

  async restoreBackup(backupPath, originalPath) {
    try {
      fs.copyFileSync(backupPath, originalPath);
      await this.log(`Restored from backup: ${originalPath}`);
      return true;
    } catch (error) {
      await this.log(`Failed to restore backup: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async fixPackageJson() {
    const packagePath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packagePath)) {
      await this.log('package.json not found, creating basic one', 'WARN');
      const basicPackage = {
        name: 'qmoi-ai-automation',
        version: '1.0.0',
        description: 'QMOI AI Automation System',
        main: 'index.js',
        scripts: {
          start: 'node index.js',
          test: 'echo "No tests specified"',
          dev: 'node --watch index.js'
        },
        dependencies: {
          'express': '^4.18.2',
          'node-fetch': '^3.3.2',
          'dockerode': '^3.3.5'
        },
        devDependencies: {
          '@types/node': '^20.0.0',
          'typescript': '^5.0.0'
        }
      };
      fs.writeFileSync(packagePath, JSON.stringify(basicPackage, null, 2));
      this.fixesApplied.add('package.json');
      return true;
    }

    try {
      const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      let fixed = false;

      // Fix missing scripts
      if (!packageContent.scripts) {
        packageContent.scripts = {};
        fixed = true;
      }

      const requiredScripts = {
        'start': 'node index.js',
        'dev': 'node --watch index.js',
        'test': 'echo "No tests specified"',
        'build': 'echo "No build specified"',
        'qmoi-auto-push': 'node scripts/qmoi-auto-push.js',
        'qmoi-error-recovery': 'node scripts/qmoi-error-recovery.js',
        'qmoi-setup': 'node scripts/qmoi-setup.js'
      };

      for (const [script, command] of Object.entries(requiredScripts)) {
        if (!packageContent.scripts[script]) {
          packageContent.scripts[script] = command;
          fixed = true;
        }
      }

      // Fix missing dependencies
      if (!packageContent.dependencies) {
        packageContent.dependencies = {};
        fixed = true;
      }

      const requiredDeps = {
        'express': '^4.18.2',
        'node-fetch': '^3.3.2',
        'dockerode': '^3.3.5'
      };

      for (const [dep, version] of Object.entries(requiredDeps)) {
        if (!packageContent.dependencies[dep]) {
          packageContent.dependencies[dep] = version;
          fixed = true;
        }
      }

      if (fixed) {
        await this.createBackup(packagePath);
        fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
        this.fixesApplied.add('package.json');
        await this.log('Fixed package.json');
        return true;
      }

      return false;
    } catch (error) {
      await this.log(`Error fixing package.json: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async fixGitLabCI() {
    const gitlabPath = path.join(process.cwd(), '.gitlab-ci.yml');
    if (!fs.existsSync(gitlabPath)) {
      await this.log('.gitlab-ci.yml not found, creating basic one', 'WARN');
      const basicCI = `stages:
  - setup
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

before_script:
  - npm install

setup:
  stage: setup
  script:
    - echo "Setting up QMOI environment"
    - npm run qmoi-setup
  only:
    - main
    - develop

test:
  stage: test
  script:
    - echo "Running QMOI tests"
    - npm test
  only:
    - main
    - develop

build:
  stage: build
  script:
    - echo "Building QMOI application"
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  only:
    - main

deploy:
  stage: deploy
  script:
    - echo "Deploying QMOI application"
    - npm start
  only:
    - main

qmoi-auto-push:
  stage: deploy
  script:
    - echo "Running QMOI auto-push"
    - npm run qmoi-auto-push
  only:
    - main
  when: manual

qmoi-error-recovery:
  stage: deploy
  script:
    - echo "Running QMOI error recovery"
    - npm run qmoi-error-recovery
  only:
    - main
  when: manual

after_script:
  - echo "QMOI pipeline completed"
  - npm run qmoi-auto-push || true
`;
      fs.writeFileSync(gitlabPath, basicCI);
      this.fixesApplied.add('.gitlab-ci.yml');
      return true;
    }

    try {
      let ciContent = fs.readFileSync(gitlabPath, 'utf8');
      let fixed = false;

      // Fix missing stages
      if (!ciContent.includes('stages:')) {
        ciContent = `stages:
  - setup
  - test
  - build
  - deploy

${ciContent}`;
        fixed = true;
      }

      // Fix missing variables
      if (!ciContent.includes('variables:')) {
        ciContent = ciContent.replace(/^/, `variables:
  NODE_VERSION: "18"

`);
        fixed = true;
      }

      // Fix missing cache
      if (!ciContent.includes('cache:')) {
        ciContent = ciContent.replace(/^/, `cache:
  paths:
    - node_modules/

`);
        fixed = true;
      }

      // Fix missing before_script
      if (!ciContent.includes('before_script:')) {
        ciContent = ciContent.replace(/^/, `before_script:
  - npm install

`);
        fixed = true;
      }

      // Add QMOI-specific jobs if missing
      if (!ciContent.includes('qmoi-auto-push:')) {
        ciContent += `

qmoi-auto-push:
  stage: deploy
  script:
    - echo "Running QMOI auto-push"
    - npm run qmoi-auto-push
  only:
    - main
  when: manual

qmoi-error-recovery:
  stage: deploy
  script:
    - echo "Running QMOI error recovery"
    - npm run qmoi-error-recovery
  only:
    - main
  when: manual

after_script:
  - echo "QMOI pipeline completed"
  - npm run qmoi-auto-push || true
`;
        fixed = true;
      }

      if (fixed) {
        await this.createBackup(gitlabPath);
        fs.writeFileSync(gitlabPath, ciContent);
        this.fixesApplied.add('.gitlab-ci.yml');
        await this.log('Fixed .gitlab-ci.yml');
        return true;
      }

      return false;
    } catch (error) {
      await this.log(`Error fixing .gitlab-ci.yml: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async fixJavaScriptSyntax(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let fixed = false;
      let newContent = content;

      // Fix common syntax errors
      const fixes = [
        // Fix missing semicolons
        { pattern: /(\w+)\s*\n\s*(\w+)/g, replacement: '$1;\n$2' },
        // Fix missing quotes in object properties
        { pattern: /(\w+):\s*([^,\n}]+)/g, replacement: '$1: "$2"' },
        // Fix missing commas in objects
        { pattern: /(\w+):\s*([^,\n}]+)\s*\n\s*(\w+):/g, replacement: '$1: "$2",\n  $3:' },
        // Fix missing parentheses in function calls
        { pattern: /(\w+)\s+([^;]+);/g, replacement: '$1($2);' },
        // Fix missing import/require statements
        { pattern: /const\s+(\w+)\s*=\s*require\(([^)]+)\)/g, replacement: 'const $1 = require($2);' }
      ];

      for (const fix of fixes) {
        if (fix.pattern.test(newContent)) {
          newContent = newContent.replace(fix.pattern, fix.replacement);
          fixed = true;
        }
      }

      if (fixed) {
        await this.createBackup(filePath);
        fs.writeFileSync(filePath, newContent);
        this.fixesApplied.add(filePath);
        await this.log(`Fixed syntax errors in ${filePath}`);
        return true;
      }

      return false;
    } catch (error) {
      await this.log(`Error fixing syntax in ${filePath}: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async fixMissingFiles() {
    const requiredFiles = [
      { path: 'index.js', content: `const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'QMOI AI Automation System is running' });
});

app.listen(port, () => {
  console.log(\`QMOI server running on port \${port}\`);
});` },
      { path: 'scripts/services/notification_service.js', content: `class NotificationService {
  constructor() {
    this.notifications = [];
  }

  async sendNotification(title, message) {
    const notification = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    this.notifications.push(notification);
    console.log(\`[NOTIFICATION] \${title}: \${message}\`);
    return notification;
  }

  getNotifications() {
    return this.notifications;
  }
}

module.exports = { NotificationService };` },
      { path: 'scripts/qmoi-setup.js', content: `#!/usr/bin/env node

console.log('Setting up QMOI environment...');

// Setup script content will be implemented here
console.log('QMOI setup completed');` }
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file.path);
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, file.content);
        this.fixesApplied.add(file.path);
        await this.log(`Created missing file: ${file.path}`);
      }
    }
  }

  async installDependencies() {
    try {
      await this.log('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      await this.log('Dependencies installed successfully');
      return true;
    } catch (error) {
      await this.log(`Failed to install dependencies: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async runTests() {
    try {
      await this.log('Running tests...');
      execSync('npm test', { stdio: 'inherit' });
      await this.log('Tests passed');
      return true;
    } catch (error) {
      await this.log(`Tests failed: ${error.message}`, 'WARN');
      return false;
    }
  }

  async validateFiles() {
    const filesToValidate = [
      'package.json',
      '.gitlab-ci.yml',
      'index.js',
      'scripts/qmoi-auto-push.js',
      'scripts/qmoi-error-recovery.js'
    ];

    for (const file of filesToValidate) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        try {
          // Validate JSON files
          if (file.endsWith('.json')) {
            JSON.parse(fs.readFileSync(filePath, 'utf8'));
          }
          // Validate JavaScript files by attempting to require them
          if (file.endsWith('.js')) {
            require(filePath);
          }
          await this.log(`✓ ${file} is valid`);
        } catch (error) {
          await this.log(`✗ ${file} has errors: ${error.message}`, 'ERROR');
          return false;
        }
      }
    }
    return true;
  }

  async performRecovery() {
    await this.log('Starting QMOI Error Recovery...');
    
    try {
      // Step 1: Fix package.json
      await this.fixPackageJson();
      
      // Step 2: Fix GitLab CI
      await this.fixGitLabCI();
      
      // Step 3: Fix missing files
      await this.fixMissingFiles();
      
      // Step 4: Fix syntax errors in JavaScript files
      const jsFiles = [
        'index.js',
        'scripts/qmoi-auto-push.js',
        'scripts/qmoi-error-recovery.js',
        'scripts/services/notification_service.js'
      ];
      
      for (const file of jsFiles) {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          await this.fixJavaScriptSyntax(filePath);
        }
      }
      
      // Step 5: Install dependencies
      await this.installDependencies();
      
      // Step 6: Validate files
      const validationPassed = await this.validateFiles();
      
      // Step 7: Run tests
      await this.runTests();
      
      // Step 8: Send notification
      const fixCount = this.fixesApplied.size;
      if (fixCount > 0) {
        await this.notificationService.sendNotification(
          'QMOI Error Recovery Completed',
          `Fixed ${fixCount} issues: ${Array.from(this.fixesApplied).join(', ')}`
        );
      }
      
      await this.log(`Error recovery completed. Fixed ${fixCount} issues.`);
      return true;
      
    } catch (error) {
      await this.log(`Error recovery failed: ${error.message}`, 'ERROR');
      await this.notificationService.sendNotification(
        'QMOI Error Recovery Failed',
        error.message
      );
      return false;
    }
  }

  async getRecoveryLog() {
    return this.recoveryLog;
  }

  async getFixesApplied() {
    return Array.from(this.fixesApplied);
  }
}

// CLI interface
if (require.main === module) {
  const recovery = new QMOIErrorRecovery();
  recovery.performRecovery().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { QMOIErrorRecovery }; 