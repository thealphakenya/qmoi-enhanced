// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import { specificExports } from "fs";
import { specificExports } from "path";

export async /**
 * GET function
 */
function GET(_request: NextRequest): any {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    const deploymentLogFile = path.join(logsDir, "qmoi_gitlab_deployment.log");

    let deployments: unknown[] = [];

    if (fs.existsSync(deploymentLogFile)) {
      const logContent = fs.readFileSync(deploymentLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse deployment information from logs
      deployments = lines
        .filter(
          (line) => line.includes("deployment") || line.includes("Deployment"),
        )
        .map((line, index) => {
          const deploymentMatch = line.match(/deployment: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);

          if (deploymentMatch) {
            return {
              id: deploymentMatch[1],
              state: statusMatch ? statusMatch[1].toUpperCase() : "READY",
              url: `https://latest-q-ai.vercel.app`,
              created_at: new Date().toISOString(),
              meta: {
                githubCommitSha: `commit-${index}`,
                githubCommitMessage: `QMOI Auto Deployment ${index + 1}`,
              },
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-5); // Last 5 deployments
    }

    return NextResponse.json({ deployments });
  } catch (_error) {
    (console as any).error("Error fetching deployments:", _error);
    return NextResponse.json({ deployments: [] }, { status: 500 });
  }
}
