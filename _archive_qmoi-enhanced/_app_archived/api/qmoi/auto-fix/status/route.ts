import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const latestReportPath = path.join(logsDir, "qmoi_auto_fix_latest.json");

    let report = {
      timestamp: new Date().toISOString(),
      status: "unknown" as "running" | "completed" | "error" | "unknown",
      summary: {
        md_files_processed: 0,
        claims_verified: 0,
        claims_fixed: 0,
        errors_fixed: 0,
        manual_errors_fixed: 0,
        new_features_documented: 0,
      },
      deployment: {
        status: "unknown",
        github_actions: "unknown",
      },
      details: [],
    };

    // Try to read latest report
    try {
      const reportData = await fs.readFile(latestReportPath, "utf-8");
      report = JSON.parse(reportData);
    } catch (error) {
      console.log("No latest report found, using default");
    }

    // Check if auto-fix process is running
    try {
      const processes = await fs.readdir(logsDir);
      const runningLogs = processes.filter(
        (file) => file.includes("qmoi_auto_fix") && file.endsWith(".log"),
      );

      if (runningLogs.length > 0) {
        // Check if process is actively running by looking at log timestamps
        const latestLog = runningLogs.sort().pop();
        if (latestLog) {
          const logPath = path.join(logsDir, latestLog);
          const logStats = await fs.stat(logPath);
          const timeDiff = Date.now() - logStats.mtime.getTime();

          // If log was updated in last 5 minutes, consider it running
          if (timeDiff < 5 * 60 * 1000) {
            report.status = "running";
          }
        }
      }
    } catch (error) {
      console.log("Error checking running processes:", error);
    }

    // Check deployment status
    try {
      const vercelConfigPath = path.join(process.cwd(), "vercel.json");
      await fs.access(vercelConfigPath);
      report.deployment.status = "configured";
    } catch {
      report.deployment.status = "not_configured";
    }

    // Check GitHub Actions status
    try {
      const githubWorkflowsPath = path.join(
        process.cwd(),
        ".github",
        "workflows",
      );
      await fs.access(githubWorkflowsPath);
      const workflows = await fs.readdir(githubWorkflowsPath);
      if (workflows.length > 0) {
        report.deployment.github_actions = "configured";
      } else {
        report.deployment.github_actions = "no_workflows";
      }
    } catch {
      report.deployment.github_actions = "not_configured";
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error getting auto-fix status:", error);
    return NextResponse.json(
      { error: "Failed to get auto-fix status" },
      { status: 500 },
    );
  }
}
