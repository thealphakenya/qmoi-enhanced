/* eslint-env node,jest,browser */
/* global Headers, Response, Request, URL, URLSearchParams */
// @ts-nocheck
// Provide handlers through an async getter so MSW (ESM) is imported at runtime
export async function getHandlers() {
  const TEST_VERBOSE = process.env.TEST_VERBOSE === "1" || false;
  const debug = (...args: unknown[]) => {
    if (TEST_VERBOSE) console.debug(...args);
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

  // Normalize and detect actions (qfix/qoptimize/qsecure) across many possible
  // request shapes that different MSW interceptors provide.
  const getActionFromReq = (_req: any, providedRawUrl?: any) => {
    try {
      const raw =
        providedRawUrl ??
        ((_req && (_req as any).url) ||
          (_req && (_req as any)._request && (_req as any)._request.url) ||
          "");

      // Some interceptors expose searchParams directly on the req
      if (
        _req &&
        (_req as any).searchParams &&
        typeof (_req as any).searchParams.has === "function"
      ) {
        if ((_req as any).searchParams.has("qfix")) return "QFix";
        if ((_req as any).searchParams.has("qoptimize")) return "QOptimize";
        if ((_req as any).searchParams.has("qsecure")) return "QSecure";
      }

      // If raw is a URL instance with searchParams
      if (raw && typeof raw === "object" && (raw as any).searchParams) {
        if ((raw as any).searchParams.has("qfix")) return "QFix";
        if ((raw as any).searchParams.has("qoptimize")) return "QOptimize";
        if ((raw as any).searchParams.has("qsecure")) return "QSecure";
      }

      // Collapse to a string we can safely inspect
      const s =
        typeof raw === "string"
          ? raw
          : raw && (raw as any).href
          ? (raw as any).href
          : raw && (raw as any).search
          ? (raw as any).search
          : raw && (raw as any).path
          ? (raw as any).path
          : JSON.stringify(raw || {});

      if (typeof s === "string") {
        if (s.includes("qfix")) return "QFix";
        if (s.includes("qoptimize")) return "QOptimize";
        if (s.includes("qsecure")) return "QSecure";
      }
    } catch (_e) {
      // swallow and fallback to Unknown below
    }
    return "Unknown";
  };

  const handlers = [
    helpers.get(
      "/api/qmoi/status",
      (_req: unknown, _res: unknown, ctx: unknown) => {
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
              console.error(
                "HANDLER: status inner _request logging failed",
                _e
              );
            }
          }
        } catch (_e) {
          console.error("HANDLER: status handler logging failed", _e);
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
        const _response = new Response(JSON.stringify(payload), {
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
        });
        if (typeof _res === "function") {
          return (_res as any)(_response);
        }
        return _response;
      }
    ),
    // Also register absolute-url forms to ensure matching regardless of how
    // the _request is represented by the underlying interceptor.
    helpers.get(
      "http://localhost/api/qmoi/status",
      (_req: unknown, _res: unknown, ctx: unknown) => {
        try {
          debug(
            "HANDLER: absolute status handler invoked, url=",
            ((_req as any)._request && ((_req as any)._request as any).url) ||
              String((_req as any).url)
          );
        } catch (_e) {
          console.error("HANDLER: absolute status logging failed", _e);
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
        const _response = new Response(JSON.stringify(payload), {
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
        });
        if (typeof _res === "function") {
          return (_res as any)(_response);
        }
        return _response;
      }
    ),
    helpers.post(
      "/api/qmoi/payload",
      (_req: unknown, _res: unknown, ctx: unknown) => {
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
              console.error(
                "HANDLER: payload inner _request logging failed",
                _e
              );
            }
          }
        } catch (_e) {
          console.error("HANDLER: payload handler logging failed", _e);
        }
        const rawUrl =
          (_req && (_req as any).url) ||
          (_req &&
            (_req as any)._request &&
            ((_req as any)._request as any).url) ||
          "";
        // Temporary unconditional dump to capture actual request shape for debugging
        try {
          console.log("HANDLER DUMP UNCOND:", {
            keys: Object.keys(_req || {}),
            url: (_req as any).url,
            _request: (_req as any)._request,
          });
        } catch (_e) {}
        debug(
          "HANDLER: payload rawUrl=",
          rawUrl,
          "type=",
          typeof rawUrl,
          "reqKeys=",
          Object.keys(_req || {})
        );

        let action = getActionFromReq(_req, rawUrl);
        // Extra: if unknown and rawUrl is a string, try parsing a URL and re-run detection
        if (action === "Unknown" && typeof rawUrl === "string") {
          try {
            const urlObj = new URL(rawUrl, "http://localhost");
            action = getActionFromReq(_req, urlObj);
          } catch (_e) {}
        }
        if (action === "Unknown") {
          try {
            debug(
              "HANDLER: payload detection failed, rawUrl=",
              rawUrl,
              "_req_keys=",
              Object.keys(_req || {})
            );
            if ((_req as any) && (_req as any)._request)
              debug("HANDLER: _request =", (_req as any)._request);
          } catch (_e) {}
        }
        const out = { message: `${action} done` };
        if (ctx && typeof (ctx as any).status === "function") {
          return (_res as any)(
            (ctx as any).status(200),
            (ctx as any).json(out)
          );
        }
        const _response = new Response(JSON.stringify(out), {
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
        });
        if (typeof _res === "function") {
          return (_res as any)(_response);
        }
        return _response;
      }
    ),
    helpers.post(
      "http://localhost/api/qmoi/payload",
      (_req: unknown, _res: unknown, ctx: unknown) => {
        // Mirror logic for absolute URL form
        try {
          const rawUrl =
            ((_req as any) && (_req as any).url) ||
            ((_req as any) &&
              (_req as any)._request &&
              ((_req as any)._request as any).url) ||
            "";
          let action = getActionFromReq(_req, rawUrl);
          if (action === "Unknown" && typeof rawUrl === "string") {
            try {
              const urlObj = new URL(rawUrl, "http://localhost");
              action = getActionFromReq(_req, urlObj);
            } catch (_e) {}
          }
          const out = { message: `${action} done` };
          if (ctx && typeof (ctx as any).status === "function") {
            return (_res as any)(
              (ctx as any).status(200),
              (ctx as any).json(out)
            );
          }
          const _response = new Response(JSON.stringify(out), {
            status: 200,
            headers: new Headers({ "content-type": "application/json" }),
          });
          if (typeof _res === "function") {
            return (_res as any)(_response);
          }
          return _response;
        } catch (_e) {
          console.error("HANDLER: absolute payload handler failed", _e);
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
