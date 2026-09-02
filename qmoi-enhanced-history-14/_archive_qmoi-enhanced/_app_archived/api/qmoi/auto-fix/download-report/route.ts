import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function requireApiKey(request: NextRequest) {
  const key = request.headers.get("x-qmoi-api-key") || "";
  const expected = process.env.QMOI_API_KEY || "";
  if (!expected) return true;
  return key === expected;
}

export async function GET(request: NextRequest) {
  const logsDir = path.join(process.cwd(), "logs");
  try {
    const latestReportPath = path.join(logsDir, "qmoi_auto_fix_latest.json");

    // Check if latest report exists
    try {
      await fs.access(latestReportPath);
    } catch (e) {
      return NextResponse.json(
        { error: "No report available for download" },
        { status: 404 },
      );
    }

    // optionally require API key for downloads
    if (!requireApiKey(request) && process.env.QMOI_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure logs dir exists
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: "download-report-access",
      status: "success",
      user: "unknown",
      app: "QMOI",
      device: "unknown",
      error: null,
    };
    fs.appendFileSync(
      path.join(logsDir, "download_fixes.log"),
      JSON.stringify(logEntry) + "\n",
    );

    // Read the report file
    const reportData = await fs.promises.readFile(latestReportPath, "utf-8");
    const report = JSON.parse(reportData);

    // Create response with proper headers for file download
    const response = new NextResponse(reportData);
    response.headers.set("Content-Type", "application/json");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="qmoi-auto-fix-report-${new Date().toISOString().split("T")[0]}.json"`,
    );

    return response;
  } catch (error) {
    // On error, log the error
    globalThis.console.error("Error downloading report:", error);
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    const logEntryErr = {
      timestamp: new Date().toISOString(),
      action: "download-report-access",
      status: "error",
      user: "unknown",
      app: "QMOI",
      device: "unknown",
      error: error?.toString() || "unknown error",
    };
    fs.appendFileSync(
      path.join(logsDir, "download_fixes.log"),
      JSON.stringify(logEntryErr) + "\n",
    );
    return NextResponse.json(
      { error: "Failed to download report" },
      { status: 500 },
    );
  }
}
