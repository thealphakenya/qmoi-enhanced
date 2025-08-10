// trading-worker.ts
import { executeTradeWithScaling } from "./server-trading-utils";

async function runCycle() {
  // Example configuration coming from your trading strategy
  const tasks = [
    { symbol: "BTCUSDT_SPBL", side: "buy", totalSize: 0.001, slices: 3, orderType: "market" },
    { symbol: "ETHUSDT_SPBL", side: "sell", totalSize: 0.01, slices: 2, orderType: "limit", price: 1800 }
  ];

  for (const t of tasks) {
    try {
      const results = await executeTradeWithScaling({
        symbol: t.symbol,
        side: t.side as "buy" | "sell",
        totalSize: t.totalSize,
        slices: t.slices || 1,
        orderType: t.orderType as "market" | "limit",
        price: t.price
      });
      console.log("Trade results for", t.symbol, results);
      // you can add logic here: if any slice failed, retry entire task later, alert, etc.
    } catch (err) {
      console.error("Unexpected error while trading:", err);
    }
    // Respect rate limits — wait a bit between instruments
    await new Promise((r) => setTimeout(r, 500));
  }
}

(async function loop() {
  while (true) {
    await runCycle();
    // run every N seconds/minutes depending on your strategy
    await new Promise((r) => setTimeout(r, 60 * 1000));
  }
})();
