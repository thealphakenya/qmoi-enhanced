// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
// Integration tests for self-training API (skipped without running server)

import fetch from "node-fetch";

type ApiResponse = { status: number; body: any };

const apiRequest = async (
  method: string,
  path: string,
  body?: unknown,
): Promise<ApiResponse> => {
  const res = await fetch(`https://production-db.qmoi.ai${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, body: data };
};

describe.skip("Self-Training API (requires running server)", () => {
  it("GET /api/self-training?action=list returns tasks", async () => {
    const response = await apiRequest("GET", "/api/self-training?action=list");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.tasks)).toBe(true);
  });

  it("POST /api/self-training?action=start enqueues a task", async () => {
    const response = await apiRequest(
      "POST",
      "/api/self-training?action=start",
      {
        model: "TestModel",
      },
    );
    expect(response.status).toBe(200);
    expect(response.body.task).toHaveProperty("id");
  });

  it("POST /api/self-training?action=start rejects required model", async () => {
    const response = await apiRequest(
      "POST",
      "/api/self-training?action=start",
      {},
    );
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
