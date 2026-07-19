# Binance Integration

## Overview

This document describes the Binance exchange integration used by QMOI trading services.

- Adapter implementation: `services/adapters/binance.ts`
- Trading API route: `app/api/qi-trading/route.ts`
- Supported actions: `quote`, `execute`, `status`, `health`
- Environment variables:
  - `BINANCE_API_KEY`
  - `BINANCE_API_SECRET`
  - `BINANCE_TESTNET` (optional, set to `true` to use Binance testnet)
  - `BINANCE_REAL_TRADING` (optional, enable live mode)
  - `REAL_TRADING` (global override)

## Supported trading flow

1. `GET /api/qi-trading` returns supported platforms and available actions.
2. `POST /api/qi-trading` with `action: "quote"` fetches the current Binance ticker price for a symbol.
3. `POST /api/qi-trading` with `action: "execute"` sends a market or limit order to Binance.
4. `POST /api/qi-trading` with `action: "status"` returns wallet/balance status and exchange health.
5. `POST /api/qi-trading` with `action: "health"` returns exchange connectivity status.

## Binance adapter details

- `BinanceAdapter` generates Binance API signatures and sends authenticated REST requests.
- It supports market and limit order placement and query endpoints.
- When `BINANCE_TESTNET=true`, the adapter switches to Binance testnet.
- If live trading is disabled, the route returns simulated order executions.

## Important notes

- Binance market and limit orders are routed through `app/api/qi-trading/route.ts`.
- Proper API permissions are required for order placement and account data.
- Keep Binance credentials in environment variables and secrets only.
- Use testnet mode for development before enabling live trading.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:23.637333Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 55
- words: 286
- characters: 2153
- headings: 6
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
