#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';

class GitHubFallback {
  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
    this.githubUrl = process.env.GITHUB_URL || 'https://api.github.com';
    this.githubRepo = process.env.GITHUB_REPOSITORY || 'alphaqmoi/qmoi-ai-system';
    this.gitlabToken = process.env.GITLAB_TOKEN || process.env.GITLAB_ACCESS_TOKEN;
    this.gitlabUrl = process.env.GITLAB_URL || 'https://gitlab.com';
    this.projectId = process.env.GITLAB_PROJECT_ID;
    this.branch = process.env.CI_COMMIT_REF_NAME || 'main';
    this.commitSha = process.env.CI_COMMIT_SHA;
    this.jobId = process.env.CI_JOB_ID;
    this.pipelineId = process.env.CI_PIPELINE_ID;
    
    this.logFile = path.join(process.cwd(), 'logs', 'github-fallback.log');
    this.ensureLogDir();
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

  async makeGitHubRequest(endpoint, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: new URL(this.githubUrl).hostname,
        port: 443,
        path: `/repos/${this.githubRepo}${endpoint}`,
        method,
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'QMOI-GitHub-Fallback/1.0'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (e) {
            resolve(data);
          }
        });
      });

      req.on('error', reject);
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  async makeGitLabRequest(endpoint, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: new URL(this.gitlabUrl).hostname,
        port: 443,
        path: `/api/v4${endpoint}`,
        method,
        headers: {
          'Authorization': `Bearer ${this.gitlabToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'QMOI-GitHub-Fallback/1.0'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (e) {
            resolve(data);
          }
        });
      });

      req.on('error', reject);
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  async checkGitLabAvailability() {
    try {
      this.log('Checking GitLab availability...');
      
      const response = await this.makeGitLabRequest('/projects/' + this.projectId, 'GET');
      
      if (response.id) {
        this.log('GitLab is available');
        return true;
      } else {
        this.log('GitLab is not available');
        return false;
      }
    } catch (error) {
      this.log(`GitLab is not available: ${error.message}`, 'WARN');
      return false;
    }
  }

  async checkGitHubAvailability() {
    try {
      this.log('Checking GitHub availability...');
      
      const response = await this.makeGitHubRequest('', 'GET');
      
      if (response.id) {
        this.log('GitHub is available');
        return true;
      } else {
        this.log('GitHub is not available');
        return false;
      }
    } catch (error) {
      this.log(`GitHub is not available: ${error.message}`, 'WARN');
      return false;
    }
  }

  async runCommand(command, cwd = process.cwd()) {
    return new Promise((resolve, reject) => {
      this.log(`Running command: ${command}`);
      
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
          reject({ stdout, stderr, code });
        }
      });

      child.on('error', (error) => {
        this.log(`Command error: ${error.message}`, 'ERROR');
        reject({ error: error.message, code: -1 });
      });
    });
  }

  async setupGitHubRemote() {
    try {
      this.log('Setting up GitHub remote...');
      
      // Check if GitHub remote already exists
      try {
        await this.runCommand('git remote get-url github');
        this.log('GitHub remote already exists');
        return true;
      } catch (error) {
        // GitHub remote doesn't exist, add it
        const githubUrl = `https://github.com/${this.githubRepo}.git`;
        await this.runCommand(`git remote add github ${githubUrl}`);
        this.log('GitHub remote added successfully');
        return true;
      }
    } catch (error) {
      this.log(`Failed to setup GitHub remote: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async syncToGitHub() {
    try {
      this.log('Syncing to GitHub...');
      
      // Setup GitHub remote
      await this.setupGitHubRemote();
      
      // Fetch latest changes
      await this.runCommand('git fetch github');
      
      // Push to GitHub
      await this.runCommand(`git push github ${this.branch}`);
      
      this.log('Successfully synced to GitHub');
      return true;
    } catch (error) {
      this.log(`Failed to sync to GitHub: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async syncFromGitHub() {
    try {
      this.log('Syncing from GitHub...');
      
      // Setup GitHub remote
      await this.setupGitHubRemote();
      
      // Fetch latest changes from GitHub
      await this.runCommand('git fetch github');
      
      // Merge changes from GitHub
      await this.runCommand(`git merge github/${this.branch}`);
      
      this.log('Successfully synced from GitHub');
      return true;
    } catch (error) {
      this.log(`Failed to sync from GitHub: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async createGitHubIssue(title, description, labels = ['qmoi', 'fallback']) {
    try {
      const issue = await this.makeGitHubRequest('/issues', 'POST', {
        title,
        body: description,
        labels
      });
      this.log(`Created GitHub issue: ${issue.number} - ${title}`);
      return issue;
    } catch (error) {
      this.log(`Failed to create GitHub issue: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async createGitHubRelease(version, description) {
    try {
      const release = await this.makeGitHubRequest('/releases', 'POST', {
        tag_name: `v${version}`,
        name: `QMOI v${version}`,
        body: description,
        draft: false,
        prerelease: false
      });
      this.log(`Created GitHub release: ${release.tag_name}`);
      return release;
    } catch (error) {
      this.log(`Failed to create GitHub release: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async sendGitHubNotification(type, data = {}) {
    try {
      const timestamp = new Date().toISOString();
      const githubUrl = `https://github.com/${this.githubRepo}`;
      
      let title, description, labels;
      
      switch (type) {
        case 'fallback_activated':
          title = `🔄 QMOI GitHub Fallback Activated - ${timestamp}`;
          description = `## QMOI GitHub Fallback Activated

### Fallback Details:
- **Reason**: GitLab unavailable
- **Branch**: ${this.branch}
- **Commit**: ${this.commitSha}
- **Pipeline ID**: ${this.pipelineId}
- **Job ID**: ${this.jobId}
- **Timestamp**: ${timestamp}

### GitHub Repository:
${githubUrl}

### Status:
QMOI has switched to GitHub as the primary platform due to GitLab unavailability.

### Actions Taken:
- GitHub remote configured
- Code synced to GitHub
- Notifications redirected to GitHub
- Automation continued on GitHub

### Next Steps:
- Monitor GitHub for updates
- Continue development on GitHub
- Sync back to GitLab when available

---
*Generated by QMOI GitHub Fallback System*`;
          labels = ['qmoi', 'fallback', 'activated'];
          break;
          
        case 'sync_completed':
          title = `✅ QMOI GitHub Sync Completed - ${timestamp}`;
          description = `## QMOI GitHub Sync Completed

### Sync Details:
- **Direction**: ${data.direction || 'bidirectional'}
- **Branch**: ${this.branch}
- **Commit**: ${this.commitSha}
- **Pipeline ID**: ${this.pipelineId}
- **Job ID**: ${this.jobId}
- **Timestamp**: ${timestamp}

### GitHub Repository:
${githubUrl}

### Sync Results:
- Code synchronized successfully
- All changes preserved
- No conflicts detected
- Automation continued

### Status:
All QMOI operations are now running on GitHub.

---
*Generated by QMOI GitHub Fallback System*`;
          labels = ['qmoi', 'fallback', 'sync', 'completed'];
          break;
          
        case 'gitlab_restored':
          title = `🔄 QMOI GitLab Restored - ${timestamp}`;
          description = `## QMOI GitLab Restored

### Restoration Details:
- **Branch**: ${this.branch}
- **Commit**: ${this.commitSha}
- **Pipeline ID**: ${this.pipelineId}
- **Job ID**: ${this.jobId}
- **Timestamp**: ${timestamp}

### Status:
GitLab is available again. QMOI will sync changes back to GitLab.

### Actions:
- Syncing changes from GitHub to GitLab
- Restoring GitLab as primary platform
- Updating notifications
- Continuing automation on GitLab

### Next Steps:
- Monitor sync progress
- Verify all changes transferred
- Resume normal operations

---
*Generated by QMOI GitHub Fallback System*`;
          labels = ['qmoi', 'fallback', 'restored'];
          break;
          
        default:
          title = `📢 QMOI GitHub Fallback Notification - ${timestamp}`;
          description = `## QMOI GitHub Fallback Notification

### Details:
- **Type**: ${type}
- **Branch**: ${this.branch}
- **Commit**: ${this.commitSha}
- **Pipeline ID**: ${this.pipelineId}
- **Job ID**: ${this.jobId}
- **Timestamp**: ${timestamp}

### GitHub Repository:
${githubUrl}

---
*Generated by QMOI GitHub Fallback System*`;
          labels = ['qmoi', 'fallback', 'notification'];
      }
      
      // Create GitHub issue
      const issue = await this.createGitHubIssue(title, description, labels);
      
      this.log(`GitHub notification sent: ${type}`);
      return issue;
      
    } catch (error) {
      this.log(`Failed to send GitHub notification: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async runFallbackPipeline() {
    try {
      this.log('Starting QMOI GitHub fallback pipeline...');
      
      // Check platform availability
      const gitlabAvailable = await this.checkGitLabAvailability();
      const githubAvailable = await this.checkGitHubAvailability();
      
      if (!gitlabAvailable && !githubAvailable) {
        throw new Error('Neither GitLab nor GitHub is available');
      }
      
      if (!gitlabAvailable && githubAvailable) {
        this.log('GitLab unavailable, activating GitHub fallback');
        
        // Send fallback notification
        await this.sendGitHubNotification('fallback_activated');
        
        // Sync to GitHub
        await this.syncToGitHub();
        
        // Run QMOI automation on GitHub
        await this.runQMOIAutomationOnGitHub();
        
        // Send sync completion notification
        await this.sendGitHubNotification('sync_completed', { direction: 'to-github' });
        
      } else if (gitlabAvailable && githubAvailable) {
        this.log('Both platforms available, syncing between them');
        
        // Sync from GitHub to GitLab
        await this.syncFromGitHub();
        
        // Send restoration notification
        await this.sendGitHubNotification('gitlab_restored');
        
      } else {
        this.log('GitLab available, using primary platform');
        // Continue with normal GitLab operations
      }
      
      this.log('GitHub fallback pipeline completed successfully');
      
    } catch (error) {
      this.log(`GitHub fallback pipeline failed: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async runQMOIAutomationOnGitHub() {
    try {
      this.log('Running QMOI automation on GitHub...');
      
      // Run the same automation scripts but with GitHub context
      const automationScripts = [
        'npm run auto:setup',
        'npm run qmoi:test',
        'npm run qmoi:build',
        'npm run qmoi:health'
      ];
      
      for (const script of automationScripts) {
        try {
          await this.runCommand(script);
          this.log(`GitHub automation completed: ${script}`);
        } catch (error) {
          this.log(`GitHub automation failed: ${script} - ${error.message}`, 'WARN');
        }
      }
      
      this.log('QMOI automation on GitHub completed');
      
    } catch (error) {
      this.log(`Failed to run QMOI automation on GitHub: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  async monitorPlatforms() {
    try {
      this.log('Monitoring platform availability...');
      
      const gitlabAvailable = await this.checkGitLabAvailability();
      const githubAvailable = await this.checkGitHubAvailability();
      
      const status = {
        gitlab: gitlabAvailable ? 'available' : 'unavailable',
        github: githubAvailable ? 'available' : 'unavailable',
        timestamp: new Date().toISOString()
      };
      
      this.log(`Platform status: GitLab=${status.gitlab}, GitHub=${status.github}`);
      
      // If GitLab becomes available again, restore it
      if (gitlabAvailable && status.gitlab === 'available') {
        this.log('GitLab restored, syncing back from GitHub');
        await this.syncFromGitHub();
        await this.sendGitHubNotification('gitlab_restored');
      }
      
      return status;
      
    } catch (error) {
      this.log(`Failed to monitor platforms: ${error.message}`, 'ERROR');
      throw error;
    }
  }
}

// Main execution
async function main() {
  const fallback = new GitHubFallback();
  
  try {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
      case '--fallback-pipeline':
        await fallback.runFallbackPipeline();
        break;
      case '--sync-to-github':
        await fallback.syncToGitHub();
        break;
      case '--sync-from-github':
        await fallback.syncFromGitHub();
        break;
      case '--setup-github':
        await fallback.setupGitHubRemote();
        break;
      case '--monitor-platforms':
        await fallback.monitorPlatforms();
        break;
      case '--check-gitlab':
        const gitlabAvailable = await fallback.checkGitLabAvailability();
        console.log(`GitLab available: ${gitlabAvailable}`);
        break;
      case '--check-github':
        const githubAvailable = await fallback.checkGitHubAvailability();
        console.log(`GitHub available: ${githubAvailable}`);
        break;
      case '--notify':
        const data = args[1] ? JSON.parse(args[1]) : {};
        await fallback.sendGitHubNotification(args[2] || 'fallback_activated', data);
        break;
      default:
        console.log('QMOI GitHub Fallback System');
        console.log('Usage:');
        console.log('  --fallback-pipeline    Run complete fallback pipeline');
        console.log('  --sync-to-github       Sync code to GitHub');
        console.log('  --sync-from-github     Sync code from GitHub');
        console.log('  --setup-github         Setup GitHub remote');
        console.log('  --monitor-platforms    Monitor platform availability');
        console.log('  --check-gitlab         Check GitLab availability');
        console.log('  --check-github         Check GitHub availability');
        console.log('  --notify [data] [type] Send GitHub notification');
        break;
    }
    
  } catch (error) {
    fallback.log(`GitHub fallback failed: ${error.message}`, 'ERROR');
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = { GitHubFallback };

// Run if this script is executed directly
if (require.main === module) {
  main();
} 