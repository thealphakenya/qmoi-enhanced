import MpesaService from "../MpesaService";

describe("MpesaService tests", () => {
  beforeEach(() => {
    delete process.env.PRODUCTION_CONFIRMED;
    delete process.env.MPESA_CONSUMER_KEY;
    delete process.env.MPESA_CONSUMER_SECRET;
  });

  test("stkPush simulates when not in production", async () => {
    const svc = new MpesaService();
    const res = await svc.stkPush("254700000000", 50);
    expect(res.success).toBe(true);
    expect(res.reference).toMatch(/sim-mpesa-/);
  });

  test("stkPush fails when production but credentials missing", async () => {
    process.env.PRODUCTION_CONFIRMED = "true";
    const svc = new MpesaService();
    const res = await svc.stkPush("254700000000", 100);
    expect(res.success).toBe(false);
    expect(res.error).toMatch(
      /MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET not configured/
    );
  });

  test("stkPush does an STK push when credentials are provided", async () => {
    process.env.PRODUCTION_CONFIRMED = "true";
    process.env.MPESA_CONSUMER_KEY = "ckey";
    process.env.MPESA_CONSUMER_SECRET = "csecret";
    process.env.MPESA_PASSKEY = "passkey";

    // Mock token response then STK push response
    const mockFetch = jest
      .spyOn(global, "fetch" as any)
      .mockImplementationOnce(
        async () =>
          ({ ok: true, json: async () => ({ access_token: "tok" }) } as any)
      )
      .mockImplementationOnce(
        async () =>
          ({
            ok: true,
            json: async () => ({ CheckoutRequestID: "CR123" }),
          } as any)
      );

    const svc = new MpesaService();
    const res = await svc.stkPush("254700000000", 150);

    expect(res.success).toBe(true);
    expect(res.reference).toMatch(/CR123/);

    mockFetch.mockRestore();
  });
});
