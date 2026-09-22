import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

interface LogRequest {
  log_type?: string;
  device_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
}

interface ExportRequest {
  type: string;
  device_id?: string;
  date_from?: string;
  date_to?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LogRequest = await request.json();
    const { log_type = 'all', device_id, date_from, date_to, limit = 100 } = body;

    // Check if user is master (you can implement your own authentication logic)
    const isMaster = await checkMasterAccess(request);
    if (!isMaster) {
      return NextResponse.json(
        { error: 'Master access required' },
        { status: 403 }
      );
    }

    // Get project root directory
    const projectRoot = process.cwd();
    const loggerScript = path.join(projectRoot, 'scripts', 'qmoi_own_device_logger.py');

    // Check if logger script exists
    if (!fs.existsSync(loggerScript)) {
      return NextResponse.json(
        { error: 'QMOI Own Device Logger not found' },
        { status: 404 }
      );
    }

    // Build command arguments
    const args = [
      '--log-type', log_type,
      '--limit', limit.toString()
    ];

    if (device_id) {
      args.push('--device-id', device_id);
    }

    if (date_from) {
      args.push('--date-from', date_from);
    }

    if (date_to) {
      args.push('--date-to', date_to);
    }

    // Execute the logger script
    const { stdout, stderr } = await execAsync(
      `python "${loggerScript}" ${args.join(' ')}`,
      { cwd: projectRoot }
    );

    if (stderr) {
      console.error('Logger script stderr:', stderr);
    }

    // Parse the output
    let logs;
    try {
      logs = JSON.parse(stdout);
    } catch (parseError) {
      console.error('Failed to parse logger output:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse log data' },
        { status: 500 }
      );
    }

    return NextResponse.json(logs);

  } catch (error) {
    console.error('QMOI Own Device Logs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is master
    const isMaster = await checkMasterAccess(request);
    if (!isMaster) {
      return NextResponse.json(
        { error: 'Master access required' },
        { status: 403 }
      );
    }

    // Get basic statistics
    const projectRoot = process.cwd();
    const loggerScript = path.join(projectRoot, 'scripts', 'qmoi_own_device_logger.py');

    if (!fs.existsSync(loggerScript)) {
      return NextResponse.json(
        { error: 'QMOI Own Device Logger not found' },
        { status: 404 }
      );
    }

    const { stdout } = await execAsync(
      `python "${loggerScript}" --statistics`,
      { cwd: projectRoot }
    );

    let stats;
    try {
      stats = JSON.parse(stdout);
    } catch (parseError) {
      console.error('Failed to parse statistics:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse statistics' },
        { status: 500 }
      );
    }

    return NextResponse.json(stats);

  } catch (error) {
    console.error('QMOI Own Device Statistics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function checkMasterAccess(request: NextRequest): Promise<boolean> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return false;
    }

    // Check for master token or session
    const token = authHeader.replace('Bearer ', '');
    
    // You can implement your own master authentication logic here
    // For now, we'll check if the token contains 'master' or 'admin'
    if (token.includes('master') || token.includes('admin')) {
      return true;
    }

    // Check for master session in cookies
    const cookies = request.headers.get('cookie');
    if (cookies && (cookies.includes('master=true') || cookies.includes('admin=true'))) {
      return true;
    }

    return false;

  } catch (error) {
    console.error('Master access check error:', error);
    return false;
  }
} 