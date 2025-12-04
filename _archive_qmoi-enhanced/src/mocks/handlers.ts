import { rest } from "msw";

export const handlers = [
  rest.get("/api/qmoi/status", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: "OK",
        last_check: "2024-06-01T12:00:00Z",
        mutation_count: 5,
        logs: ["Log 1", "Log 2"],
      }),
    );
  }),
  rest.post("/api/qmoi/payload", (req, res, ctx) => {
    const action = req.url.searchParams.get("qfix")
      ? "QFix"
      : req.url.searchParams.get("qoptimize")
        ? "QOptimize"
        : req.url.searchParams.get("qsecure")
          ? "QSecure"
          : "Unknown";
    return res(ctx.status(200), ctx.json({ message: `${action} done` }));
  }),
];
