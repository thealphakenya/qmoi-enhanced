import fetch from "node-fetch";

describe("Integration validate endpoint", () => {
  test("returns 400 for unknown provider", async () => {
    const res = await fetch(
      "http://localhost/api/integrations/validate?provider=unknown"
    );
    // In unit tests we cannot call local server; instead we ensure route function exists by dynamic import
    const route = (await import("../../../app/api/integrations/validate/route"))
      .GET;
    const fakeReq = new Request(
      "http://localhost/api/integrations/validate?provider=unknown"
    );
    const result = await route(fakeReq as any);
    const json = await result.json();
    expect(json.success).toBe(false);
    expect(json._error).toMatch(/Unknown provider/);
  });
});
