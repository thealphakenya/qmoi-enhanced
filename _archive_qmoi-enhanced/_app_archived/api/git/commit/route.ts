import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { message, files = ["*"] } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Commit message is required" },
        { status: 400 },
      );
    }

    // Add files to staging
    const addCommand =
      files.length === 1 && files[0] === "*"
        ? "git add ."
        : `git add ${files.join(" ")}`;

    await execAsync(addCommand);

    // Commit with message
    const { stdout: commitOutput } = await execAsync(
      `git commit -m "${message}"`,
    );

    // Extract commit ID from output
    const commitMatch = commitOutput.match(/\[([a-f0-9]+)\]/);
    const commitId = commitMatch ? commitMatch[1] : "unknown";

    return NextResponse.json({
      success: true,
      commitId,
      message,
      output: commitOutput,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to commit changes", details: error.message },
      { status: 500 },
    );
  }
}
