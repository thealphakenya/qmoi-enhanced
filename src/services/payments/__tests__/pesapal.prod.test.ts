import PesapalService from "../PesapalService";
import * as prodGuard from "../../../../lib/prodGuard";

describe("PesapalService production flow", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("createOrder returns redirectUrl when body contains form action", async () => {
    jest.spyOn(prodGuard, "isProductionConfirmed").mockReturnValue(true);

    const responseHtml = `<html><body><form action="https://pesapal.com/checkout"></form></body></html>`;
    const fetchMock = jest
      .spyOn(global, "fetch" as any)
      .mockResolvedValue({ ok: true, text: async () => responseHtml } as any);

    process.env.PESAPAL_CONSUMER_KEY = "ck";
    process.env.PESAPAL_CONSUMER_SECRET = "cs";

    const svc = new PesapalService();
    const res = await svc.createOrder(100);

    delete process.env.PESAPAL_CONSUMER_KEY;
    delete process.env.PESAPAL_CONSUMER_SECRET;

    expect(res.success).toBe(true);
    expect(res.redirectUrl).toBe("https://pesapal.com/checkout");

    fetchMock.mockRestore();
  });
});
