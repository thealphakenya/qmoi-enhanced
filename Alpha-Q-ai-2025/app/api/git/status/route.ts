import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(req: NextRequest) {
  try {
    // Get current branch
    const { stdout: branchOutput } = await execAsync('git branch --show-current');
    const currentBranch = branchOutput.trim();

    // Get last commit
    const { stdout: commitOutput } = await execAsync('git log -1 --pretty=format:"%H|%s|%an|%ad" --date=short');
    const [commitId, message, author, date] = commitOutput.split('|');

    // Get status
    const { stdout: statusOutput } = await execAsync('git status --porcelain');
    const hasChanges = statusOutput.trim().length > 0;

    return NextResponse.json({
      status: hasChanges ? 'modified' : 'clean',
      currentBranch,
      lastCommit: {
        id: commitId,
        message,
        author,
        date
      },
      hasChanges,
      changesCount: statusOutput.split('\n').filter(line => line.trim()).length
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to get Git status', details: error.message },
      { status: 500 }
    );
  }
}
