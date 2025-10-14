import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

interface ExportRequest {
  type: string;
  device_id?: string;
  date_from?: string;
  date_to?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json();
    const { type, device_id, date_from, date_to } = body;

    // Check if user is master
    const isMaster = await checkMasterAccess(request);
    if (!isMaster) {
      return NextResponse.json(
        { error: "Master access required" },
        { status: 403 },
      );
    }

    // Validate export type
    const validTypes = ["ownership", "unlock", "master", "all", "statistics"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid export type" },
        { status: 400 },
      );
    }

    // Get project root directory
    const projectRoot = process.cwd();
    const loggerScript = path.join(
      projectRoot,
      "scripts",
      "qmoi_own_device_logger.py",
    );

    // Check if logger script exists
    if (!fs.existsSync(loggerScript)) {
      return NextResponse.json(
        { error: "QMOI Own Device Logger not found" },
        { status: 404 },
      );
    }

    // Build command arguments for export
    const args = ["--export", "--type", type];

    if (device_id) {
      args.push("--device-id", device_id);
    }

    if (date_from) {
      args.push("--date-from", date_from);
    }

    if (date_to) {
      args.push("--date-to", date_to);
    }

    // Execute the logger script with export
    const { stdout, stderr } = await execAsync(
      `python "${loggerScript}" ${args.join(" ")}`,
      { cwd: projectRoot },
    );

    if (stderr) {
      console.error("Logger export script stderr:", stderr);
    }

    // Parse the export data
    let exportData;
    try {
      exportData = JSON.parse(stdout);
    } catch (parseError) {
      console.error("Failed to parse export data:", parseError);
      return NextResponse.json(
        { error: "Failed to parse export data" },
        { status: 500 },
      );
    }

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `qmoi-own-device-${type}-logs-${timestamp}.json`;

    // Return the export data as a downloadable file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("QMOI Own Device Export API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function checkMasterAccess(request: NextRequest): Promise<boolean> {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return false;
    }

    // Check for master token or session
    const token = authHeader.replace("Bearer ", "");

    // You can implement your own master authentication logic here
    // For now, we'll check if the token contains 'master' or 'admin'
    if (token.includes("master") || token.includes("admin")) {
      return true;
    }

    // Check for master session in cookies
    const cookies = request.headers.get("cookie");
    if (
      cookies &&
      (cookies.includes("master=true") || cookies.includes("admin=true"))
    ) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Master access check error:", error);
    return false;
  }
}
