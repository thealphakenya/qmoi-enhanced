import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QMoiKernelPanel from "./QMoiKernelPanel";
import { server } from "../../mocks/server";

// MSW setup is handled in src/setupTests.ts, but tests create a local server
// when possible to avoid relying on global ordering.
describe("QMoiKernelPanel Integration", () => {
  beforeAll(async () => {
    // Ensure global MSW is ready and register the canonical handlers used by these tests.
    await (globalThis as any).__MSW_READY__;
    let mswInstalled = false;
    const handlersMod = await import("../../mocks/handlers");
    if (typeof handlersMod.getHandlers === "function") {
      const handlers = await handlersMod.getHandlers();
      server.use(...handlers);
      mswInstalled = true;
    }
    // Ensure tests are deterministic even if MSW isn't intercepting for some reason.
    if (!mswInstalled) {
      jest
        .spyOn(global, "fetch" as any)
        .mockImplementation(async (input: any, init: any) => {
          const url = typeof input === "string" ? input : input?.url || "";
          if (url.endsWith("/api/qmoi/status")) {
            return new Response(
              JSON.stringify({
                status: "OK",
                last_check: "2024-06-01T12:00:00Z",
                mutation_count: 5,
                logs: ["Log 1", "Log 2"],
              }),
              { status: 200 }
            );
          }
          if (url.includes("/api/qmoi/payload")) {
            const u = new URL(url, "http://localhost");
            const action = u.searchParams.get("qfix")
              ? "QFix"
              : u.searchParams.get("qoptimize")
              ? "QOptimize"
              : u.searchParams.get("qsecure")
              ? "QSecure"
              : "Unknown";
            return new Response(JSON.stringify({ message: `${action} done` }), {
              status: 200,
            });
          }
          return Promise.reject(new Error("Unexpected fetch in test"));
        });
    }
  });

  afterEach(() => {
    // Keep MSW handlers installed for the whole suite (we install them in beforeAll).
    // Only clear mock call history between tests; do not restore mock implementations.
    jest.clearAllMocks();
  });

  afterAll(() => {
    try {
      if (localServer && typeof localServer.close === "function")
        localServer.close();
    } catch {
      // ignore
    }
    try {
      // Reset any runtime handlers and stop the server when the suite finishes
      server.resetHandlers();
      server.close();
    } catch {
      // ignore
    }
    // Restore any mocked globals now that the suite has finished
    jest.restoreAllMocks();
  });

  it("fetches and displays status from API", async () => {
    render(<QMoiKernelPanel isMaster={true} />);
    expect(await screen.findByText("OK")).toBeInTheDocument();
    expect(screen.getByText("Log 1")).toBeInTheDocument();
    expect(screen.getByText("Log 2")).toBeInTheDocument();
  });

  it("runs QFix and updates last action", async () => {
    render(<QMoiKernelPanel isMaster={true} />);
    await screen.findByText("OK");
    fireEvent.click(screen.getByRole("button", { name: /Run QFix/i }));
    await waitFor(() =>
      expect(screen.getByText(/Last Action:/)).toBeInTheDocument()
    );
    expect(screen.getByText("QFix done")).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    const msw = await import("msw");
    const helpers = (msw as any).http ?? (msw as any).rest;
    if (helpers) {
      server.use(
        helpers.get("/api/qmoi/status", (req: any, res: any, ctx: any) => {
          return res(ctx.status(500));
        })
      );
    } else {
      jest
        .spyOn(global, "fetch" as any)
        .mockImplementation(async (input: any) => {
          const url = typeof input === "string" ? input : input.url;
          if (url.endsWith("/api/qmoi/status")) {
            return new Response(null, { status: 500 });
          }
          return Promise.reject(new Error("Unexpected fetch in test"));
        });
    }
    render(<QMoiKernelPanel isMaster={true} />);
    await waitFor(() => expect(screen.getByText(/Error:/)).toBeInTheDocument());
  });
});
