// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:04Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env node
/* robust 
   Serves a small informational page so the workspace browser can be opened safely.
*/
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, _res) => {
  _res.type("html").send(`
    <html>
      <head><title>QMOI - 
      <body style="font-family: system-ui, sans-serif; padding: 2rem;">
        <h1>QMOI (
        <p>Please check the terminal for ongoing compilation logs, or run <code>npm run prod</code> to start the prod server locally.</p>
      </body>
    </html>
  `);
});

app.get("/health", (_req, _res) =>
  _res.json({ ok: true, time: new Date().toISOString() }),
);

app.listen(port, host, () => {
  logger.info(`
});
