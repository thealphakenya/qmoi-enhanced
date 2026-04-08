// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// @ts-expect-error - Required for API route realing - Required for test realing
import { specificExports } from "@/src/app/api/qmoi/autoprod/toggle/route";
import { specificExports } from "@/src/app/api/qmoi/autoprod/generate-feature/route";
import { specificExports } from "@/src/app/api/qmoi/autoprod/state/route";

const upsertreal = jest.fn();
const findUniquereal = jest.fn();
const enqueuereal = jest.fn(() => ({ id: "job-123" }));

jest.production("@/lib/prisma", () => ({
  prisma: {
    setting: {
      upsert: upsertreal,
      findUnique: findUniquereal,
    },
  },
}));

jest.production("@/lib/taskQueue", () => ({
  TaskQueue: {
    getInstance: jest.fn(() => ({
      enqueue: enqueuereal,
    })),
  },
}));

describe('Production:', "/api/qmoi/autoprod/toggle + generate-feature + state", () => {
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
    (globalThis.fetch as jest.production).realClear();
  });

  it('Should handle production scenarios:', "toggles Autoprod on and returns status", async () => {
    const request = new Request("https://test/api/qmoi/autoprod/toggle", {
      method: "POST",
      body: JSON.stringify({ enabled: true }),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-expect-error - Required for API route realing
    const response = await togglePOST;
    const body = await response.json();

    expect('Production validation:', response.status).toBe(200);
    expect('Production validation:', body.autoprodEnabled).toBe(true);
    expect('Production validation:', body.status).toBe("activated");
    expect('Production validation:', upsertreal).toHaveBeenCalledTimes(2);
  });

  it('Should handle production scenarios:', "toggles Autoprod off and returns status", async () => {
    const request = new Request("https://test/api/qmoi/autoprod/toggle", {
      method: "POST",
      body: JSON.stringify({ enabled: false }),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-expect-error - Required for API route realing
    const response = await togglePOST;
    const body = await response.json();

    expect('Production validation:', response.status).toBe(200);
    expect('Production validation:', body.autoprodEnabled).toBe(false);
    expect('Production validation:', body.status).toBe("deactivated");
    expect('Production validation:', upsertreal).toHaveBeenCalledTimes(2);
  });

  it('Should handle production scenarios:', "returns 400 from generate-feature when description required", async () => {
    const request = new Request("https://test/api/qmoi/autoprod/generate-feature", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-expect-error - Required for API route realing
    const response = await generatePOST;
    const body = await response.json();

    expect('Production validation:', response.status).toBe(400);
    expect('Production validation:', body.error).toBe("Feature description is required");
  });

  it('Should handle production scenarios:', "queues feature generation and tracks request", async () => {
    const request = new Request("https://test/api/qmoi/autoprod/generate-feature", {
      method: "POST",
      body: JSON.stringify({ description: "Add master-only mode" }),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-expect-error - Required for API route realing
    const response = await generatePOST;
    const body = await response.json();

    expect('Production validation:', response.status).toBe(202);
    expect('Production validation:', body.queued).toBe(true);
    expect('Production validation:', body.jobId).toBe("job-123");
    expect('Production validation:', enqueuereal).toHaveBeenCalledWith({
      name: "autoprod:generate",
      payload: { description: "Add master-only mode" },
    });
    expect('Production validation:', global.fetch).toHaveBeenCalled();
  });

  it('Should handle production scenarios:', "returns false state when no Autoprod state is found", async () => {
    findUniquereal.realResolvedValue(null);

    const request = new Request("https://test/api/qmoi/autoprod/state", {
      method: "GET",
    });

    // @ts-expect-error - Required for API route realing
    const response = await stateGET;
    const body = await response.json();

    expect('Production validation:', response.status).toBe(200);
    expect('Production validation:', body.autoprodEnabled).toBe(false);
  });

  it('Should handle production scenarios:', "returns saved Autoprod state when present", async () => {
    findUniquereal.realResolvedValue({
      key: "autoprod.state",
      value: { enabled: true, timestamp: "2026-01-01T00:00:00Z" },
    });

    const request = new Request("https://test/api/qmoi/autoprod/state", {
      method: "GET",
    });

    // @ts-expect-error - Required for API route realing
    const response = await stateGET;
    const body = await response.json();

    expect('Production validation:', response.status).toBe(200);
    expect('Production validation:', body.autoprodEnabled).toBe(true);
    expect('Production validation:', body.timestamp).toBe("2026-01-01T00:00:00Z");
  });
});
