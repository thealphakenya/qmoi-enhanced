// @jest-environment node
const { spawn } = require("child_process");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

jest.setTimeout(30000);

const net = require("net");

// Skip this integration suite if Python Flask is not installed in the test environment
let _flaskAvailable = true;
try {
  const cp = require("child_process");
  cp.execSync('python3 -c "import flask"', { stdio: "ignore" });
} catch (e) {
  _flaskAvailable = false;
  // eslint-disable-next-line no-console
  console.warn(
    "Skipping persona integration tests because Flask is not available"
  );
}

if (!_flaskAvailable) {
  describe.skip("QM OI helper server (integration) - skipped (flask missing)", () => {
    test("skipped", () => {});
  });
} else {
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

  describe("QM OI helper server (integration)", () => {
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

      if (fs.existsSync(memoryFileInScripts)) {
        backupPath = memoryFileInScripts + ".bak";
        fs.copyFileSync(memoryFileInScripts, backupPath);
      }

      fs.mkdirSync(path.dirname(memoryFileInScripts), { recursive: true });

      serverProc = spawn("python3", ["-u", serverScript], {
        stdio: ["ignore", "pipe", "pipe"],
        env: Object.assign({}, process.env, {
          QMOI_LOCAL_PORT: String(port),
          QMOI_SYNC_INTERVAL_SECONDS: "0",
          QMOI_MEMORY_FILE: memoryFileInScripts,
        }),
      });

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

      await waitForServer(baseUrl + "/health", 10000, 200);
    });

    afterAll(() => {
      try {
        if (serverProc) serverProc.kill();
      } catch (e) {}
      if (backupPath && fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, memoryFileInScripts);
        fs.unlinkSync(backupPath);
      }
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
}
