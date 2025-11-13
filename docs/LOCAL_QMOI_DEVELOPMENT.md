Local QM OI Development Endpoint (DEV ONLY)

A lightweight local QM OI HTTP server is available for development and testing.

Location
- `scripts/qmoi_local_server.py`

Endpoints (default host: `http://localhost:8080`)
- `GET /health`  -> quick health check
- `GET /memory`  -> returns the persistent memory file `qmoi_memory.json`
- `POST /v1/chat/completions`  -> accepts OpenAI-like chat payload `{ "model":"qmoi", "messages": [...] }` and returns an OpenAI-style response.

Usage
- Start: `python3 scripts/qmoi_local_server.py &`
- Examples: see `CURLQMOIMASTERSISTERUSER.md` for example curl calls for user/master/sister personas.

Notes
- This server is a development helper only. For production, replace with a secured model backend, add authentication, and enforce rate limiting.
- Persistent memory is stored in `qmoi_memory.json` at the repository root.

Deployment / keep-alive
- To keep the local server running in `qvillage` use the supervisor script and systemd unit in `deploy/qvillage/` (see `deploy/README.md`). The supervisor forces `QMOI_MODEL=qmoi` by default.
- Protect `/sync/*` endpoints before exposing beyond localhost: set `QMOI_SYNC_API_KEY` and call sync endpoints with `Authorization: Bearer <key>`.
