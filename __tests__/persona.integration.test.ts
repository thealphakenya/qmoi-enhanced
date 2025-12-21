// @jest-environment node
const { spawn } = require("child_process");

jest.setTimeout(30000);

describe("QM OI helper server integration", () => {
  let child = null;

  async function waitForReady(childProcess, port, timeout = 20000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      let resolved = false;
      function ok() {
        if (resolved) return;
        resolved = true;
        resolve(true);
      }
      function fail(err) {
        if (resolved) return;
        resolved = true;
        reject(err);
      }

      childProcess.stdout.on("data", (chunk) => {
        const s = String(chunk || "").toLowerCase();
        if (s.includes("listening") || s.includes("listening on")) {
          ok();
        }
      });

      childProcess.on("exit", (code) => {
        fail(new Error("Server exited unexpectedly with code " + code));
      });

      // Poll the health endpoint until it's available
      const attempt = async () => {
        try {
          const res = await fetch(`http://127.0.0.1:${port}/health`);
          if (res && res.status === 200) {
            ok();
            return;
          }
        } catch (e) {
          // ignore, server may not be up yet
        }
        if (Date.now() - start > timeout) {
          fail(new Error("Timeout waiting for server ready"));
          return;
        }
        setTimeout(attempt, 250);
      };
      attempt();
    });
  }

  beforeAll(async () => {
    // Choose a free ephemeral port to avoid collisions in parallel runs
    const net = require('net');
    let port;
    if (process.env.QMOI_LOCAL_PORT) {
      port = Number(process.env.QMOI_LOCAL_PORT);
    } else {
      port = await new Promise((resolve, reject) => {
        const s = net.createServer();
        s.listen(0, '127.0.0.1', () => {
          const p = s.address().port;
          s.close(() => resolve(p));
        });
        s.on('error', reject);
      });
    }
    child = spawn("python3", ["-u", "scripts/qmoi_local_server.py"], {
      stdio: ["ignore", "pipe", "pipe"],
      env: Object.assign({}, process.env, { QMOI_LOCAL_PORT: String(port) }),
    });
    // Attach debug listeners to help diagnose failures in CI
    child.stdout.on("data", (c) =>
      console.log("[child stdout]", String(c || ""))
    );
    child.stderr.on("data", (c) =>
      console.error("[child stderr]", String(c || ""))
    );
    console.log("[child pid]", child.pid, "port", port);
    await waitForReady(child, port, 25000);
    // Small buffer after ready to ensure server fully accepts connections (increase to avoid flakiness under load / instrumented runs)
    await new Promise((r) => setTimeout(r, 1000));
    // Store the port for use in tests
    child._qmoi_test_port = port;
  });

  afterAll(() => {
    if (child && !child.killed) child.kill();
  });

  test("master persona chat and memory flow", async () => {
    const url = `http://127.0.0.1:${child._qmoi_test_port}/v1/chat/completions`;
    const body = {
      messages: [
        { role: "system", content: "master" },
        { role: "user", content: "How are you doing today?" },
      ],
    };

    // Helper to retry transient network failures (reduces flakiness under instrumentation)
    async function postWithRetry(url, opts, retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          const r = await fetch(url, opts);
          return r;
        } catch (e) {
          if (i === retries - 1) throw e;
          // exponential backoff
          await new Promise((r) => setTimeout(r, 200 * (i + 1)));
        }
      }
    }

    const resp = await postWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    expect(resp.status).toBe(200);
    const j = await resp.json();
    expect(j).toHaveProperty("choices");
    const msg =
      j.choices?.[0]?.message?.content ?? (j.choices?.[0]?.message || "");
    expect(typeof msg).toBe("string");
    expect(msg.startsWith("[Master Mode]")).toBe(true);

    const memResp = await fetch(`http://127.0.0.1:${child._qmoi_test_port}/memory`);
    expect(memResp.status).toBe(200);
    const mem = await memResp.json();
    expect(Array.isArray(mem.conversations)).toBe(true);
    const last = mem.conversations[mem.conversations.length - 1];
    expect(last).toBeDefined();
    expect(last.persona).toBe("master");
    expect(last.message).toContain("How are you doing today");
  });
});
