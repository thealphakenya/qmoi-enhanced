
// Enhanced Express server for QMOI AI, QCity, and QMOI Space UIs
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT_MAIN = 3000; // QMOI AI Main
const PORT_QCITY = 3001; // QCity
const PORT_SPACE = 5000; // QMOI Space

// Helper: Serve static or fallback to index.html for SPA
function serveStaticOrSPA(dir) {
  return [
    express.static(dir),
    (req, res, next) => {
      const indexPath = path.join(dir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Not found');
      }
    }
  ];
}

// QMOI AI Main UI
const mainApp = express();
mainApp.use('/', ...serveStaticOrSPA(path.join(__dirname, '../public')));
mainApp.get('/health', (req, res) => res.json({ status: 'ok', service: 'QMOI Main UI' }));
mainApp.listen(PORT_MAIN, async () => {
  console.log(`QMOI Main UI running at http://localhost:${PORT_MAIN}`);
  try { await open(`http://localhost:${PORT_MAIN}`); } catch {}
});

// QCity UI
const qcityApp = express();
qcityApp.use('/', ...serveStaticOrSPA(path.join(__dirname, '../public/qcity')));
qcityApp.get('/health', (req, res) => res.json({ status: 'ok', service: 'QCity UI' }));
qcityApp.listen(PORT_QCITY, async () => {
  console.log(`QCity UI running at http://localhost:${PORT_QCITY}`);
  try { await open(`http://localhost:${PORT_QCITY}`); } catch {}
});

// QMOI Space PWA
const spaceApp = express();
spaceApp.use('/', ...serveStaticOrSPA(path.join(__dirname, '../qmoi-space-pwa')));
spaceApp.get('/health', (req, res) => res.json({ status: 'ok', service: 'QMOI Space PWA' }));
spaceApp.listen(PORT_SPACE, async () => {
  console.log(`QMOI Space PWA running at http://localhost:${PORT_SPACE}`);
  try { await open(`http://localhost:${PORT_SPACE}`); } catch {}
});

// Reliability: Log errors
process.on('uncaughtException', err => { console.error('Uncaught:', err); });
process.on('unhandledRejection', err => { console.error('Unhandled:', err); });
