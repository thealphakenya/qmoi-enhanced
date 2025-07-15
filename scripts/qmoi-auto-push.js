#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

class QMOIAutoPush {
  constructor() {
    this.gitlabToken = process.env.GITLAB_TOKEN || process.env.GITLAB_ACCESS_TOKEN;
    this.githubToken = process.env.GITHUB_TOKEN;
    this.gitlabUrl = process.env.GITLAB_URL || 'https://gitlab.com';
    this.projectId = process.env.GITLAB_PROJECT_ID;
    this.branch = process.env.CI_COMMIT_REF_NAME || 'main';
    this.commitSha = process.env.CI_COMMIT_SHA;
    this.jobId = process.env.CI_JOB_ID;
    this.pipelineId = process.env.CI_PIPELINE_ID;
    
    this.logFile = path.join(process.cwd(), 'logs', 'qmoi-auto-push.log');
    this.ensureLogDir();
    this.maxRetries = 5;
    this.retryDelay = 30000; // 30 seconds
  }

  ensureLogDir() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    fs.appendFileSync(this.logFile, logEntry);
    console.log(`[${level}] ${message}`);
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runCommand(command, cwd = process.cwd(), retries = 0) {
    return new Promise((resolve, reject) => {
      this.log(`Running command (attempt ${retries + 1}): ${command}`);
      
      const child = spawn(command, [], {
        shell: true,
        cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, FORCE_COLOR: '1' }
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
        process.stdout.write(data);
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
        process.stderr.write(data);
      });

      child.on('close', (code) => {
        if (code === 0) {
          this.log(`Command completed successfully: ${command}`);
          resolve({ stdout, stderr, code });
        } else {
          this.log(`Command failed with code ${code}: ${command}`, 'ERROR');
          if (retries < this.maxRetries) {
            this.log(`Retrying command in ${this.retryDelay}ms...`);
            setTimeout(() => {
              this.runCommand(command, cwd, retries + 1)
                .then(resolve)
                .catch(reject);
            }, this.retryDelay);
          } else {
            reject({ stdout, stderr, code });
          }
        }
      });

      child.on('error', (error) => {
        this.log(`Command error: ${error.message}`, 'ERROR');
        if (retries < this.maxRetries) {
          this.log(`Retrying command in ${this.retryDelay}ms...`);
          setTimeout(() => {
            this.runCommand(command, cwd, retries + 1)
              .then(resolve)
              .catch(reject);
          }, this.retryDelay);
        } else {
          reject({ error: error.message, code: -1 });
        }
      });
    });
  }

  async fixCriticalErrors() {
    this.log('🔧 Fixing critical errors before push...');
    
    const criticalFixes = [
      {
        name: 'Fix package.json syntax',
        command: 'node scripts/json-config-fixer.js --fix-package',
        continueOnError: true
      },
      {
        name: 'Fix TypeScript config',
        command: 'node scripts/json-config-fixer.js --fix-tsconfig',
        continueOnError: true
      },
      {
        name: 'Fix ESLint config',
        command: 'node scripts/json-config-fixer.js --fix-eslint',
        continueOnError: true
      },
      {
        name: 'Fix Jest config',
        command: 'node scripts/json-config-fixer.js --fix-jest',
        continueOnError: true
      },
      {
        name: 'Clean npm cache',
        command: 'npm cache clean --force',
        continueOnError: true
      },
      {
        name: 'Reinstall dependencies',
        command: 'npx rimraf node_modules package-lock.json && npm install',
        continueOnError: true
      },
      {
        name: 'Fix git status',
        command: 'git config --global user.email "qmoi@automation.com" && git config --global user.name "QMOI Automation"',
        continueOnError: true
      }
    ];

    for (const fix of criticalFixes) {
      try {
        this.log(`Applying critical fix: ${fix.name}`);
        await this.runCommand(fix.command);
        this.log(`Critical fix applied: ${fix.name}`);
      } catch (error) {
        this.log(`Critical fix failed: ${fix.name} - ${error.message}`, 'WARN');
        if (!fix.continueOnError) {
          throw error;
        }
      }
    }
  }

  async ensureGitStatus() {
    this.log('🔍 Ensuring git status is clean...');
    
    try {
      // Check if we're in a git repository
      await this.runCommand('git status');
      
      // Add all changes
      await this.runCommand('git add .');
      
      // Check if there are changes to commit
      const status = await this.runCommand('git status --porcelain');
      if (status.stdout.trim()) {
        this.log('📝 Committing changes...');
        await this.runCommand('git commit -m "QMOI Auto-Push: Automated fixes and updates"');
      } else {
        this.log('✅ No changes to commit');
      }
    } catch (error) {
      this.log(`Git status check failed: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async pushToGitLab() {
    this.log('🚀 Pushing to GitLab...');
    
    try {
      // Try to push to current branch
      await this.runCommand(`git push origin ${this.branch}`);
      this.log('✅ Successfully pushed to GitLab');
      return true;
    } catch (error) {
      this.log(`GitLab push failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async pushToGitHub() {
    if (!this.githubToken) {
      this.log('⚠️ No GitHub token available, skipping GitHub push');
      return false;
    }

    this.log('🚀 Pushing to GitHub...');
    
    try {
      // Add GitHub remote if not exists
      try {
        await this.runCommand('git remote get-url github');
      } catch {
        await this.runCommand('git remote add github https://github.com/thealphakenya/Alpha-Q-ai.git');
      }
      
      // Push to GitHub
      await this.runCommand(`git push github ${this.branch}`);
      this.log('✅ Successfully pushed to GitHub');
      return true;
    } catch (error) {
      this.log(`GitHub push failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async createBackupBranch() {
    this.log('💾 Creating backup branch...');
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupBranch = `qmoi-backup-${timestamp}`;
      
      await this.runCommand(`git checkout -b ${backupBranch}`);
      await this.runCommand(`git push origin ${backupBranch}`);
      
      this.log(`✅ Created backup branch: ${backupBranch}`);
      return backupBranch;
    } catch (error) {
      this.log(`Backup branch creation failed: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async forcePush() {
    this.log('💪 Attempting force push...');
    
    try {
      await this.runCommand(`git push origin ${this.branch} --force`);
      this.log('✅ Force push successful');
      return true;
    } catch (error) {
      this.log(`Force push failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async notifyStakeholders(success, platforms = []) {
    this.log('📢 Notifying stakeholders...');
    
    try {
      const message = success 
        ? `✅ QMOI Auto-Push successful! Platforms: ${platforms.join(', ')}`
        : `❌ QMOI Auto-Push failed! Check logs for details.`;
      
      // Send notification via notification service
      await this.runCommand(`node scripts/notification_service.js --message "${message}"`);
      
      this.log('✅ Stakeholders notified');
    } catch (error) {
      this.log(`Notification failed: ${error.message}`, 'ERROR');
    }
  }

  async runComprehensiveAutoPush() {
    this.log('🤖 Starting QMOI Comprehensive Auto-Push...');
    
    let success = false;
    let pushedPlatforms = [];
    
    try {
      // Step 1: Fix critical errors
      await this.fixCriticalErrors();
      
      // Step 2: Ensure git status is clean
      await this.ensureGitStatus();
      
      // Step 3: Create backup branch
      const backupBranch = await this.createBackupBranch();
      
      // Step 4: Try normal push to GitLab
      if (await this.pushToGitLab()) {
        pushedPlatforms.push('GitLab');
        success = true;
      }
      
      // Step 5: Try push to GitHub
      if (await this.pushToGitHub()) {
        pushedPlatforms.push('GitHub');
        success = true;
      }
      
      // Step 6: If normal push failed, try force push
      if (!success) {
        this.log('🔄 Attempting force push as fallback...');
        if (await this.forcePush()) {
          pushedPlatforms.push('GitLab (Force)');
          success = true;
        }
      }
      
      // Step 7: Notify stakeholders
      await this.notifyStakeholders(success, pushedPlatforms);
      
      if (success) {
        this.log('🎉 QMOI Auto-Push completed successfully!');
        this.log(`Pushed to platforms: ${pushedPlatforms.join(', ')}`);
      } else {
        this.log('❌ QMOI Auto-Push failed!');
        throw new Error('All push attempts failed');
      }
      
    } catch (error) {
      this.log(`Auto-push failed: ${error.message}`, 'ERROR');
      
      // Final fallback: create issue with error details
      try {
        await this.createGitLabIssue(
          'QMOI Auto-Push Failed',
          `Auto-push failed with error: ${error.message}\n\nLogs: ${this.logFile}`
        );
      } catch (issueError) {
        this.log(`Failed to create issue: ${issueError.message}`, 'ERROR');
      }
      
      throw error;
    }
  }

  async createGitLabIssue(title, description) {
    if (!this.gitlabToken || !this.projectId) {
      this.log('⚠️ No GitLab credentials available for issue creation');
      return null;
    }

    try {
      const response = await fetch(`${this.gitlabUrl}/api/v4/projects/${this.projectId}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.gitlabToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          labels: 'qmoi,automation,error'
        })
      });

      if (response.ok) {
        const issue = await response.json();
        this.log(`Created GitLab issue: ${issue.iid} - ${title}`);
        return issue;
      } else {
        this.log(`Failed to create GitLab issue: ${response.statusText}`, 'ERROR');
        return null;
      }
    } catch (error) {
      this.log(`Failed to create GitLab issue: ${error.message}`, 'ERROR');
      return null;
    }
  }
}

async function main() {
  const autoPush = new QMOIAutoPush();
  
  try {
    await autoPush.runComprehensiveAutoPush();
    process.exit(0);
  } catch (error) {
    autoPush.log(`Main execution failed: ${error.message}`, 'ERROR');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = QMOIAutoPush; 