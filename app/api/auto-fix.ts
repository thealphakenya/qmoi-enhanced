import { NextRequest, NextResponse } from 'next/server';
import { autoFixService } from '../../../scripts/services/auto_fix_service';
import { useQCity } from '../../../hooks/useQCity';

// Helper to get current QCity status
async function getStatus() {
  // In a real app, replace with actual status fetch logic
  // For now, simulate with a default status
  return {
    running: true,
    platforms: {},
    features: {},
    resources: { cpu: 0, memory: 0, disk: 0, network: 0 },
    tasks: [],
    errors: [],
    backups: [],
    performance: { startupTime: 0, memoryUsage: 0, cpuUsage: 0, networkUsage: 0, lastOptimization: 0 }
  };
}

let isContinuousRunning = false;

export async function POST(req: NextRequest) {
  const { mode } = await req.json();
  if (mode === 'start') {
    if (!isContinuousRunning) {
      isContinuousRunning = true;
      autoFixService.startContinuousAutoFix(getStatus);
      return NextResponse.json({ message: 'Continuous auto-fix started.' });
    } else {
      return NextResponse.json({ message: 'Continuous auto-fix already running.' });
    }
  } else if (mode === 'stop') {
    if (isContinuousRunning) {
      autoFixService.stopContinuousAutoFix();
      isContinuousRunning = false;
      return NextResponse.json({ message: 'Continuous auto-fix stopped.' });
    } else {
      return NextResponse.json({ message: 'Continuous auto-fix was not running.' });
    }
  } else if (mode === 'status') {
    return NextResponse.json({ running: isContinuousRunning });
  } else {
    // One-off fix (default)
    const status = await getStatus();
    const result = await autoFixService.startAutoFix(status);
    return NextResponse.json(result);
  }
} 