type TradeRecord = {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  profit?: number;
};

export class TradingService {
  private static instance: TradingService | null = null;
  private trades: TradeRecord[] = [];

  static getInstance() {
    if (!TradingService.instance)
      TradingService.instance = new TradingService();
    return TradingService.instance;
  }

  async getTradingStats() {
    const total = this.trades.length;
    const successful = this.trades.filter(
      (t) => t.status === "completed"
    ).length;
    const failed = this.trades.filter((t) => t.status === "failed").length;
    const totalProfit = this.trades.reduce((s, t) => s + (t.profit || 0), 0);
    const winRate = total === 0 ? 0 : successful / total;
    const averageProfit = total === 0 ? 0 : totalProfit / total;
    const best = this.trades.reduce(
      (acc, t) => (t.profit && t.profit > (acc.profit || -Infinity) ? t : acc),
      {} as TradeRecord
    );
    const worst = this.trades.reduce(
      (acc, t) => (t.profit && t.profit < (acc.profit || Infinity) ? t : acc),
      {} as TradeRecord
    );
    return {
      totalTrades: total,
      successfulTrades: successful,
      failedTrades: failed,
      totalProfit,
      winRate,
      averageProfit,
      bestTrade: best,
      worstTrade: worst,
    };
  }

  async getTradeHistory() {
    return this.trades
      .slice()
      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
  }

  async getActiveTrades() {
    return this.trades.filter((t) => t.status === "pending");
  }

  async createTrade(payload: Partial<TradeRecord>) {
    const id =
      payload.id || `trade-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const t: TradeRecord = {
      id,
      symbol: payload.symbol || "UNKNOWN",
      type: payload.type || "buy",
      amount: payload.amount || 0,
      price: payload.price || 0,
      timestamp: payload.timestamp || new Date().toISOString(),
      status: payload.status || "pending",
      profit: payload.profit || 0,
    };
    this.trades.push(t);
    return t;
  }

  async executeTrade(trade: Partial<TradeRecord>) {
    // Simulate execution; mark as completed and assign small random profit
    const profit = Math.round((Math.random() - 0.4) * 100 * 100) / 100;
    const tradeRecord = await this.createTrade({
      ...trade,
      status: "completed",
      profit,
    });
    return { ok: true, profit };
  }

  async updateTrade(id: string, updates: Partial<TradeRecord>) {
    const idx = this.trades.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.trades[idx] = { ...this.trades[idx], ...updates } as TradeRecord;
    return this.trades[idx];
  }

  async cancelTrade(id: string) {
    const idx = this.trades.findIndex(
      (t) => t.id === id && t.status === "pending"
    );
    if (idx === -1) return false;
    this.trades[idx].status = "failed";
    return true;
  }
}

export default TradingService;
