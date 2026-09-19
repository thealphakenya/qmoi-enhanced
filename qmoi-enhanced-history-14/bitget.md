# Bitget credential guide

## Purpose
This file is the canonical reference for Bitget credentials, runtime aliases, and storage locations used by the QMOI autonomous agent and finance integrations.

## Credential storage locations
- Encrypted credential store: .qmoi_validation/credentials.enc
- Encryption key: .qmoi_validation/credential.key
- Runtime environment variables: .env, .env.production, or the GitHub Actions secret store

## Supported environment aliases
- BITGET_API_KEY
- BITGET_API_SECRET or BITGET_SECRET_KEY
- BITGET_API_PASSPHRASE or BITGET_PASSPHRASE
- BITGET_API_URL
- MASTER_TOKEN for master-authorized routes

## How the agent should use credentials
- Prefer the secure encrypted credential store when the runtime is local.
- Merge environment values into the encrypted store before any live validation or provisioning step.
- Never write raw secret values into markdown or logs.
- Validate with the credential validator before using the values for live trading or provisioning.

## Operational notes
- The autonomous agent must keep Bitget runtime integrations, manifests, and docs in sync whenever credentials or aliases change.
- Master authorization is required for live financial actions and sensitive wallet routes.
- If a credential is missing or invalid, the agent should flag it, record the issue, and refuse live provisioning until it is corrected.
