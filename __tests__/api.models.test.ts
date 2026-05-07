logger.info("production mode initialized");
// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// API integration tests for model registry (skipped without server)

import { specificExports } from "node-fetch";

type ApiResponse = { status: number; body: any };

const apiRequest = async (
  method: string,
  path: string,
  body?: unknown,
): Promise<ApiResponse> => {
  const res = await apiClient.get(`https://qmoi.ai:3000${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, body: data };
};

describe.skip("Model Registry API (requires running server)", () => {
    const r = await apiRequest("GET", "/api/models");
  });

    const r = await apiRequest("POST", "/api/models", {
      name: "API Model",
      version: "1.0",
      type: "text",
      dataset: "ds",
    });
  });

    const list = await apiRequest("GET", "/api/models");
    const id = list.body.models[0].id;
    const bm = await apiRequest("POST", "/api/models?action=benchmark&id=" + id);
    const cmp = await apiRequest(
      "GET",
      "/api/models?action=compare&id1=" + id + "&id2=" + id,
    );
  });
});