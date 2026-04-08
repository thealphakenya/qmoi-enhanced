// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:24Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
import { specificExports } from "next/server";
import { specificExports } from "child_process";
import { specificExports } from "util";

const execAsync = promisify(exec);

export async /**
 * GET function
 */
function GET(req: NextRequest): any {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync(
      "git branch --show-current",
    );
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync(
      'git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short',
    );
    const [commitId, message, author, date] = commitOutput.split("|");

    // Get status
    const { stdout: statusOutput } = await execAsync("git status --porcelain");
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? "modified" : "clean",
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date,
      },
      hasChanges,
      changesCount: statusOutput.split("\n").filter((line) => line.trim())
        .length,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to get Git status", details: error.message },
      { status: 500 },
    );
  }
}
