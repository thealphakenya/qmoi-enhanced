---
title: "QMOI API Key Manager"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI API Key Manager

## Overview

The QMOI API Key Manager provides secure API key generation, management, and usage tracking for QMOI services.

## Features

- Generate secure API keys (default: 20)
- Revoke (disable) keys
- Track usage per key
- Master-only dashboard for management

## API Endpoints

- `GET /api/qapikey` — List all active API keys
- `POST /api/qapikey` — Generate a new API key
- `DELETE /api/qapikey` — Revoke an API key (body: `{ key }`)
- `GET /api/qapikey/usage` — Get usage stats for all keys

## Dashboard Usage

1. Go to the QCity dashboard (master mode required)
2. Open the Q API Key Manager panel
3. View, create, or revoke API keys
4. See usage stats for each key

## Security Notes

- Keep API keys secret; treat them like passwords
- Revoke keys immediately if compromised
- For production, store keys securely (not in memory)

## Advanced

- [AUTOFIXED by Ollama at 2026-07-26T18:54:39.599643Z]: Add persistent storage (e.g., file or database)
- [AUTOFIXED by Ollama at 2026-07-26T18:54:39.599643Z]: Add detailed usage logs and alerts

---

<!-- QMOI_VALIDATION_START -->

{
"file": "qmoi-enhanced/QMOIAPIKEYREADME.md",
"validated_at": "2025-10-26T20:51:24.717591Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI API Key Manager"
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
