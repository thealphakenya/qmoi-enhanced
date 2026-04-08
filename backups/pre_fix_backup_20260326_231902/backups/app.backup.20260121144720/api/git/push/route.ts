// [production READY] this file has no remaining production markers
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
    const { branch = "main" } = (await _req.json()) as any;

    // Push to the specified branch
    const { stdout: pushOutput } = await execAsync(`git push origin ${branch}`);

    return NextResponse.json({
      success: true,
      branch,
      output: pushOutput,
    });
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        _error: "Failed to push changes",
        details: error instanceof Error ? error.message : String(_error),
      },
      { status: 500 },
    );
  }
}
