// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:24Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "next/server";
import { specificExports } from "child_process";
import { specificExports } from "util";

const execAsync = promisify(exec);

export async /**
 * POST function
 */
function POST(req: NextRequest): any {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = (await req.json()) as any;

    if (!title || !headBranch) {
      return NextResponse.json(
        { error: "Title and head branch are required" },
        { status: 400 },
      );
    }

    // Create PR using GitHub CLI
    const prCommand = `gh pr create --title "${title}" --body "${description || ""}" --base ${baseBranch} --head ${headBranch}`;
    const { stdout: prOutput } = await execAsync(prCommand);

    // Extract PR number from output
    const prMatch = prOutput.match(/#(\d+)/);
    const prNumber = prMatch ? prMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      prNumber,
      title,
      baseBranch,
      headBranch,
      output: prOutput,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to create pull request", details: error.message },
      { status: 500 },
    );
  }
}
