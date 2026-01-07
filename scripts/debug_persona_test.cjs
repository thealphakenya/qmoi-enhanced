const { spawn } = require("child_process");
const net = require("net");
const http = require("http");
const path = require("path");
const fs = require("fs");

async function waitForPort(port, host = "127.0.0.1", timeout = 10000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const s = new net.Socket();
      let settled = false;
      s.setTimeout(1000);
      s.on("connect", () => {
        settled = true;
        s.destroy();
        resolve();
      });
      s.on("error", () => {
        if (!settled) {
          s.destroy();
          if (Date.now() - start > timeout) return reject(new Error("timeout"));
          setTimeout(check, 200);
        }
      });
      s.on("timeout", () => {
        if (!settled) {
          s.destroy();
          if (Date.now() - start > timeout) return reject(new Error("timeout"));
          setTimeout(check, 200);
        }
      });
      s.connect(port, host);
    };
    check();
  });
}

(async () => {
  const port = 8090;
  const baseUrl = `http://127.0.0.1:${port}`;
  const serverScript = path.join(
    process.cwd(),
    "scripts",
    "qmoi_local_server.cjs"
  );
  const env = Object.assign({}, process.env, {
    QMOI_LOCAL_PORT: String(port),
    QMOI_SYNC_INTERVAL_SECONDS: "0",
    QMOI_MEMORY_FILE: path.join(process.cwd(), `qmoi_memory_${port}.json`),
  });
  console.log("Spawning server", serverScript, "on port", port);
  const proc = spawn("node", [serverScript], {
    stdio: ["ignore", "pipe", "pipe"],
    env,
  });
  let out = "";
  let err = "";
  proc.stdout.on("data", (d) => {
    out += d.toString();
    console.log("[server-out]", d.toString().trim());
  });
  proc.stderr.on("data", (d) => {
    err += d.toString();
    console.error("[server-err]", d.toString().trim());
  });
  proc.on("exit", (code, sig) => console.log("server-exit", code, sig));

  try {
    await waitForPort(port, "127.0.0.1", 5000);
    console.log("port open, sending request");
    const payload = {
      messages: [
        { role: "system", content: "master" },
        { role: "user", content: "How are you doing today?" },
      ],
    };
    const data = JSON.stringify(payload);
    const options = {
      hostname: "127.0.0.1",
      port: port,
      path: "/v1/chat/completions",
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
        console.log("RESPONSE STATUS", res.statusCode);
        console.log("RESPONSE BODY", body);
        proc.kill();
      });
    });
    req.on("error", (e) => {
      console.error("REQ ERROR", e);
      proc.kill();
    });
    req.write(data);
    req.end();
  } catch (e) {
    console.error("ERROR DURING DEBUG:", e, "stdout:", out, "stderr:", err);
    proc.kill();
  }
})();
