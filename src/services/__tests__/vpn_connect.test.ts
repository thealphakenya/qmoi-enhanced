import { vpnService } from "../VPNService";

describe("VPN connect behavior (guarded)", () => {
  beforeEach(() => {
    delete process.env.PRODUCTION_CONFIRMED;
  });

  test("connectToServer throws when not in production", async () => {
    const server =
      (await vpnService.getRecommendedServer()) || vpnService.getServers()[0];
    expect(server).toBeDefined();
    await expect(vpnService.connectToServer(server.id)).rejects.toThrow(
      /PRODUCTION_CONFIRMED/
    );
  });

  test("ensureSecureConnection is allowed to attempt connection only when PRODUCTION_CONFIRMED set (skipped by default)", async () => {
    if (process.env.PRODUCTION_CONFIRMED !== "1") {
      return;
    }
    // In an environment where PRODUCTION_CONFIRMED=1 this would attempt to connect (may require VPN_CLIENT_CMD)
    const server =
      (await vpnService.getRecommendedServer()) || vpnService.getServers()[0];
    expect(server).toBeDefined();
    await expect(vpnService.ensureSecureConnection()).resolves.toBeUndefined();
  });
});
