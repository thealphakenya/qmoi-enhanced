# All API Endpoints

**Last Generated:** 2026-07-09T23:08:48.431197Z

Complete reference of all API endpoints organized by method and path.

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

## Local Ollama Endpoints (Free AI Agent)

These endpoints are available when Ollama is installed and running locally in your Codespace.

- `GET /api/tags` — Lists available Ollama models
- `POST /api/generate` — Generates a completion from `qwen2.5-coder:3b`
- `POST /api/chat` — Sends a chat-style request to Ollama

**Request example:**
```json
{
  "model": "qwen2.5-coder:3b",
  "prompt": "Write a hello world function in JavaScript",
  "stream": false
}
```

**Response example:**
```json
{
  "response": "function helloWorld() { console.log(\"Hello, world!\"); }",
  "done": true
}
```

## Related Documentation

- [API.md](API.md) - Main API documentation
- [ROUTES.md](ROUTES.md) - Application routes
- [WEBHOOKS.md](WEBHOOKS.md) - Webhooks and WebSocket endpoints

