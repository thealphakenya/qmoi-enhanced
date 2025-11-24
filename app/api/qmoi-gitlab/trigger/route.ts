import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    const triggerLogFile = path.join(logsDir, 'qmoi_gitlab_ci_cd.log');
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    // Log the trigger event
    const timestamp = new Date().toISOString();
    const triggerLog = `[${timestamp}] INFO: Pipeline triggered successfully via QMOI GitLab Clone UI\n`;
    
    fs.appendFileSync(triggerLogFile, triggerLog);
    
    // Simulate pipeline creation
    const pipelineId = Math.floor(Math.random() * 10000) + 1000;
    const pipelineLog = `[${timestamp}] INFO: Pipeline ${pipelineId} status: running\n`;
    fs.appendFileSync(triggerLogFile, pipelineLog);
    
    return NextResponse.json({ 
      success: true, 
      pipelineId,
      message: 'Pipeline triggered successfully'
    });
  } catch (error) {
    console.error('Error triggering pipeline:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to trigger pipeline'
    }, { status: 500 });
  }
} 