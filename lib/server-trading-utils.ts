// server-trading-utils.ts
import fs from "fs";
import path from "path";
import { SpotClient, FuturesClient } from "bitget-api"; // bitget-api v1.x
import { setTimeout as delay } from "timers/promises";

const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "trading.log");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function log(...args: any[]) {
  const line = `[${new Date().toISOString()}] ${args.map(String).join(" ") }\n`;
  fs.appendFileSync(LOG_FILE, line);
  // also output to console for dev
  console.log(...args);
}

/**
 * Environment flags:
 * BITGET_API_KEY, BITGET_API_SECRET, BITGET_API_PASSPHRASE
 * BITGET_USE_TESTNET (true/false)
 * LIVE_TRADING (true/false) - default false (dry-run)
 */
export function initBitgetClient({useFutures=false} = {}) {
  const key = process.env.BITGET_API_KEY;
  const secret = process.env.BITGET_API_SECRET;
  const pass = process.env.BITGET_API_PASSPHRASE;
  const useTestnet = (process.env.BITGET_USE_TESTNET || "true").toLowerCase() === "true";
  const live = (process.env.LIVE_TRADING || "false").toLowerCase() === "true";

  log("initBitgetClient", { useTestnet, live, useFutures });

  if (!key || !secret || !pass) {
    log("Bitget credentials not set. Client will operate in public (read-only) mode.");
    // return read-only client (no credentials) but SDK allows instantiation without keys
    if (useFutures) return new FuturesClient(); // public
    return new SpotClient();
  }

  const opts = {
    apiKey: key,
    apiSecret: secret,
    apiPass: pass,
    // request library options can be provided if needed
  };

  // if you want futures, pass to futures client
  if (useFutures) {
    const client = new FuturesClient(opts);
    if (useTestnet) {
      // FUTURES testnet base URL — bitget-api might expose env override via BITGETTRACE or other options.
      // Many SDKs default to production; set API host override if supported by the SDK.
      // If your SDK supports options for base URL, set them here. Otherwise set test credentials.
      log("NOTE: Ensure FUTURES testnet credentials / endpoint configured if using testnet.");
    }
    return client;
  }

  const client = new SpotClient(opts);
  if (useTestnet) {
    // Note: The SDK may default to production endpoints. The npm SDK docs mention testnet use — consult SDK docs
    log("NOTE: Ensure SPOT testnet credentials / endpoint configured if using testnet.");
  }
  return client;
}

/**
 * executeTradeWithScaling
 * - symbol (Bitget symbol string, e.g., "BTCUSDT_SPBL" or "BTCUSDT")
 * - side: 'buy' | 'sell'
 * - totalSize: number (base currency amount or quote depending on type)
 * - options:
 *    - slices: number (how many equally-sized orders to split into)
 *    - orderType: 'market' | 'limit'
 *    - price (for limit orders; if omitted, limit order will use current mid)
 *    - client: pre-init Bitget client (optional)
 *    - maxRetries, retryDelayMs, timeoutMs
 *
 * returns array of results { success, orderId?, attemptedSize, error? }
 */
export async function executeTradeWithScaling({
  symbol,
  side,
  totalSize,
  slices = 1,
  orderType = "market",
  price,
  client,
  maxRetries = 5,
  retryDelayMs = 1000
}: {
  symbol: string;
  side: "buy" | "sell";
  totalSize: number;
  slices?: number;
  orderType?: "market" | "limit";
  price?: number; // for limit orders
  client?: any;
  maxRetries?: number;
  retryDelayMs?: number;
}) {
  const live = (process.env.LIVE_TRADING || "false").toLowerCase() === "true";
  if (!client) client = initBitgetClient();

  const sliceSize = totalSize / Math.max(1, slices);
  const results: Array<any> = [];

  log(`executeTradeWithScaling start`, { symbol, side, totalSize, slices, orderType, live });

  for (let i = 0; i < slices; i++) {
    let attempt = 0;
    let success = false;
    let lastError: any = null;

    while (attempt < maxRetries && !success) {
      attempt++;
      try {
        log(`Placing slice ${i + 1}/${slices} attempt ${attempt}`, { sliceSize });

        if (!live) {
          // dry-run: simulate order placement
          const sim = {
            success: true,
            orderId: `SIM-${Date.now()}-${i}`,
            sliceSize,
            side,
            orderType,
            price: price ?? null,
            note: "dry-run"
          };
          log("DRY-RUN simulated order:", sim);
          results.push(sim);
          success = true;
          break;
        }

        // For spot: use client.placeOrder (check SDK docs for exact method naming)
        // The bitget-api SDK offers different clients; SpotClient place order call signature example:
        // client.placeOrder({ symbol, side, type, size, price, clientOid, ...})
        // We'll try to call a few common names based on SDK.
        const payload: any = {
          symbol,
          side: side.toUpperCase(), // bitget may accept upper-case
          type: orderType === "market" ? "market" : "limit",
        };

        // size vs quantity naming: SDK endpoints differ; try widely-used "size" and "quantity"
        if (orderType === "market") {
          // Some exchanges accept "size" in base units or amount in quote.
          payload.size = String(sliceSize);
        } else {
          payload.size = String(sliceSize);
          payload.price = String(price ?? payload.price);
        }

        // attempt placing using several candidate call names (SDK wrappers vary)
        let res: any = null;
        if (typeof client.placeOrder === "function") {
          // common wrapper
          res = await client.placeOrder(payload);
        } else if (typeof client.spotOrder === "function") {
          // alternative SDK naming
          res = await client.spotOrder(payload);
        } else if (typeof client.addOrder === "function") {
          res = await client.addOrder(payload);
        } else {
          throw new Error("Bitget client does not expose a recognized order method. Check SDK version.");
        }

        log("Order placed result:", res);
        results.push({ success: true, orderId: res?.orderId ?? res?.data?.orderId ?? null, raw: res });
        success = true;
        break;
      } catch (err) {
        lastError = err;
        log(`Order attempt ${attempt} failed for slice ${i + 1}:`, err?.message ?? err);
        // exponential backoff
        const backoff = retryDelayMs * Math.pow(2, attempt - 1);
        log(`Waiting ${backoff}ms before retrying slice ${i + 1}...`);
        await delay(backoff);
      }
    } // attempts loop

    if (!success) {
      const fail = { success: false, slice: i + 1, attemptedSize: sliceSize, error: lastError?.message ?? String(lastError) };
      results.push(fail);
      log("Giving up on slice", fail);
      // continue to next slice (or you may decide to abort entire operation by returning)
    }
  } // slices

  log(`executeTradeWithScaling finished for ${symbol}`, { resultsSummary: results.map(r => ({ success: r.success, orderId: r.orderId })) });
  return results;
}
