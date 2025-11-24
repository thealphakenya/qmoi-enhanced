---
title: "Wallet Module Runbook"
qmoi_validation_frontmatter: true
---

# Wallet Module Runbook

This document describes the `src/wallet.ts` module and how to run tests locally.

Overview
- `src/wallet.ts` implements a WalletService with a pluggable adapter interface.
- Adapters:
  - `MockAdapter` — deterministic mock balances for testing.
  - `TestnetAdapter` — placeholder for real testnet SDK integrations; returns mock if no credentials.

State
- The service persists state to `.qmoi_state/wallets.json` by default. Tests use `.qmoi_state_test`.

How to run locally
1. Install dependencies (Node + npm required):

```bash
npm install
```

2. Run tests (Jest + ts-jest):

```bash
npm test
```

3. Run a quick script to list balances (example):

```bash
# create a tiny runner if needed; example using ts-node
npx ts-node -e "(async()=>{ const { WalletService, MockAdapter } = require('./src/wallet'); const s=new WalletService(); s.registerAdapter(new MockAdapter('demo')); console.log(await s.getAllBalances()); })()"
```

Security and production notes
- The TestnetAdapter will not use real funds unless properly implemented and credentials are provided.
- Do not store secrets in plaintext in the state file; use Vault or GitHub Secrets for production secrets.
- Add more adapters under `src/` for exchanges or custodians. Keep the mock-first behavior for safety.
