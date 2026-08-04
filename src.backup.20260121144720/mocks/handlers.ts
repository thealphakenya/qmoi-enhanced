/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/mocks/handlers.ts -->
/* eslint-env node,jest,browser */
// Minimal MSW handlers for tests — keep simple and syntactically safe
export async function getHandlers() {
  let msw: any = null;
  try {
    msw = await import("msw");
  } catch (e) {
    try {
      msw = require("msw");
    } catch (_e) {
      msw = null;
    }
  }

  const rest = msw ? msw.rest || msw.default?.rest : null;
  if (rest) {
    const handlers = [
      rest.get("/api/qmoi/status", (_req: unknown, res: unknown, ctx: any) =>
        res(
          ctx.status(200),
          ctx.json({ status: "OK", last_check: new Date().toISOString() }),
        ),
      ),
      rest.post("/api/qmoi/payload", (_req: unknown, res: unknown, ctx: any) =>
        res(ctx.status(200), ctx.json({ message: "Processed" })),
      ),
    ];
    return handlers;
  }

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
