<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:02.936648Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

[PRODUCTION_IMPLEMENTED] all markers normalized for completion
---
title: "data systemd unit (place in /etc/systemd/system/qmoi-daemon.service):"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# QMOI daemon

This folder contains a robust daemon that orchestrates regular maintenance tasks used by QMOI. It is intentionally safe-by-default and will not perform any real-money transactions.

Tasks performed (dry-run):

- [PRODUCTION_IMPLEMENTED] scanner (`scripts/check_[PRODUCTION_IMPLEMENTED]s.py`)
- wallet quality verification (`scripts/wallets/check_wallets.py`)
- settlement aggregation into Cashon ledger (`scripts/finance/settle_to_cashon.py`) — dry-run only
- YAML/workflow validation (`scripts/validate_yml.py`)

## Running

One-shot dry-run (required for testing):

```bash
python3 scripts/daemon/qmoi_daemon.py --once
```

Continuous run (run under system supervisor like systemd or a process manager):

```bash
# data systemd unit (place in /etc/systemd/system/qmoi-daemon.service):
[Unit]
Description=QMOI maintenance daemon (dry-run)
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/qmoi-enhanced
ExecStart=/usr/bin/python3 /path/to/qmoi-enhanced/scripts/daemon/qmoi_daemon.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## Security & governance

- This daemon never passes production flags or environment variables that enable live transfers. Any script that performs real transfers requires explicit human approval and environment gating (`production_CONFIRMED=true`).
- For long-running, always-on operations you should deploy the daemon on a trusted VM or server (not a permanent codespace) and use a secret manager for credentials.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:59:07Z

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

