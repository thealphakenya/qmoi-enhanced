# QVS.md - QMOI Verification and Seed Contract

## Purpose

QVS is the verification layer for QMOI seed expansion, model evaluation, memory synchronization, masks, QVS state, links, wallets, Cashon, financial-manager workflows, and autonomous tracks.

## Portable Seed

`scripts/qmoi_seed.py` is a dependency-free bootstrap seed. Its file size is checked to remain below 5 MiB. It does not embed credentials or model weights. A trusted release supplies a hash-pinned payload and manifest; the seed verifies SHA-256, rejects unsafe archive traversal or absolute links, expands atomically, and reports the destination and entry count.

The seed is portable orchestration, not a claim that one binary can provide every platform runtime without platform-specific dependencies. Every expansion must pass platform, dependency, integrity, security, link, and health checks.

## Verification Domains

- Model-card and QMOI model documentation consistency
- Reproducible model comparison evidence
- Runtime provider selection and Ollama fallback health
- GitHub-hosted workflow and local keepalive status
- API, endpoint, route, port, link, and Markdown validation
- Tracking, memory, mask, QVS, parallel, trading, account, wallet, Cashon, and financial-manager evidence
- Source/ref/commit provenance across repositories and histories
- Production-readiness findings and tested replacement evidence

## Wallet and Provider Boundary

The local wallet contract is implemented by `scripts/qmoi_wallet_manager.py` and
persists balances and transaction history atomically beneath the runtime
`.qmoi_state` directory.
Credits and debits must use positive amounts; insufficient funds and invalid
amounts fail without writing a transaction. Regression coverage lives in
`tests/test_wallet_and_links.py`.

Cashon is the wallet workflow name used by QMOI, not proof of a live payment
account. PayPal, Pesapal, Cashon, or another provider may be connected only
through a separately approved adapter with credentials, webhook verification,
reconciliation, and compliance controls. Without that adapter, the local ledger
is the source of truth for development and must not be described as settled
external funds.

## Security and Resource Claims

QMOI cannot guarantee being unhackable, virus-proof, or having physically unlimited resources. Production QVS instead enforces least privilege, dependency and artifact hashes, secret redaction, sandboxed extraction, resource quotas, health thresholds, circuit breakers, backups, and explicit failure/recovery evidence.

## Realtime Availability

GitHub-hosted execution is authoritative for production proof. Local execution is a validation/keepalive surface. A successful state requires a current workflow result, runtime health, model/inference evidence, regression tests, link checks, checkpoint, and success contract.
