#!/usr/bin/env node

/**
 * QMOI Setup Script
 * Initializes the QMOI AI Automation System environment
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { NotificationService } = require('./services/notification_service');

class QMOISetup {
  constructor() {
    this.notificationService = new NotificationService();
    this.setupLog = [];
    this.setupDir = process.cwd();
  }

  async log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message };
    this.setupLog.push(logEntry);
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  async createDirectories() {
    const directories = [
      'scripts/services',
      'logs',
      'backups',
      'config',
      'data',
      'temp'
    ];

    for (const dir of directories) {
      const dirPath = path.join(this.setupDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        await this.log(`Created directory: ${dir}`);
      }
    }
  }

  async createConfigFiles() {
    const configs = [
      {
        path: 'config/qmoi.json',
        content: {
          version: '1.0.0',
          name: 'QMOI AI Automation System',
          description: 'Comprehensive AI automation system for multiple platforms',
          platforms: {
            gitlab: {
              enabled: true,
              api_url: process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4',
              token: process.env.GITLAB_TOKEN
            },
            github: {
              enabled: true,
              api_url: 'https://api.github.com',
              token: process.env.GITHUB_TOKEN
            },
            gitpod: {
              enabled: true,
              api_url: 'https://api.gitpod.io/v1',
              token: process.env.GITPOD_API_TOKEN
            },
            vercel: {
              enabled: true,
              token: process.env.VERCEL_TOKEN
            },
            huggingface: {
              enabled: true,
              token: process.env.HUGGINGFACE_TOKEN
            }
          },
          features: {
            auto_push: true,
            error_recovery: true,
            notifications: true,
            parallel_processing: true,
            self_healing: true
          },
          settings: {
            max_retries: 3,
            timeout: 30000,
            backup_enabled: true,
            log_level: 'INFO'
          }
        }
      },
      {
        path: 'config/notification.json',
        content: {
          email: {
            enabled: false,
            smtp_host: process.env.SMTP_HOST,
            smtp_port: process.env.SMTP_PORT || 587,
            username: process.env.SMTP_USERNAME,
            password: process.env.SMTP_PASSWORD
          },
          slack: {
            enabled: false,
            webhook_url: process.env.SLACK_WEBHOOK_URL
          },
          discord: {
            enabled: false,
            webhook_url: process.env.DISCORD_WEBHOOK_URL
          }
        }
      }
    ];

    for (const config of configs) {
      const configPath = path.join(this.setupDir, config.path);
      if (!fs.existsSync(configPath)) {
        fs.mkdirSync(path.dirname(configPath), { recursive: true });
        fs.writeFileSync(configPath, JSON.stringify(config.content, null, 2));
        await this.log(`Created config file: ${config.path}`);
      }
    }
  }

  async createLogFiles() {
    const logFiles = [
      'logs/qmoi.log',
      'logs/error.log',
      'logs/audit.log',
      'logs/notification.log'
    ];

    for (const logFile of logFiles) {
      const logPath = path.join(this.setupDir, logFile);
      if (!fs.existsSync(logPath)) {
        fs.mkdirSync(path.dirname(logPath), { recursive: true });
        fs.writeFileSync(logPath, '');
        await this.log(`Created log file: ${logFile}`);
      }
    }
  }

  async installDependencies() {
    try {
      await this.log('Installing npm dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      await this.log('Dependencies installed successfully');
      return true;
    } catch (error) {
      await this.log(`Failed to install dependencies: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async setupGitHooks() {
    const hooksDir = path.join(this.setupDir, '.git', 'hooks');
    if (!fs.existsSync(hooksDir)) {
      await this.log('Git hooks directory not found, skipping git hooks setup', 'WARN');
      return;
    }

    const hooks = [
      {
        name: 'pre-commit',
        content: `#!/bin/sh
echo "Running QMOI pre-commit checks..."
npm run qmoi-error-recovery || exit 1
echo "Pre-commit checks completed"
`
      },
      {
        name: 'post-commit',
        content: `#!/bin/sh
echo "Running QMOI post-commit actions..."
npm run qmoi-auto-push || true
echo "Post-commit actions completed"
`
      }
    ];

    for (const hook of hooks) {
      const hookPath = path.join(hooksDir, hook.name);
      fs.writeFileSync(hookPath, hook.content);
      fs.chmodSync(hookPath, '755');
      await this.log(`Created git hook: ${hook.name}`);
    }
  }

  async validateEnvironment() {
    const checks = [
      {
        name: 'Node.js version',
        check: () => {
          const version = process.version;
          const major = parseInt(version.slice(1).split('.')[0]);
          return major >= 16;
        }
      },
      {
        name: 'npm availability',
        check: () => {
          try {
            execSync('npm --version', { stdio: 'ignore' });
            return true;
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Git availability',
        check: () => {
          try {
            execSync('git --version', { stdio: 'ignore' });
            return true;
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Required directories',
        check: () => {
          const requiredDirs = ['scripts', 'config', 'logs'];
          return requiredDirs.every(dir => fs.existsSync(path.join(this.setupDir, dir)));
        }
      }
    ];

    let allPassed = true;
    for (const check of checks) {
      const passed = check.check();
      if (passed) {
        await this.log(`✓ ${check.name} check passed`);
      } else {
        await this.log(`✗ ${check.name} check failed`, 'ERROR');
        allPassed = false;
      }
    }

    return allPassed;
  }

  async runTests() {
    try {
      await this.log('Running QMOI tests...');
      execSync('npm test', { stdio: 'inherit' });
      await this.log('Tests passed successfully');
      return true;
    } catch (error) {
      await this.log(`Tests failed: ${error.message}`, 'WARN');
      return false;
    }
  }

  async sendSetupNotification() {
    try {
      await this.notificationService.sendNotification(
        'QMOI Setup Completed',
        'QMOI AI Automation System has been successfully set up and is ready to use.'
      );
    } catch (error) {
      await this.log(`Failed to send setup notification: ${error.message}`, 'WARN');
    }
  }

  async performSetup() {
    await this.log('Starting QMOI Setup...');
    
    try {
      // Step 1: Create directory structure
      await this.createDirectories();
      
      // Step 2: Create configuration files
      await this.createConfigFiles();
      
      // Step 3: Create log files
      await this.createLogFiles();
      
      // Step 4: Install dependencies
      const depsInstalled = await this.installDependencies();
      if (!depsInstalled) {
        throw new Error('Failed to install dependencies');
      }
      
      // Step 5: Setup git hooks
      await this.setupGitHooks();
      
      // Step 6: Validate environment
      const envValid = await this.validateEnvironment();
      if (!envValid) {
        throw new Error('Environment validation failed');
      }
      
      // Step 7: Run tests
      await this.runTests();
      
      // Step 8: Send notification
      await this.sendSetupNotification();
      
      await this.log('QMOI setup completed successfully!');
      await this.log('QMOI is now ready to automate your development workflow.');
      await this.log('Available commands:');
      await this.log('  npm start          - Start QMOI server');
      await this.log('  npm run dev        - Start QMOI in development mode');
      await this.log('  npm run qmoi-auto-push - Run auto-push functionality');
      await this.log('  npm run qmoi-error-recovery - Run error recovery');
      
      return true;
      
    } catch (error) {
      await this.log(`Setup failed: ${error.message}`, 'ERROR');
      await this.notificationService.sendNotification(
        'QMOI Setup Failed',
        error.message
      );
      return false;
    }
  }

  async getSetupLog() {
    return this.setupLog;
  }
}

// CLI interface
if (require.main === module) {
  const setup = new QMOISetup();
  setup.performSetup().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { QMOISetup }; 