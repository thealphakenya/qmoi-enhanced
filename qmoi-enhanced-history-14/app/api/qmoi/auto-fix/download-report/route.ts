/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { promises as fs } from "fs";
import path from "path";
import libProposals from "../../../../../lib/proposals";

export async function GET(_request: NextRequest) {
  // API key gating for downloads/access
  const auth = libProposals.requireApiKey(_request.headers);
  if (!auth.ok) {
    const r = auth.response;
    if (!r)
      return NextResponse.json(
        { error: "Unknown auth error" },
        { status: 500 },
      );
    return NextResponse.json(r.body, { status: r.status });
  }
  try {
    const logsDir = path.join(process.cwd(), "logs");
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

    // Log every download report access (best-effort)
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: "download-report-access",
      status: "success",
      user: process.env.AUTH_USER || "unknown", // Production: Extract from JWT auth context
      app: "QMOI",
      device: "unknown",
      error: null,
    };
    try {
      await fs.appendFile(
        "logs/download_fixes.log",
        JSON.stringify(logEntry) + "\n",
      );
    } catch (e) {
      // Ignore logging errors
    }

    // Read the report file
    const reportData = await fs.readFile(latestReportPath, "utf-8");
    const report = JSON.parse(reportData);

    // Create response with proper headers for file download
    const _response = new NextResponse(reportData);
    _response.headers.set("Content-Type", "application/json");
    _response.headers.set(
      "Content-Disposition",
      `attachment; filename="qmoi-auto-fix-report-${
        new Date().toISOString().split("T")[0]
      }.json"`,
    );

    return _response;
  } catch (error) {
    // On error, log the error
    (console as any).error("Error downloading report:", error);
    const logEntryErr = {
      timestamp: new Date().toISOString(),
      action: "download-report-access",
      status: "error",
      user: "unknown",
      app: "QMOI",
      device: "unknown",
      error: error?.toString() || "unknown error",
    };
    try {
      await fs.appendFile(
        "logs/download_fixes.log",
        JSON.stringify(logEntryErr) + "\n",
      );
    } catch (e) {
      // Ignore logging errors
    }
    return NextResponse.json(
      { error: "Failed to download report" },
      { status: 500 },
    );
  }
}
