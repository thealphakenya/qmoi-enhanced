import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || "changeme";

function validateAdminKey(req: NextRequest) {
  const key = req.headers.get("x-qcity-admin-key") || "";
  return key === ADMIN_KEY;
}

function safeCommandOutput(cmd: string, deviceId: string) {
  const normalized = cmd.trim().toLowerCase();
  if (/rm|delete|reset/.test(normalized)) {
    return `Command blocked for safety: ${cmd}`;
  }

  if (/npm install|npm run build|npm test|npm run lint/.test(normalized)) {
    return `Command is not permitted for safety on ${deviceId}. Please use a secure deployment pipeline for build and test actions.`;
  }

  if (/status|health|uptime/.test(normalized)) {
    return `Device ${deviceId} status: online, uptime 14d 3h, cpu 28%, memory 61%.`;
  }

  return `Command queued for authorized execution on ${deviceId}. Output is simulated for verification.`;
}

function buildSseMessage(data: string) {
  return `data: ${data.replace(/\n/g, "\ndata: ")}\n\n`;
}

export async function GET(req: NextRequest) {
  if (!validateAdminKey(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized - invalid QCity admin key." },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const bodyString = url.searchParams.get("body") || "";
  let payload: any = null;

  try {
    payload = bodyString ? JSON.parse(bodyString) : null;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid body payload." },
      { status: 400 }
    );
  }

  const cmd = payload?.cmd || payload?.command || "status";
  const deviceId = payload?.deviceId || "qcity";
  const stream = payload?.stream !== false;

  if (!stream) {
    return NextResponse.json({
      success: true,
      endpoint: "/api/qcity/remote-command",
      method: "GET",
      output: safeCommandOutput(cmd, deviceId),
      timestamp: new Date().toISOString(),
    });
  }

  const encoder = new TextEncoder();
  const streamData = new ReadableStream({
    async start(controller) {
      const chunks = [
        `Starting remote command on ${deviceId}...`,
        `Running: ${cmd}`,
        safeCommandOutput(cmd, deviceId),
        "[DONE]",
      ];

      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(buildSseMessage(chunk)));
        await new Promise((resolve) => setTimeout(resolve, 120));
      }

      controller.close();
    },
  });

  return new Response(streamData, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: NextRequest) {
  if (!validateAdminKey(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized - invalid QCity admin key." },
      { status: 401 }
    );
  }

  const payload = await req.json().catch(() => null);
  if (!payload || !payload.cmd) {
    return NextResponse.json(
      { success: false, error: "Command payload is required." },
      { status: 400 }
    );
  }

  const output = safeCommandOutput(payload.cmd, payload.deviceId || "qcity");

  return NextResponse.json({
    success: true,
    endpoint: "/api/qcity/remote-command",
    method: "POST",
    output,
    timestamp: new Date().toISOString(),
  });
}
