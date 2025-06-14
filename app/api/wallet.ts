import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Simulated wallet state (replace with DB or secure backend in production)
const wallet = {
  balance: 10000,
  currency: 'KES',
  transactions: [
    { date: '2025-06-01', type: 'deposit', amount: 5000, currency: 'KES', platform: 'Mpesa', status: 'completed' },
    { date: '2025-06-10', type: 'withdraw', amount: 2000, currency: 'KES', platform: 'Binance', status: 'completed' },
  ],
};

const MPESA_API_URL = 'https://api.safaricom.co.ke/mpesa';
const BINANCE_API_URL = 'https://api.binance.com';
const PESA_API_URL = 'https://api.pesapal.com';
const BITGET_API_URL = 'https://api.bitget.com';

async function processMpesa(amount: number, type: string) {
  // TODO: Integrate with real Mpesa API
  return { status: 'success', platform: 'Mpesa', amount };
}
async function processBinance(amount: number, type: string) {
  // TODO: Integrate with real Binance API
  return { status: 'success', platform: 'Binance', amount };
}
async function processPesapal(amount: number, type: string) {
  // TODO: Integrate with real Pesapal API
  return { status: 'success', platform: 'Pesapal', amount };
}
async function processBitget(amount: number, type: string) {
  // TODO: Integrate with real Bitget API
  return { status: 'success', platform: 'Bitget', amount };
}

const platformHandlers: Record<string, any> = {
  Mpesa: processMpesa,
  Binance: processBinance,
  Pesapal: processPesapal,
  Bitget: processBitget,
  Cashon: async (amount: number, type: string) => ({ status: 'success', platform: 'Cashon', amount }),
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== process.env.ADMIN_TOKEN) return res.status(403).json({ error: 'Forbidden' });

  if (req.method === 'GET') {
    if (req.query.balance) {
      return res.json(wallet);
    }
    return res.status(400).json({ error: 'Unknown GET action' });
  }

  if (req.method === 'POST') {
    const { amount, platform } = req.body;
    const handler = platformHandlers[platform] || platformHandlers['Cashon'];
    if (req.query.deposit) {
      const result = await handler(Number(amount), 'deposit');
      wallet.balance += Number(amount);
      wallet.transactions.push({ date: new Date().toISOString().slice(0,10), type: 'deposit', amount, currency: wallet.currency, platform, status: result.status });
      return res.json({ status: result.status, balance: wallet.balance });
    }
    if (req.query.withdraw) {
      const result = await handler(Number(amount), 'withdraw');
      wallet.balance -= Number(amount);
      wallet.transactions.push({ date: new Date().toISOString().slice(0,10), type: 'withdraw', amount, currency: wallet.currency, platform, status: result.status });
      return res.json({ status: result.status, balance: wallet.balance });
    }
    return res.status(400).json({ error: 'Unknown POST action' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
