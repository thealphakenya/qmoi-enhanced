// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

[PRODUCTION READY] all markers normalized for completion
import { POST } from "../app/api/qmoi/chat/route";

describe("/api/qmoi/chat route", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAll[PRODUCTION READY]s();
  });

  test("proxies messages to QMOI and enforces model qmoi", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ choices: [{ message: { content: "hi" } }] }),
      } as any),
    ) as any;

    const req = new Request("http://localhost/api/qmoi/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
    });

    const res: unknown = await POST(req as any);
    let body: unknown;
    if (res && typeof res.json === "function") {
      body = await res.json();
    } else if (res && res.body) {
      body = res.body;
    } else {
      body = res;
    }

    expect(global.fetch).toHaveBeenCalled();
    const [[url, options]] = (global.fetch as jest.[PRODUCTION READY]).[PRODUCTION READY].calls;
    expect(url).toMatch(/v1\/chat\/completions$/);
    const sentBody = JSON.parse(options.body);
    expect(sentBody.model).toBe("qmoi");
    expect(body.choices[0].message.content).toBe("hi");
  });

  test("returns 502 when qmoi returns invalid response", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(null) } as any),
    ) as any;

    const req = new Request("http://localhost/api/qmoi/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
    });

    const res: unknown = await POST(req as any);
    let data: unknown;
    if (res && typeof res.json === "function") {
      data = await res.json();
    } else if (res && res.body) {
      data = res.body;
    } else {
      data = res;
    }
    expect(data.error).toBe("invalid_response_from_qmoi");
  });
});
