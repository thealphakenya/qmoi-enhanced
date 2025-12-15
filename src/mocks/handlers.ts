// Provide handlers through an async getter so MSW (ESM) is imported at runtime
export async function getHandlers() {
  console.error("handlers.getHandlers: called");
  const msw = await import("msw");
  // Prefer `rest` helpers when available, otherwise fall back to `http` helpers
  const { rest, http } = msw as any;
  const helpers = rest ?? http;
  console.error(
    "handlers.getHandlers: using helper=",
    helpers === rest ? "rest" : helpers === http ? "http" : "none"
  );
  if (!helpers)
    throw new Error("MSW helpers (rest or http) not found on msw import");

  const handlers = [
    helpers.get("/api/qmoi/status", (req: any, res: any, ctx: any) => {
      try {
        console.error(
          "HANDLER: status handler invoked, keys=",
          Object.keys(req),
          "method=",
          req.method,
          "path=",
          req.path,
          "url=",
          String(req.url)
        );
        if (req && req.request) {
          try {
            console.error(
              "HANDLER: status inner request keys=",
              Object.keys(req.request),
              "request.url=",
              (req.request as any).url,
              "request.path=",
              (req.request as any).path
            );
          } catch (e) {
            console.error("HANDLER: status inner request logging failed", e);
          }
        }
      } catch (e) {
        console.error("HANDLER: status handler logging failed", e);
      }
      return res(
        ctx.status(200),
        ctx.json({
          status: "OK",
          last_check: "2024-06-01T12:00:00Z",
          mutation_count: 5,
          logs: ["Log 1", "Log 2"],
        })
      );
    }),
    // Also register absolute-url forms to ensure matching regardless of how
    // the request is represented by the underlying interceptor.
    helpers.get(
      "http://localhost/api/qmoi/status",
      (req: any, res: any, ctx: any) => {
        try {
          console.error(
            "HANDLER: absolute status handler invoked, url=",
            (req.request && (req.request as any).url) || String(req.url)
          );
        } catch (e) {
          console.error("HANDLER: absolute status logging failed", e);
        }
        return res(
          ctx.status(200),
          ctx.json({
            status: "OK",
            last_check: "2024-06-01T12:00:00Z",
            mutation_count: 5,
            logs: ["Log 1", "Log 2"],
          })
        );
      }
    ),
    helpers.post("/api/qmoi/payload", (req: any, res: any, ctx: any) => {
      // in rest handlers, req.url is a URL instance
      try {
        console.error(
          "HANDLER: payload handler invoked, keys=",
          Object.keys(req),
          "method=",
          req.method,
          "path=",
          req.path,
          "url=",
          String(req.url)
        );
        if (req && req.request) {
          try {
            console.error(
              "HANDLER: payload inner request keys=",
              Object.keys(req.request),
              "request.url=",
              (req.request as any).url,
              "request.path=",
              (req.request as any).path
            );
          } catch (e) {
            console.error("HANDLER: payload inner request logging failed", e);
          }
        }
      } catch (e) {
        console.error("HANDLER: payload handler logging failed", e);
      }
      // Support both `req.url` (rest) and `req.request.url` (http helper)
      const rawUrl =
        (req && req.url) ||
        (req && req.request && (req.request as any).url) ||
        "";
      const urlObj =
        typeof rawUrl === "string"
          ? new URL(rawUrl, "http://localhost")
          : rawUrl;
      const action = urlObj.searchParams.has("qfix")
        ? "QFix"
        : urlObj.searchParams.has("qoptimize")
        ? "QOptimize"
        : urlObj.searchParams.has("qsecure")
        ? "QSecure"
        : "Unknown";
      return res(ctx.status(200), ctx.json({ message: `${action} done` }));
    }),
    helpers.post(
      "http://localhost/api/qmoi/payload",
      (req: any, res: any, ctx: any) => {
        // Mirror logic for absolute URL form
        try {
          const rawUrl =
            (req && req.url) ||
            (req && req.request && (req.request as any).url) ||
            "";
          const urlObj =
            typeof rawUrl === "string"
              ? new URL(rawUrl, "http://localhost")
              : rawUrl;
          const action = urlObj.searchParams.has("qfix")
            ? "QFix"
            : urlObj.searchParams.has("qoptimize")
            ? "QOptimize"
            : urlObj.searchParams.has("qsecure")
            ? "QSecure"
            : "Unknown";
          return res(ctx.status(200), ctx.json({ message: `${action} done` }));
        } catch (e) {
          console.error("HANDLER: absolute payload handler failed", e);
          return res(ctx.status(200), ctx.json({ message: `Unknown done` }));
        }
      }
    ),
  ];
  console.error("handlers.getHandlers: returning", handlers.length);
  return handlers;
}
