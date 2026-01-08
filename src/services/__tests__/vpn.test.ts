/* eslint-disable @typescript-eslint/no-explicit-any */
import { vpnService } from "../VPNService";

describe("VPNService validateController", () => {
  beforeEach(() => {
    delete process.env.VPN_CONTROLLER_URL;
  });

  test("returns error when controller URL missing", async () => {
    const res = await vpnService.validateController();
    expect(res.success).toBe(false);
    expect(res.message).toMatch(/not configured/);
  });

  test("returns success when controller reachable", async () => {
    process.env.VPN_CONTROLLER_URL = "http://controller.test";

    const mockFetch = jest
      .spyOn(global, "fetch" as any)
      .mockImplementationOnce(
        async () => ({ ok: true, status: 200, text: async () => "ok" } as any)
      );

    const res = await vpnService.validateController();
    expect(res.success).toBe(true);
    expect(res.status).toBe(200);

    mockFetch.mockRestore();
  });

  test("returns an error when controller returns non-OK", async () => {
    process.env.VPN_CONTROLLER_URL = "http://controller.test";

    const mockFetch = jest
      .spyOn(global, "fetch" as any)
      .mockImplementationOnce(
        async () =>
          ({ ok: false, status: 503, text: async () => "down" } as any)
      );

    const res = await vpnService.validateController();
    expect(res.success).toBe(false);
    expect(res.status).toBe(503);

    mockFetch.mockRestore();
  });
});
