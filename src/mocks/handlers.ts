/* eslint-env node,jest,browser */
/* global Headers, Response, Request, URL, URLSearchParams */
// @ts-nocheck
// Provide handlers through an async getter so MSW (ESM) is imported at runtime
export async function getHandlers() {
  const TEST_VERBOSE = process.env.TEST_VERBOSE === "1" || false;
  const debug = (...args: unknown[]) => {
    if (TEST_VERBOSE) console.debug(...(args as any));
  };
  debug("handlers.getHandlers: called");
  const msw = await import("msw");
  // Prefer `rest` helpers when available, otherwise fall back to `http` helpers
  const { rest, http } = msw as any;
  const helpers = rest ?? http;
  debug(
    "handlers.getHandlers: using helper=",
    helpers === rest ? "rest" : helpers === http ? "http" : "none"
  );
  if (!helpers)
    throw new Error("MSW helpers (rest or http) not found on msw import");

  const handlers = [
    helpers.get("/api/qmoi/status", (_req: any, _res: any, ctx: any) => {
      try {
        debug(
          "HANDLER: status handler invoked, keys=",
          Object.keys(_req),
          "method=",
          (_req as any).method,
          "path=",
          (_req as any).path,
          "url=",
          String((_req as any).url)
        );
        if ((_req as any) && (_req as any)._request) {
          try {
            debug(
              "HANDLER: status inner _request keys=",
              Object.keys((_req as any)._request),
              "_request.url=",
              ((_req as any)._request as any).url,
              "_request.path=",
              ((_req as any)._request as any).path
            );
          } catch (_e) {
            (globalThis.console as any)?.error?.("HANDLER: status inner _request logging failed", _e);
          }
        }
      } catch (_e) {
        (globalThis.console as any)?.error?.("HANDLER: status handler logging failed", _e);
      }
      // Support multiple resolver shapes: rest (ctx), http (return object), or http with _res not a function
      const payload = {
        status: "OK",
        last_check: "2024-06-01T12:00:00Z",
        mutation_count: 5,
        logs: ["Log 1", "Log 2"],
      };
      if (ctx && typeof (ctx as any).status === "function") {
        return (_res as any)(
          (ctx as any).status(200),
          (ctx as any).json(payload)
        );
      }
      const response = new Response(JSON.stringify(payload), {
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
      });
      if (typeof _res === "function") {
        return (_res as any)(response);
      }
      return response;
    }),
    // Also register absolute-url forms to ensure matching regardless of how
    // the _request is represented by the underlying interceptor.
    helpers.get(
      "http://localhost/api/qmoi/status",
      (_req: any, _res: any, ctx: any) => {
        try {
          debug(
            "HANDLER: absolute status handler invoked, url=",
            ((_req as any)._request && ((_req as any)._request as any).url) ||
              String((_req as any).url)
          );
        } catch (_e) {
          (globalThis.console as any)?.error?.("HANDLER: absolute status logging failed", _e);
        }
        const payload = {
          status: "OK",
          last_check: "2024-06-01T12:00:00Z",
          mutation_count: 5,
          logs: ["Log 1", "Log 2"],
        };
        if (ctx && typeof (ctx as any).status === "function") {
          return (_res as any)(
            (ctx as any).status(200),
            (ctx as any).json(payload)
          );
        }
        const response = new Response(JSON.stringify(payload), {
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
        });
        if (typeof _res === "function") {
          return (_res as any)(response);
        }
        return response;
      }
    ),
    helpers.post("/api/qmoi/payload", (_req: any, _res: any, ctx: any) => {
      // in rest handlers, _req.url is a URL instance
      try {
        debug(
          "HANDLER: payload handler invoked, keys=",
          Object.keys(_req),
          "method=",
          (_req as any).method,
          "path=",
          (_req as any).path,
          "url=",
          String((_req as any).url)
        );
        if ((_req as any) && (_req as any)._request) {
          try {
            debug(
              "HANDLER: payload inner _request keys=",
              Object.keys((_req as any)._request),
              "_request.url=",
              ((_req as any)._request as any).url,
              "_request.path=",
              ((_req as any)._request as any).path
            );
          } catch (_e) {
            (globalThis.console as any)?.error?.("HANDLER: payload inner _request logging failed", _e);
          }
        }
      } catch (_e) {
        (globalThis.console as any)?.error?.("HANDLER: payload handler logging failed", _e);
      }
      // Support both `_req.url` (rest) and `_req._request.url` (http helper)
      const rawUrl =
        (_req && _req.url) ||
        (_req && _req._request && (_req._request as any).url) ||
        "";
      const urlObj =
        typeof rawUrl === "string"
          ? new URL(rawUrl, "http://localhost")
          : rawUrl;
      const hasFlag = (flag: string) => {
        try {
          if (typeof rawUrl === "string" && rawUrl.includes(`?${flag}`))
            return true;
          if (urlObj && typeof urlObj.searchParams?.has === "function") {
            if ((urlObj as any).searchParams.has(flag)) return true;
          }
          if (typeof rawUrl === "string" && rawUrl.includes(flag)) return true;
        } catch (_e) {
          // ignore
        }
        return false;
      };
      // Debug log to aid tests when query flags are not detected
      try {
        console.log(
          "PAYLOAD HANDLER: rawUrl=",
          rawUrl,
          "urlObjSearch=",
          urlObj?.search || null,
          "hasQfix=",
          hasFlag("qfix")
        );
      } catch (e) {
        void e;
        /* ignore */ void e; /* ignore logging errors */
      }
      const action = hasFlag("qfix")
        ? "QFix"
        : hasFlag("qoptimize")
        ? "QOptimize"
        : hasFlag("qsecure")
        ? "QSecure"
        : "Unknown";
      const out = { message: `${action} done` };
      if (ctx && typeof (ctx as any).status === "function") {
        return (_res as any)((ctx as any).status(200), (ctx as any).json(out));
      }
      const response = new Response(JSON.stringify(out), {
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
      });
      if (typeof _res === "function") {
        return (_res as any)(response);
      }
      return response;
    }),
    helpers.post(
      "http://localhost/api/qmoi/payload",
      (_req: any, _res: any, ctx: any) => {
        // Mirror logic for absolute URL form
        try {
          const rawUrl =
            ((_req as any) && (_req as any).url) ||
            ((_req as any) &&
              (_req as any)._request &&
              ((_req as any)._request as any).url) ||
            "";
          const urlObj =
            typeof rawUrl === "string"
              ? new URL(rawUrl, "http://localhost")
              : rawUrl;
          const hasFlag = (flag: string) => {
            try {
              if (typeof rawUrl === "string" && rawUrl.includes(`?${flag}`))
                return true;
              if (
                urlObj &&
                typeof (urlObj as any).searchParams?.has === "function"
              ) {
                if ((urlObj as any).searchParams.has(flag)) return true;
              }
              if (typeof rawUrl === "string" && rawUrl.includes(flag))
                return true;
            } catch (_e) {
              // ignore
            }
            return false;
          };
          try {
            console.log(
              "ABS PAYLOAD HANDLER: rawUrl=",
              rawUrl,
              "urlObjSearch=",
              urlObj?.search || null,
              "hasQfix=",
              hasFlag("qfix")
            );
          } catch (e) {
            /* ignore */
          }
          const action = hasFlag("qfix")
            ? "QFix"
            : hasFlag("qoptimize")
            ? "QOptimize"
            : hasFlag("qsecure")
            ? "QSecure"
            : "Unknown";
          const out = { message: `${action} done` };
          if (ctx && typeof (ctx as any).status === "function") {
            return (_res as any)(
              (ctx as any).status(200),
              (ctx as any).json(out)
            );
          }
          const response = new Response(JSON.stringify(out), {
            status: 200,
            headers: new Headers({ "content-type": "application/json" }),
          });
          if (typeof _res === "function") {
            return (_res as any)(response);
          }
          return response;
        } catch (_e) {
          (globalThis.console as any)?.error?.("HANDLER: absolute payload handler failed", _e);
          const out = { message: `Unknown done` };
          if (ctx && typeof (ctx as any).status === "function") {
            return (_res as any)(
              (ctx as any).status(200),
              (ctx as any).json(out)
            );
          }
          if (typeof _res === "function") {
            return (_res as any)({
              status: 200,
              headers: { "content-type": "application/json" },
              body: JSON.stringify(out),
            });
          }
          return {
            status: 200,
            headers: new Headers({ "content-type": "application/json" }),
            body: JSON.stringify(out),
          };
        }
      }
    ),
  ];
  debug("handlers.getHandlers: returning", handlers.length);
  return handlers;
}
