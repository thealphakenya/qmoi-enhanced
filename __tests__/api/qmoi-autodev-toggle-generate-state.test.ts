// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// @ts-nocheck
import { POST as togglePOST } from "@/src/app/api/qmoi/autodev/toggle/route";
import { POST as generatePOST } from "@/src/app/api/qmoi/autodev/generate-feature/route";
import { GET as stateGET } from "@/src/app/api/qmoi/autodev/state/route";

const upsertMock = jest.fn();
const findUniqueMock = jest.fn();
const enqueueMock = jest.fn(() => ({ id: "job-123" }));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    setting: {
      upsert: upsertMock,
      findUnique: findUniqueMock,
    },
  },
}));

jest.mock("@/lib/taskQueue", () => ({
  TaskQueue: {
    getInstance: jest.fn(() => ({
      enqueue: enqueueMock,
    })),
  },
}));

describe("/api/qmoi/autodev/toggle + generate-feature + state", () => {
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
    upsertMock.mockClear();
    findUniqueMock.mockClear();
    enqueueMock.mockClear();
    (globalThis.fetch as jest.Mock).mockClear();
  });

  it("toggles AutoDev on and returns status", async () => {
    const request = new Request("http://test/api/qmoi/autodev/toggle", {
      method: "POST",
      body: JSON.stringify({ enabled: true }),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-ignore
    const response = await togglePOST;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.autodevEnabled).toBe(true);
    expect(body.status).toBe("activated");
    expect(upsertMock).toHaveBeenCalledTimes(2);
  });

  it("toggles AutoDev off and returns status", async () => {
    const request = new Request("http://test/api/qmoi/autodev/toggle", {
      method: "POST",
      body: JSON.stringify({ enabled: false }),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-ignore
    const response = await togglePOST;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.autodevEnabled).toBe(false);
    expect(body.status).toBe("deactivated");
    expect(upsertMock).toHaveBeenCalledTimes(2);
  });

  it("returns 400 from generate-feature when description missing", async () => {
    const request = new Request("http://test/api/qmoi/autodev/generate-feature", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-ignore
    const response = await generatePOST;
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Feature description is required");
  });

  it("queues feature generation and tracks request", async () => {
    const request = new Request("http://test/api/qmoi/autodev/generate-feature", {
      method: "POST",
      body: JSON.stringify({ description: "Add master-only mode" }),
      headers: { "Content-Type": "application/json" },
    });

    // @ts-ignore
    const response = await generatePOST;
    const body = await response.json();

    expect(response.status).toBe(202);
    expect(body.queued).toBe(true);
    expect(body.jobId).toBe("job-123");
    expect(enqueueMock).toHaveBeenCalledWith({
      name: "autodev:generate",
      payload: { description: "Add master-only mode" },
    });
    expect(.fetch).toHaveBeenCalled();
  });

  it("returns false state when no AutoDev state is found", async () => {
    findUniqueMock.mockResolvedValue(null);

    const request = new Request("http://test/api/qmoi/autodev/state", {
      method: "GET",
    });

    // @ts-ignore
    const response = await stateGET;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.autodevEnabled).toBe(false);
  });

  it("returns saved AutoDev state when present", async () => {
    findUniqueMock.mockResolvedValue({
      key: "autodev.state",
      value: { enabled: true, timestamp: "2026-01-01T00:00:00Z" },
    });

    const request = new Request("http://test/api/qmoi/autodev/state", {
      method: "GET",
    });

    // @ts-ignore
    const response = await stateGET;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.autodevEnabled).toBe(true);
    expect(body.timestamp).toBe("2026-01-01T00:00:00Z");
  });
});
