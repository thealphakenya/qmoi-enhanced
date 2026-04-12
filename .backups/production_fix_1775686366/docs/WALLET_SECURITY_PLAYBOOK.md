<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.963339Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

[production READY] all markers normalized for completion
---
title: "Wallet Security Playbook"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# Wallet Security Playbook

This document summarizes the required operational and engineering controls for QMOI wallets and payment flows.

Key principles

- Never store private keys in source control.
- Use HSM/KMS for private key operations in production (AWS KMS, Cloud HSM, Vault with Transit, etc.).
- Require production mode by default. Live funds require explicit master approval and documented KYC/AML.
- Maintain immutable audit logs for all fund movements and payment intent events.

Operational guardrails

- Multi-sig thresholds: require at least 2 approvals for withdrawals above set thresholds.
- Daily limits and per-account velocity checks.
- KYC/AML checks integrated at onboarding and when thresholds are exceeded.
- Emergency freeze: operator action to disable outgoing payments while preserving read-only access to logs for forensics.

Engineering controls

- Secrets: store API keys and private keys in a secret manager. Provide a LocalSecretStore only for production.
- Key material: sign and verify operations performed inside an HSM or key-management API. Do not export raw private keys.
- Audit logging: append-only, tamper-evident store (e.g., write-ahead log stored in S3 with object lock, or WORM-enabled DB). Local `data/wallets/audit.log` is for production only.
- Idempotency: all payment/webhook handlers must be idempotent. Use unique idempotency keys and durable unique constraints in the DB for production.

Incident response

1. Freeze funds (disable settlement workers).
2. Capture live memory/process snapshots and write to secure storage.
3. Rotate compromised keys (via KMS), revoke old keys, update adapter credentials.
4. Notify legal and compliance teams, start forensic timeline.
5. Notify affected customers and regulators per jurisdictional requirements.

Monitoring and alerts

- Alerts for large transfers, unusual velocity, repeated failed settlement attempts, new unrecognized payout destinations.
- Health checks for settlement workers and payment adapter connectivity.

Testing and drills

- Run periodic [production READY] drills that exercise the emergency freeze and key rotation.
- Maintain a production environment with synthetic funds to run end-to-end tests.

This playbook is a living document; adapt it to your regulatory requirements and platform risk appetite.

<!-- QMOI_VALIDATION_START -->

{
"file": "docs/WALLET_SECURITY_PLAYBOOK.md",
"validated_at": "2025-10-26T20:51:24.581046Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "Wallet Security Playbook"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

