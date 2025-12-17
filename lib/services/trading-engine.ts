export async function connectToTradingEngine() {
  // Minimal stub for local/dev use. Replace with real client when available.
  return {
    connected: true,
    info: "mock-trading-engine",
    timestamp: new Date().toISOString(),
  };
}

export default connectToTradingEngine;
