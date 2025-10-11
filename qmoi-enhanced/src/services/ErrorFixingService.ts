import axios from "axios";

interface ErrorReport {
  type: string;
  message: string;
  filePath?: string;
  lineNumber?: number;
  columnNumber?: number;
  stack?: string;
  context?: Record<string, unknown>;
}

interface FixSuggestion {
  description: string;
  codeChanges: {
    filePath: string;
    startLine: number;
    endLine: number;
    newContent: string;
  }[];
  commands?: string[];
}

export class ErrorFixingService {
  private static instance: ErrorFixingService;
  private errorQueue: ErrorReport[] = [];
  private isProcessing: boolean = false;

  private constructor() {
    // Private constructor to enforce Singleton pattern
  }

  public static getInstance(): ErrorFixingService {
    if (!ErrorFixingService.instance) {
      ErrorFixingService.instance = new ErrorFixingService();
    }
    return ErrorFixingService.instance;
  }

  public async reportError(report: ErrorReport): Promise<void> {
    console.log("Error reported:", report);
    this.errorQueue.push(report);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const errorReport = this.errorQueue.shift();

    if (errorReport) {
      console.log("Processing error:", errorReport);
      try {
        // Simulate AI analysis and fix suggestion
        const fixSuggestion = await this.analyzeAndSuggestFix(errorReport);
        if (fixSuggestion) {
          console.log("Applying fix suggestion:", fixSuggestion);
          await this.applyFix(fixSuggestion);
          console.log("Fix applied successfully.");
        } else {
          console.log("No automatic fix suggested for this error.");
        }
      } catch (error) {
        console.error("Failed to process error or apply fix:", error);
      } finally {
        this.isProcessing = false;
        this.processQueue(); // Process next error in queue
      }
    } else {
      this.isProcessing = false;
    }
  }

  private async analyzeAndSuggestFix(
    error: ErrorReport,
  ): Promise<FixSuggestion | null> {
    // This is where the AI logic for analyzing errors and suggesting fixes would go.
    // For now, this is a [PRODUCTION IMPLEMENTATION REQUIRED] with some basic examples.
    console.log("AI analyzing error:", error);

    // License compliance error handling
    if (
      error.message.includes("Non-compliant license found") ||
      error.type === "LicenseError"
    ) {
      // Attempt to parse the offending package from logs (if available)
      // Suggest removing or replacing the package, or adding a license override
      return {
        description:
          "Attempting to fix license compliance error. Will try to remove or replace non-compliant packages, or add override if safe.",
        codeChanges: [],
        commands: [
          // Try to auto-remove the last installed package (as a fallback)
          "npm uninstall <offending-package>",
          // Optionally, add a license override (if policy allows)
          // 'npx license-checker --json > license-report.json',
          // 'echo "<offending-package>@*" >> .license-allowlist',
        ],
      };
    }

    // Vercel/Deployment error handling
    if (
      error.message.includes("Vercel deployment failed") ||
      error.type === "VercelDeployError"
    ) {
      // Try to parse the error and suggest fixes
      return {
        description:
          "Attempting to fix Vercel deployment error. Will retry with cache clear, check env, and auto-fix common issues.",
        codeChanges: [],
        commands: [
          "npx vercel --prod --force --yes",
          // Optionally, clear Vercel cache
          "npx vercel --prod --yes --force --prebuilt",
        ],
      };
    }

    // Heroku/Other deployment error handling
    if (
      error.message.includes("Heroku deployment failed") ||
      error.type === "HerokuDeployError"
    ) {
      return {
        description:
          "Attempting to fix Heroku deployment error. Will retry push and check env.",
        codeChanges: [],
        commands: ["git push heroku main --force"],
      };
    }

    // Existing logic...
    if (error.message.includes("Cannot find module") && error.filePath) {
      const moduleName = error.message.split("'")[1];
      return {
        description: `Attempting to fix missing import for module: ${moduleName}`,
        codeChanges: [], // Real fix would involve dynamically generating code to add import
        commands: [`npm install ${moduleName}`], // Or yarn add, or pip install
      };
    }

    if (
      error.message.includes("linter error") &&
      error.filePath &&
      error.lineNumber
    ) {
      return {
        description: `Attempting to fix linter error at ${error.filePath}:${error.lineNumber}`,
        codeChanges: [], // Real fix would involve fetching file content, applying linter fix
      };
    }

    // Example for a hypothetical GitHub push error
    if (error.type === "GitHubPushError") {
      return {
        description: `Attempting to resolve GitHub push error: ${error.message}`,
        codeChanges: [],
        commands: ["git pull --rebase", "git push"],
      };
    }

    // [PRODUCTION IMPLEMENTATION REQUIRED] for other error types
    return null;
  }

  private async applyFix(fix: FixSuggestion): Promise<void> {
    console.log("Applying code changes:", fix.codeChanges);
    // In a real scenario, this would interact with the file system API to modify files.
    // For this simulation, we'll just log.
    for (const change of fix.codeChanges) {
      console.log(`Applying change to ${change.filePath}:`);
      console.log(`  Lines ${change.startLine}-${change.endLine} will be replaced with:
${change.newContent}`);
      // await axios.post('/api/edit-file', change); // Hypothetical API call to apply file edit
    }

    console.log("Running commands:", fix.commands);
    if (fix.commands && fix.commands.length > 0) {
      for (const command of fix.commands) {
        console.log(`Executing command: ${command}`);
        // await axios.post('/api/run-command', { command }); // Hypothetical API call to run terminal command
      }
    }
  }
}

export const errorFixingService = ErrorFixingService.getInstance();
