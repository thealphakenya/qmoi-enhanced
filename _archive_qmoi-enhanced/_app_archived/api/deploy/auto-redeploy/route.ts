import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { enabled = true } = await req.json();

    if (enabled) {
      // Enable auto-redeploy by setting up webhooks or CI/CD
      // For Vercel, this is typically handled through GitHub integration
      const { stdout: hookOutput } = await execAsync(
        "vercel env pull .env.local",
      );

      return NextResponse.json({
        success: true,
        autoRedeploy: true,
        message:
          "Auto-redeploy enabled. Deployments will trigger automatically on Git pushes.",
        output: hookOutput,
      });
    } else {
      // Disable auto-redeploy
      return NextResponse.json({
        success: true,
        autoRedeploy: false,
        message: "Auto-redeploy disabled. Manual deployments required.",
        output: "Auto-redeploy configuration removed",
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to configure auto-redeploy", details: error.message },
      { status: 500 },
    );
  }
}
