#!/usr/bin/env node
// CommonJS variant of the minimal helper server for environments with "type": "module".
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.QMOI_LOCAL_PORT || process.env.PORT || 8081);
const HOST = process.env.QMOI_HELPER_HOST || "127.0.0.1";
const MEMORY_FILE =
  process.env.QMOI_MEMORY_FILE || path.join(__dirname, "qmoi_memory.json");
const QMOI_SYNC_API_KEY = process.env.QMOI_SYNC_API_KEY;

// Persistent server-side debug log (helps tests inspect server-side events)
const LOG_FILE = String(MEMORY_FILE) + ".server.log";
function appendLog(msg) {
  try {
    const ts = new Date().toISOString();
    const line = typeof msg === "string" ? msg : JSON.stringify(msg);
    fs.appendFileSync(LOG_FILE, `[${ts}] ${String(line)}\n`, {
      encoding: "utf-8",
    });
  } catch (e) {
    // ignore logging failures
  }
}

function readJsonSafe(p) {
  try {
    if (!fs.existsSync(p)) return {};
    const s = fs.readFileSync(p, "utf-8");
    return JSON.parse(s || "{}") || {};
  } catch (e) {
    return {};
  }
}

function atomicWriteJson(p, obj) {
  try {
    const dir = path.dirname(p);
    fs.mkdirSync(dir, { recursive: true });
    const tmp = p + ".tmp." + Date.now();
    fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), { encoding: "utf-8" });
    fs.renameSync(tmp, p);
    return true;
  } catch (e) {
    return false;
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const b = Buffer.concat(chunks).toString("utf-8");
      if (!b) return resolve(null);
      try {
        resolve(JSON.parse(b));
      } catch (e) {
        resolve(null);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, obj, status = 200) {
  const s = JSON.stringify(obj);
  try {
    appendLog(`[sendJson] status=${status} body=${s}`);
  } catch (e) {}
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(s);
}

const server = http.createServer(async (req, res) => {
  const u = url.parse(req.url || "", true);
  const pathname = u.pathname || "/";

  // Log every incoming request early to aid debugging in test harnesses
  try {
    const note = {
      event: "request-start",
      method: req.method,
      url: req.url,
      headers: req.headers,
    };
    console.log(
      `[qmoi_local_server] request start: ${req.method} ${
        req.url
      } headers=${JSON.stringify(req.headers)}`
    );
    appendLog(note);
  } catch (e) {}

  if (req.method === "GET" && (pathname === "/" || pathname === "/health")) {
    return sendJson(res, { status: "ok", model: "qmoi" });
  }

  if (
    pathname === "/v1/chat/completions" &&
    (req.method === "POST" || req.method === "OPTIONS")
  ) {
    try {
      if (req.method === "OPTIONS") return sendJson(res, {}, 204);
      console.log("[qmoi_local_server] incoming", req.method, pathname, {
        headers: req.headers,
      });
      const payload = (await parseBody(req)) || {};
      console.log("[qmoi_local_server] payload", payload);
      const messages = payload.messages || [];
      let last_user = "";
      let system_mode = "";
      for (let i = messages.length - 1; i >= 0; --i) {
        const m = messages[i];
        if (!last_user && m.role === "user") last_user = m.content || "";
        if (!system_mode && m.role === "system" && m.content)
          system_mode = m.content;
      }

      // Append to memory
      try {
        const mem = readJsonSafe(MEMORY_FILE);
        const convs = Array.isArray(mem.conversations) ? mem.conversations : [];
        if (last_user) {
          const persona = system_mode || "user";
          convs.push({
            role: "user",
            content: last_user,
            ts: new Date().toISOString(),
            persona,
          });
          mem.conversations = convs;
          atomicWriteJson(MEMORY_FILE, mem);
        }
      } catch (e) {
        const errStr = e && e.stack ? e.stack : String(e);
        console.error("[qmoi_local_server] memory append error", errStr);
        try {
          appendLog({ event: "memory-append-error", error: errStr });
        } catch (e2) {}
      }

      const lu = (last_user || "").toLowerCase();
      let reply_text = "";
      if (last_user && lu.includes("what did i tell")) {
        let msgs = [];
        try {
          const mm = readJsonSafe(MEMORY_FILE) || {};
          msgs = (mm.conversations || [])
            .filter((c) => c.role === "user")
            .map((c) => c.content);
        } catch (e) {
          msgs = [];
        }
        const recall = msgs.length
          ? msgs.slice(-5).join(" ")
          : "I do not recall.";
        reply_text = `[User Mode] I recall: ${recall}`;
      } else if (last_user && (lu.startsWith("hello") || lu.trim() === "hi")) {
        reply_text = "Hello! How can I assist you?";
      } else if (last_user && lu.includes("create a file")) {
        // Parse pattern: Create a file named <path> with the content '<content>'
        let created = false;
        try {
          const m =
            /create a file named\s+([^\s]+)\s+with the content\s+'([^']*)'/i.exec(
              last_user
            );
          if (m) {
            const fname = m[1];
            const content = m[2];
            const p = path.isAbsolute(fname)
              ? fname
              : path.join(process.cwd(), fname);
            const dir = path.dirname(p);
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(p, content, "utf-8");
            created = true;
          }
        } catch (e) {
          created = false;
        }
        if (created)
          reply_text = `[User Mode] Echo: ${last_user} [Action] File created`;
        else reply_text = `[User Mode] Echo: ${last_user} [Action] (simulated)`;
      } else {
        reply_text = last_user
          ? `[User Mode] Echo: ${last_user}`
          : "[User Mode] Hello from qmoi_local_server";
      }

      const masterPrefix =
        system_mode && String(system_mode).toLowerCase().includes("master")
          ? "[Master Mode] "
          : "";
      const response = {
        id: "local-1",
        object: "chat.completion",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: masterPrefix + reply_text },
          },
        ],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      };
      try {
        appendLog({
          event: "response",
          status: 200,
          path: pathname,
          bodySize: JSON.stringify(response).length,
        });
      } catch (e) {}
      return sendJson(res, response);
    } catch (e) {
      try {
        appendLog({
          event: "handler-error",
          path: pathname,
          error: e && e.stack ? e.stack : String(e),
        });
      } catch (ee) {}
      console.error(
        "[qmoi_local_server] handler error",
        e && e.stack ? e.stack : String(e)
      );
      try {
        return sendJson(
          res,
          { error: "server error", details: String(e) },
          500
        );
      } catch (_e2) {
        try {
          appendLog({ event: "handler-error-cant-write", path: pathname });
        } catch (ee) {}
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "server error" }));
      }
    }

    if (
      pathname === "/sync/push" &&
      (req.method === "POST" || req.method === "OPTIONS")
    ) {
      if (req.method === "OPTIONS") return sendJson(res, {}, 204);
      if (QMOI_SYNC_API_KEY) {
        const auth = req.headers["authorization"] || "";
        if (
          !auth.startsWith("Bearer ") ||
          auth.split(" ")[1] !== QMOI_SYNC_API_KEY
        ) {
          return sendJson(res, { error: "unauthorized" }, 401);
        }
      }
      const payload = (await parseBody(req)) || {};
      if (typeof payload !== "object")
        return sendJson(res, { error: "invalid payload" }, 400);
      try {
        atomicWriteJson(MEMORY_FILE, payload);
        return sendJson(res, { ok: true });
      } catch (e) {
        return sendJson(
          res,
          { error: "failed to save", details: String(e) },
          500
        );
      }
    }

    if (pathname === "/sync/pull" && req.method === "GET") {
      if (QMOI_SYNC_API_KEY) {
        const auth = req.headers["authorization"] || "";
        if (
          !auth.startsWith("Bearer ") ||
          auth.split(" ")[1] !== QMOI_SYNC_API_KEY
        ) {
          return sendJson(res, { error: "unauthorized" }, 401);
        }
      }
      const data = readJsonSafe(MEMORY_FILE);
      return sendJson(res, data);
    }

    if (pathname === "/memory" && req.method === "GET") {
      const data = readJsonSafe(MEMORY_FILE);
      return sendJson(
        res,
        data && data.conversations ? data : { conversations: [] }
      );
    }

    // Fallback
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  }
});

