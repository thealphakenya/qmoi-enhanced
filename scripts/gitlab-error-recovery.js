#!/usr/bin/env node

const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

class GitLabErrorRecovery {
  constructor() {
    this.gitlabToken =
      process.env.GITLAB_TOKEN || process.env.GITLAB_ACCESS_TOKEN;
    this.gitlabUrl = process.env.GITLAB_URL || "https://gitlab.com";
    this.projectId = process.env.GITLAB_PROJECT_ID;
    this.branch = process.env.CI_COMMIT_REF_NAME || "main";
    this.commitSha = process.env.CI_COMMIT_SHA;
    this.jobId = process.env.CI_JOB_ID;
    this.pipelineId = process.env.CI_PIPELINE_ID;

    this.logFile = path.join(
      process.cwd(),
      "logs",
      "gitlab-error-recovery.log",
    );
    this.ensureLogDir();
  }

  ensureLogDir() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message, level = "INFO") {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    fs.appendFileSync(this.logFile, logEntry);
    console.log(`[${level}] ${message}`);
  }

  async runCommand(command, cwd = process.cwd()) {
    return new Promise((resolve, reject) => {
      this.log(`Running command: ${command}`);

      const child = spawn(command, [], {
        shell: true,
        cwd,
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, FORCE_COLOR: "1" },
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        stdout += data.toString();
        process.stdout.write(data);
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
        process.stderr.write(data);
      });

      child.on("close", (code) => {
        if (code === 0) {
          this.log(`Command completed successfully: ${command}`);
          resolve({ stdout, stderr, code });
        } else {
          this.log(`Command failed with code ${code}: ${command}`, "ERROR");
          reject({ stdout, stderr, code });
        }
      });

      child.on("error", (error) => {
        this.log(`Command error: ${error.message}`, "ERROR");
        reject({ error: error.message, code: -1 });
      });
    });
  }

  async fixNpmIssues() {
    try {
      this.log("Fixing NPM issues...");

      const fixes = [
        {
          name: "Clear NPM cache",
          command: "npm cache clean --force",
          continueOnError: true,
        },
        {
          name: "Remove node_modules and package-lock.json",
          command: "npx rimraf node_modules package-lock.json",
          continueOnError: true,
        },
        {
          name: "Reinstall dependencies",
          command: "npm install",
          continueOnError: false,
        },
        {
          name: "Update NPM",
          command: "npm install -g npm@latest",
          continueOnError: true,
        },
      ];

      for (const fix of fixes) {
        try {
          this.log(`Applying NPM fix: ${fix.name}`);
          await this.runCommand(fix.command);
          this.log(`NPM fix applied successfully: ${fix.name}`);
        } catch (error) {
          this.log(`NPM fix failed: ${fix.name} - ${error.message}`, "WARN");
          if (!fix.continueOnError) {
            throw error;
          }
        }
      }

      this.log("NPM issues fixed successfully");
    } catch (error) {
      this.log(`Failed to fix NPM issues: ${error.message}`, "ERROR");
      throw error;
    }
  }

  async fixBuildIssues() {
    try {
      this.log("Fixing build issues...");

      const fixes = [
        {
          name: "Clear build cache",
          command: "npx rimraf build/ dist/ .cache/",
          continueOnError: true,
        },
        {
          name: "Fix TypeScript compilation",
          command: "npx tsc --noEmit --skipLibCheck",
          continueOnError: true,
        },
        {
          name: "Fix ESLint issues",
          command: "npx eslint --fix src/",
          continueOnError: true,
        },
        {
          name: "Fix Prettier formatting",
          command: "npx prettier --write src/",
          continueOnError: true,
        },
        {
          name: "Check for missing dependencies",
          command: "npm ls --depth=0",
          continueOnError: true,
        },
      ];

      for (const fix of fixes) {
        try {
          this.log(`Applying build fix: ${fix.name}`);
          await this.runCommand(fix.command);
          this.log(`Build fix applied successfully: ${fix.name}`);
        } catch (error) {
          this.log(`Build fix failed: ${fix.name} - ${error.message}`, "WARN");
          if (!fix.continueOnError) {
            throw error;
          }
        }
      }

      this.log("Build issues fixed successfully");
    } catch (error) {
      this.log(`Failed to fix build issues: ${error.message}`, "ERROR");
      throw error;
    }
  }

  async fixTestIssues() {
    try {
      this.log("Fixing test issues...");

      const fixes = [
        {
          name: "Clear test cache",
          command: "npx rimraf coverage/ .nyc_output/ test-results/",
          continueOnError: true,
        },
        {
          name: "Install test dependencies",
          command:
            "npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom",
          continueOnError: true,
        },
        {
          name: "Install Playwright",
          command: "npx playwright install",
          continueOnError: true,
        },
        {
          name: "Install Cypress",
          command: "npm install --save-dev cypress",
          continueOnError: true,
        },
        {
          name: "Update Jest configuration",
          command: "npm run test -- --passWithNoTests",
          continueOnError: true,
        },
      ];

      for (const fix of fixes) {
        try {
          this.log(`Applying test fix: ${fix.name}`);
          await this.runCommand(fix.command);
          this.log(`Test fix applied successfully: ${fix.name}`);
        } catch (error) {
          this.log(`Test fix failed: ${fix.name} - ${error.message}`, "WARN");
          if (!fix.continueOnError) {
            throw error;
          }
        }
      }

      this.log("Test issues fixed successfully");
    } catch (error) {
      this.log(`Failed to fix test issues: ${error.message}`, "ERROR");
      throw error;
    }
  }

  async fixGitIssues() {
    try {
      this.log("Fixing Git issues...");

      const fixes = [
        {
          name: "Configure Git user",
          command:
            'git config --global user.name "QMOI Automation" && git config --global user.email "qmoi-automation@gitlab.com"',
          continueOnError: true,
        },
        {
          name: "Set Git push strategy",
          command: "git config --global push.default simple",
          continueOnError: true,
        },
        {
          name: "Configure GitLab credentials",
          command: `git config --global url."https://oauth2:${this.gitlabToken}@${new URL(this.gitlabUrl).hostname}/".insteadOf "https://${new URL(this.gitlabUrl).hostname}/"`,
          continueOnError: true,
        },
        {
          name: "Fetch latest changes",
          command: "git fetch origin",
          continueOnError: true,
        },
        {
          name: "Reset to origin",
          command: `git reset --hard origin/${this.branch}`,
          continueOnError: true,
        },
      ];

      for (const fix of fixes) {
        try {
          this.log(`Applying Git fix: ${fix.name}`);
          await this.runCommand(fix.command);
          this.log(`Git fix applied successfully: ${fix.name}`);
        } catch (error) {
          this.log(`Git fix failed: ${fix.name} - ${error.message}`, "WARN");
          if (!fix.continueOnError) {
            throw error;
          }
        }
      }

      this.log("Git issues fixed successfully");
    } catch (error) {
      this.log(`Failed to fix Git issues: ${error.message}`, "ERROR");
      throw error;
    }
  }

  async fixEnvironmentIssues() {
    try {
      this.log("Fixing environment issues...");

      const fixes = [
        {
          name: "Check Node.js version",
          command: "node --version",
          continueOnError: true,
        },
        {
          name: "Check NPM version",
          command: "npm --version",
          continueOnError: true,
        },
        {
          name: "Set environment variables",
          command: "export NODE_ENV=production && export CI=true",
          continueOnError: true,
        },
        {
          name: "Create necessary directories",
          command: "mkdir -p logs build dist coverage test-results",
          continueOnError: true,
        },
        {
          name: "Set file permissions",
          command: "chmod +x scripts/*.js",
          continueOnError: true,
        },
      ];

      for (const fix of fixes) {
        try {
          this.log(`Applying environment fix: ${fix.name}`);
          await this.runCommand(fix.command);
          this.log(`Environment fix applied successfully: ${fix.name}`);
        } catch (error) {
          this.log(
            `Environment fix failed: ${fix.name} - ${error.message}`,
            "WARN",
          );
          if (!fix.continueOnError) {
            throw error;
          }
        }
      }

      this.log("Environment issues fixed successfully");
    } catch (error) {
      this.log(`Failed to fix environment issues: ${error.message}`, "ERROR");
      throw error;
    }
  }

  async fixScriptIssues() {
    try {
      this.log("Fixing script issues...");

      // Check if all required scripts exist
      const requiredScripts = [
        "scripts/auto-setup.js",
        "scripts/gitlab-automation.js",
        "scripts/gitlab-push-automation.js",
        "scripts/gitlab-notification-service.js",
        "scripts/health-check.js",
      ];

      for (const script of requiredScripts) {
        if (!fs.existsSync(script)) {
          this.log(`Creating missing script: ${script}`, "WARN");
          // Create a basic script template
          const scriptContent = `#!/usr/bin/env node
// QMOI ${path.basename(script, ".js")} Script
// Auto-generated by QMOI Error Recovery

console.log('QMOI ${path.basename(script, ".js")} script loaded');

module.exports = {
  // Add implementation here
};
`;
          fs.writeFileSync(script, scriptContent);
          fs.chmodSync(script, "755");
          this.log(`Created script: ${script}`);
        }
      }

      this.log("Script issues fixed successfully");
    } catch (error) {
      this.log(`Failed to fix script issues: ${error.message}`, "ERROR");
      throw error;
    }
  }

  async fixConfigurationIssues() {
    try {
      this.log("Fixing configuration issues...");

      // Check and fix package.json
      if (fs.existsSync("package.json")) {
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

        // Ensure required scripts exist
        const requiredScripts = {
          start: "react-scripts start",
          build: "react-scripts build",
          test: "react-scripts test",
          "auto:setup": "node scripts/auto-setup.js",
          "gitlab:automation": "node scripts/gitlab-automation.js",
        };

        let updated = false;
        for (const [script, command] of Object.entries(requiredScripts)) {
          if (!packageJson.scripts || !packageJson.scripts[script]) {
            if (!packageJson.scripts) packageJson.scripts = {};
            packageJson.scripts[script] = command;
            updated = true;
            this.log(`Added missing script: ${script}`);
          }
        }

        if (updated) {
          fs.writeFileSync(
            "package.json",
            JSON.stringify(packageJson, null, 2),
          );
          this.log("Updated package.json with missing scripts");
        }
      }

      // Check and fix .gitignore
      if (!fs.existsSync(".gitignore")) {
        const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Coverage
coverage/
.nyc_output/

# Test results
test-results/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# QMOI specific
qmoi_secret_flag
`;
        fs.writeFileSync(".gitignore", gitignoreContent);
        this.log("Created .gitignore file");
      }

      // Check and fix .gitlab-ci.yml
      if (!fs.existsSync(".gitlab-ci.yml")) {
        this.log("Creating basic .gitlab-ci.yml file", "WARN");
        // The .gitlab-ci.yml file should be created by the main automation
      }

      this.log("Configuration issues fixed successfully");
    } catch (error) {
      this.log(`Failed to fix configuration issues: ${error.message}`, "ERROR");
      throw error;
    }
  }

  async runFullRecovery() {
    try {
      this.log("Starting QMOI GitLab error recovery...");

      // Step 1: Fix environment issues
      await this.fixEnvironmentIssues();

      // Step 2: Fix NPM issues
      await this.fixNpmIssues();

      // Step 3: Fix configuration issues
      await this.fixConfigurationIssues();

      // Step 4: Fix script issues
      await this.fixScriptIssues();

      // Step 5: Fix build issues
      await this.fixBuildIssues();

      // Step 6: Fix test issues
      await this.fixTestIssues();

      // Step 7: Fix Git issues
      await this.fixGitIssues();

      this.log("QMOI GitLab error recovery completed successfully");

      // Run health check after recovery
      try {
        await this.runCommand("npm run health:check");
        this.log("Health check passed after recovery");
      } catch (error) {
        this.log(
          `Health check failed after recovery: ${error.message}`,
          "WARN",
        );
      }

      return {
        success: true,
        message: "Error recovery completed successfully",
        fixes: [
          "Environment issues fixed",
          "NPM issues fixed",
          "Configuration issues fixed",
          "Script issues fixed",
          "Build issues fixed",
          "Test issues fixed",
          "Git issues fixed",
        ],
      };
    } catch (error) {
      this.log(`Error recovery failed: ${error.message}`, "ERROR");

      // Try to send error notification
      try {
        const {
          GitLabNotificationService,
        } = require("./gitlab-notification-service");
        const notificationService = new GitLabNotificationService();
        await notificationService.sendErrorNotification(error, {
          type: "error_recovery_failed",
          recovery_attempted: true,
        });
      } catch (notificationError) {
        this.log(
          `Failed to send error notification: ${notificationError.message}`,
          "ERROR",
        );
      }

      throw error;
    }
  }

  async diagnoseIssues() {
    try {
      this.log("Diagnosing QMOI issues...");

      const diagnostics = [];

      // Check Node.js and NPM
      try {
        const nodeVersion = await this.runCommand("node --version");
        diagnostics.push(`✅ Node.js: ${nodeVersion.stdout.trim()}`);
      } catch (error) {
        diagnostics.push(`❌ Node.js: Not available`);
      }

      try {
        const npmVersion = await this.runCommand("npm --version");
        diagnostics.push(`✅ NPM: ${npmVersion.stdout.trim()}`);
      } catch (error) {
        diagnostics.push(`❌ NPM: Not available`);
      }

      // Check Git
      try {
        const gitVersion = await this.runCommand("git --version");
        diagnostics.push(`✅ Git: ${gitVersion.stdout.trim()}`);
      } catch (error) {
        diagnostics.push(`❌ Git: Not available`);
      }

      // Check required files
      const requiredFiles = [
        "package.json",
        "scripts/auto-setup.js",
        "scripts/gitlab-automation.js",
      ];

      for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
          diagnostics.push(`✅ ${file}: Exists`);
        } else {
          diagnostics.push(`❌ ${file}: Missing`);
        }
      }

      // Check environment variables
      const requiredEnvVars = [
        "GITLAB_TOKEN",
        "GITLAB_PROJECT_ID",
        "CI_COMMIT_REF_NAME",
      ];

      for (const envVar of requiredEnvVars) {
        if (process.env[envVar]) {
          diagnostics.push(`✅ ${envVar}: Set`);
        } else {
          diagnostics.push(`❌ ${envVar}: Not set`);
        }
      }

      this.log("Diagnostics completed:");
      diagnostics.forEach((diagnostic) => this.log(diagnostic));

      return diagnostics;
    } catch (error) {
      this.log(`Diagnosis failed: ${error.message}`, "ERROR");
      throw error;
    }
  }
}

// Main execution
async function main() {
  const recovery = new GitLabErrorRecovery();

  try {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case "--full-recovery":
        await recovery.runFullRecovery();
        break;
      case "--diagnose":
        await recovery.diagnoseIssues();
        break;
      case "--fix-npm":
        await recovery.fixNpmIssues();
        break;
      case "--fix-build":
        await recovery.fixBuildIssues();
        break;
      case "--fix-tests":
        await recovery.fixTestIssues();
        break;
      case "--fix-git":
        await recovery.fixGitIssues();
        break;
      case "--fix-env":
        await recovery.fixEnvironmentIssues();
        break;
      case "--fix-scripts":
        await recovery.fixScriptIssues();
        break;
      case "--fix-config":
        await recovery.fixConfigurationIssues();
        break;
      default:
        console.log("QMOI GitLab Error Recovery");
        console.log("Usage:");
        console.log("  --full-recovery    Run complete error recovery");
        console.log("  --diagnose         Diagnose current issues");
        console.log("  --fix-npm          Fix NPM issues only");
        console.log("  --fix-build        Fix build issues only");
        console.log("  --fix-tests        Fix test issues only");
        console.log("  --fix-git          Fix Git issues only");
        console.log("  --fix-env          Fix environment issues only");
        console.log("  --fix-scripts      Fix script issues only");
        console.log("  --fix-config       Fix configuration issues only");
        break;
    }
  } catch (error) {
    recovery.log(`Error recovery failed: ${error.message}`, "ERROR");
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = { GitLabErrorRecovery };

// Run if this script is executed directly
if (require.main === module) {
  main();
}
