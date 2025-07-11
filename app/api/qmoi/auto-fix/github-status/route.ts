import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
    
    const status = {
      status: "unknown" as "success" | "failure" | "running" | "unknown",
      last_run: new Date().toISOString(),
      duration: "0s",
      workflow: "qmoi-auto-fix.yml"
    };

    // Check if workflows directory exists
    try {
      await fs.access(workflowsDir);
      const workflows = await fs.readdir(workflowsDir);
      
      if (workflows.includes('qmoi-auto-fix.yml')) {
        status.workflow = "qmoi-auto-fix.yml";
        status.status = "configured";
      } else if (workflows.length > 0) {
        status.workflow = workflows[0];
        status.status = "configured";
      } else {
        status.status = "no_workflows";
      }
    } catch {
      status.status = "not_configured";
    }

    // Check for recent log files that might indicate recent runs
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      const logFiles = await fs.readdir(logsDir);
      
      const autoFixLogs = logFiles.filter(file => 
        file.includes('qmoi_auto_fix') && 
        file.endsWith('.log')
      );

      if (autoFixLogs.length > 0) {
        // Get the most recent log
        const latestLog = autoFixLogs.sort().pop();
        if (latestLog) {
          const logPath = path.join(logsDir, latestLog);
          const logStats = await fs.stat(logPath);
          status.last_run = logStats.mtime.toISOString();
          
          // Determine status based on log content
          try {
            const logContent = await fs.readFile(logPath, 'utf-8');
            if (logContent.includes('completed successfully')) {
              status.status = "success";
            } else if (logContent.includes('error') || logContent.includes('failed')) {
              status.status = "failure";
            } else if (logContent.includes('running')) {
              status.status = "running";
            }
          } catch {
            // If we can't read the log, assume unknown
          }
        }
      }
    } catch (error) {
      console.log('Error checking logs:', error);
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error getting GitHub status:', error);
    return NextResponse.json(
      { error: 'Failed to get GitHub status' },
      { status: 500 }
    );
  }
} 