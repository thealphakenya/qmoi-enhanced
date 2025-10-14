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

- TODO: Add persistent storage (e.g., file or database)
- TODO: Add detailed usage logs and alerts

---
