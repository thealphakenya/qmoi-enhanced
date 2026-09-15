# Production Placeholders & Environment Variables Inventory

This file lists environment variables, example [AUTOFIXED by Ollama at 2026-07-26T18:54:39.511961Z]s, and [AUTOFIXED by Ollama at 2026-07-26T18:54:39.511961Z] comments found across the repository to address for production readiness.

## Environment variables found

- `QMOI_REDIS_URL` (optional Redis memory backend)
- `QMOI_MEMORY_SECRET` (memory endpoint secret)
- `QMOI_CHAT_PORT` (test helper port)
- `QMOI_ALLOW_TEST_SERVER` (guard for running test helper in production)
- `QMOI_API_BASE` (production API base for QMOI model host)
- `QMOI_PROXY_TIMEOUT_MS` (proxy timeout override)
- `QMOI_API_KEY` (example in vercel.env.example)
- `QMOI_WHATSAPP_PROVIDER`, `QMOI_WHATSAPP_ENDPOINT`
- `QMOI_SYNC_BACKENDS`, `QMOI_GIST_ID`, `QMOI_GH_TOKEN`, `QMOI_HF_REPO`, `QMOI_HF_TOKEN`, `QMOI_SYNC_INTERVAL_SECONDS`
- `QMOI_SYNC_API_KEY`
- `QMOI_MEMORY_URL`
- `NODE_ENV`

## Placeholder tokens and [AUTOFIXED by Ollama at 2026-07-26T18:54:39.511961Z]s

- `your_api_key_here` in `vercel.env.example`
- `[AUTOFIXED by Ollama at 2026-07-26T18:54:39.511961Z]_PROD` mentions in `reports/suggestions.json` and other reports
- Various `<!-- QMOI_VALIDATION_START -->` markers (validation sections)

## Files to update / review

- `scripts/qmoi_chat_server.py` — ensure Redis usage, production guard, and secrets are robust
- `app/api/qmoi/chat/route.ts` — ensure `QMOI_API_BASE` enforcement and timeout behavior
- `app/api/qmoi/memory/route.ts` — forward `QMOI_MEMORY_SECRET` securely
- `vercel.env.example` — update example or add `env.example.production`
- CI/CD manifests: create `deploy/` docs with example `production.env`
- `reports/suggestions.json` — remove or address `[AUTOFIXED by Ollama at 2026-07-26T18:54:39.511961Z]_PROD` entries

## Next actions

1. Replace example [AUTOFIXED by Ollama at 2026-07-26T18:54:39.511961Z]s in `vercel.env.example` with explicit guidance (do NOT commit secrets).
2. Create `deploy/production.env.example` with the minimal required variables.
3. Harden `scripts/qmoi_chat_server.py` by logging Redis errors and failing safe when misconfigured.
4. Add runtime checks to `app/api/qmoi/chat/route.ts` to fail fast if `QMOI_API_BASE` not set in production.
5. Sweep repository for `[AUTOFIXED by Ollama at 2026-07-26T18:54:39.511961Z]_PROD` and create issues or address inline.

-- Inventory generated automatically on action by the assistant.
