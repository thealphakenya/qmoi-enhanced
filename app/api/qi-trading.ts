import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Store Bitget credentials securely (in env vars or a secure vault in production)
const BITGET_API_KEY = process.env.BITGET_API_KEY;
const BITGET_API_SECRET = process.env.BITGET_API_SECRET;
const BITGET_API_PASSPHRASE = process.env.BITGET_API_PASSPHRASE;
const BITGET_API_BASE = 'https://api.bitget.com';
const TRADING_LOG = path.join(process.cwd(), 'trading-log.json');
const DATASET_PATH = path.join(process.cwd(), 'datasets/trading/trading-dataset-sample.csv');

// Helper to sign Bitget API requests
function signRequest(method: string, path: string, body: string, timestamp: string) {
  const preHash = timestamp + method.toUpperCase() + path + body;
  return crypto.createHmac('sha256', BITGET_API_SECRET!).update(preHash).digest('base64');
}

async function bitgetRequest(method: string, path: string, bodyObj: any = null) {
  if (!BITGET_API_KEY || !BITGET_API_SECRET || !BITGET_API_PASSPHRASE) throw new Error('Bitget credentials not set');
  const timestamp = Date.now().toString();
  const body = bodyObj ? JSON.stringify(bodyObj) : '';
  const sign = signRequest(method, path, body, timestamp);
  const headers = {
    'ACCESS-KEY': BITGET_API_KEY,
    'ACCESS-SIGN': sign,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': BITGET_API_PASSPHRASE,
    'Content-Type': 'application/json',
  };
  const url = BITGET_API_BASE + path;
  const res = await fetch(url, {
    method,
    headers,
    body: method === 'GET' ? undefined : body,
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// Dummy confidence calculation (replace with real AI logic)
let confidence = 0.82;
let usingRealFunds = confidence >= 0.7;

// In-memory log for admin
const tradeLog: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple admin auth (replace with real auth in production)
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== process.env.ADMIN_TOKEN) return res.status(403).json({ error: 'Forbidden' });

  const { action } = req.query;
  try {
    if (action === 'account') {
      // Get Bitget account balance
      const data = await bitgetRequest('GET', '/api/v2/account/assets', null);
      return res.json({ balance: data.data });
    }
    if (action === 'trades') {
      // Get recent trades
      const data = await bitgetRequest('GET', '/api/v2/mix/order/history?productType=USDT-FUTURES', null);
      return res.json({ trades: data.data });
    }
    if (action === 'trade') {
      // Place a trade (AI decides pair, amount, side, etc.)
      // Example: market buy BTC/USDT
      const pair = 'BTCUSDT_UMCBL';
      const side = 'open_long';
      const size = 0.01;
      if (confidence < 0.7) return res.json({ error: 'Confidence too low for real trade', confidence });
      const order = await bitgetRequest('POST', '/api/v2/mix/order/placeOrder', {
        symbol: pair,
        marginCoin: 'USDT',
        size,
        side,
        orderType: 'market',
        productType: 'USDT-FUTURES',
      });
      tradeLog.push({ time: Date.now(), pair, side, size, result: order });
      return res.json({ order });
    }
    if (action === 'stats') {
      // Return trading stats, confidence, and log (persistent)
      let log = [];
      if (fs.existsSync(TRADING_LOG)) {
        log = JSON.parse(fs.readFileSync(TRADING_LOG, 'utf-8'));
      }
      // Confidence and real funds status from last trade
      const last = log.length > 0 ? log[log.length - 1] : null;
      // Analytics: profit, win rate, trade count, pairs, etc.
      const totalProfit = log.reduce((sum: number, t: any) => sum + (t.order?.profit || 0), 0);
      const winCount = log.filter((t: any) => (t.order?.profit || 0) > 0).length;
      const lossCount = log.filter((t: any) => (t.order?.profit || 0) < 0).length;
      const tradeCount = log.length;
      const pairs = Array.from(new Set(log.map((t: any) => t.pair)));
      const winRate = tradeCount > 0 ? winCount / tradeCount : 0;
      return res.json({
        confidence: last?.confidence ?? 0.5,
        usingRealFunds: last?.real_funds ?? false,
        log,
        analytics: {
          totalProfit,
          winRate,
          tradeCount,
          pairs,
          winCount,
          lossCount,
        }
      });
    }
    // Trading log route
    if (req.method === 'GET') {
      // Return all trades
      if (fs.existsSync(TRADING_LOG)) {
        const trades = JSON.parse(fs.readFileSync(TRADING_LOG, 'utf-8'));
        return res.status(200).json(trades);
      } else {
        return res.status(200).json([]);
      }
    } else if (req.method === 'POST') {
      // Simulate a trade (for demo/testing)
      const now = Date.now();
      const trade = {
        id: Math.random().toString(36).slice(2),
        timestamp: now,
        type: Math.random() > 0.5 ? 'BUY' : 'SELL',
        amount: 1,
        price: 70000 + Math.floor(Math.random() * 1000),
        result: 'SIMULATED',
        rationale: 'Manual simulation',
      };
      let trades = [];
      if (fs.existsSync(TRADING_LOG)) {
        trades = JSON.parse(fs.readFileSync(TRADING_LOG, 'utf-8'));
      }
      trades.push(trade);
      fs.writeFileSync(TRADING_LOG, JSON.stringify(trades, null, 2));
      return res.status(201).json(trade);
    } else if (req.method === 'DELETE') {
      // Clear all trades (admin only)
      fs.writeFileSync(TRADING_LOG, '[]');
      return res.status(204).end();
    } else {
      return res.status(405).end();
    }
    return res.status(400).json({ error: 'Unknown action' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
