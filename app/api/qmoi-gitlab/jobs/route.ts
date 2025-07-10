import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    const jobLogFile = path.join(logsDir, 'qmoi_gitlab_ci_cd.log');
    
    let jobs = [];
    
    if (fs.existsSync(jobLogFile)) {
      const logContent = fs.readFileSync(jobLogFile, 'utf-8');
      const lines = logContent.split('\n').filter(line => line.trim());
      
      // Parse job information from logs
      jobs = lines
        .filter(line => line.includes('job:') || line.includes('Job'))
        .map((line, index) => {
          const jobMatch = line.match(/job: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);
          
          if (jobMatch) {
            return {
              id: index + 1,
              name: jobMatch[1],
              status: statusMatch ? statusMatch[1] : 'pending',
              stage: 'build',
              duration: Math.floor(Math.random() * 300) + 60 // Random duration 1-6 minutes
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-10); // Last 10 jobs
    }
    
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ jobs: [] }, { status: 500 });
  }
} 