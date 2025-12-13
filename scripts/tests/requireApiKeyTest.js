#!/usr/bin/env node
import assert from "assert";

function requireApiKey(headers) {
  try {
    const authHeader = headers.get
      ? headers.get("authorization")
      : headers["authorization"];
    const apiKeyHeader = headers.get
      ? headers.get("x-api-key")
      : headers["x-api-key"];
    const masterToken = process.env.MASTER_TOKEN;
    if (process.env.NODE_ENV === "development") return { ok: true };
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (token === masterToken || token === process.env.API_KEY)
        return { ok: true };
    }
    if (apiKeyHeader === masterToken || apiKeyHeader === process.env.API_KEY)
      return { ok: true };
    return {
      ok: false,
      response: {
        body: { error: "Unauthorized - Invalid API key" },
        status: 401,
      },
    };
  } catch (err) {
    return {
      ok: false,
      response: { body: { error: "Authentication error" }, status: 500 },
    };
  }
}

class FakeHeaders {
  constructor(init = {}) {
    this.store = {};
    for (const k of Object.keys(init)) this.store[k.toLowerCase()] = init[k];
  }
  get(key) {
    return this.store[key.toLowerCase()] ?? null;
  }
}

(async function run() {
  console.log("Running requireApiKey smoke tests...");
  process.env.NODE_ENV = "development";
  let headers = new FakeHeaders();
  let res = requireApiKey(headers);
  assert(res.ok, "Development mode should allow requests");
  process.env.NODE_ENV = "production";
  process.env.MASTER_TOKEN = "master-123";
  headers = new FakeHeaders({ authorization: "Bearer master-123" });
  res = requireApiKey(headers);
  assert(res.ok, "MASTER_TOKEN via Authorization should be accepted");
  process.env.API_KEY = "api-456";
  headers = new FakeHeaders({ "x-api-key": "api-456" });
  res = requireApiKey(headers);
  assert(res.ok, "API_KEY via x-api-key should be accepted");
  headers = new FakeHeaders({ authorization: "Bearer wrong" });
  res = requireApiKey(headers);
  assert(
    !res.ok && res.response?.status === 401,
    "Invalid key should be rejected with 401"
  );
  console.log("All requireApiKey smoke tests passed.");
  process.exit(0);
})();
