import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  let status = 'Unknown';
  let lastDeploy = '';
  let health = '';
  let logs: string[] = [];
  let history: {timestamp: string, status: string, version: string}[] = [];
  try {
    const logData = fs.readFileSync('logs/vercel_auto_deploy.log', 'utf-8').split('\n').filter(Boolean) as string[];
    logs = logData.slice(-20);
    const last = [...logs].reverse().find((line: string) => line.includes('deployment')) || '';
    if (last) {
      lastDeploy = last;
      if (last.includes('successful')) status = 'Success';
      else if (last.includes('failed')) status = 'Failed';
    }
    const healthLine = logs.find((line: string) => line.includes('Health check'));
    if (healthLine) health = healthLine;
    // Parse history: look for lines with deployment, rollback, and version (commit hash)
    const versionRegex = /commit ([a-f0-9]{7,40})/i;
    let events: {timestamp: string, status: string, version: string}[] = [];
    for (let line of logData.slice(-100)) {
      let timestamp = line.slice(1, 20);
      let status = '';
      if (line.includes('deployment successful')) status = 'Success';
      else if (line.includes('deployment failed')) status = 'Failed';
      else if (line.includes('rollback')) status = 'Rollback';
      else continue;
      let version = '';
      const match = line.match(versionRegex);
      if (match) version = match[1];
      events.push({timestamp, status, version});
    }
    history = events.slice(-20).reverse();
  } catch {}
  return NextResponse.json({ status, lastDeploy, health, logs, history });
} 