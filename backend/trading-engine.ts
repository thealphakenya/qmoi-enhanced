import fs from "fs";
import path from "path";
import { parse as csvParse } from "csv-parse/sync";

interface Trade {
  id: string;
  timestamp: number;
  type: string;
  amount: number;
  price: number;
  result?: string;
  rationale: string;
}

const DATASET_PATH = path.join(process.cwd(), "data", "trading-data.csv");
const TRADING_LOG = path.join(process.cwd(), "trading-log.json");

function loadDataset(): Record<string, unknown>[] {
  if (!fs.existsSync(DATASET_PATH)) {
    return [];
  }

  const csv = fs.readFileSync(DATASET_PATH, "utf-8");
  return csvParse(csv, { columns: true }) as Record<string, unknown>[];
}

function logTrade(trade: Trade): void {
  const trades = fs.existsSync(TRADING_LOG)
    ? JSON.parse(fs.readFileSync(TRADING_LOG, "utf-8"))
    : [];
  trades.push(trade);
  fs.writeFileSync(TRADING_LOG, JSON.stringify(trades, null, 2), "utf-8");
}

function simpleMovingAverage(prices: number[], window: number): number[] {
  const sma: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < window - 1) {
      sma.push(NaN);
      continue;
    }

    const sum = prices.slice(i - window + 1, i + 1).reduce((acc, value) => acc + value, 0);
    sma.push(sum / window);
  }

  return sma;
}

export async function autonomousTradingLoop(): Promise<void> {
  const data = loadDataset();
  const closes = data.map((row) => Number(row.Close || row.close || 0));
  const sma = simpleMovingAverage(closes, 3);

  setInterval(() => {
    const idx = Math.floor(Math.random() * Math.max(1, closes.length - 1)) + 1;
    const price = closes[idx];
    const average = sma[idx];

    if (Number.isFinite(price) && Number.isFinite(average)) {
      const trade: Trade = {
        id: Math.random().toString(36).slice(2),
        timestamp: Date.now(),
        type: price > average ? "BUY" : "SELL",
        amount: 1,
        price,
        rationale: "SMA cross strategy",
      };
      logTrade(trade);
    }
  }, 10000);
}
