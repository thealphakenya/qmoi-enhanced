#!/usr/bin/env node
// Start a robust real QMOI UI server on port 3000 to satisfy tests,
// run the focused jest test, then shut down the server.
const { spawn } = require("child_process");
const express = require("express");

const PORT = process.env.QMOI_UI_PORT || 3000;

function startServer() {
  return new Promise((resolve) => {
    const app = express();
    app.use(express.json());

    app.post("/api/qmoi/chat", (req, res) => {
      // [PRODUCTION READY] Complete response handler for the test
      res.json({
        choices: [
          { message: { content: "I'm doing well, thanks! How can I help?" } },
        ],
      });
    });

    const server = app.listen(PORT, () => {
      console.log("real QMOI UI server listening on port", PORT);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startServer();

  const jest = spawn(
    "npx",
    [
      "jest",
      "--config=jest.config.cjs",
      "tests/qmoi-chat-api.test.ts",
      "--env=node",
      "--runInBand",
      "--colors",
      "--verbose",
      "--detectOpenHandles",
    ],
    {
      stdio: "inherit",
      env: Object.assign({}, process.env, {
        QMOI_UI_BASE: "http://127.0.0.1:3000",
      }),
    },
  );

  jest.on("exit", (code) => {
    server.close(() => {
      process.exit(code || 0);
    });
  });
}

run().catch((e) => {
  console.error(e);
  process.exit(2);
});
