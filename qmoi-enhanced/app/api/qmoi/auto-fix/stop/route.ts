import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Find and kill Python processes running the auto-fix script
    const command = process.platform === 'win32' 
      ? 'tasklist /FI "IMAGENAME eq python.exe" /FO CSV'
      : 'ps aux | grep python';

    const { stdout } = await execAsync(command);
    
    let killedProcesses = 0;
    
    if (process.platform === 'win32') {
      // Windows: Parse tasklist output and kill processes
      const lines = stdout.split('\n').slice(1); // Skip header
      for (const line of lines) {
        if (line.includes('python.exe')) {
          const parts = line.split(',');
          if (parts.length > 1) {
            const pid = parts[1].replace(/"/g, '');
            try {
              await execAsync(`taskkill /PID ${pid} /F`);
              killedProcesses++;
            } catch (error) {
              console.log(`Failed to kill process ${pid}:`, error);
            }
          }
        }
      }
    } else {
      // Unix: Kill processes containing qmoi_auto_fix
      const lines = stdout.split('\n');
      for (const line of lines) {
        if (line.includes('qmoi_auto_fix')) {
          const parts = line.trim().split(/\s+/);
          if (parts.length > 1) {
            const pid = parts[1];
            try {
              await execAsync(`kill -9 ${pid}`);
              killedProcesses++;
            } catch (error) {
              console.log(`Failed to kill process ${pid}:`, error);
            }
          }
        }
      }
    }

    return NextResponse.json({
      status: 'stopped',
      message: `Stopped ${killedProcesses} auto-fix processes`,
      killedProcesses
    });

  } catch (error) {
    console.error('Error stopping auto-fix process:', error);
    return NextResponse.json(
      { error: 'Failed to stop auto-fix process' },
      { status: 500 }
    );
  }
} 