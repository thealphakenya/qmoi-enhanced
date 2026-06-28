# All API Endpoints

**Last Generated:** 2026-06-28T19:35:57.913827Z

Complete reference of all API endpoints organized by method and path.

## 🤖 Local Ollama AI Endpoints (Free Agent)

**Base URL:** `http://localhost:11434`

### GET Endpoints

- `GET /api/tags` - List all available AI models and metadata
- `GET /api/models` - Get model information

### POST Endpoints

- `POST /api/generate` - Generate text completions from a prompt
  - Parameters: `model`, `prompt`, `stream`, `temperature`, `top_p`
  - Returns: Generated text with timing metrics

- `POST /api/chat` - Chat interface (OpenAI-compatible format)
  - Parameters: `model`, `messages` (array of role/content), `stream`
  - Returns: Assistant response with metadata

- `POST /api/embed` - Generate embeddings for text
  - Parameters: `model`, `input`
  - Returns: Vector embeddings

### Summary

| Method | Endpoint | Purpose | Production |
|--------|----------|---------|------------|
| GET | `/api/tags` | List models | ✅ |
| POST | `/api/generate` | Generate completions | ✅ |
| POST | `/api/chat` | Chat completions | ✅ |
| POST | `/api/embed` | Text embeddings | ✅ |

**Status:** Running on localhost:11434 (persistent, unlimited, free)

---

## REST Endpoints

### By HTTP Method


#### GET

- `/config` (api/qcity.ts)
- `/logs` (api/qcity.ts)
- `/notifications` (api/qcity.ts)
- `/resources` (api/qcity.ts)
- `/status` (api/qcity.ts)
- `/tasks` (api/qcity.ts)
- `/workspace-logs` (api/qcity.ts)
- `/workspaces` (api/qcity.ts)

#### POST

- `/configure-platforms` (api/qcity.ts)
- `/enable-features` (api/qcity.ts)
- `/monitor-resources` (api/qcity.ts)
- `/start` (api/qcity.ts)
- `/stop` (api/qcity.ts)


### By Path

- `GET    /config` (api/qcity.ts)
- `POST   /configure-platforms` (api/qcity.ts)
- `POST   /enable-features` (api/qcity.ts)
- `GET    /logs` (api/qcity.ts)
- `POST   /monitor-resources` (api/qcity.ts)
- `GET    /notifications` (api/qcity.ts)
- `GET    /resources` (api/qcity.ts)
- `POST   /start` (api/qcity.ts)
- `GET    /status` (api/qcity.ts)
- `POST   /stop` (api/qcity.ts)
- `GET    /tasks` (api/qcity.ts)
- `GET    /workspace-logs` (api/qcity.ts)
- `GET    /workspaces` (api/qcity.ts)


## Related Documentation

- [API.md](API.md) - Main API documentation
- [ROUTES.md](ROUTES.md) - Application routes
- [WEBHOOKS.md](WEBHOOKS.md) - Webhooks and WebSocket endpoints


<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-28T19:36:37.393440Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 54
- words: 144
- characters: 1292
- headings: 7
- links: 3
- images: 0
- tables: 0
- lion validation block: inserted
<!-- LION_VALIDATION_END -->
