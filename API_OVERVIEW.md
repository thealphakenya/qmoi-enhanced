# API Overview & Inventory (Draft)

Purpose: a human-friendly inventory to help update `API.md`. This file is a working draft and should be used to generate a complete `API.md` with programmatic scanning.

## How to use this doc

- Run a quick grep across the repo for Flask/FastAPI/Express/Koa route decorators and files under `api/`, `server/`, `routes/`, or `src/`.
- Populate `API.md` with the endpoints found and example usage.

## Suggested programmatic extractor (pseudo-steps)

1. Search for patterns: `@app.route`, `@router.get`, `app.post(`, `router.post(`, `express.Router()`, `app.get(`
2. For each match, capture file path, function name, path string, HTTP methods, and docstring if present.
3. Produce `API.md` sections grouped by service (auth, models, qvillage, storage, utils).

## Known endpoints (seed list)

- Web UI / Dashboard
  - `GET /` — main dashboard (scripts/qmoi_dashboard.py)

- Model & Inference
  - `/generate` — generate text (discover implementation path)
  - `/embed` — create embeddings
  - `/classify` — classification endpoint

- Management
  - `/upload_model` — upload or register a model
  - `/evaluate` — run evaluation on a model
  - `/deploy` — prepare and deploy a model

- Search & Retrieval
  - `/search_docs` — search docs
  - `/retrieve` — retrieve vector db passages

- Utilities
  - `/healthz` — health check
  - `/metrics` — Prometheus metrics endpoint

## Next steps to build `API.md`

- Run the programmatic extractor and write the full `API.md` with examples and authentication notes.
- Optionally add a small script `tools/generate_api_md.py` to auto-generate `API.md` from the codebase.

---

This is a starter file to help you build a comprehensive `API.md` as requested.
