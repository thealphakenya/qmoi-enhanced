import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const latestReportPath = path.join(logsDir, "qmoi_auto_fix_latest.json");

    // Check if latest report exists
    try {
      await fs.access(latestReportPath);
    } catch {
      return NextResponse.json(
        { error: "No report available for download" },
        { status: 404 },
      );
    }

    // Log every download report access
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: "download-report-access",
      status: "success",
      user: "unknown", // TODO: add user context if available
      app: "QMOI",
      device: "unknown",
      error: null,
    };
    fs.appendFileSync(
      "logs/download_fixes.log",
      JSON.stringify(logEntry) + "\n",
    );

    // Read the report file
    const reportData = await fs.readFile(latestReportPath, "utf-8");
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
    console.error("Error downloading report:", error);
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
      "logs/download_fixes.log",
      JSON.stringify(logEntryErr) + "\n",
    );
    return NextResponse.json(
      { error: "Failed to download report" },
      { status: 500 },
    );
  }
}
