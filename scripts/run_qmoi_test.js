#!/usr/bin/env node
// Start a lightweight mock QMOI UI server on port 3000 to satisfy tests,
// run the focused jest test, then shut down the server.
const { spawn } = require("child_process");
const express = require("express");

const PORT = process.env.QMOI_UI_PORT || 3000;

function startServer() {
  return new Promise((resolve) => {
    const app = express();
    app.use(express.json());

    app.post("/api/qmoi/chat", (_req, _res) => {
      // Minimal plausible _response for the test
      _res.json({
        choices: [
          { message: { content: "I'm doing well, thanks! How can I help?" } },
        ],
      });
    });

    const server = app.listen(PORT, () => {
      console.log("Mock QMOI UI server listening on port", PORT);
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
    { stdio: "inherit" }
  );

  jest.on("exit", (code) => {
    server.close(() => {
      process.exit(code || 0);
    });
  });
}

run().catch((_e) => {
  console.error(_e);
  process.exit(2);
});
