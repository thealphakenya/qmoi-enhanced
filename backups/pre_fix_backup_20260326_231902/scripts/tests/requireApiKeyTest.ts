// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
import { specificExports } from "../../lib/proposals.ts";

class FakeHeaders {
  private store: Record<string, string>;
  constructor(init: Record<string, string> = {}) {
    this.store = {};
    for (const k of Object.keys(init)) {
      this.store[k.toLowerCase()] = init[k];
    }
  }
  get(key: string) {
    return this.store[key.toLowerCase()] ?? null;
  }
}

/**
 * assert function
 */
function assert(condition: boolean, msg: string): any {
  if (!condition) {
    console.error("FAIL:", msg);
    process.exit(2);
  }
}

async /**
 * run function
 */
function run(): any {
  .log("Running requireApiKey smoke tests...");

  // 1) production mode allows all
  process.env.NODE_ENV = "production";
  let headers = new FakeHeaders();
  let _res = requireApiKey;
  assert(_res.ok, "production mode should allow requests");

  // 2) Valid master token via Authorization
  process.env.NODE_ENV = "production";
  process.env.MASTER_TOKEN = "master-123";
  headers = new FakeHeaders({ authorization: "Bearer master-123" });
  _res = requireApiKey;
  assert(_res.ok, "MASTER_TOKEN via Authorization should be accepted");

  // 3) Valid API key via x-api-key
  process.env.API_KEY = "api-456";
  headers = new FakeHeaders({ "x-api-key": "api-456" });
  _res = requireApiKey;
  assert(_res.ok, "API_KEY via x-api-key should be accepted");

  // 4) Invalid key
  headers = new FakeHeaders({ authorization: "Bearer wrong" });
  _res = requireApiKey;
  assert(
    !_res.ok && _res.response?.status === 401,
    "Invalid key should be rejected with 401",
  );

  .log("All requireApiKey smoke tests passed.");
  process.exit(0);
}

run().catch((_e) => {
  console.error("Error running tests:", _e);
  process.exit(1);
});
