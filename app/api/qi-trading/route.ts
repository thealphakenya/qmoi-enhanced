import { BitgetAdapter } from "@/services/adapters/bitget";
import { BinanceAdapter } from "@/services/adapters/binance";
import { WalletManager } from "@/config/wallet";
import { getSecretJson, setSecretJson } from "@/services/secrets/secretStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const env = typeof process !== "undefined" ? (process as any).env : {};
const REAL_TRADING =
  env.REAL_TRADING === "true" ||
  env.BITGET_REAL_TRADING === "true" ||
  env.BINANCE_REAL_TRADING === "true";
const AUTH_TOKENS = [env.MASTER_TOKEN, env.ADMIN_TOKEN].filter(Boolean) as string[];

const walletManager = WalletManager.getInstance();

const supportedActions = [
  "quote",
  "execute",
  "status",
  "balance",
  "health",
  "set_credentials",
  "clear_credentials",
] as const;
const supportedPlatforms = ["bitget", "binance"] as const;

type SupportedAction = (typeof supportedActions)[number];
type SupportedPlatform = (typeof supportedPlatforms)[number];

type ExchangeCredentials = {
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  testnet?: boolean;
  realTrading?: boolean;
};

const EXCHANGE_CREDENTIAL_KEYS: Record<SupportedPlatform, string> = {
  bitget: "exchange.bitget",
  binance: "exchange.binance",
};

function getBearerToken(request: Request): string | null {
  const auth = request.headers.get("authorization") || "";
  return auth.startsWith("Bearer ") ? auth.replace("Bearer ", "") : auth || null;
}

function isAuthorized(request: Request): boolean {
  const token = getBearerToken(request);
  return !!token && AUTH_TOKENS.includes(token);
}

