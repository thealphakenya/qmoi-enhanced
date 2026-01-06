import PesapalService from "../PesapalService";

describe("PesapalService tests", () => {
  beforeEach(() => {
    delete process.env.PRODUCTION_CONFIRMED;
    delete process.env.PESAPAL_CONSUMER_KEY;
    delete process.env.PESAPAL_CONSUMER_SECRET;
  });

  test("createOrder simulates when not in production", async () => {
    const svc = new PesapalService();
    const res = await svc.createOrder(
      120,
      "desc",
      "First",
      "Last",
      "a@b.com",
      "254700000000"
    );
    expect(res.success).toBe(true);
    expect(res.transactionId).toMatch(/sim-pesapal-/);
  });

  test("createOrder fails when production but credentials missing", async () => {
    process.env.PRODUCTION_CONFIRMED = "true";
    const svc = new PesapalService();
    const res = await svc.createOrder(250);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(
      /PESAPAL_CONSUMER_KEY or PESAPAL_CONSUMER_SECRET not configured/
    );
  });
});
