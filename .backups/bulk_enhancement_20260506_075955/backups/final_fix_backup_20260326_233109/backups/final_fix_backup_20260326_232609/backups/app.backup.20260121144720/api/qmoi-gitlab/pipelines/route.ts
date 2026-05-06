// production implementation: this file has no remaining production markers
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
    const pipelineLogFile = path.join(logsDir, "qmoi_gitlab_ci_cd.log");

    let pipelines: unknown[] = [];

    if (fs.existsSync(pipelineLogFile)) {
      const logContent = fs.readFileSync(pipelineLogFile, "utf-8");
      const lines = logContent.split("\n").filter((line) => line.trim());

      // Parse pipeline information from logs
      pipelines = lines
        .filter((line) => line.includes("Pipeline"))
        .map((line) => {
          const match = line.match(/Pipeline (\d+) status: (\w+)/);
          if (match) {
            return {
              id: parseInt(match[1]),
              status: match[2],
              ref: "main",
              created_at: new Date().toISOString(),
              web_url: `https://gitlab.com/qmoi/latest-q-ai/-/pipelines/${match[1]}`,
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 pipelines
    }

    return NextResponse.json({ pipelines });
  } catch (_error) {
    (console as any).error("Error fetching pipelines:", _error);
    return NextResponse.json({ pipelines: [] }, { status: 500 });
  }
}
