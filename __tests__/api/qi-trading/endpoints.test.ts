jest.mock("@/services/secrets/secretStore", () => {
  const credentials: Record<string, any> = {
    "exchange.bitget": {
      apiKey: "bitget-key",
      apiSecret: "bitget-secret",
      passphrase: "passphrase",
    },
    "exchange.binance": {
      apiKey: "binance-key",
      apiSecret: "binance-secret",
      testnet: true,
    },
  };

  return {
    getSecretJson: jest.fn(async (key: string) => credentials[key]),
    setSecretJson: jest.fn(async () => undefined),
  };
});

jest.mock("@/services/adapters/bitget", () => {
  return {
    BitgetAdapter: jest.fn().mockImplementation(() => ({
      getTicker: jest.fn(async () => ({ data: { last: "50000" } })),
      getBalances: jest.fn(async () => new Map([
        ["USDT", 10],
        ["BTC", 0.001],
      ])),
      healthCheck: jest.fn(async () => true),
      placeMarketOrder: jest.fn(async () => ({ id: "bitget-market-order", status: "ok" })),
      placeLimitOrder: jest.fn(async () => ({ id: "bitget-limit-order", status: "ok" })),
    })),
  };
});

jest.mock("@/services/adapters/binance", () => {
  return {
    BinanceAdapter: jest.fn().mockImplementation(() => ({
      getPrice: jest.fn(async () => 50000),
      getBalances: jest.fn(async () => new Map([
        ["USDT", 20],
        ["BTC", 0.002],
      ])),
      healthCheck: jest.fn(async () => true),
      placeMarketOrder: jest.fn(async () => ({ orderId: "binance-market-order", status: "ok" })),
      placeLimitOrder: jest.fn(async () => ({ orderId: "binance-limit-order", status: "ok" })),
    })),
  };
});

jest.mock("@/config/wallet", () => {
  return {
    WalletManager: {
      getInstance: jest.fn(() => ({
        getBalances: jest.fn(async () => [
          { currency: "USDT", balance: 3.84, usdValue: 3.84 },
          { currency: "BTC", balance: 0.001, usdValue: 50 },
        ]),
      })),
    },
  };
});

process.env.MASTER_TOKEN = "test-master-token";
process.env.ADMIN_TOKEN = "test-admin-token";

describe("QMOI /api/qi-trading route", () => {
  let GET: typeof import("../../../app/api/qi-trading/route").GET;
  let POST: typeof import("../../../app/api/qi-trading/route").POST;

  beforeAll(async () => {
    const route = await import("../../../app/api/qi-trading/route");
    GET = route.GET;
    POST = route.POST;
  });

  function buildRequest(body?: unknown, headers?: Record<string, string>) {
    return new Request("http://localhost/api/qi-trading", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  test("GET returns available route metadata", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject({
      success: true,
      route: "/api/qi-trading",
      status: "available",
    });
    expect(Array.isArray(data.supportedActions)).toBe(true);
  });

  test("POST quote action returns ticker data", async () => {
    const request = buildRequest({ action: "quote", platform: "bitget", symbol: "BTC/USDT" });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject({ success: true, action: "quote", platform: "bitget" });
    expect(data.quote).toBeDefined();
    expect(data.quote.symbol).toBe("BTCUSDT");
  });

  test("POST status action returns exchange balances and health", async () => {
    const request = buildRequest(
      { action: "status", platform: "bitget" },
      { Authorization: "Bearer test-master-token" },
    );
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.exchangeBalances)).toBe(true);
    expect(data.health).toBeDefined();
    expect(data.balanceVerification).toBeDefined();
    expect(data.balanceVerification.meetsExpected).toBe(true);
  });

  test("POST status action with missing auth returns unauthorized", async () => {
    const request = buildRequest({ action: "status", platform: "bitget" });
    const response = await POST(request);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  test("POST set_credentials action stores exchange credentials securely", async () => {
    const request = buildRequest(
      {
        action: "set_credentials",
        platform: "bitget",
        credentials: {
          apiKey: "new-bitget-key",
          apiSecret: "new-bitget-secret",
          passphrase: "new-passphrase",
          realTrading: false,
        },
      },
      { Authorization: "Bearer test-master-token" },
    );
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.configured).toBe(true);
    expect(data.credentials).toMatchObject({ apiKey: "*****", apiSecret: "*****", passphrase: "*****" });
  });

  test("POST clear_credentials action clears stored exchange credentials", async () => {
    const request = buildRequest(
      { action: "clear_credentials", platform: "bitget" },
      { Authorization: "Bearer test-master-token" },
    );
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.cleared).toBe(true);
  });

  test("POST balance action returns wallet balances and exchange balances", async () => {
    const request = buildRequest(
      { action: "balance", platform: "binance" },
      { Authorization: "Bearer test-master-token" },
    );
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.balances)).toBe(true);
    expect(Array.isArray(data.exchangeBalances)).toBe(true);
    expect(data.exchangeBalances.find((item: any) => item.platform === "binance")).toBeDefined();
  });

  test("POST health action returns platform health statuses", async () => {
    const request = buildRequest(
      { action: "health", platform: "bitget" },
      { Authorization: "Bearer test-master-token" },
    );
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.health)).toBe(true);
    expect(data.health.every((item: any) => typeof item.platform === "string")).toBe(true);
  });

  test("POST execute action rejects invalid quantity", async () => {
    const request = buildRequest(
      { action: "execute", platform: "bitget", symbol: "BTC/USDT", side: "buy", orderType: "market", quantity: 0 },
      { Authorization: "Bearer test-master-token" },
    );
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Invalid quantity");
  });

  test("POST execute action returns simulated order when real trading is disabled", async () => {
    const request = buildRequest(
      { action: "execute", platform: "binance", symbol: "BTC/USDT", side: "buy", orderType: "market", quantity: 0.0001, dryRun: true },
      { Authorization: "Bearer test-master-token" },
    );
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.order).toBeDefined();
    expect(data.order.simulated).toBe(true);
  });

  test("POST execute action rejects invalid quantity when authenticated", async () => {
    const request = buildRequest(
      { action: "execute", platform: "bitget", symbol: "BTC/USDT", side: "buy", orderType: "market", quantity: 0 },
      { Authorization: "Bearer test-master-token" },
    );
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Invalid quantity");
  });
});
