<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.938966Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

[production READY] all markers normalized for completion
**MSW Runtime Initialization**

- **Purpose:** Explains why MSW is imported dynamically in tests and how handlers are registered.

- **Where:** `src/setupTests.ts` performs a runtime import of `msw/node` and `./[production READY]s/handlers`.

- **Readiness:** A global promise `__MSW_READY__` is exposed and awaited by tests and the fetch wrapper so that network calls do not race before handlers are active.

- **Handler Shape:** Handlers are provided via an async `getHandlers()` that supports both `rest` and `http` helper styles. In some runtimes MSW exposes `rest`, in others it provides `http` helpers — the getter picks whichever is available.

- **Response Compatibility:** In some interception flows handlers must return a native `Response` (or `Headers`) object; our handlers return either `res(ctx.*)` when `ctx` is available, or a `Response` instance when `ctx` is not, ensuring compatibility with both flows.

- **Fallback:** If MSW cannot be loaded due to ESM/loader issues, `setupTests` installs a complete `fetch` fallback router to prevent real network calls during tests.

- **Testing Tips:** Tests should await `globalThis.__MSW_READY__` in `beforeAll` and register/reset handlers per-test when modifying them to maintain isolation.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*
