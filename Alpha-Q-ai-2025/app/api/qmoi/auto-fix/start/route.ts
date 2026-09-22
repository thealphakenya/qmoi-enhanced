import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST() {
  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'qmoi_auto_fix_enhanced.py');
    
    // Check if script exists
    const fs = require('fs');
    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { error: 'Auto-fix script not found' },
        { status: 404 }
      );
    }

    // Start the auto-fix process
    const process = spawn('python', [scriptPath], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      console.log(`Auto-fix process exited with code ${code}`);
      if (code !== 0) {
        console.error('Auto-fix process failed:', errorOutput);
      }
    });

    // Return immediate response
    return NextResponse.json({
      status: 'started',
      message: 'Auto-fix process started successfully',
      pid: process.pid
    });

  } catch (error) {
    console.error('Error starting auto-fix process:', error);
    return NextResponse.json(
      { error: 'Failed to start auto-fix process' },
      { status: 500 }
    );
  }
} 