// Global error handlers to ensure exceptions are logged for test harnesses
process.on("uncaughtException", (err) => {
  try {
    console.error(
      "[qmoi_local_server] uncaughtException",
      err && err.stack ? err.stack : String(err)
    );
  } catch (e) {
    // ignore
  }
});
process.on("unhandledRejection", (reason) => {
  try {
    console.error(
      "[qmoi_local_server] unhandledRejection",
      reason && reason.stack ? reason.stack : String(reason)
    );
  } catch (e) {
    // ignore
  }
});

// TCP-level connection logging so tests can observe if a TCP socket reaches this process
server.on("connection", (socket) => {
  try {
    appendLog({
      event: "tcp-connection",
      remoteAddress: socket.remoteAddress,
      remotePort: socket.remotePort,
    });
  } catch (e) {}
  try {
    socket.on("close", (hadErr) => {
      try {
        appendLog({
          event: "tcp-close",
          remoteAddress: socket.remoteAddress,
          remotePort: socket.remotePort,
          hadErr,
        });
      } catch (e) {}
    });
    try {
      socket.on("data", (chunk) => {
        try {
          appendLog({
            event: "socket-data",
            len: chunk.length,
            prefixHex: chunk.slice(0, 64).toString("hex"),
          });
        } catch (e) {}
      });
    } catch (e) {}
  } catch (e) {}
});

// Additional server-level events to capture request parsing errors and request events
server.on("request", (req, res) => {
  try {
    appendLog({
      event: "request-event",
      method: req.method,
      url: req.url,
      headers: req.headers,
    });
  } catch (e) {}
});
server.on("clientError", (err, socket) => {
  try {
    appendLog({
      event: "client-error",
      error: err && err.stack ? err.stack : String(err),
    });
  } catch (e) {}
  try {
    socket.end("HTTP/1.1 400 Bad Request\\r\\n\\r\\n");
  } catch (e) {}
});
server.on("close", () => {
  try {
    appendLog({ event: "server-close" });
  } catch (e) {}
});

server.listen(PORT, HOST, () => {
  console.log(
    `qmoi_local_server.cjs listening on http://${HOST}:${PORT} (memory=${MEMORY_FILE})`
  );
  try {
    appendLog({
      event: "listening",
      host: HOST,
      port: PORT,
      memory: MEMORY_FILE,
    });
  } catch (e) {}
});

// Graceful shutdown
process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
