// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import { NextRequest } from "next/server";

// robust SSE endpoint streaming track create/update events from tracks-store
export async function GET(req: NextRequest) {
  // Use require to avoid build-time import errors in some environments
  let store: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    store = require("@/lib/tracks-store").default;
  } catch (e) {
    store = null;
  }

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });

  if (!store) {
    return new Response(
      JSON.stringify({ success: false, error: "tracks store not available" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const stream = new ReadableStream({
    start(controller) {
      const push = (eventName: string, payload: any) => {
        try {
          const data = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
          controller.enqueue(new TextEncoder().encode(data));
        } catch (e) {
          // ignore
        }
      };

      const onCreated = (rec: any) => push("created", rec);
      const onUpdated = (rec: any) => push("updated", rec);

      store.on("created", onCreated);
      store.on("updated", onUpdated);

      // ping to keep connection alive
      const iv = setInterval(() => {
        controller.enqueue(new TextEncoder().encode(`event: ping\ndata: \n\n`));
      }, 25000);

      controller.enqueue(
        new TextEncoder().encode(`event: ready\ndata: connected\n\n`),
      );

      controller.addEventListener("close", () => {
        clearInterval(iv);
        store.off("created", onCreated);
        store.off("updated", onUpdated);
      });
    },
    cancel() {
      // nothing
    },
  });

  return new Response(stream, { headers });
}
