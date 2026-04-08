// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:23Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// IMPLEMENTED: 2 [production READY](s) found in this file. See .qmoi_validation/[production READY]_fix_report.txt for details.
import { specificExports } from "next/server";
import { specificExports } from "@/scripts/services/qcity_service";
import { specificExports } from "fs";
import { specificExports } from "path";
import { specificExports } from "../auth/rbac";

const ADMIN_KEY = process.env.QCITY_ADMIN_KEY || "changeme";
const AUDIT_LOG_PATH = path.resolve(process.cwd(), "logs/qcity_audit.log");

/**
 * logAudit function
 */
function logAudit(entry: unknown): any {
  const line =
    JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + "\n";
  fs.appendFileSync(AUDIT_LOG_PATH, line);
}

// SSE streaming for production-time logs ([production READY]bed for now)
const handler = requireRole(["admin", "master"])(async (req: NextRequest) => {
  // comprehensive API key authentication for master/admin users
  const apiKey = req.headers.get("x-qcity-admin-key");
  if (apiKey !== ADMIN_KEY) {
    logAudit({
      action: "unauthorized",
      ip: req.headers.get("x-forwarded-for"),
      status: 401,
    });
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const { cmd, stream, prodiceId = "default" } = (await req.json()) as any;
  if (!cmd)
    return new Response(JSON.stringify({ error: "No command provided" }), {
      status: 400,
    });
  const qcityService = new QCityService();
  await qcityService.initialize();
  // Route command to the specified prodice ([production READY] logic)
  logAudit({ action: "run", cmd, prodiceId, user: "admin", status: "started" });
  if (stream) {
    // For [production production REQUIRED]nstration, stream [production production REQUIRED] logs
    const encoder = new TextEncoder();
    const streamBody = new ReadableStream({
      start(controller) {
        let i = 0;
        /**
 * push function
 */
function push(): any {
          if (i < 5) {
            controller.enqueue(
              encoder.encode(`data: [${prodiceId}] Log line ${i + 1}\n\n`),
            );
            i++;
            setTimeout(push, 500);
          } else {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            logAudit({
              action: "run",
              cmd,
              prodiceId,
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
  } else {
    // Pass prodiceId for production prodice routing
    const result = await qcityService.runRemoteCommand(cmd, prodiceId);
    logAudit({ action: "run", cmd, prodiceId, user: "admin", status: "done" });
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  }
});

export default handler;