function normalizeSymbol(symbol: string): string {
  return symbol.replace(/\//g, "").toUpperCase();
}

function isValidBitgetCredentials(creds: Partial<ExchangeCredentials> | null | undefined) {
  return !!creds?.apiKey && !!creds?.apiSecret && !!creds?.passphrase;
}

function isValidBinanceCredentials(creds: Partial<ExchangeCredentials> | null | undefined) {
  return !!creds?.apiKey && !!creds?.apiSecret;
}

async function loadExchangeCredentials(
  platform: SupportedPlatform,
): Promise<ExchangeCredentials | null> {
  const stored = await getSecretJson<ExchangeCredentials>(EXCHANGE_CREDENTIAL_KEYS[platform]);

  if (platform === "bitget") {
    const envCreds = {
      apiKey: env.BITGET_API_KEY || "",
      apiSecret: env.BITGET_API_SECRET || "",
      passphrase: env.BITGET_PASSPHRASE || "",
      realTrading: env.BITGET_REAL_TRADING === "true",
    };

    if (isValidBitgetCredentials(envCreds)) {
      if (!stored || JSON.stringify(stored) !== JSON.stringify(envCreds)) {
        await setSecretJson(EXCHANGE_CREDENTIAL_KEYS.bitget, envCreds);
      }
      return envCreds;
    }

    if (stored && isValidBitgetCredentials(stored)) {
      return stored;
    }
    return null;
  }

  const envCreds = {
    apiKey: env.BINANCE_API_KEY || "",
    apiSecret: env.BINANCE_API_SECRET || "",
    testnet: env.BINANCE_TESTNET === "true",
    realTrading: env.BINANCE_REAL_TRADING === "true",
  };

  if (isValidBinanceCredentials(envCreds)) {
    if (!stored || JSON.stringify(stored) !== JSON.stringify(envCreds)) {
      await setSecretJson(EXCHANGE_CREDENTIAL_KEYS.binance, envCreds);
    }
    return envCreds;
  }

  if (stored && isValidBinanceCredentials(stored)) {
    return stored;
  }

  return null;
}

async function persistExchangeCredentials(
  platform: SupportedPlatform,
  creds: ExchangeCredentials,
) {
  if (platform === "bitget" && !isValidBitgetCredentials(creds)) {
    throw new Error("Bitget credentials require apiKey, apiSecret, and passphrase");
  }
  if (platform === "binance" && !isValidBinanceCredentials(creds)) {
    throw new Error("Binance credentials require apiKey and apiSecret");
  }

  await setSecretJson(EXCHANGE_CREDENTIAL_KEYS[platform], creds);
}

async function clearPersistedExchangeCredentials(platform: SupportedPlatform) {
  await setSecretJson(EXCHANGE_CREDENTIAL_KEYS[platform], {});
}

async function getExchangeAdapter(platform: SupportedPlatform) {
  const creds = await loadExchangeCredentials(platform);
  if (!creds) {
    throw new Error(`${platform} credentials are not configured`);
  }

  return platform === "bitget"
    ? new BitgetAdapter({
        apiKey: creds.apiKey,
        apiSecret: creds.apiSecret,
        passphrase: creds.passphrase || "",
      })
    : new BinanceAdapter({
        apiKey: creds.apiKey,
        apiSecret: creds.apiSecret,
        testnet: creds.testnet === true,
      });
}

async function getPlatformHealth(platform: SupportedPlatform) {
  try {
    const creds = await loadExchangeCredentials(platform);
    const adapter = await getExchangeAdapter(platform);
    const healthy = await adapter.healthCheck();
    return {
      platform,
      healthy,
      configured:
        platform === "bitget"
          ? isValidBitgetCredentials(creds)
          : isValidBinanceCredentials(creds),
    };
  } catch (error) {
    const creds = await loadExchangeCredentials(platform);
    return {
      platform,
      healthy: false,
      configured:
        platform === "bitget"
          ? isValidBitgetCredentials(creds)
          : isValidBinanceCredentials(creds),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function getPlatformQuote(platform: SupportedPlatform, symbol: string) {
  const normalizedSymbol = normalizeSymbol(symbol);
  if (platform === "bitget") {
    const adapter = await getExchangeAdapter(platform) as BitgetAdapter;
    const ticker = await adapter.getTicker(normalizedSymbol);
    return {
      platform,
      symbol: normalizedSymbol,
      ticker,
    };
  }

  const adapter = await getExchangeAdapter(platform) as BinanceAdapter;
  const price = await adapter.getPrice(normalizedSymbol);
  return {
    platform,
    symbol: normalizedSymbol,
    price,
  };
}

function parseSymbolPair(symbol: string) {
  const normalized = symbol.replace(/\s+/g, "").toUpperCase();
  const parts = normalized.split(/[/_-]/).filter(Boolean);
  if (parts.length === 2) {
    return { base: parts[0], quote: parts[1] };
  }
  if (normalized.endsWith("USDT")) {
    return { base: normalized.slice(0, -4), quote: "USDT" };
  }
  if (normalized.endsWith("BTC")) {
    return { base: normalized.slice(0, -3), quote: "BTC" };
  }
  return { base: normalized.slice(0, 3), quote: normalized.slice(3) };
}

async function getPlatformPrice(platform: SupportedPlatform, symbol: string): Promise<number> {
  const normalizedSymbol = normalizeSymbol(symbol);
  if (platform === "bitget") {
    const adapter = await getExchangeAdapter(platform) as BitgetAdapter;
    const ticker = await adapter.getTicker(normalizedSymbol);
    const rawPrice =
      ticker?.data?.last ??
      ticker?.data?.lastPrice ??
      ticker?.data?.close ??
      ticker?.last ??
      ticker?.price ??
      ticker?.data?.last_price ??
      ticker?.data?.price;
    const price = Number(rawPrice);
    if (Number.isNaN(price)) {
      throw new Error("Unable to parse Bitget price from ticker response");
    }
    return price;
  }

  const adapter = await getExchangeAdapter(platform) as BinanceAdapter;
  return await adapter.getPrice(normalizedSymbol);
}

async function verifyOrderCapacity(
  platform: SupportedPlatform,
  symbol: string,
  side: "buy" | "sell",
  quantity: number,
  price?: number,
) {
  const normalizedSymbol = normalizeSymbol(symbol);
  const { base, quote } = parseSymbolPair(symbol);
  const adapter = await getExchangeAdapter(platform);
  const balances = await adapter.getBalances();
  const baseBalance = balances.get(base) ?? 0;
  const quoteBalance = balances.get(quote) ?? 0;
  const effectivePrice = price ?? (await getPlatformPrice(platform, normalizedSymbol));

  if (side === "buy") {
    const requiredQuote = effectivePrice * quantity * 1.02;
    if (quoteBalance < requiredQuote) {
      throw new Error(
        `Insufficient ${quote} balance for buy order: required ${requiredQuote.toFixed(8)}, available ${quoteBalance}`,
      );
    }
  } else {
    if (baseBalance < quantity) {
      throw new Error(
        `Insufficient ${base} balance for sell order: required ${quantity}, available ${baseBalance}`,
      );
    }
  }

  return {
    base,
    quote,
    baseBalance,
    quoteBalance,
    effectivePrice,
  };
}

async function getExchangeBalances(platform: SupportedPlatform) {
  const adapter = await getExchangeAdapter(platform);
  const balancesMap = await adapter.getBalances();
  const balances: Array<{ asset: string; available: number }> = [];
  let usdtBalance = 0;

  balancesMap.forEach((available, asset) => {
    const assetKey = String(asset).toUpperCase();
    const amount = Number(available);
    balances.push({ asset: assetKey, available: amount });
    if (assetKey === "USDT") {
      usdtBalance = amount;
    }
  });

  return {
    platform,
    balances,
    usdtBalance,
    timestamp: new Date().toISOString(),
    startingBalanceComparison:
      platform === "bitget"
        ? {
            expected: 3.84,
            actual: usdtBalance,
            difference: Number((usdtBalance - 3.84).toFixed(8)),
            meetsExpected: usdtBalance >= 3.84,
          }
        : undefined,
  };
}

async function executePlatformOrder(options: {
  platform: SupportedPlatform;
  symbol: string;
  side: "buy" | "sell";
  orderType: "market" | "limit";
  quantity: number;
  price?: number;
  dryRun?: boolean;
}) {
  const { platform, side, orderType, symbol, quantity, price, dryRun } = options;
  const normalizedSymbol = normalizeSymbol(symbol);
  const marketSide = platform === "binance" ? side.toUpperCase() : side;

  try {
    await verifyOrderCapacity(platform, normalizedSymbol, side, quantity, price);
  } catch (error) {
    if (!dryRun && REAL_TRADING) {
      throw error;
    }
  }

  if (dryRun || !REAL_TRADING) {
    return {
      platform,
      symbol: normalizedSymbol,
      side,
      orderType,
      quantity,
      price,
      simulated: true,
      message: REAL_TRADING
        ? "Dry-run execution requested"
        : "Real trading disabled; order simulation returned",
    };
  }

  if (platform === "bitget") {
    const adapter = await getExchangeAdapter(platform) as BitgetAdapter;
    if (orderType === "market") {
      return adapter.placeMarketOrder(
        normalizedSymbol,
        marketSide as "buy" | "sell",
        quantity.toString(),
      );
    }

    if (!price) {
      throw new Error("Limit orders require a price");
    }

    return adapter.placeLimitOrder(
      normalizedSymbol,
      marketSide as "buy" | "sell",
      quantity.toString(),
      price.toString(),
    );
  }

  const adapter = await getExchangeAdapter(platform) as BinanceAdapter;
  if (orderType === "market") {
    return adapter.placeMarketOrder({
      symbol: normalizedSymbol,
      side: marketSide as "BUY" | "SELL",
      type: "MARKET",
      quantity,
    });
  }

  if (!price) {
    throw new Error("Limit orders require a price");
  }

  return adapter.placeLimitOrder({
    symbol: normalizedSymbol,
    side: marketSide as "BUY" | "SELL",
    type: "LIMIT",
    quantity,
    price,
  });
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  return jsonResponse({
    success: true,
    route: "/api/qi-trading",
    status: "available",
    supportedActions,
    supportedPlatforms,
    message: "QMOI Quantum Intelligence trading endpoint is ready",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const action =
    typeof body.action === "string" && supportedActions.includes(body.action as SupportedAction)
      ? (body.action as SupportedAction)
      : "execute";
  const platform =
    typeof body.platform === "string" && supportedPlatforms.includes(body.platform as SupportedPlatform)
      ? (body.platform as SupportedPlatform)
      : "bitget";
  const symbol = String(body.symbol || "BTC/USDT");
  const side = body.side === "sell" ? "sell" : "buy";
  const orderType = body.orderType === "limit" ? "limit" : "market";
  const quantity = Number(body.quantity || 0);
  const price = body.price !== undefined ? Number(body.price) : undefined;
  const dryRun = body.dryRun === true;

  if (!supportedActions.includes(action)) {
    return jsonResponse(
      {
        success: false,
        error: `Unsupported action ${action}`,
        supportedActions,
      },
      400,
    );
  }

  if (action !== "quote" && !isAuthorized(req)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  try {
    if (action === "quote") {
      try {
        const quote = await getPlatformQuote(platform, symbol);
        return jsonResponse({
          success: true,
          action,
          route: "/api/qi-trading",
          platform,
          quote,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        return jsonResponse(
          {
            success: false,
            action,
            route: "/api/qi-trading",
            platform,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString(),
          },
          500,
        );
      }
    }

    if (action === "status") {
      const balances = await walletManager.getBalances();
      const exchangeBalances = await Promise.all(
        supportedPlatforms.map(async (candidate) => {
          try {
            return await getExchangeBalances(candidate);
          } catch (error) {
            return {
              platform: candidate,
              balances: [],
              usdtBalance: 0,
              timestamp: new Date().toISOString(),
              error: error instanceof Error ? error.message : String(error),
            };
          }
        }),
      );
      const bitgetExchange = exchangeBalances.find(
        (item) => item.platform === "bitget" && !("error" in item) && item.startingBalanceComparison,
      ) as
        | {
            platform: string;
            balances: { asset: string; available: number }[];
            usdtBalance: number;
            timestamp: string;
            startingBalanceComparison?: {
              expected: number;
              actual: number;
              difference: number;
              meetsExpected: boolean;
            };
          }
        | undefined;
      return jsonResponse({
        success: true,
        action,
        route: "/api/qi-trading",
        platform,
        balances,
        exchangeBalances,
        balanceVerification: bitgetExchange?.startingBalanceComparison,
        health: await Promise.all(supportedPlatforms.map((candidate) => getPlatformHealth(candidate))),
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "balance") {
      const balances = await walletManager.getBalances();
      const exchangeBalances = await Promise.all(
        supportedPlatforms.map(async (candidate) => {
          try {
            return await getExchangeBalances(candidate);
          } catch (error) {
            return {
              platform: candidate,
              balances: [],
              usdtBalance: 0,
              error: error instanceof Error ? error.message : String(error),
            };
          }
        }),
      );
      return jsonResponse({
        success: true,
        action,
        route: "/api/qi-trading",
        balances,
        exchangeBalances,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "health") {
      const health = await Promise.all(
        supportedPlatforms.map((candidate) => getPlatformHealth(candidate)),
      );
      return jsonResponse({
        success: true,
        action,
        route: "/api/qi-trading",
        health,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "set_credentials") {
      const credentials = body.credentials as Partial<ExchangeCredentials> | undefined;
      if (!credentials) {
        return jsonResponse(
          {
            success: false,
            error: "Missing credentials payload",
          },
          400,
        );
      }

      const credsToSave: ExchangeCredentials = {
        apiKey: String(credentials.apiKey || ""),
        apiSecret: String(credentials.apiSecret || ""),
        passphrase: credentials.passphrase ? String(credentials.passphrase) : undefined,
        testnet: credentials.testnet === true,
        realTrading: credentials.realTrading === true,
      };

      await persistExchangeCredentials(platform, credsToSave);
      const configured =
        platform === "bitget"
          ? isValidBitgetCredentials(credsToSave)
          : isValidBinanceCredentials(credsToSave);
      return jsonResponse({
        success: true,
        action,
        route: "/api/qi-trading",
        platform,
        configured,
        credentials: {
          apiKey: credsToSave.apiKey ? "*****" : "",
          apiSecret: credsToSave.apiSecret ? "*****" : "",
          passphrase: platform === "bitget" ? (credsToSave.passphrase ? "*****" : undefined) : undefined,
          testnet: credsToSave.testnet,
          realTrading: credsToSave.realTrading,
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "clear_credentials") {
      await clearPersistedExchangeCredentials(platform);
      return jsonResponse({
        success: true,
        action,
        route: "/api/qi-trading",
        platform,
        cleared: true,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "execute") {
      if (!quantity || quantity <= 0) {
        return jsonResponse(
          {
            success: false,
            error: "Invalid quantity",
          },
          400,
        );
      }

      const orderResult = await executePlatformOrder({
        platform,
        symbol,
        side,
        orderType,
        quantity,
        price,
        dryRun,
      });

      return jsonResponse({
        success: true,
        action,
        route: "/api/qi-trading",
        platform,
        order: {
          symbol: normalizeSymbol(symbol),
          side,
          orderType,
          quantity,
          price,
          simulated: dryRun || !REAL_TRADING,
          result: orderResult,
        },
        realTrading: REAL_TRADING,
        timestamp: new Date().toISOString(),
      });
    }

    return jsonResponse(
      {
        success: false,
        error: "Unhandled trading action",
      },
      400,
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        route: "/api/qi-trading",
        action,
        platform,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
}
