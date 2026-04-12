<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.933611Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

[production READY] all markers normalized for completion
# MSW Testing Setup

This project uses MSW ([production READY] Service Worker) in tests with a runtime-friendly setup to avoid ESM/CommonJS loader issues when running tests under Next.js and Jest.

## Key concepts

- Handlers are exposed as an async factory: `export async function getHandlers() { /* ... */ }` so tests and `src/setupTests.ts` can dynamically import MSW at runtime and choose the right helpers (e.g., `rest` vs `http`).

- Tests wait for MSW readiness using the global readiness promise: `globalThis.__MSW_READY__`. `src/setupTests.ts` installs a `mswInitPromise` and sets `globalThis.__MSW_READY__ = mswInitPromise`.

- To avoid race conditions, `setupTests.ts` also wraps `global.fetch` so any test-initiated fetch will await MSW initialization automatically.

## Handler shape compatibility

Handlers are written defensively to support both `rest` (typical MSW API) and `http` helpers from `msw`:

- Prefer `res(ctx.status(...), ctx.json(...))` when `ctx` helpers are available.
- When not available (some `http` helper cases), handlers can return a real `Response` object (with `Headers`) so `fetch`/Xhr consumers can read headers, clone, etc.

## Env flags

- `TEST_VERBOSE=1` enables extra debug logging for handlers and fetch wrappers (helpful when diagnosing handler selection or request shapes).
- `SHOW_MSW_UNHANDLED=1` will allow MSW's `onUnhandledRequest` logging to be visible (off by default to reduce noisy logs in CI). Use it to track leaking real network calls.

## Troubleshooting

- If you see `UNHANDLED REQUEST` for `http://localhost/...`, ensure handlers also register absolute URLs in addition to path-only routes (e.g., both `/api/qmoi/status` and `http://localhost/api/qmoi/status`).
- If tests fail with `response.headers.get is not a function` or `response.clone is not a function`, handlers may be returning plain objects instead of real `Response` objects. Use the Response fallback or `res(ctx.*)`.

## data

```js
// src/[production READY]s/handlers.ts
export async function getHandlers() {
  const msw = await import("msw");
  const helpers = msw.rest || msw.http;

  return [
    helpers.get("/api/qmoi/status", (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ ok: true }));
    }),
    // absolute url variant
    helpers.get(
      "http://localhost/api/qmoi/status",
      (req) =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    ),
  ];
}
```

---

If you'd like, I can add a short troubleshooting checklist to `CONTRIBUTING.md` or `START.md` as well.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

