TESTS.md

## Overview

This document lists the automated tests in this repository, the features they exercise, and how to run them. It also documents expected behaviour for production-ready features referenced by tests (session/memory, accessibility settings, TTS/SSML, sync backends).

## Run tests

- JavaScript / Next.js tests (Jest):

  - Install: `npm install`
  - Run: `npm run test` or `npm run ci:full` for full build+tests

- Python tests (pytest):
  - Ensure dev requirements installed: `pip install -r requirements-dev.txt`
  - Run: `python -m pytest` or `python -m pytest tests/<specific>`

## High-level test areas and related features

1. API / HTTP

- Files: `tests/api/*`, `__tests__/qmoi-chat-api.test.ts`
- Features tested:
  - `/api/qmoi/chat` proxy returns OpenAI-like chat completion objects.
  - `/api/qmoi/memory` and `/api/qmoi/voice-preview` endpoints respond and honor model name `qmoi`.
- Production considerations:
  - Enforce `QMOI_API_BASE` and request timeouts.
  - Validate and sanitize incoming messages before forwarding to models.

2. Persona & helper server integration

- Files: `__tests__/*persona.integration*`, `scripts/qmoi_local_server.py` (helper)
- Features tested:
  - Persona detection (master/sister/user) and fallback behaviour.
  - Persistent local memory file (`qmoi_memory.json`) and optional SQLite backend.
  - Sync push/pull endpoints for backends (gist, hf, scp) using `QMOI_SYNC_BACKENDS` env var.
- Production considerations:
  - Protect sync endpoints with `QMOI_SYNC_API_KEY`.
  - Use atomic writes for memory persistence and optional Redis for scaling.

3. Memory & sync

- Files: `scripts/tests/test_memory_sync.py`, `tests/test_qmoi_memory.py`
- Features tested:
  - `push_memory_to_backends` and `pull_memory_from_backends` behaviour.
  - Merge strategy for remote memory (idempotent by timestamp keys).
- Production considerations:
  - Prefer Redis or managed DB for production memory with periodic durable backups.
  - Ensure credentials (GH token, HF token) come from env and are validated.

4. UI components & accessibility

- Files: `src/components/*`, integration UI tests
- Features tested:
  - `UISettings` persists user preferences (font size, colors, high contrast, reduce motion).
  - Keyboard shortcuts and global events (`qmoi:open-settings`, `qmoi:toggle-high-contrast`, `qmoi:toggle-reduce-motion`).
  - `FloatingAQ` floating ask widget and `ThemeProvider` behaviour.
- Production considerations:
  - `UISettings` is client-only and mounted dynamically to avoid SSR problems (done via `app/layout.tsx`).
  - Expose CSS custom properties for theming and accessibility.

5. Payments, webhooks and integrations

- Files: `payments/*`, `scripts/test_*` that exercise payments
- Features tested:
  - Stripe adapter error handling and webhook verification.
  - Provider stubs used in tests when third-party keys are absent.
- Production considerations:
  - Use real Stripe keys only in secure environments; tests should use stubs or test keys.
  - Validate and mask sensitive values in logs.

6. End-to-end and smoke tests

- Files: `tests/e2e/*`, `scripts/*comprehensive*`
- Features tested:
  - App build, static generation, and core UI routes.
  - Quick smoke checks using helper servers.
- Production considerations:
  - CI should run `npm run build` and server-side smoke tests in a reproducible environment.

## Notes on running tests reliably

- Pytest environment:
  - Some tests expect local directories (e.g., `logs/`) and environment variables. Ensure `logs/` exists and sensible env vars are set (`QMOI_BASE`, `QMOI_SYNC_BACKENDS`, tokens if testing sync`).
  - Use the provided `requirements-dev.txt`.
- Jest / Node:
  - The Next `app` layout dynamically imports client-only components; ensure `next build` succeeds before running some integration tests.

## Actionable checklist to reach green CI (recommended)

- Ensure `requirements-dev.txt` contains all Python test deps and install in CI image.
- Create the `logs/` directory before running pytest.
- Add a lightweight, well-tested `qmoi_local_server.py` helper that uses atomic writes and optional Redis.
- Protect sync endpoints with `QMOI_SYNC_API_KEY` and make tests use a test key.
- Keep client-only UI components dynamically imported (already wired in `app/layout.tsx`).

If you want, I can:

- Add a minimal, robust copy of `scripts/qmoi_local_server.py` (safe default helper) to reduce flaky integration failures.
- Run `npm run ci:full` and `pytest` in CI-like sequence and fix remaining issues until green.

---

Generated on: 2025-12-23
