describe("Integration validate endpoint", () => {
  test("returns 400 for unknown provider", async () => {
    // In unit tests we cannot call local server; instead we ensure route function exists by dynamic import
    const route = (await import("../../../app/api/integrations/validate/route"))
      .GET;
    const fakeReq = {
      url: "http://localhost/api/integrations/validate?provider=unknown",
    } as any;
    let result: any;
    try {
      result = await route(fakeReq as any);
    } catch (err) {
      // Log and rethrow to surface details in CI logs
      // eslint-disable-next-line no-console
      console.error("ROUTE THREW:", err);
      throw err;
    }

    let json: any;
    if (typeof (result as any).json === "function") {
      json = await (result as any).json();
    } else if ((result as any).body) {
      json = (result as any).body;
    } else {
      json = result;
    }
    expect(json.success).toBe(false);
    expect(json._error).toMatch(/Unknown provider/);
  });

  test("validates vpn provider", async () => {
    process.env.VPN_CONTROLLER_URL = "http://controller.test";

    const mockFetch = jest
      .spyOn(global, "fetch" as any)
      .mockImplementationOnce(
        async () => ({ ok: true, status: 200, text: async () => "ok" } as any)
      );

    const route = (await import("../../../app/api/integrations/validate/route"))
      .GET;
    const fakeReq = {
      url: "http://localhost/api/integrations/validate?provider=vpn",
    } as any;
    let result: any;
    try {
      result = await route(fakeReq as any);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("ROUTE THREW:", err);
      throw err;
    }

    let json: any;
    if (typeof (result as any).json === "function") {
      json = await (result as any).json();
    } else if ((result as any).body) {
      json = (result as any).body;
    } else {
      json = result;
    }

    expect(json.success).toBe(true);
    expect(json.provider).toBe("vpn");

    mockFetch.mockRestore();
  });
});
