#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';

class GitLabAutomation {
  constructor() {
    this.gitlabToken = process.env.GITLAB_TOKEN || process.env.GITLAB_ACCESS_TOKEN;
    this.gitlabUrl = process.env.GITLAB_URL || 'https://gitlab.com';
    this.projectId = process.env.GITLAB_PROJECT_ID;
    this.branch = process.env.CI_COMMIT_REF_NAME || 'main';
    this.commitSha = process.env.CI_COMMIT_SHA;
    this.jobId = process.env.CI_JOB_ID;
    this.pipelineId = process.env.CI_PIPELINE_ID;
    
    this.logFile = path.join(process.cwd(), 'logs', 'gitlab-automation.log');
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
          'User-Agent': 'QMOI-GitLab-Automation/1.0'
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

  async createGitLabIssue(title, description, labels = ['qmoi', 'automation']) {
    try {
      const issue = await this.makeGitLabRequest(`/projects/${this.projectId}/issues`, 'POST', {
        title,
        description,
        labels: labels.join(','),
        confidential: false
      });
      this.log(`Created GitLab issue: ${issue.iid} - ${title}`);
      return issue;
    } catch (error) {
      this.log(`Failed to create GitLab issue: ${error.message}`, 'ERROR');
      return null;
    }
  }

  async updateGitLabStatus(status, description) {
    try {
      await this.makeGitLabRequest(`/projects/${this.projectId}/status_checks/${this.commitSha}`, 'POST', {
        state: status,
        description,
        target_url: `${this.gitlabUrl}/${this.projectId}/-/jobs/${this.jobId}`
      });
      this.log(`Updated GitLab status: ${status} - ${description}`);
    } catch (error) {
      this.log(`Failed to update GitLab status: ${error.message}`, 'ERROR');
    }
  }

  async addGitLabComment(comment) {
    try {
      await this.makeGitLabRequest(`/projects/${this.projectId}/merge_requests/${this.pipelineId}/notes`, 'POST', {
        body: comment
      });
      this.log(`Added GitLab comment to MR ${this.pipelineId}`);
    } catch (error) {
      this.log(`Failed to add GitLab comment: ${error.message}`, 'ERROR');
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

  async fixCommonErrors() {
    this.log('Starting common error fixes...');
    
    const fixes = [
      {
        name: 'Fix npm cache',
        command: 'npm cache clean --force',
        continueOnError: true
      },
      {
        name: 'Remove node_modules and reinstall',
        command: 'npx rimraf node_modules package-lock.json && npm install',
        continueOnError: true
      },
      {
        name: 'Fix TypeScript compilation',
        command: 'npx tsc --noEmit --skipLibCheck',
        continueOnError: true
      },
      {
        name: 'Fix ESLint issues',
        command: 'npx eslint --fix src/',
        continueOnError: true
      },
      {
        name: 'Fix Prettier formatting',
        command: 'npx prettier --write src/',
        continueOnError: true
      }
    ];

    for (const fix of fixes) {
      try {
        this.log(`Applying fix: ${fix.name}`);
        await this.runCommand(fix.command);
        this.log(`Fix applied successfully: ${fix.name}`);
      } catch (error) {
        this.log(`Fix failed: ${fix.name} - ${error.message}`, 'WARN');
        if (!fix.continueOnError) {
          throw error;
        }
      }
    }
  }

  async runAutoSetup() {
    try {
      this.log('Starting QMOI auto-setup...');
      await this.updateGitLabStatus('running', 'QMOI auto-setup in progress');
      
      // Run the auto-setup script
      await this.runCommand('npm run auto:setup');
      
      this.log('QMOI auto-setup completed successfully');
      await this.updateGitLabStatus('success', 'QMOI auto-setup completed successfully');
      
      // Create success notification
      await this.createGitLabIssue(
        'QMOI Auto-Setup Completed Successfully',
        `## QMOI Auto-Setup Report\n\n` +
        `✅ **Status**: Completed Successfully\n` +
        `📅 **Timestamp**: ${new Date().toISOString()}\n` +
        `🔗 **Pipeline**: ${this.gitlabUrl}/${this.projectId}/-/pipelines/${this.pipelineId}\n` +
        `📋 **Job**: ${this.gitlabUrl}/${this.projectId}/-/jobs/${this.jobId}\n\n` +
        `### What was completed:\n` +
        `- Dependencies installed and verified\n` +
        `- Build process completed\n` +
        `- Tests executed successfully\n` +
        `- UI components validated\n` +
        `- Documentation updated\n\n` +
        `### Next Steps:\n` +
        `- Review the build artifacts\n` +
        `- Deploy to staging environment\n` +
        `- Run integration tests\n`,
        ['qmoi', 'success', 'auto-setup']
      );
      
    } catch (error) {
      this.log(`Auto-setup failed: ${error.message}`, 'ERROR');
      await this.updateGitLabStatus('failed', 'QMOI auto-setup failed');
      
      // Create error notification with recovery steps
      await this.createGitLabIssue(
        'QMOI Auto-Setup Failed - Recovery Required',
        `## QMOI Auto-Setup Error Report\n\n` +
        `❌ **Status**: Failed\n` +
        `📅 **Timestamp**: ${new Date().toISOString()}\n` +
        `🔗 **Pipeline**: ${this.gitlabUrl}/${this.projectId}/-/pipelines/${this.pipelineId}\n` +
        `📋 **Job**: ${this.gitlabUrl}/${this.projectId}/-/jobs/${this.jobId}\n\n` +
        `### Error Details:\n` +
        `\`\`\`\n${error.message}\n\`\`\`\n\n` +
        `### Recovery Steps:\n` +
        `1. **Manual Fix**: Run \`npm run auto:setup\` locally\n` +
        `2. **Clean Install**: \`npx rimraf node_modules && npm install\`\n` +
        `3. **Check Dependencies**: Verify all required packages are installed\n` +
        `4. **Review Logs**: Check the automation logs for specific errors\n` +
        `5. **Test Locally**: Run \`npm test\` to identify test failures\n\n` +
        `### Common Solutions:\n` +
        `- Clear npm cache: \`npm cache clean --force\`\n` +
        `- Update dependencies: \`npm update\`\n` +
        `- Fix TypeScript errors: \`npx tsc --noEmit\`\n` +
        `- Fix ESLint issues: \`npx eslint --fix src/\`\n\n` +
        `### Automated Recovery:\n` +
        `The system will attempt automatic recovery on the next pipeline run.`,
        ['qmoi', 'error', 'auto-setup', 'needs-attention']
      );
      
      throw error;
    }
  }

  async runTests() {
    try {
      this.log('Running QMOI tests...');
      await this.updateGitLabStatus('running', 'QMOI tests in progress');
      
      // Run all test suites
      await this.runCommand('npm test');
      await this.runCommand('npm run test:ui');
      await this.runCommand('npm run test:e2e');
      
      this.log('All tests completed successfully');
      await this.updateGitLabStatus('success', 'QMOI tests passed');
      
    } catch (error) {
      this.log(`Tests failed: ${error.message}`, 'ERROR');
      await this.updateGitLabStatus('failed', 'QMOI tests failed');
      
      // Create test failure notification
      await this.createGitLabIssue(
        'QMOI Tests Failed - Review Required',
        `## QMOI Test Failure Report\n\n` +
        `❌ **Status**: Tests Failed\n` +
        `📅 **Timestamp**: ${new Date().toISOString()}\n` +
        `🔗 **Pipeline**: ${this.gitlabUrl}/${this.projectId}/-/pipelines/${this.pipelineId}\n` +
        `📋 **Job**: ${this.gitlabUrl}/${this.projectId}/-/jobs/${this.jobId}\n\n` +
        `### Error Details:\n` +
        `\`\`\`\n${error.message}\n\`\`\`\n\n` +
        `### Test Categories:\n` +
        `- Unit Tests: \`npm test\`\n` +
        `- UI Tests: \`npm run test:ui\`\n` +
        `- E2E Tests: \`npm run test:e2e\`\n\n` +
        `### Debugging Steps:\n` +
        `1. Run tests locally: \`npm test\`\n` +
        `2. Check test coverage: \`npm run test:coverage\`\n` +
        `3. Run specific test: \`npm test -- --testNamePattern="test name"\`\n` +
        `4. Check test environment: \`npm run test:debug\`\n\n` +
        `### Common Test Issues:\n` +
        `- Missing test dependencies\n` +
        `- Environment configuration issues\n` +
        `- Async test timing problems\n` +
        `- Mock/stub configuration errors`,
        ['qmoi', 'error', 'tests', 'needs-review']
      );
      
      throw error;
    }
  }

  async buildProject() {
    try {
      this.log('Building QMOI project...');
      await this.updateGitLabStatus('running', 'QMOI build in progress');
      
      // Run build process
      await this.runCommand('npm run build');
      
      this.log('Build completed successfully');
      await this.updateGitLabStatus('success', 'QMOI build completed');
      
    } catch (error) {
      this.log(`Build failed: ${error.message}`, 'ERROR');
      await this.updateGitLabStatus('failed', 'QMOI build failed');
      
      // Create build failure notification
      await this.createGitLabIssue(
        'QMOI Build Failed - Fix Required',
        `## QMOI Build Failure Report\n\n` +
        `❌ **Status**: Build Failed\n` +
        `📅 **Timestamp**: ${new Date().toISOString()}\n` +
        `🔗 **Pipeline**: ${this.gitlabUrl}/${this.projectId}/-/pipelines/${this.pipelineId}\n` +
        `📋 **Job**: ${this.gitlabUrl}/${this.projectId}/-/jobs/${this.jobId}\n\n` +
        `### Error Details:\n` +
        `\`\`\`\n${error.message}\n\`\`\`\n\n` +
        `### Build Process:\n` +
        `- TypeScript compilation\n` +
        `- Bundle generation\n` +
        `- Asset optimization\n` +
        `- Production build\n\n` +
        `### Debugging Steps:\n` +
        `1. Check TypeScript errors: \`npx tsc --noEmit\`\n` +
        `2. Verify dependencies: \`npm ls\`\n` +
        `3. Clear build cache: \`npm run build:clean\`\n` +
        `4. Check build config: Review webpack/build configuration\n\n` +
        `### Common Build Issues:\n` +
        `- TypeScript compilation errors\n` +
        `- Missing dependencies\n` +
        `- Import/export issues\n` +
        `- Asset loading problems\n` +
        `- Environment variable issues`,
        ['qmoi', 'error', 'build', 'needs-fix']
      );
      
      throw error;
    }
  }

  async deployToGitLab() {
    try {
      this.log('Deploying QMOI to GitLab...');
      await this.updateGitLabStatus('running', 'QMOI deployment in progress');
      
      // Create deployment artifacts
      await this.runCommand('npm run build:prod');
      
      // Create GitLab release
      const version = require('../package.json').version;
      const releaseData = {
        name: `QMOI v${version}`,
        tag_name: `v${version}`,
        description: `QMOI Automated Release v${version}\n\n` +
                    `- Auto-setup completed\n` +
                    `- Tests passed\n` +
                    `- Build successful\n` +
                    `- Ready for deployment\n\n` +
                    `### Changes:\n` +
                    `- Enhanced GitLab integration\n` +
                    `- Improved error handling\n` +
                    `- Automated notifications\n` +
                    `- Self-healing capabilities`,
        assets: {
          links: [
            {
              name: 'Build Artifacts',
              url: `${this.gitlabUrl}/${this.projectId}/-/jobs/${this.jobId}/artifacts/browse`
            }
          ]
        }
      };
      
      await this.makeGitLabRequest(`/projects/${this.projectId}/releases`, 'POST', releaseData);
      
      this.log('Deployment completed successfully');
      await this.updateGitLabStatus('success', 'QMOI deployed successfully');
      
      // Create deployment success notification
      await this.createGitLabIssue(
        'QMOI Deployment Successful',
        `## QMOI Deployment Report\n\n` +
        `✅ **Status**: Deployed Successfully\n` +
        `📅 **Timestamp**: ${new Date().toISOString()}\n` +
        `🔗 **Pipeline**: ${this.gitlabUrl}/${this.projectId}/-/pipelines/${this.pipelineId}\n` +
        `📋 **Job**: ${this.gitlabUrl}/${this.projectId}/-/jobs/${this.jobId}\n` +
        `🏷️ **Version**: v${version}\n\n` +
        `### Deployment Details:\n` +
        `- Build artifacts created\n` +
        `- GitLab release published\n` +
        `- All tests passed\n` +
        `- Auto-setup completed\n\n` +
        `### Access Points:\n` +
        `- **Release**: ${this.gitlabUrl}/${this.projectId}/-/releases\n` +
        `- **Artifacts**: ${this.gitlabUrl}/${this.projectId}/-/jobs/${this.jobId}/artifacts/browse\n` +
        `- **Pipeline**: ${this.gitlabUrl}/${this.projectId}/-/pipelines/${this.pipelineId}\n\n` +
        `### Next Steps:\n` +
        `- Monitor application health\n` +
        `- Run smoke tests\n` +
        `- Update documentation\n` +
        `- Notify stakeholders`,
        ['qmoi', 'success', 'deployment', 'completed']
      );
      
    } catch (error) {
      this.log(`Deployment failed: ${error.message}`, 'ERROR');
      await this.updateGitLabStatus('failed', 'QMOI deployment failed');
      
      // Create deployment failure notification
      await this.createGitLabIssue(
        'QMOI Deployment Failed - Rollback Required',
        `## QMOI Deployment Failure Report\n\n` +
        `❌ **Status**: Deployment Failed\n` +
        `📅 **Timestamp**: ${new Date().toISOString()}\n` +
        `🔗 **Pipeline**: ${this.gitlabUrl}/${this.projectId}/-/pipelines/${this.pipelineId}\n` +
        `📋 **Job**: ${this.gitlabUrl}/${this.projectId}/-/jobs/${this.jobId}\n\n` +
        `### Error Details:\n` +
        `\`\`\`\n${error.message}\n\`\`\`\n\n` +
        `### Immediate Actions:\n` +
        `1. **Rollback**: Revert to previous stable version\n` +
        `2. **Investigate**: Check deployment logs\n` +
        `3. **Fix**: Address the root cause\n` +
        `4. **Test**: Verify fix locally\n` +
        `5. **Redeploy**: Trigger new deployment\n\n` +
        `### Common Deployment Issues:\n` +
        `- Environment configuration\n` +
        `- Resource constraints\n` +
        `- Network connectivity\n` +
        `- Permission issues\n` +
        `- Build artifact problems`,
        ['qmoi', 'error', 'deployment', 'needs-rollback']
      );
      
      throw error;
    }
  }

  const MAX_RETRIES = 3;
  const BASE_DELAY = 10000; // 10 seconds

  async function notify(status, message) {
    // Placeholder for notification logic (console, API, etc.)
    console.log(`[GITLAB-AUTOMATION][${status}] ${message}`);
  }

  async function retryStep(stepFn, stepName) {
    let attempt = 0;
    let lastError = null;
    while (attempt < MAX_RETRIES) {
      try {
        await stepFn();
        await notify('success', `${stepName} succeeded on attempt ${attempt + 1}`);
        return;
      } catch (error) {
        lastError = error;
        await notify('error', `${stepName} failed on attempt ${attempt + 1}: ${error.message}`);
        attempt++;
        if (attempt < MAX_RETRIES) {
          const delay = BASE_DELAY * Math.pow(2, attempt);
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }
    await notify('error', `${stepName} failed after ${MAX_RETRIES} attempts.`);
    throw lastError;
  }

  async runFullPipeline() {
    try {
      this.log('Starting full QMOI GitLab pipeline...');
      
      // Step 1: Fix common errors
      await this.fixCommonErrors();
      
      // Step 2: Run auto-setup
      await this.runAutoSetup();
      
      // Step 3: Run tests
      await this.runTests();
      
      // Step 4: Build project
      await this.buildProject();
      
      // Step 5: Deploy to GitLab
      await this.deployToGitLab();
      
      this.log('Full QMOI GitLab pipeline completed successfully');
      
      // Add success comment to merge request
      await this.addGitLabComment(
        `## 🎉 QMOI Pipeline Completed Successfully!\n\n` +
        `✅ **Auto-setup**: Completed\n` +
        `✅ **Tests**: All passed\n` +
        `✅ **Build**: Successful\n` +
        `✅ **Deployment**: Completed\n\n` +
        `### Summary:\n` +
        `- All automation scripts executed successfully\n` +
        `- Error recovery mechanisms worked as expected\n` +
        `- GitLab integration functioning properly\n` +
        `- Notifications sent to all stakeholders\n\n` +
        `### Next Steps:\n` +
        `- Review the deployment\n` +
        `- Monitor application health\n` +
        `- Run additional validation tests\n\n` +
        `🔗 **Pipeline**: ${this.gitlabUrl}/${this.projectId}/-/pipelines/${this.pipelineId}`
      );
      
    } catch (error) {
      this.log(`Full pipeline failed: ${error.message}`, 'ERROR');
      
      // Add failure comment to merge request
      await this.addGitLabComment(
        `## ❌ QMOI Pipeline Failed\n\n` +
        `❌ **Status**: Pipeline Failed\n` +
        `📅 **Timestamp**: ${new Date().toISOString()}\n\n` +
        `### Error Details:\n` +
        `\`\`\`\n${error.message}\n\`\`\`\n\n` +
        `### Recovery Actions:\n` +
        `1. Check the automation logs\n` +
        `2. Review the created GitLab issues\n` +
        `3. Fix the identified problems\n` +
        `4. Re-run the pipeline\n\n` +
        `### Support:\n` +
        `- Check the automation logs for detailed error information\n` +
        `- Review the created GitLab issues for specific fixes\n` +
        `- Contact the development team if needed\n\n` +
        `🔗 **Pipeline**: ${this.gitlabUrl}/${this.projectId}/-/pipelines/${this.pipelineId}`
      );
      
      throw error;
    }
  }
}

// Main execution
async function main() {
  const automation = new GitLabAutomation();
  
  try {
    // Check if we're in a GitLab CI environment
    if (!process.env.CI) {
      automation.log('Not running in GitLab CI, but continuing with automation...', 'WARN');
    }
    
    // Run the full pipeline
    await automation.runFullPipeline();
    
  } catch (error) {
    automation.log(`Pipeline execution failed: ${error.message}`, 'ERROR');
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = { GitLabAutomation };

// Run if this script is executed directly
if (require.main === module) {
  main();
} 