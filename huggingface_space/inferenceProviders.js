import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'config', 'inference_providers.json');
let providers = [
  { name: 'Hugging Face Inference API', id: 'hf', url: 'https://api-inference.huggingface.co' },
  { name: 'Local Model', id: 'local', url: 'http://localhost:5000' },
  { name: 'Cloud Provider', id: 'cloud', url: 'https://cloud-inference.example.com' }
];
if (fs.existsSync(configPath)) {
  try {
    providers = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    console.error('[Qmoispace] Failed to load inference providers config:', e);
  }
}

let currentProvider = providers[0];

function autoDetectProvider() {
  // Ping each provider and select the fastest available
  const http = require('http');
  let best = null;
  let bestTime = Infinity;
  providers.forEach(p => {
    const start = Date.now();
    try {
      const req = http.request(p.url, { method: 'HEAD', timeout: 2000 }, res => {
        const t = Date.now() - start;
        if (t < bestTime) {
          best = p;
          bestTime = t;
        }
      });
      req.on('error', () => {});
      req.end();
    } catch {}
  });
  if (best) {
    currentProvider = best;
    fs.appendFileSync('logs/qmoispace_inference.log', `[${new Date().toISOString()}] Selected provider: ${best.name}\n`);
  }
  return currentProvider;
}

function getCurrentProvider() {
  return currentProvider;
}

function setCurrentProvider(id) {
  const found = providers.find(p => p.id === id);
  if (found) {
    currentProvider = found;
    fs.appendFileSync('logs/qmoispace_inference.log', `[${new Date().toISOString()}] Manually set provider: ${found.name}\n`);
    return true;
  }
  return false;
}

module.exports = { autoDetectProvider, getCurrentProvider, setCurrentProvider, providers }; 