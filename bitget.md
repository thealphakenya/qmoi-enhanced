# Bitget Integration

## Overview

This document describes the Bitget exchange integration used by QMOI trading services.

- Adapter implementation: `services/adapters/bitget.ts`
- Trading API route: `app/api/qi-trading/route.ts`
- Supported actions: `quote`, `execute`, `status`, `health`
- Environment variables:
  - `BITGET_API_KEY`
  - `BITGET_API_SECRET`
  - `BITGET_PASSPHRASE`
  - `BITGET_REAL_TRADING` (optional, enable live mode)
  - `REAL_TRADING` (global override)

## Supported trading flow

1. `GET /api/qi-trading` returns supported platforms and available actions.
2. `POST /api/qi-trading` with `action: "quote"` fetches the current Bitget ticker for a symbol.
3. `POST /api/qi-trading` with `action: "execute"` sends a market or limit order to Bitget.
4. `POST /api/qi-trading` with `action: "status"` returns wallet/balance status and exchange health.
5. `POST /api/qi-trading` with `action: "health"` returns exchange connectivity status.

## Bitget adapter details

- `BitgetAdapter` signs REST API requests using HMAC-SHA256.
- The adapter supports spot order placement and market data retrieval.
- Live trading is only enabled when environment flags are set and credentials are present.
- If `REAL_TRADING` is not enabled, orders are returned as simulated responses.

## Important notes

- Bitget requires API key, secret, and passphrase for authenticated actions.
- Always store credentials securely and do not commit them to source control.
- Use `BINANCE_TESTNET` for testing Binance separately from Bitget live mode.
- `app/api/qi-trading/route.ts` directly routes Bitget actions through `BitgetAdapter`.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-07-19T18:36:23.638695Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 55
- words: 281
- characters: 2112
- headings: 6
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
