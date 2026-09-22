#!/usr/bin/env node

/**
 * QMOI GitHub Integration System
 * Comprehensive GitHub integration with full developer permissions
 * Repository management, issues, PRs, workflows, and more
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import QMOINotificationSystem from './qmoi-notification-system.js';

const execAsync = promisify(exec);

class QMOIGitHubIntegration {
  constructor() {
    this.notificationSystem = new QMOINotificationSystem();
    this.githubToken = process.env.GITHUB_TOKEN || process.env.QMOI_GITHUB_TOKEN;
    this.githubApi = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Authorization': `token ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'QMOI-GitHub-Integration'
      }
    });
    this.repoInfo = null;
    this.operations = [];
  }

  async initialize() {
    console.log('🔗 Initializing QMOI GitHub Integration...');
    await this.notificationSystem.initialize();
    
    if (!this.githubToken) {
      throw new Error('GitHub token not found. Set GITHUB_TOKEN or QMOI_GITHUB_TOKEN environment variable.');
    }

    // Get repository information
    await this.getRepositoryInfo();
    
    console.log('✅ QMOI GitHub Integration initialized');
  }

  async getRepositoryInfo() {
    try {
      // Get remote URL
      const { stdout } = await execAsync('git remote get-url origin');
      const remoteUrl = stdout.trim();
      
      // Extract owner and repo from URL
      const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
      if (match) {
        const [, owner, repo] = match;
        this.repoInfo = { owner, repo: repo.replace('.git', '') };
        console.log(`📦 Repository: ${owner}/${repo}`);
      } else {
        throw new Error('Could not parse GitHub repository URL');
      }
    } catch (error) {
      throw new Error(`Failed to get repository info: ${error.message}`);
    }
  }

  async createIssue(title, body, labels = []) {
    console.log(`📝 Creating issue: ${title}`);
    
    try {
      const response = await this.githubApi.post(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/issues`, {
        title,
        body,
        labels
      });

      const issue = response.data;
      this.operations.push({
        type: 'create_issue',
        id: issue.id,
        number: issue.number,
        title: issue.title,
        timestamp: new Date().toISOString()
      });

      await this.notificationSystem.sendNotification(
        'info',
        'Issue Created',
        `Created issue #${issue.number}: ${issue.title}`,
        {
          details: {
            issue: {
              number: issue.number,
              title: issue.title,
              url: issue.html_url
            }
          }
        }
      );

      return issue;
    } catch (error) {
      console.error('Failed to create issue:', error.message);
      throw error;
    }
  }

  async createPullRequest(title, body, head, base = 'main') {
    console.log(`🔀 Creating pull request: ${title}`);
    
    try {
      const response = await this.githubApi.post(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/pulls`, {
        title,
        body,
        head,
        base
      });

      const pr = response.data;
      this.operations.push({
        type: 'create_pull_request',
        id: pr.id,
        number: pr.number,
        title: pr.title,
        timestamp: new Date().toISOString()
      });

      await this.notificationSystem.sendNotification(
        'info',
        'Pull Request Created',
        `Created PR #${pr.number}: ${pr.title}`,
        {
          details: {
            pr: {
              number: pr.number,
              title: pr.title,
              url: pr.html_url
            }
          }
        }
      );

      return pr;
    } catch (error) {
      console.error('Failed to create pull request:', error.message);
      throw error;
    }
  }

  async updateWorkflow(workflowPath, content) {
    console.log(`🔧 Updating workflow: ${workflowPath}`);
    
    try {
      // Read current content
      const currentContent = await fs.readFile(workflowPath, 'utf8');
      
      // Create backup
      const backupPath = `${workflowPath}.backup.${Date.now()}`;
      await fs.writeFile(backupPath, currentContent);
      
      // Write new content
      await fs.writeFile(workflowPath, content);
      
      // Commit and push changes
      await this.commitAndPush(`Update workflow: ${path.basename(workflowPath)}`);
      
      this.operations.push({
        type: 'update_workflow',
        file: workflowPath,
        timestamp: new Date().toISOString()
      });

      await this.notificationSystem.sendNotification(
        'success',
        'Workflow Updated',
        `Updated workflow: ${path.basename(workflowPath)}`,
        {
          details: {
            file: workflowPath,
            backup: backupPath
          }
        }
      );

      return { success: true, backupPath };
    } catch (error) {
      console.error('Failed to update workflow:', error.message);
      throw error;
    }
  }

  async createBranch(branchName, baseBranch = 'main') {
    console.log(`🌿 Creating branch: ${branchName}`);
    
    try {
      // Get latest commit from base branch
      const { stdout } = await execAsync(`git rev-parse origin/${baseBranch}`);
      const sha = stdout.trim();
      
      // Create branch via GitHub API
      const response = await this.githubApi.post(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/git/refs`, {
        ref: `refs/heads/${branchName}`,
        sha
      });

      this.operations.push({
        type: 'create_branch',
        branch: branchName,
        timestamp: new Date().toISOString()
      });

      await this.notificationSystem.sendNotification(
        'info',
        'Branch Created',
        `Created branch: ${branchName}`,
        {
          details: {
            branch: branchName,
            base: baseBranch
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to create branch:', error.message);
      throw error;
    }
  }

  async commitAndPush(message) {
    console.log(`💾 Committing and pushing: ${message}`);
    
    try {
      // Add all changes
      await execAsync('git add .');
      
      // Commit
      await execAsync(`git commit -m "${message}"`);
      
      // Push
      await execAsync('git push origin HEAD');
      
      this.operations.push({
        type: 'commit_and_push',
        message,
        timestamp: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to commit and push:', error.message);
      throw error;
    }
  }

  async mergePullRequest(prNumber, mergeMethod = 'squash') {
    console.log(`🔀 Merging pull request #${prNumber}`);
    
    try {
      const response = await this.githubApi.put(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/pulls/${prNumber}/merge`, {
        merge_method: mergeMethod
      });

      this.operations.push({
        type: 'merge_pull_request',
        prNumber,
        timestamp: new Date().toISOString()
      });

      await this.notificationSystem.sendNotification(
        'success',
        'Pull Request Merged',
        `Merged PR #${prNumber}`,
        {
          details: {
            prNumber,
            mergeMethod
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to merge pull request:', error.message);
      throw error;
    }
  }

  async createRelease(tagName, name, body, draft = false, prerelease = false) {
    console.log(`🏷️ Creating release: ${tagName}`);
    
    try {
      const response = await this.githubApi.post(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/releases`, {
        tag_name: tagName,
        name,
        body,
        draft,
        prerelease
      });

      const release = response.data;
      this.operations.push({
        type: 'create_release',
        tagName,
        name,
        timestamp: new Date().toISOString()
      });

      await this.notificationSystem.sendNotification(
        'success',
        'Release Created',
        `Created release: ${name} (${tagName})`,
        {
          details: {
            release: {
              name,
              tagName,
              url: release.html_url
            }
          }
        }
      );

      return release;
    } catch (error) {
      console.error('Failed to create release:', error.message);
      throw error;
    }
  }

  async updateRepositorySettings(settings) {
    console.log('⚙️ Updating repository settings...');
    
    try {
      const response = await this.githubApi.patch(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}`, settings);

      this.operations.push({
        type: 'update_repository_settings',
        settings,
        timestamp: new Date().toISOString()
      });

      await this.notificationSystem.sendNotification(
        'info',
        'Repository Settings Updated',
        'Updated repository settings',
        {
          details: {
            settings
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to update repository settings:', error.message);
      throw error;
    }
  }

  async enableSecurityFeatures() {
    console.log('🔒 Enabling security features...');
    
    try {
      // Enable Dependabot alerts
      await this.githubApi.put(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/vulnerability-alerts`);
      
      // Enable automated security fixes
      await this.githubApi.put(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/automated-security-fixes`);
      
      // Enable secret scanning
      await this.githubApi.put(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/secret-scanning`);
      
      this.operations.push({
        type: 'enable_security_features',
        timestamp: new Date().toISOString()
      });

      await this.notificationSystem.sendNotification(
        'success',
        'Security Features Enabled',
        'Enabled Dependabot alerts, automated security fixes, and secret scanning',
        {
          details: {
            features: ['Dependabot alerts', 'Automated security fixes', 'Secret scanning']
          }
        }
      );

      return { success: true };
    } catch (error) {
      console.error('Failed to enable security features:', error.message);
      throw error;
    }
  }

  async createWorkflow(name, triggers = ['push'], branches = ['main', 'master']) {
    console.log(`🔧 Creating workflow: ${name}`);
    
    const workflowContent = {
      name: name,
      on: {},
      permissions: {
        contents: 'read',
        'pull-requests': 'read',
        issues: 'read'
      },
      env: {
        NODE_VERSION: '18',
        QMOI_AUTODEV_ENABLED: 'true'
      },
      jobs: {
        build: {
          'runs-on': 'ubuntu-latest',
          timeout_minutes: 30,
          steps: [
            {
              name: 'Checkout code',
              uses: 'actions/checkout@v4'
            },
            {
              name: 'Setup Node.js',
              uses: 'actions/setup-node@v4',
              with: {
                'node-version': '${{ env.NODE_VERSION }}'
              }
            },
            {
              name: 'Install dependencies',
              run: 'npm ci --legacy-peer-deps'
            },
            {
              name: 'Run tests',
              run: 'npm test'
            },
            {
              name: 'Build',
              run: 'npm run build'
            }
          ]
        }
      }
    };

    // Add triggers
    for (const trigger of triggers) {
      if (trigger === 'push') {
        workflowContent.on.push = { branches };
      } else if (trigger === 'pull_request') {
        workflowContent.on.pull_request = { branches };
      } else if (trigger === 'workflow_dispatch') {
        workflowContent.on.workflow_dispatch = {};
      }
    }

    const yaml = await import('js-yaml');
    const workflowYaml = yaml.dump(workflowContent, { indent: 2 });
    
    const workflowPath = `.github/workflows/${name.toLowerCase().replace(/\s+/g, '-')}.yml`;
    
    // Ensure workflows directory exists
    await fs.mkdir('.github/workflows', { recursive: true });
    
    // Write workflow file
    await fs.writeFile(workflowPath, workflowYaml);
    
    // Commit and push
    await this.commitAndPush(`Add workflow: ${name}`);
    
    this.operations.push({
      type: 'create_workflow',
      name,
      path: workflowPath,
      timestamp: new Date().toISOString()
    });

    await this.notificationSystem.sendNotification(
      'success',
      'Workflow Created',
      `Created workflow: ${name}`,
      {
        details: {
          workflow: {
            name,
            path: workflowPath,
            triggers
          }
        }
      }
    );

    return { success: true, path: workflowPath };
  }

  async getRepositoryStatus() {
    console.log('📊 Getting repository status...');
    
    try {
      const [repo, issues, prs, workflows] = await Promise.all([
        this.githubApi.get(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}`),
        this.githubApi.get(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/issues?state=open`),
        this.githubApi.get(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/pulls?state=open`),
        this.githubApi.get(`/repos/${this.repoInfo.owner}/${this.repoInfo.repo}/actions/workflows`)
      ]);

      const status = {
        repository: repo.data,
        openIssues: issues.data.length,
        openPullRequests: prs.data.length,
        workflows: workflows.data.workflows.length,
        lastOperation: this.operations[this.operations.length - 1] || null
      };

      return status;
    } catch (error) {
      console.error('Failed to get repository status:', error.message);
      throw error;
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      repository: this.repoInfo,
      operations: this.operations,
      summary: {
        totalOperations: this.operations.length,
        operationsByType: this.operations.reduce((acc, op) => {
          acc[op.type] = (acc[op.type] || 0) + 1;
          return acc;
        }, {})
      }
    };

    await fs.writeFile('logs/qmoi-github-integration-report.json', JSON.stringify(report, null, 2));
    return report;
  }
}

// CLI interface
const isMainModule = process.argv[1] && process.argv[1].endsWith('qmoi-github-integration.js');
if (isMainModule) {
  const integration = new QMOIGitHubIntegration();
  const args = process.argv.slice(2);

  async function main() {
    await integration.initialize();

    if (args.includes('--create-issue')) {
      const title = args[args.indexOf('--create-issue') + 1];
      const body = args[args.indexOf('--create-issue') + 2] || 'Issue created by QMOI';
      const issue = await integration.createIssue(title, body);
      console.log('Issue created:', JSON.stringify(issue, null, 2));
    } else if (args.includes('--create-pr')) {
      const title = args[args.indexOf('--create-pr') + 1];
      const body = args[args.indexOf('--create-pr') + 2] || 'PR created by QMOI';
      const head = args[args.indexOf('--create-pr') + 3] || 'qmoi-auto-fix';
      const pr = await integration.createPullRequest(title, body, head);
      console.log('PR created:', JSON.stringify(pr, null, 2));
    } else if (args.includes('--create-workflow')) {
      const name = args[args.indexOf('--create-workflow') + 1] || 'QMOI Auto-Fix';
      const result = await integration.createWorkflow(name);
      console.log('Workflow created:', JSON.stringify(result, null, 2));
    } else if (args.includes('--enable-security')) {
      const result = await integration.enableSecurityFeatures();
      console.log('Security features enabled:', JSON.stringify(result, null, 2));
    } else if (args.includes('--status')) {
      const status = await integration.getRepositoryStatus();
      console.log('Repository status:', JSON.stringify(status, null, 2));
    } else if (args.includes('--report')) {
      const report = await integration.generateReport();
      console.log('Report generated:', JSON.stringify(report, null, 2));
    } else {
      console.log(`
QMOI GitHub Integration

Usage:
  node qmoi-github-integration.js --create-issue <title> [body]     # Create issue
  node qmoi-github-integration.js --create-pr <title> [body] [head] # Create pull request
  node qmoi-github-integration.js --create-workflow [name]          # Create workflow
  node qmoi-github-integration.js --enable-security                # Enable security features
  node qmoi-github-integration.js --status                         # Get repository status
  node qmoi-github-integration.js --report                         # Generate report

Environment Variables:
  GITHUB_TOKEN or QMOI_GITHUB_TOKEN - GitHub personal access token

Features:
  • Full repository management
  • Issue and PR creation
  • Workflow management
  • Security feature enablement
  • Comprehensive reporting
  • Integration with QMOI notification system

Examples:
  node qmoi-github-integration.js --create-issue "Bug Report" "Found a bug in the system"
  node qmoi-github-integration.js --create-workflow "QMOI Auto-Fix"
  node qmoi-github-integration.js --enable-security
  node qmoi-github-integration.js --status
`);
    }
  }

  main().catch(console.error);
}

export default QMOIGitHubIntegration; 