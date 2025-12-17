import { setupServer } from "msw/node";
import { getHandlers } from "../src/mocks/handlers";

describe("handlers integration", () => {
  let server: any;

  beforeAll(async () => {
    const handlers = await getHandlers();
    server = setupServer(...handlers);
    server.listen({ onUnhandledRequest: "error" });
  });
  afterAll(() => server && server.close());

  test("GET /api/qmoi/status (path-only) returns 200 and payload", async () => {
    const res = await fetch("/api/qmoi/status");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data && data.status).toBe("OK");
  });

  test("GET absolute URL http://localhost/api/qmoi/status returns 200", async () => {
    const res = await fetch("http://localhost/api/qmoi/status");
    expect(res.status).toBe(200);
  });

  test("POST /api/qmoi/payload?qfix returns QFix message", async () => {
    const res = await fetch("/api/qmoi/payload?qfix=1", { method: "POST" });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toMatch(/QFix/i);
  });
});
