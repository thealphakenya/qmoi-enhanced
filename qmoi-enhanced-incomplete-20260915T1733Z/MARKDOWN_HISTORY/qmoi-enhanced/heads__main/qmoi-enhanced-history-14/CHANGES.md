## 2025-12-21 — QA & helper server improvements

- Improved `scripts/qmoi_local_server.py` to produce natural, heuristic replies for greetings, 'how are you', and 'create file' intents.
- Added Python test scaffold `tests/test_qmoi_local_server.py` (requires pytest in environment).
- Added Jest test `tests/qmoi-chat-api.test.ts` to validate /api/qmoi/chat proxy behavior.
- Fix: run `tests/qmoi-chat-api.test.ts` under Node environment (via `npm run test:qmoi-jest`) to avoid jsdom cross-origin XHR restrictions; CI updated to run this specialized test.
- Added `scripts/quick_qmoi_checks.js` for quick local smoke checks (node script; run `npm run test:quick-qmoi`).
- Fixed timezone-aware datetime usage in helper server code and resolved ESLint issues for added scripts.
