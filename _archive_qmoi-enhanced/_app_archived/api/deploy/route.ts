import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { platform = "vercel", autoRedeploy = true } = await req.json();

    if (platform === "vercel") {
      // Deploy to Vercel using Vercel CLI
      const { stdout: deployOutput } = await execAsync("vercel --prod --yes");

      // Extract deployment URL from output
      const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
      const deploymentUrl = urlMatch ? urlMatch[0] : "";

      // Extract deployment ID from output
      const idMatch = deployOutput.match(/Deployment ID: ([a-zA-Z0-9]+)/);
      const deploymentId = idMatch ? idMatch[1] : "unknown";

      return NextResponse.json({
        success: true,
        platform: "vercel",
        deploymentId,
        url: deploymentUrl,
        status: "deployed",
        lastDeploy: new Date().toISOString(),
        environment: "production",
        autoRedeploy,
        output: deployOutput,
      });
    } else {
      return NextResponse.json(
        { error: "Unsupported platform", supported: ["vercel"] },
        { status: 400 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to deploy", details: error.message },
      { status: 500 },
    );
  }
}
