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
- `/api/qi-trading` (app/api/qi-trading/route.ts)
- `/api/cashon` (app/api/cashon/route.ts)
- `/api/cashon/balance` (app/api/cashon/balance/route.ts)
- `/api/cashon/trading-status` (app/api/cashon/trading-status/route.ts)

#### POST

- `/configure-platforms` (api/qcity.ts)
- `/enable-features` (api/qcity.ts)
- `/monitor-resources` (api/qcity.ts)
- `/start` (api/qcity.ts)
- `/stop` (api/qcity.ts)
- `/api/qi-trading` (app/api/qi-trading/route.ts)
- `/api/cashon/deposit` (app/api/cashon/deposit/route.ts)
- `/api/cashon/start-trading` (app/api/cashon/start-trading/route.ts)
- `/api/cashon/stop-trading` (app/api/cashon/stop-trading/route.ts)


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
- `GET    /api/qi-trading` (app/api/qi-trading/route.ts)
- `POST   /api/qi-trading` (app/api/qi-trading/route.ts)
- `GET    /api/cashon` (app/api/cashon/route.ts)
- `GET    /api/cashon/balance` (app/api/cashon/balance/route.ts)
- `GET    /api/cashon/trading-status` (app/api/cashon/trading-status/route.ts)
- `POST   /api/cashon/deposit` (app/api/cashon/deposit/route.ts)
- `POST   /api/cashon/start-trading` (app/api/cashon/start-trading/route.ts)
- `POST   /api/cashon/stop-trading` (app/api/cashon/stop-trading/route.ts)

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

