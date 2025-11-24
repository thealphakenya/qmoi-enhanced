/* eslint-env node */
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const findRepoRoot = () => {
  let dir = process.cwd();
  while (!fs.existsSync(path.join(dir, '.git')) && dir !== path.dirname(dir)) {
    dir = path.dirname(dir);
  }
  return dir;
};

class AutoGitUpdater {
  constructor() {
    this.repoPath = process.cwd();
    this.lastCommitTime = null;
    this.isRunning = false;
    this.masterWhatsApp = '+254725382624';
    this.sisterWhatsApp = '+61424053495';
    this.repoRoot = findRepoRoot();
    process.chdir(this.repoRoot);
  }

  async start() {
    console.log('🤖 Auto Git Updater started...');
    this.isRunning = true;
    
    // Initial commit and push
    await this.performUpdate();
    
    // Set up periodic updates
    setInterval(async () => {
      if (this.isRunning) {
        await this.performUpdate();
      }
    }, 5 * 60 * 1000); // Every 5 minutes
    
    // Set up daily updates
    setInterval(async () => {
      if (this.isRunning) {
        await this.performDailyUpdate();
      }
    }, 24 * 60 * 60 * 1000); // Every 24 hours

    // Add a scheduled git pull/merge every 10 minutes
    setInterval(async () => {
      try {
        console.log('Scheduled git pull/merge...');
        await this.executeCommand('git pull --rebase');
        console.log('Git pull/merge completed.');
      } catch (err) {
        console.error('Git pull/merge failed:', err.message);
      }
    }, 10 * 60 * 1000);
  }

  async performUpdate() {
    try {
      console.log('📝 Checking for changes...');
      
      // Check if there are any changes
      const hasChanges = await this.checkForChanges();
      if (!hasChanges) {
        console.log('✅ No changes detected');
        return;
      }

      // Stage all changes
      await this.executeCommand('git add .');
      console.log('📦 Changes staged');

      // Create commit message
      const commitMessage = this.generateCommitMessage();
      await this.executeCommand(`git commit -m "${commitMessage}"`);
      console.log('💾 Changes committed');

      // Push to remote
      await this.executeCommand('git push origin main');
      console.log('🚀 Changes pushed to remote');

      // Update last commit time
      this.lastCommitTime = new Date();
      // Auto-update version and changelog files
      await this.updateVersionAndChangelog(commitMessage);
      // Notify master
      await this.notifyMaster('✅ Repository updated successfully', commitMessage);

    } catch (error) {
      console.error('❌ Error during update:', error.message);
      await this.handleError(error);
    }
  }

  async updateVersionAndChangelog(commitMessage) {
    try {
      // Update version.txt
      const versionFile = 'version.txt';
      const version = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
      fs.writeFileSync(versionFile, version);
      // Update CHANGELOG.md
      const changelogFile = 'CHANGELOG.md';
      let changelog = '';
      if (fs.existsSync(changelogFile)) {
        changelog = fs.readFileSync(changelogFile, 'utf8');
      }
      const newEntry = `\n## ${version}\n- ${commitMessage}\n`;
      fs.writeFileSync(changelogFile, newEntry + changelog);
      // Update all .md files with new version info if needed
      this.updateDocumentation();
      // Notify master of version change
      await this.notifyMaster('🔄 Version updated', `New version: ${version}`);
    } catch (error) {
      console.error('❌ Error updating version/changelog:', error.message);
    }
  }

  async performDailyUpdate() {
    try {
      console.log('📅 Performing daily update...');
      
      // Pull latest changes
      await this.executeCommand('git pull origin main');
      console.log('⬇️ Latest changes pulled');

      // Check for conflicts
      const hasConflicts = await this.checkForConflicts();
      if (hasConflicts) {
        console.log('⚠️ Conflicts detected, attempting to resolve...');
        await this.resolveConflicts();
      }

      // Update documentation
      await this.updateDocumentation();
      
      // Create daily summary
      const summary = await this.createDailySummary();
      await this.notifyMaster('📊 Daily Update Summary', summary);

    } catch (error) {
      console.error('❌ Error during daily update:', error.message);
      await this.handleError(error);
    }
  }

  async checkForChanges() {
    return new Promise((resolve) => {
      exec('git status --porcelain', (error, stdout) => {
        if (error) {
          resolve(false);
        } else {
          resolve(stdout.trim().length > 0);
        }
      });
    });
  }

  async checkForConflicts() {
    return new Promise((resolve) => {
      exec('git status --porcelain', (error, stdout) => {
        if (error) {
          resolve(false);
        } else {
          resolve(stdout.includes('UU') || stdout.includes('AA'));
        }
      });
    });
  }

  async resolveConflicts() {
    try {
      // Abort current merge if there are conflicts
      await this.executeCommand('git merge --abort');
      console.log('🔄 Merge aborted due to conflicts');
      
      // Pull with rebase to avoid conflicts
      await this.executeCommand('git pull --rebase origin main');
      console.log('🔄 Rebase completed');
      
    } catch (error) {
      console.error('❌ Could not resolve conflicts automatically');
      await this.notifyMaster('⚠️ Git conflicts detected', 'Manual resolution required');
    }
  }

