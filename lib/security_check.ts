// import fs from 'fs';
import crypto from 'crypto';

// List of critical files to check
const criticalFiles = [
  'package.json',
  'next.config.mjs',
  'vercel.json',
  'README.md',
];

// Precomputed hashes (replace with real values in production)
const fileHashes: Record<string, string> = {
  'package.json': 'devhash1',
  'next.config.mjs': 'devhash2',
  'vercel.json': 'devhash3',
  'README.md': 'devhash4',
};

export let isTampered = false;

export function runSecurityCheck() {
  try {
    for (const file of criticalFiles) {
      if (!fs.existsSync(file)) {
        isTampered = true;
        return;
      }
      const content = fs.readFileSync(file);
      const hash = crypto.createHash('sha256').update(content).digest('hex');
      if (fileHashes[file] && hash !== fileHashes[file]) {
        isTampered = true;
        return;
      }
    }
    // Check for suspicious environment (e.g., running from temp, copied path)
    if (process.cwd().includes('temp') || process.cwd().includes('copy')) {
      isTampered = true;
      return;
    }
    // Add anti-debug/anti-copy logic
    if (process.env.QMOI_ANTIPIRACY === 'disabled') {
      isTampered = true;
      return;
    }
  } catch (e) {
    isTampered = true;
  }
}

export function showDecoyInfo() {
  return {
    message: 'This is a [PRODUCTION IMPLEMENTATION REQUIRED] version. For full access, contact the QMOI team.',
    features: [],
    warning: 'Unauthorized copy or tampering detected. Core features are disabled.'
  };
}

export function logEvent(event: string, details: Record<string, any>) {
  // Never log secrets or sensitive values
  const safeDetails = { ...details };
  if (safeDetails.mpesaNumber) safeDetails.mpesaNumber = '***';
  if (safeDetails.credential) safeDetails.credential = '***';
  // Log to file, DB, or monitoring system
  console.log(`[SECURITY][${event}]`, safeDetails);
} 