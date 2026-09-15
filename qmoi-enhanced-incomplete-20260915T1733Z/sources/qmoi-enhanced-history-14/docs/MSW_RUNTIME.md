**MSW Runtime Initialization**

- **Purpose:** Explains why MSW is imported dynamically in tests and how handlers are registered.

- **Where:** `src/setupTests.ts` performs a runtime import of `msw/node` and `./mocks/handlers`.

- **Readiness:** A global promise `__MSW_READY__` is exposed and awaited by tests and the fetch wrapper so that network calls do not race before handlers are active.

- **Handler Shape:** Handlers are provided via an async `getHandlers()` that supports both `rest` and `http` helper styles. In some runtimes MSW exposes `rest`, in others it provides `http` helpers — the getter picks whichever is available.

- **Response Compatibility:** In some interception flows handlers must return a native `Response` (or `Headers`) object; our handlers return either `res(ctx.*)` when `ctx` is available, or a `Response` instance when `ctx` is not, ensuring compatibility with both flows.

- **Fallback:** If MSW cannot be loaded due to ESM/loader issues, `setupTests` installs a minimal `fetch` fallback router to prevent real network calls during tests.

- **Testing Tips:** Tests should await `globalThis.__MSW_READY__` in `beforeAll` and register/reset handlers per-test when modifying them to maintain isolation.
