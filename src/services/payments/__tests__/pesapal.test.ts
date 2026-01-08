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

  test("createOrder posts XML and returns body when API responds OK", async () => {
    process.env.PRODUCTION_CONFIRMED = "true";
    process.env.PESAPAL_CONSUMER_KEY = "ckey";
    process.env.PESAPAL_CONSUMER_SECRET = "csecret";

    const bodyText = "TRANSACTION-123";
    const mockFetch = jest
      .spyOn(global, "fetch" as any)
      .mockImplementationOnce(
        async () => ({ ok: true, text: async () => bodyText } as any)
      );

    const svc = new PesapalService();
    const res = await svc.createOrder(
      200,
      "desc",
      "F",
      "L",
      "a@b.com",
      "254700000000"
    );

    expect(res.success).toBe(true);
    expect(res.transactionId).toBe(bodyText);

    mockFetch.mockRestore();
  });

  test("createOrder extracts redirectUrl from HTML form action", async () => {
    process.env.PRODUCTION_CONFIRMED = "true";
    process.env.PESAPAL_CONSUMER_KEY = "ckey";
    process.env.PESAPAL_CONSUMER_SECRET = "csecret";

    const html =
      '<html><body><form action="https://pesapal.com/pay/xyz123">pay</form></body></html>';
    const mockFetch2 = jest
      .spyOn(global, "fetch" as any)
      .mockImplementationOnce(
        async () => ({ ok: true, text: async () => html } as any)
      );

    const svc2 = new PesapalService();
    const res2 = await svc2.createOrder(300);

    expect(res2.success).toBe(true);
    expect(res2.redirectUrl).toBe("https://pesapal.com/pay/xyz123");

    mockFetch2.mockRestore();
  });
});
