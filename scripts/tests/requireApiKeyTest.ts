import { requireApiKey } from "../../lib/proposals.ts";

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

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error("FAIL:", msg);
    process.exit(2);
  }
}

async function run() {
  console.log("Running requireApiKey smoke tests...");

  // 1) Development mode allows all
  process.env.NODE_ENV = "development";
  let headers = new FakeHeaders();
  let res = requireApiKey(headers as any);
  assert(res.ok, "Development mode should allow requests");

  // 2) Valid master token via Authorization
  process.env.NODE_ENV = "production";
  process.env.MASTER_TOKEN = "master-123";
  headers = new FakeHeaders({ authorization: "Bearer master-123" });
  res = requireApiKey(headers as any);
  assert(res.ok, "MASTER_TOKEN via Authorization should be accepted");

  // 3) Valid API key via x-api-key
  process.env.API_KEY = "api-456";
  headers = new FakeHeaders({ "x-api-key": "api-456" });
  res = requireApiKey(headers as any);
  assert(res.ok, "API_KEY via x-api-key should be accepted");

  // 4) Invalid key
  headers = new FakeHeaders({ authorization: "Bearer wrong" });
  res = requireApiKey(headers as any);
  assert(
    !res.ok && res.response?.status === 401,
    "Invalid key should be rejected with 401",
  );

  console.log("All requireApiKey smoke tests passed.");
  process.exit(0);
}

run().catch((e) => {
  console.error("Error running tests:", e);
  process.exit(1);
});
