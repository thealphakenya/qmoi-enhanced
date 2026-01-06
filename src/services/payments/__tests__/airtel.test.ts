import AirtelService from "../AirtelService";

describe("AirtelService tests", () => {
  beforeEach(() => {
    delete process.env.PRODUCTION_CONFIRMED;
    delete process.env.AIRTEL_CLIENT_ID;
    delete process.env.AIRTEL_CLIENT_SECRET;
  });

  test("sendPayment simulates when not in production", async () => {
    const svc = new AirtelService();
    const res = await svc.sendPayment("254700000000", 100);
    expect(res.success).toBe(true);
    expect(res.reference).toMatch(/sim-airtel-/);
  });

  test("sendPayment fails when production but credentials missing", async () => {
    process.env.PRODUCTION_CONFIRMED = "true";
    const svc = new AirtelService();
    const res = await svc.sendPayment("254700000000", 200);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/AIRTEL_CLIENT_ID not configured/);
  });
});
