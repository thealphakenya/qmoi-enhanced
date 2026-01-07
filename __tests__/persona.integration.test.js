// @jest-environment node
const { spawn } = require("child_process");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

jest.setTimeout(30000);

const net = require("net");

function waitForServer(url, timeout = 20000, interval = 250) {
  const u = new URL(url);
  const host = u.hostname;
  const port = Number(u.port || 80);
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const socket = new net.Socket();
      let settled = false;
      socket.setTimeout(1000);
      socket.on("connect", () => {
        settled = true;
        socket.destroy();
        resolve();
      });
      socket.on("timeout", () => {
        if (!settled) {
          socket.destroy();
          if (Date.now() - start > timeout)
            return reject(new Error("timeout waiting for server"));
          setTimeout(check, interval);
        }
      });
      socket.on("error", () => {
        if (!settled) {
          socket.destroy();
          if (Date.now() - start > timeout)
            return reject(new Error("timeout waiting for server"));
          setTimeout(check, interval);
        }
      });
      socket.connect(port, host);
    };
    check();
  });
}

const child_process = require("child_process");
let SKIP_PERSONA = false;
try {
  child_process.execSync('python3 -c "import flask"', { stdio: "ignore" });
} catch (e) {
  SKIP_PERSONA = true;
}

const describeIf = SKIP_PERSONA ? describe.skip : describe;

describeIf("QM OI helper server (integration)", () => {
  const serverScript = path.join(
    process.cwd(),
    "scripts",
    "qmoi_local_server.py"
  );
  let port;
  let baseUrl;
  let memoryPath;
  let memoryFileInScripts;
  let serverProc = null;
  let backupPath = null;

  beforeAll(async () => {
    // Choose a port (env overrides) or pick a free ephemeral port to avoid collisions
    if (process.env.QMOI_LOCAL_PORT) {
      port = Number(process.env.QMOI_LOCAL_PORT);
    } else {
      port = await new Promise((resolve, reject) => {
        const s = net.createServer();
        s.listen(0, "127.0.0.1", () => {
          const p = s.address().port;
          s.close(() => resolve(p));
        });
        s.on("error", reject);
      });
    }
    baseUrl = `http://127.0.0.1:${port}`;
    memoryPath = path.join(process.cwd(), `qmoi_memory_${port}.json`);
    memoryFileInScripts = memoryPath;

    // Backup existing memory file if present
    if (fs.existsSync(memoryFileInScripts)) {
      backupPath = memoryFileInScripts + ".bak";
      fs.copyFileSync(memoryFileInScripts, backupPath);
    }

    // Ensure scripts dir exists
    fs.mkdirSync(path.dirname(memoryFileInScripts), { recursive: true });

    // Start python server unbuffered (-u) so logs appear promptly
    serverProc = spawn("python3", ["-u", serverScript], {
      stdio: ["ignore", "pipe", "pipe"],
      env: Object.assign({}, process.env, {
        QMOI_LOCAL_PORT: String(port),
        QMOI_SYNC_INTERVAL_SECONDS: "0",
        QMOI_MEMORY_FILE: memoryFileInScripts,
      }),
    });

    // Optional: capture output for debugging
    serverProc.stdout.on("data", (d) => {
      console.log("[qmoi-server]", d.toString());
    });
    serverProc.stderr.on("data", (d) => {
      console.error("[qmoi-server-err]", d.toString());
    });
    serverProc.on("error", (e) => console.error("[qmoi-server-error]", e));
    serverProc.on("exit", (code, sig) =>
      console.log("[qmoi-server-exit]", code, sig)
    );

    // Wait for /health endpoint
    await waitForServer(baseUrl + "/health", 10000, 200);
  });

  afterAll(() => {
    try {
      if (serverProc) serverProc.kill();
    } catch (e) {}
    // Restore backup
    if (backupPath && fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, memoryFileInScripts);
      fs.unlinkSync(backupPath);
    }
    // Clean up test memory file if it was created
    try {
      if (fs.existsSync(memoryFileInScripts))
        fs.unlinkSync(memoryFileInScripts);
    } catch (e) {}
  });

  test("responds in master persona and appends memory", async () => {
    const payload = {
      messages: [
        { role: "system", content: "master" },
        { role: "user", content: "How are you doing today?" },
      ],
    };

    const http = require("http");
    const postJson = (url, payload, timeout = 5000) => {
      return new Promise((resolve, reject) => {
        const u = new URL(url);
        const data = JSON.stringify(payload);
        const options = {
          hostname: u.hostname,
          port: Number(u.port || 80),
          path: u.pathname,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data),
          },
        };
        const req = http.request(options, (res) => {
          let body = "";
          res.on("data", (c) => (body += c.toString()));
          res.on("end", () => {
            try {
              const json = JSON.parse(body);
              resolve({ status: res.statusCode, data: json });
            } catch (e) {
              resolve({ status: res.statusCode, data: body });
            }
          });
        });
        req.on("error", (err) => reject(err));
        req.setTimeout(timeout, () => {
          req.abort();
          reject(new Error("timeout"));
        });
        req.write(data);
        req.end();
      });
    };

    const r = await postJson(baseUrl + "/v1/chat/completions", payload, 5000);
    expect(r.status).toBe(200);
    expect(r.data).toBeDefined();
    expect(r.data.choices).toBeDefined();
    const text = r.data.choices[0].message.content;
    expect(typeof text).toBe("string");
    expect(text.includes("[Master Mode]")).toBeTruthy();

    // Ensure memory file exists and last entry matches
    // Wait briefly for the server to write the file (race window)
    const waitForFile = (f, timeout = 2000) =>
      new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
          if (fs.existsSync(f)) return resolve();
          if (Date.now() - start > timeout)
            return reject(new Error("timeout waiting for memory file"));
          setTimeout(check, 50);
        };
        check();
      });
    await waitForFile(memoryFileInScripts, 2000);
    const mem = JSON.parse(fs.readFileSync(memoryFileInScripts, "utf-8"));
    expect(Array.isArray(mem.conversations)).toBe(true);
    const last = mem.conversations[mem.conversations.length - 1];
    expect(last).toBeDefined();
    expect(last.persona).toBe("master");
  });
});
