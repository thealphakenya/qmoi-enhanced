import { NextRequest } from 'next/server';
import { QCityService } from '@/scripts/services/qcity_service';
import * as fs from 'fs';
import * as path from 'path';
import { requireRole } from '../auth/rbac';

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || 'changeme';
const AUDIT_LOG_PATH = path.resolve(process.cwd(), 'logs/qcity_audit.log');

function logAudit(entry: any) {
  const line = JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + '\n';
  fs.appendFileSync(AUDIT_LOG_PATH, line);
}

// SSE streaming for real-time logs (stubbed for now)
const handler = requireRole(['admin', 'master'])(async (req: NextRequest) => {
  // Basic API key authentication for master/admin users
  const apiKey = req.headers.get('x-qcity-admin-key');
  if (apiKey !== ADMIN_KEY) {
    logAudit({ action: 'unauthorized', ip: req.headers.get('x-forwarded-for'), status: 401 });
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { cmd, stream, deviceId = 'default' } = await req.json();
  if (!cmd) return new Response(JSON.stringify({ error: 'No command provided' }), { status: 400 });
  const qcityService = new QCityService();
  await qcityService.initialize();
  // Route command to the specified device (stub logic)
  logAudit({ action: 'run', cmd, deviceId, user: 'admin', status: 'started' });
  if (stream) {
    // For demonstration, stream fake logs
    const encoder = new TextEncoder();
    const streamBody = new ReadableStream({
      start(controller) {
        let i = 0;
        function push() {
          if (i < 5) {
            controller.enqueue(encoder.encode(`data: [${deviceId}] Log line ${i+1}\n\n`));
            i++;
            setTimeout(push, 500);
          } else {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
            logAudit({ action: 'run', cmd, deviceId, user: 'admin', status: 'done' });
          }
        }
        push();
      }
    });
    return new Response(streamBody, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } else {
    // Pass deviceId for real device routing
    const result = await qcityService.runRemoteCommand(cmd, deviceId);
    logAudit({ action: 'run', cmd, deviceId, user: 'admin', status: 'done' });
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

export default handler; 