  async updateDocumentation() {
    try {
      // Update README files
      const readmeFiles = [
        'README.md',
        'QMOIREADME.md',
        'MASTERREADME.md',
        'SISTERREADME.md',
        'QMOIAUTOPROJECTS.md',
        'QMOISYSTEMAUTO.md',
        'QCITYFIXAPP.md',
        'CASHON.md',
        'QMOIAICORE.md',
        'QMOIWHATSAPP.md',
        'QMOIEARNING.md',
        'AUTOGIT.md'
      ];

      for (const file of readmeFiles) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          const updatedContent = this.updateFileTimestamp(content);
          fs.writeFileSync(file, updatedContent);
        }
      }

      console.log('📚 Documentation updated');
    } catch (error) {
      console.error('❌ Error updating documentation:', error.message);
    }
  }

  updateFileTimestamp(content) {
    const timestamp = new Date().toISOString();
    const dateString = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Update last updated timestamp if it exists
    if (content.includes('Last updated:')) {
      return content.replace(
        /Last updated:.*$/m,
        `Last updated: ${dateString}`
      );
    }

    // Add timestamp if it doesn't exist
    return content + `\n\n---\n\n*Last updated: ${dateString}*`;
  }

  async createDailySummary() {
    try {
      const summary = {
        date: new Date().toISOString().split('T')[0],
        commits: await this.getCommitCount(),
        filesChanged: await this.getFilesChanged(),
        linesAdded: await this.getLinesAdded(),
        linesRemoved: await this.getLinesRemoved(),
        branches: await this.getBranches(),
        lastCommit: await this.getLastCommit()
      };

      return `📊 Daily Git Summary - ${summary.date}\n\n` +
             `🔄 Commits: ${summary.commits}\n` +
             `📁 Files Changed: ${summary.filesChanged}\n` +
             `➕ Lines Added: ${summary.linesAdded}\n` +
             `➖ Lines Removed: ${summary.linesRemoved}\n` +
             `🌿 Branches: ${summary.branches.join(', ')}\n` +
             `📝 Last Commit: ${summary.lastCommit}`;

    } catch (error) {
      console.error('❌ Error creating daily summary:', error.message);
      return '❌ Could not generate daily summary';
    }
  }

  async getCommitCount() {
    return new Promise((resolve) => {
      exec('git rev-list --count HEAD', (error, stdout) => {
        resolve(error ? 0 : parseInt(stdout.trim()));
      });
    });
  }

  async getFilesChanged() {
    return new Promise((resolve) => {
      exec('git diff --name-only HEAD~1', (error, stdout) => {
        resolve(error ? 0 : stdout.split('\n').filter(line => line.trim()).length);
      });
    });
  }

  async getLinesAdded() {
    return new Promise((resolve) => {
      exec('git diff --stat HEAD~1 | tail -1', (error, stdout) => {
        const match = stdout.match(/(\d+) insertions/);
        resolve(match ? parseInt(match[1]) : 0);
      });
    });
  }

  async getLinesRemoved() {
    return new Promise((resolve) => {
      exec('git diff --stat HEAD~1 | tail -1', (error, stdout) => {
        const match = stdout.match(/(\d+) deletions/);
        resolve(match ? parseInt(match[1]) : 0);
      });
    });
  }

  async getBranches() {
    return new Promise((resolve) => {
      exec('git branch --list', (error, stdout) => {
        if (error) {
          resolve(['main']);
        } else {
          resolve(stdout.split('\n')
            .map(branch => branch.replace('*', '').trim())
            .filter(branch => branch.length > 0));
        }
      });
    });
  }

  async getLastCommit() {
    return new Promise((resolve) => {
      exec('git log -1 --oneline', (error, stdout) => {
        resolve(error ? 'Unknown' : stdout.trim());
      });
    });
  }

  generateCommitMessage() {
    const timestamp = new Date().toISOString();
    const date = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const messages = [
      `🤖 Auto-update: ${date}`,
      `📝 Auto-commit: ${date}`,
      `🔄 Auto-sync: ${date}`,
      `⚡ Auto-push: ${date}`,
      `🚀 Auto-deploy: ${date}`,
      `✨ Auto-enhance: ${date}`,
      `🔧 Auto-fix: ${date}`,
      `📊 Auto-stats: ${date}`,
      `🎯 Auto-optimize: ${date}`,
      `💫 Auto-improve: ${date}`
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: this.repoRoot }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  async notifyMaster(title, message) {
    try {
      // Simulate WhatsApp notification
      console.log(`📱 WhatsApp notification to master:`);
      console.log(`Title: ${title}`);
      console.log(`Message: ${message}`);
      
      // In real implementation, this would call the WhatsApp API
      // await fetch('/api/whatsapp/notify-master', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     to: this.masterWhatsApp,
      //     title,
      //     message 
      //   })
      // });
    } catch (error) {
      console.error('❌ Error notifying master:', error.message);
    }
  }

  async handleError(error) {
    const errorMessage = `❌ Git Update Error: ${error.message}`;
    console.error(errorMessage);
    
    // Notify master about the error
    await this.notifyMaster('⚠️ Git Update Error', errorMessage);
    
    // Log error to file
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    };
    
    fs.appendFileSync('git-error.log', JSON.stringify(errorLog) + '\n');
  }

  stop() {
    console.log('🛑 Auto Git Updater stopped');
    this.isRunning = false;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastCommitTime: this.lastCommitTime,
      repoPath: this.repoPath
    };
  }
}

// Export for use in other modules
module.exports = AutoGitUpdater;

// Start the updater if this script is run directly
if (require.main === module) {
  const updater = new AutoGitUpdater();
  updater.start();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Auto Git Updater...');
    updater.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down Auto Git Updater...');
    updater.stop();
    process.exit(0);
  });
} 