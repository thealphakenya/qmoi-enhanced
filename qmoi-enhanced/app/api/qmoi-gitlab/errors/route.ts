import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const errorLogFile = path.join(logsDir, "qmoi_gitlab_error.log");
    const successLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let errorCount = 0;
    let successCount = 0;

    // Count errors
    if (fs.existsSync(errorLogFile)) {
      const errorContent = fs.readFileSync(errorLogFile, "utf-8");
      errorCount = errorContent
        .split("\n")
        .filter((line) => line.includes("ERROR")).length;
    }

    // Count successes
    if (fs.existsSync(successLogFile)) {
      const successContent = fs.readFileSync(successLogFile, "utf-8");
      successCount = successContent
        .split("\n")
        .filter(
          (line) => line.includes("success") || line.includes("Success"),
        ).length;
    }

    return NextResponse.json({
      errorCount,
      successCount,
      totalOperations: errorCount + successCount,
      successRate:
        errorCount + successCount > 0
          ? Math.round((successCount / (errorCount + successCount)) * 100)
          : 0,
    });
  } catch (error) {
    console.error("Error fetching error statistics:", error);
    return NextResponse.json(
      {
        errorCount: 0,
        successCount: 0,
        totalOperations: 0,
        successRate: 0,
      },
      { status: 500 },
    );
  }
}
