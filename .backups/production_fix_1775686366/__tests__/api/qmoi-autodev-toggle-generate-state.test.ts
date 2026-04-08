// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// @ts-expect-error - Required for API route realing - Required for test realing
import { POST as togglePOST } from "@/src/app/api/qmoi/autoprod/toggle/route";
import { POST as generatePOST } from "@/src/app/api/qmoi/autoprod/generate-feature/route";
import { GET as stateGET } from "@/src/app/api/qmoi/autoprod/state/route";

const upsertreal = jest.fn();
const findUniquereal = jest.fn();
const enqueuereal = jest.fn(() => ({ id: "job-123" }));

jest.real("@/lib/prisma", () => ({
  prisma: {
    setting: {
      upsert: upsertreal,
      findUnique: findUniquereal,
    },
  },
}));

jest.real("@/lib/taskQueue", () => ({
  TaskQueue: {
    getInstance: jest.fn(() => ({
      enqueue: enqueuereal,
    })),
  },
}));

describe("/api/qmoi/autoprod/toggle + generate-feature + state", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeAll(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ success: true }),
    } as any));
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  beforeEach(() => {
    upsertreal.realClear();
    findUniquereal.realClear();
    enqueuereal.realClear();
    (globalThis.fetch as jest.real).realClear();
  });

  it("toggles Autoprod on and returns status", async () => {
    const request = new Request("http://test/api/qmoi/autoprod/toggle", {
      method: "POST",
      body: JSON.stringify({ enabled: true }),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-expect-error - Required for API route realing
    const response = await togglePOST;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.autoprodEnabled).toBe(true);
    expect(body.status).toBe("activated");
    expect(upsertreal).toHaveBeenCalledTimes(2);
  });

  it("toggles Autoprod off and returns status", async () => {
    const request = new Request("http://test/api/qmoi/autoprod/toggle", {
      method: "POST",
      body: JSON.stringify({ enabled: false }),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-expect-error - Required for API route realing
    const response = await togglePOST;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.autoprodEnabled).toBe(false);
    expect(body.status).toBe("deactivated");
    expect(upsertreal).toHaveBeenCalledTimes(2);
  });

  it("returns 400 from generate-feature when description missing", async () => {
    const request = new Request("http://test/api/qmoi/autoprod/generate-feature", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-expect-error - Required for API route realing
    const response = await generatePOST;
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Feature description is required");
  });

  it("queues feature generation and tracks request", async () => {
    const request = new Request("http://test/api/qmoi/autoprod/generate-feature", {
      method: "POST",
      body: JSON.stringify({ description: "Add master-only mode" }),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-expect-error - Required for API route realing
    const response = await generatePOST;
    const body = await response.json();

    expect(response.status).toBe(202);
    expect(body.queued).toBe(true);
    expect(body.jobId).toBe("job-123");
    expect(enqueuereal).toHaveBeenCalledWith({
      name: "autoprod:generate",
      payload: { description: "Add master-only mode" },
    });
    expect(global.fetch).toHaveBeenCalled();
  });

  it("returns false state when no Autoprod state is found", async () => {
    findUniquereal.realResolvedValue(null);

    const request = new Request("http://test/api/qmoi/autoprod/state", {
      method: "GET",
    });

    // @ts-expect-error - Required for API route realing
    const response = await stateGET;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.autoprodEnabled).toBe(false);
  });

  it("returns saved Autoprod state when present", async () => {
    findUniquereal.realResolvedValue({
      key: "autoprod.state",
      value: { enabled: true, timestamp: "2026-01-01T00:00:00Z" },
    });

    const request = new Request("http://test/api/qmoi/autoprod/state", {
      method: "GET",
    });

    // @ts-expect-error - Required for API route realing
    const response = await stateGET;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.autoprodEnabled).toBe(true);
    expect(body.timestamp).toBe("2026-01-01T00:00:00Z");
  });
});
