import { vpnService } from "../VPNService";

const canRunLive =
  Boolean(process.env.VPN_CONTROLLER_URL) &&
  process.env.PRODUCTION_CONFIRMED === "1";

describe("VPN integration (live)", () => {
  if (!canRunLive) {
    test.skip("live VPN integration tests skipped (VPN_CONTROLLER_URL + PRODUCTION_CONFIRMED required)", () => {});
    return;
  }

  test("validateController (live)", async () => {
    const res = await vpnService.validateController();
    expect(res.success).toBe(true);
  });
});
