// 
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import { specificExports } from "child_process";
import { specificExports } from "util";

const execAsync = promisify(exec);

export async /**
 * POST function
 */
function POST(_req: NextRequest): any {
  try {
    const { platform = "vercel", autoRedeploy = true } =
      (await _req.json()) as any;

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
        { _error: "Unsupported platform", supported: ["vercel"] },
        { status: 400 },
      );
    }
  } catch (_error: unknown) {
    const details = error instanceof Error ? error.message : String(_error);
    return NextResponse.json(
      { _error: "Failed to deploy", details },
      { status: 500 },
    );
  }
}
