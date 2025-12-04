import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { branch = 'main' } = await req.json();

    // Push to the specified branch
    const { stdout: pushOutput } = await execAsync(`git push origin ${branch}`);

    return NextResponse.json({
      success: true,
      branch,
      output: pushOutput
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to push changes', details: error.message },
      { status: 500 }
    );
  }
} 