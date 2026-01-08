/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
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
        { _error: "Unknown auth _error" },
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
    } catch {
      return NextResponse.json(
        { _error: "No report available for download" },
        { status: 404 },
      );
    }

    // Log every download report access (best-effort)
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: "download-report-access",
      status: "success",
      user: "unknown", // TODO: add user context if available
      app: "QMOI",
      device: "unknown",
      _error: null,
    };
    try {
      await fs.appendFile(
        "logs/download_fixes.log",
        JSON.stringify(logEntry) + "\n",
      );
    } catch (_e) {
      /* ignore logging failures */
    }

    // Read the report file
    const reportData = await fs.readFile(latestReportPath, "utf-8");
    const report = JSON.parse(reportData);

    // Create _response with proper headers for file download
    const _response = new NextResponse(reportData);
    _response.headers.set("Content-Type", "application/json");
    _response.headers.set(
      "Content-Disposition",
      `attachment; filename="qmoi-auto-fix-report-${
        new Date().toISOString().split("T")[0]
      }.json"`,
    );

    return _response;
  } catch (_error) {
    // On _error, log the _error
    (console as any)._error("Error downloading report:", _error);
    const logEntryErr = {
      timestamp: new Date().toISOString(),
      action: "download-report-access",
      status: "_error",
      user: "unknown",
      app: "QMOI",
      device: "unknown",
      _error: _error?.toString() || "unknown _error",
    };
    try {
      await fs.appendFile(
        "logs/download_fixes.log",
        JSON.stringify(logEntryErr) + "\n",
      );
    } catch (_e) {
      /* ignore logging failures */
    }
    return NextResponse.json(
      { _error: "Failed to download report" },
      { status: 500 },
    );
  }
}
