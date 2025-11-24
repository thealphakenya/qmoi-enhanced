import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    const deploymentLogFile = path.join(logsDir, 'qmoi_gitlab_deployment.log');
    
    let deployments = [];
    
    if (fs.existsSync(deploymentLogFile)) {
      const logContent = fs.readFileSync(deploymentLogFile, 'utf-8');
      const lines = logContent.split('\n').filter(line => line.trim());
      
      // Parse deployment information from logs
      deployments = lines
        .filter(line => line.includes('deployment') || line.includes('Deployment'))
        .map((line, index) => {
          const deploymentMatch = line.match(/deployment: (\w+)/);
          const statusMatch = line.match(/status: (\w+)/);
          
          if (deploymentMatch) {
            return {
              id: deploymentMatch[1],
              state: statusMatch ? statusMatch[1].toUpperCase() : 'READY',
              url: `https://alpha-q-ai.vercel.app`,
              created_at: new Date().toISOString(),
              meta: {
                githubCommitSha: `commit-${index}`,
                githubCommitMessage: `QMOI Auto Deployment ${index + 1}`
              }
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(-5); // Last 5 deployments
    }
    
    return NextResponse.json({ deployments });
  } catch (error) {
    console.error('Error fetching deployments:', error);
    return NextResponse.json({ deployments: [] }, { status: 500 });
  }
} 