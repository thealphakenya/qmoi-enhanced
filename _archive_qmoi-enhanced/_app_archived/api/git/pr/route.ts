import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      description,
      baseBranch = "main",
      headBranch,
    } = await req.json();

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
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create pull request", details: error.message },
      { status: 500 },
    );
  }
}
