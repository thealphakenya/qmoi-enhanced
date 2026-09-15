/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  // Prefer synchronous require for msw (avoids ESM dynamic import pitfalls
  // in some Jest setups). Fall back to dynamic import if require fails.
  let msw: any = null;
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    msw = require("msw");
  } catch (e) {
    try {
      msw = await import("msw");
    } catch (e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;

  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: any, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: any, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

  // Fallback: provide very small compatible handler-like objects that the
  // tests can use if MSW cannot be loaded. These won't be full MSW handlers
  // but are useful for lightweight unit tests that only need predictable
  // behaviour.
  return [
    {
      method: "GET",
      url: "/api/qmoi/status",
      handler: async () => ({ status: 200, body: { status: "OK" } }),
    },
    {
      method: "POST",
      url: "/api/qmoi/payload",
      handler: async () => ({ status: 200, body: { message: "Processed" } }),
    },
  ];
}
