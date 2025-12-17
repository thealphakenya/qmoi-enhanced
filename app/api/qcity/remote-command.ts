import { NextRequest, NextResponse } from "next/server";
import { QCityService } from "@/scripts/services/qcity_service";
import * as fs from "fs";
import * as path from "path";

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || "changeme";
const AUDIT_LOG_PATH = path.resolve(process.cwd(), "logs/qcity_audit.log");

function logAudit(entry: any) {
  const line =
    JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + "\n";
  try {
    fs.appendFileSync(AUDIT_LOG_PATH, line);
  } catch {
    /* best-effort logging */
  }
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Simple admin API key check for production usage
  const apiKey = req.headers.get("x-qcity-admin-key") || "";
  if (apiKey !== ADMIN_KEY) {
    logAudit({
      action: "unauthorized",
      ip: req.headers.get("x-forwarded-for"),
      status: 401,
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    cmd,
    stream,
    deviceId = "default",
  } = await req.json().catch(() => ({}) as any);
  if (!cmd)
    return NextResponse.json({ error: "No command provided" }, { status: 400 });

  const qcityService = new QCityService();
  await qcityService.initialize();

  logAudit({ action: "run", cmd, deviceId, user: "admin", status: "started" });

  if (stream) {
    // Stream small demo logs (best-effort)
    const encoder = new TextEncoder();
    const streamBody = new ReadableStream({
      start(controller) {
        let i = 0;
        function push() {
          if (i < 5) {
            controller.enqueue(
              encoder.encode(`data: [${deviceId}] Log line ${i + 1}\n\n`),
            );
            i++;
            setTimeout(push, 300);
          } else {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            logAudit({
              action: "run",
              cmd,
              deviceId,
              user: "admin",
              status: "done",
            });
          }
        }
        push();
      },
    });

    return new Response(streamBody, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const result = await qcityService
    .runRemoteCommand(cmd, deviceId)
    .catch((e) => ({ error: String(e) }));
  logAudit({ action: "run", cmd, deviceId, user: "admin", status: "done" });
  return NextResponse.json(result);
}

export const runtime = "nodejs";
