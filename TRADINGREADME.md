# QMOI Trading README

## Overview

This document defines the live trading operational model for QMOI. It covers exchange integration, bot automation, wallet awareness, risk management, and the requirement that all trading operations remain evidence-backed and production-aware.

## Mission

QMOI trading features should move from static documentation and mock flows toward actual operational systems that can:

- monitor live markets and account state
- connect to provider APIs through secure adapters
- prioritize safety and risk thresholds
- maintain a bounded autonomy loop
- keep memory and telemetry synchronized
- avoid fake success claims without proof

## Supported trading intent

### Exchange support

- Binance adapter: spot/futures market data, wallet-read, paper-trading, and gated execution capabilities.
- Bitget adapter: spot/futures market data, wallet-read, paper-trading, and gated execution capabilities.
- CashOn adapter: wallet-read, transfer reconciliation, and paper-trading capabilities.
- Additional venues through `QMOI_ADDITIONAL_PLATFORMS`, discovered as sandbox-only generic adapters until a provider-specific adapter and credentials are verified.

Automatic platform discovery can register a configured venue and prepare its sandbox/readiness state without a human clicking through onboarding. It does not silently create accounts, bypass provider terms, invent credentials, or authorize real-money execution. Live enrollment remains blocked until provider credentials, account ownership, wallet health, risk checks, and `PRODUCTION_CONFIRMED=true` are independently verified.

### Device and permission capability contract

Trading readiness is reported consistently for Windows, macOS, Linux, iOS, Android, and web/PWA surfaces. Every adapter reports its supported capabilities and required permissions, including network access, secure secret storage, background execution where needed, and notifications for operational alerts. Device support is a capability report and validation target; it does not grant OS permissions automatically.

### Trade flow

1. Discover platform and account state.
2. Verify API and account health.
3. Run dry-run validation and risk checks.
4. Confirm funding and exposure limits.
5. Execute trade only after safety gates pass.
6. Record trade and balance telemetry.
7. Reconcile with wallet and financial manager state.

## Production controls

- `PRODUCTION_CONFIRMED=true` required for real execution.
- Dry-run validation before all real actions.
- Maximum drawdown, loss, position-size, and exposure thresholds.
- Exchange-specific restrictions and rate limits must be respected.
- All trades must be logged to a durable tracker or evidence artifact.

## Bot architecture

### Core bot responsibilities

- market retrieval and signal generation
- risk scoring and confidence gating
- order placement and monitoring
- balance reconciliation and profit tracking
- recovery on network or exchange failures
- memory and state persistence

### Trade quality gates

- liquidity check
- spread check
- available funds check
- confidence threshold check
- drawdown threshold check
- execution audit log

## UI and dashboard alignment

Trading features should remain aligned with the app and UI layers across the QMOI system:

- dashboard status and balance widgets
- wallet and account health views
- trade history and performance panels
- alert and risk signal panels
- platform connectivity status

## Historical design references

This live README is aligned with historical trading references in the repository snapshot, especially:

- qmoi-enhanced-history-14/TRADINGREADME.md
- qmoi-enhanced-history-14/QMOITRADER.md
- qmoi-enhanced-history-14/CASHONTRADINGREADME.md
- qmoi-enhanced-history-14/ALLWALLETSQVS.md
- qmoi-enhanced-history-14/QMOIMASKS.md
- qmoi-enhanced-history-14/QVS/ENHANCEDQVS.md

## Related files

- [FINANCIALMANAGER.md](FINANCIALMANAGER.md)
- [ALLMDFILESREFS.md](ALLMDFILESREFS.md)
- [ALLAUTO.md](ALLAUTO.md)
- [AUTODEV.md](AUTODEV.md)
- [MONITORING_GUIDE.md](MONITORING_GUIDE.md)
- [OLLAMA_AUTOMATION_GUIDE.md](OLLAMA_AUTOMATION_GUIDE.md)
- [API.md](API.md)
- [ENDPOINTS.md](ENDPOINTS.md)
- [ROUTES.md](ROUTES.md)

## Status

Trading operations model: active and under continuous production enhancement.
