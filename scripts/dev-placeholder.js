#!/usr/bin/env node
/* Lightweight placeholder server used when Next dev/build is unavailable.
   Serves a small informational page so the workspace browser can be opened safely.
*/
import express from "express";
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

app.get("/", (req, res) => {
  res.type("html").send(`
    <html>
      <head><title>QMOI - Placeholder</title></head>
      <body style="font-family: system-ui, sans-serif; padding: 2rem;">
        <h1>QMOI (placeholder)</h1>
        <p>The real Next.js app is not currently running in this workspace.</p>
        <p>Reason: production build may not complete in this environment (worker SIGTERM) and dev server is still compiling.</p>
        <p>Please check the terminal for ongoing compilation logs, or run <code>npm run dev</code> to start the dev server locally.</p>
      </body>
    </html>
  `);
});

app.get("/health", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

app.listen(port, host, () => {
  console.log(`Placeholder server listening on http://${host}:${port}`);
});
