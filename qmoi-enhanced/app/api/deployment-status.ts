import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  let status = "Unknown";
  let lastDeploy = "";
  let health = "";
  let logs: string[] = [];
  let history: { timestamp: string; status: string; version: string }[] = [];
  let envManagerStatus: any = null;
  let huggingfaceStatus: any = null;
  try {
    const logData = fs
      .readFileSync("logs/vercel_auto_deploy.log", "utf-8")
      .split("\n")
      .filter(Boolean) as string[];
    logs = logData.slice(-20);
    const last =
      [...logs].reverse().find((line: string) => line.includes("deployment")) ||
      "";
    if (last) {
      lastDeploy = last;
      if (last.includes("successful")) status = "Success";
      else if (last.includes("failed")) status = "Failed";
    }
    const healthLine = logs.find((line: string) =>
      line.includes("Health check"),
    );
    if (healthLine) health = healthLine;
    // Parse history: look for lines with deployment, rollback, and version (commit hash)
    const versionRegex = /commit ([a-f0-9]{7,40})/i;
    const events: { timestamp: string; status: string; version: string }[] = [];
    for (const line of logData.slice(-100)) {
      const timestamp = line.slice(1, 20);
      let status = "";
      if (line.includes("deployment successful")) status = "Success";
      else if (line.includes("deployment failed")) status = "Failed";
      else if (line.includes("rollback")) status = "Rollback";
      else continue;
      let version = "";
      const match = line.match(versionRegex);
      if (match) version = match[1];
      events.push({ timestamp, status, version });
    }
    history = events.slice(-20).reverse();
    // --- New: Read envManagerStatus and huggingfaceStatus ---
    const envManagerPath = path.join(
      process.cwd(),
      "logs",
      "env_manager_status.json",
    );
    if (fs.existsSync(envManagerPath)) {
      envManagerStatus = JSON.parse(fs.readFileSync(envManagerPath, "utf-8"));
    }
    const huggingfaceStatusPath = path.join(
      process.cwd(),
      "logs",
      "huggingface_spaces_status.json",
    );
    if (fs.existsSync(huggingfaceStatusPath)) {
      huggingfaceStatus = JSON.parse(
        fs.readFileSync(huggingfaceStatusPath, "utf-8"),
      );
    }
  } catch {}
  return NextResponse.json({
    status,
    lastDeploy,
    health,
    logs,
    history,
    envManagerStatus,
    huggingfaceStatus,
  });
}
