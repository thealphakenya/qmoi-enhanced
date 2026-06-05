// Basic Cashon endpoints smoke test
// Requires: Node.js environment, `node-fetch` or native fetch, and environment variables:
// - MASTER_TOKEN
// - BASE_URL (e.g. http://localhost:3000)

import fetch from 'node-fetch';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const MASTER_TOKEN = process.env.MASTER_TOKEN || '';

async function test() {
  if (!MASTER_TOKEN) {
    console.error('MASTER_TOKEN not set; aborting tests');
    process.exit(1);
  }

  try {
    console.log('Testing /api/cashon/trading-status');
    const status = await fetch(`${BASE_URL}/api/cashon/trading-status`, {
      headers: { Authorization: `Bearer ${MASTER_TOKEN}` },
    });
    console.log('status', status.status);

    console.log('Testing /api/cashon/signals');
    const signals = await fetch(`${BASE_URL}/api/cashon/signals`);
    console.log('signals status', signals.status);

    console.log('Testing start trading (POST)');
    const start = await fetch(`${BASE_URL}/api/cashon/start-trading`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${MASTER_TOKEN}` },
    });
    console.log('start status', start.status);

    console.log('Testing stop trading (POST)');
    const stop = await fetch(`${BASE_URL}/api/cashon/stop-trading`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${MASTER_TOKEN}` },
    });
    console.log('stop status', stop.status);

    console.log('Testing deposit (POST) with invalid amount');
    const deposit = await fetch(`${BASE_URL}/api/cashon/deposit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${MASTER_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 0 }),
    });
    console.log('deposit status', deposit.status);

    console.log('Smoke tests complete');
  } catch (err) {
    console.error('Test error', err);
    process.exit(1);
  }
}

// Run if invoked directly
if (require.main === module) test();

export default test;
