/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  const msw = await import("msw");
  const { rest } = msw as unknown;
  if (!rest) throw new Error("msw.rest not available");
  const handlers = [
    rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: unknown) =>
      res(
        ctx.status(200),
        ctx.json({ status: "OK", last_check: new Date().toISOString() }),
      ),
    ),
    rest.post(
      "/api/qmoi/payload",
      (_req: unknown, res: unknown, ctx: unknown) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
    ),
  ];
  return handlers;
}
