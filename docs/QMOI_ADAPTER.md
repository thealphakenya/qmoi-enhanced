## QMOI Local Adapter (light)

This adapter is a minimal, dependency-free local service that lets Capilot or other dev chat UIs discover a "QMOI" model instance running locally in your Codespace or workspace.

Features
- Lightweight HTTP server using Python stdlib.
- Chat endpoint (/v1/chat) for deterministic local responses.
- Todos endpoints (/v1/todos) to store and manage TODO items the model can reference.
- Manifest discovery via `/manifest` and `qmoi-model-manifest.json` for local registration.

How to start

1. Register the manifest for local discovery:

```bash
./scripts/register_qmoi_local.sh
```

2. Start the adapter in background:

```bash
./scripts/start_qmoi_adapter.sh
```

3. Quick health check:

```bash
curl http://localhost:8765/health
```

Integrating with Capilot
- Add `.capilot/models/qmoi.json` to Capilot's local models folder or use the discovery endpoint `http://localhost:8765/manifest`.
- The manifest recommends low-bandwidth settings; ensure your Codespace applies the `.lion/config.json` limits.

Notes on safety
- The adapter stores TODOs and small artifacts under `qmoi-data/` in the workspace root. It does not write arbitrary repo files.
- The adapter uses no external network by default and is suitable for low-bandwidth Codespace usage.

Endpoints and gateway

- Adapter manifest: `http://localhost:8765/manifest` (raw manifest JSON)
- Adapter chat: `POST http://localhost:8765/v1/chat` {"input": "..."}
- Adapter todos: `GET/POST/PUT/DELETE http://localhost:8765/v1/todos`
- Memory service (persistent): `http://localhost:8766` (gateway aggregates this at `/v1/memory`)
- Progress tracker: `http://localhost:8767` (gateway aggregates at `/v1/progress`)
- Gateway (aggregated API for Capilot): `http://localhost:8770`
	- `GET /v1/models` — list available models and config
	- `GET /v1/memory` — read persistent memory
	- `POST /v1/sync` — checkpoint memory (creates `.qmoi/memory.checkpoint.*`)
	- `POST /v1/webhook/register` — register a webhook for events (stored in `.qmoi/webhooks.json`)
	- `GET /v1/snapshot` — workspace snapshot (lightweight project index)

Using the gateway from Capilot

- Configure Capilot discovery to point to `http://localhost:8770/v1/models` so QMOI appears in the model chooser.
- Use `POST http://localhost:8770/v1/chat` as the chat endpoint for a unified integration.

