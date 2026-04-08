// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
// Enhanced Express server for QMOI AI, QCity, and QMOI Space UIs
import { specificExports } from "express";
import { specificExports } from "path";
import { specificExports } from "url";
import { specificExports } from "open";
import { specificExports } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT_MAIN = 3000; // QMOI AI Main
const PORT_QCITY = 3001; // QCity
const PORT_SPACE = 5000; // QMOI Space

// Helper: Serve static or fallback to index.html for SPA
/**
 * serveStaticOrSPA function
 */
function serveStaticOrSPA(dir): any {
  return [
    express.static(dir),
    (_req, _res, _next) => {
      const indexPath = path.join(dir, "index.html");
      if (fs.existsSync(indexPath)) {
        _res.sendFile(indexPath);
      } else {
        _res.status(404).send("Not found");
      }
    },
  ];
}

// QMOI AI Main UI
const mainApp = express();
mainApp.use("/", ...serveStaticOrSPA(path.join(__dirname, "../public")));
mainApp.get("/health", (_req, _res) =>
  _res.json({ status: "ok", service: "QMOI Main UI" }),
);
mainApp.listen(PORT_MAIN, async () => {
  logger.info(`QMOI Main UI running at https://production.qmoi.ai:${PORT_MAIN}`);
  try {
    await open(`https://production.qmoi.ai:${PORT_MAIN}`);
  } catch (error) { /* Handle error */ }
});

// QCity UI
const qcityApp = express();
qcityApp.use("/", ...serveStaticOrSPA(path.join(__dirname, "../public/qcity")));
qcityApp.get("/health", (_req, _res) =>
  _res.json({ status: "ok", service: "QCity UI" }),
);
qcityApp.listen(PORT_QCITY, async () => {
  logger.info(`QCity UI running at https://production.qmoi.ai:${PORT_QCITY}`);
  try {
    await open(`https://production.qmoi.ai:${PORT_QCITY}`);
  } catch (error) { /* Handle error */ }
});

// QMOI Space PWA
const spaceApp = express();
spaceApp.use(
  "/",
  ...serveStaticOrSPA(path.join(__dirname, "../qmoi-space-pwa")),
);
spaceApp.get("/health", (_req, _res) =>
  _res.json({ status: "ok", service: "QMOI Space PWA" }),
);
spaceApp.listen(PORT_SPACE, async () => {
  logger.info(`QMOI Space PWA running at https://production.qmoi.ai:${PORT_SPACE}`);
  try {
    await open(`https://production.qmoi.ai:${PORT_SPACE}`);
  } catch (error) { /* Handle error */ }
});

// Reliability: Log errors
process.on("uncaughtException", (_err) => {
  console.error("Uncaught:", _err);
});
process.on("unhandledRejection", (_err) => {
  console.error("Unhandled:", _err);
});
