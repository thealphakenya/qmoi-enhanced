import { getMarketData, executeTradeWithScaling } from './server-trading-utils';
import { WebSocketManager } from './ws-client';
import pLimit from 'p-limit';

const CONFIDENCE_THRESHOLD = 0.7; // 70% confidence for real trade
const MAX_CONCURRENT_TRADES = 4;
const TRADE_INTERVAL = 5000; // 5 sec interval between analysis cycles

const tradingPairs = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT', 'LTCUSDT', 'ADAUSDT'];

// Concurrency control
const limit = pLimit(MAX_CONCURRENT_TRADES);

// Initialize WebSocket Manager
const wsManager = new WebSocketManager();

async function analyzeAndTrade(pair: string) {
  try {
    const marketData = await getMarketData(pair);
    if (!marketData || !marketData.signal) {
      console.warn(`⚠️ No signal data for ${pair}. Skipping.`);
      return;
    }

    const { confidence, signal, price } = marketData;
    console.log(`📊 Pair: ${pair} | Confidence: ${(confidence * 100).toFixed(2)}% | Signal: ${signal}`);

    if (confidence >= CONFIDENCE_THRESHOLD) {
      const amount = calculateDynamicAmount(confidence, price);
      console.log(`✅ High confidence detected (${(confidence * 100).toFixed(2)}%). Executing trade on ${pair} with amount: ${amount}`);

      await executeTradeWithScaling({
        pair,
        signal,
        amount,
        confidence,
        scalingMode: 'auto' // system decides optimal scale for profit growth
      });
    } else {
      console.log(`ℹ️ Confidence below threshold (${(confidence * 100).toFixed(2)}%). Skipping trade.`);
    }
  } catch (error) {
    console.error(`❌ Error analyzing ${pair}:`, error);
  }
}

function calculateDynamicAmount(confidence: number, price: number): number {
  const baseAmount = 10; // Minimum $10 trade
  const scalingFactor = 1 + (confidence - CONFIDENCE_THRESHOLD) * 2; // More confidence = bigger amount
  return parseFloat((baseAmount * scalingFactor).toFixed(2));
}

async function startTradingLoop() {
  console.log('🚀 Starting trading loop with max concurrency:', MAX_CONCURRENT_TRADES);

  while (true) {
    try {
      const topPairs = selectTopPairs(tradingPairs, MAX_CONCURRENT_TRADES);
      const tasks = topPairs.map(pair => limit(() => analyzeAndTrade(pair)));

      await Promise.all(tasks);
    } catch (err) {
      console.error('⚠️ Trading loop error:', err);
    }

    await new Promise(resolve => setTimeout(resolve, TRADE_INTERVAL));
  }
}

function selectTopPairs(pairs: string[], count: number): string[] {
  return pairs.sort(() => 0.5 - Math.random()).slice(0, count);
}

// Handle WebSocket and reconnect
wsManager.on('connected', () => {
  console.log('✅ WebSocket connected.');
});

wsManager.on('disconnected', () => {
  console.warn('⚠️ WebSocket disconnected. Attempting to reconnect...');
  wsManager.reconnect();
});

wsManager.connect();
startTradingLoop();
