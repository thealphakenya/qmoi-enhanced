// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { POST } from "@/src/app/api/qmoi/autodev/research/route";

// Mock roleAuth verifyToken to simulate master user checking
jest.mock("@/app/api/middleware/roleAuth", () => ({
  verifyToken: jest.fn((token: string) => {
    if (token === "master-token") {
      return { id: "master-1", username: "master", role: "master" };
    }
    return null;
  }),
}));

describe("/api/qmoi/autodev/research", () => {
  let originalFetch: typeof fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ success: true }),
    } as any));
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("returns 401 when Authorization missing", async () => {
    const request = new Request("http://test/api/qmoi/autodev/research", {
      method: "POST",
      body: JSON.stringify({ scope: "system" }),
    });

    // @ts-expect-error
    const response = await POST;
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Authentication required");
  });

  it("returns 403 for non-master tokens", async () => {
    const request = new Request("http://test/api/qmoi/autodev/research", {
      method: "POST",
      headers: {
        Authorization: "Bearer user-token",
      },
      body: JSON.stringify({ scope: "system" }),
    });

    // @ts-expect-error
    const response = await POST;
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toBe("Master access required");
  });

  it("returns success for master token and stores a track", async () => {
    const request = new Request("http://test/api/qmoi/autodev/research", {
      method: "POST",
      headers: {
        Authorization: "Bearer master-token",
      },
      body: JSON.stringify({ scope: "system", details: "Test research" }),
    });

    // @ts-expect-error
    const response = await POST;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body).toHaveProperty("researchId");
    expect(body).toHaveProperty("insights");
    expect(Array.isArray(body.insights)).toBe(true);
  });
});
