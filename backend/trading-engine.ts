// backend/trading-engine.ts
// Autonomous trading engine for Alpha-Q AI (no API key required)
// - Loads local CSV datasets
// - Runs always-on trading loop
// - Supports Colab batch jobs (import/export CSV)
// - Logs all trades for admin audit

import fs from 'fs';
import path from 'path';
import csvParse from 'csv-parse/lib/sync';

interface Trade {
  id: string;
  timestamp: number;
  type: string;
  amount: number;
  price: number;
  result: string;
  rationale: string;
}

const DATASET_PATH = path.join(__dirname, '../datasets/trading/trading-dataset-sample.csv');
const TRADING_LOG = path.join(__dirname, '../trading-log.json');

function loadDataset(): any[] {
  const csv = fs.readFileSync(DATASET_PATH, 'utf-8');
  return csvParse(csv, { columns: true });
}

function logTrade(trade: Trade) {
  const trades = fs.existsSync(TRADING_LOG)
    ? JSON.parse(fs.readFileSync(TRADING_LOG, 'utf-8'))
    : [];
  trades.push(trade);
  fs.writeFileSync(TRADING_LOG, JSON.stringify(trades, null, 2));
}

function simpleMovingAverage(prices: number[], window: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < window - 1) {
      sma.push(NaN);
    } else {
      const sum = prices.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / window);
    }
  }
  return sma;
}

export async function autonomousTradingLoop() {
  const data = loadDataset();
  const closes = data.map(row => parseFloat(row.Close));
  const sma = simpleMovingAverage(closes, 3);
  setInterval(() => {
    const now = Date.now();
    const idx = Math.floor(Math.random() * (data.length - 1)) + 1;
    if (closes[idx] > sma[idx]) {
      const trade: Trade = {
        id: Math.random().toString(36).slice(2),
        timestamp: now,
        type: 'BUY',
        amount: 1,
        price: closes[idx],
        result: 'SIMULATED',
        rationale: 'SMA cross',
      };
      logTrade(trade);
    } else if (closes[idx] < sma[idx]) {
      const trade: Trade = {
        id: Math.random().toString(36).slice(2),
        timestamp: now,
        type: 'SELL',
        amount: 1,
        price: closes[idx],
        result: 'SIMULATED',
        rationale: 'SMA cross',
      };
      logTrade(trade);
    }
  }, 10000); // every 10 seconds
}

// To start: import { autonomousTradingLoop } from './backend/trading-engine'; autonomousTradingLoop();
// For Colab: import/export CSV using the same format as trading-dataset-sample.csv
