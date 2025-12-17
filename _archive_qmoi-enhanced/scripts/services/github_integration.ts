import axios from "axios";
import { exec } from "child_process";
import { promisify } from "util";
import { autoFixService } from "./auto_fix_service";

const execAsync = promisify(exec);

interface GitHubWebhookPayload {
  ref: string;
  repository: {
    name: string;
    full_name: string;
  };
  commits: Array<{
    id: string;
    message: string;
    timestamp: string;
  }>;
}

class GitHubIntegrationService {
  private readonly masterBranch = "refs/heads/master";
  private readonly emailAddresses = [
    "rovicviccy@gmail.com",
    "thealphakenya@gmail.com",
  ];

  public async handlePushEvent(payload: GitHubWebhookPayload) {
    if (payload.ref !== this.masterBranch) {
      return;
    }

    try {
      // Clone the repository if needed
      await this.ensureRepositoryCloned(payload.repository.full_name);

      // Pull latest changes
      await execAsync("git pull origin master");

      // Run the auto-fix service
      const status = await this.getCurrentStatus();
      const fixResults = await autoFixService.startAutoFix(status);

      // If there are fixes, commit and push them
      if (fixResults.fixedIssues.length > 0) {
        await this.commitAndPushFixes(fixResults);
      }

      // Send notification
      await this.sendNotification(payload, fixResults);
    } catch (error) {
      console.error("Error handling push event:", error);
      await this.sendErrorNotification(error);
    }
  }

  private async ensureRepositoryCloned(repoFullName: string) {
    try {
      await execAsync("git status");
    } catch {
      // Repository not cloned, clone it
      await execAsync(`git clone https://github.com/${repoFullName}.git .`);
    }
  }

  private async getCurrentStatus() {
    // Implement status gathering logic here
    // This should return a QCityStatus object
    return {
      errors: [],
      // ... other status fields
    };
  }

  private async commitAndPushFixes(fixResults: any) {
    await execAsync("git add .");
    await execAsync('git commit -m "Auto-fix: Resolved issues automatically"');
    await execAsync("git push origin master");
  }

  private async sendNotification(
    payload: GitHubWebhookPayload,
    fixResults: any,
  ) {
    const subject = "Q-city Auto Fix Results";
    const body = `
      Repository: ${payload.repository.full_name}
      Commit: ${payload.commits[0].id}
      Message: ${payload.commits[0].message}
      
      Fix Results:
      - Total Issues: ${fixResults.totalIssues}
      - Fixed Issues: ${fixResults.fixedIssues}
      - Remaining Issues: ${fixResults.remainingIssues}
      
      Logs:
      ${fixResults.logs.join("\n")}
    `;

    // Send email notification
    await autoFixService.sendEmailNotification(subject, body);
  }

  private async sendErrorNotification(error: Error) {
    const subject = "Q-city Auto Fix Error";
    const body = `
      An error occurred during the auto-fix process:
      
      Error: ${error.message}
      Stack: ${error.stack}
    `;

    await autoFixService.sendEmailNotification(subject, body);
  }
}

export const githubIntegrationService = new GitHubIntegrationService();
