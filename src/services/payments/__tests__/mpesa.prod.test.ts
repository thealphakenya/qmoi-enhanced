import MpesaService from "../MpesaService";
import * as prodGuard from "../../../../lib/prodGuard";

describe("MpesaService production flow", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("stkPush builds password and returns CheckoutRequestID when production", async () => {
    jest.spyOn(prodGuard, "isProductionConfirmed").mockReturnValue(true);

    const mockToken = { access_token: "tok" };
    const tokenRes = { ok: true, json: async () => mockToken } as any;
    const callbackRes = {
      ok: true,
      json: async () => ({ Response: { CheckoutRequestID: "CHK123" } }),
    } as any;

    const fetchMock = jest
      .spyOn(global, "fetch" as any)
      .mockResolvedValueOnce(tokenRes)
      .mockResolvedValueOnce(callbackRes);

    process.env.MPESA_CONSUMER_KEY = "ck";
    process.env.MPESA_CONSUMER_SECRET = "cs";
    const svc = new MpesaService();
    const res = await svc.stkPush("254700000000", 100);

    delete process.env.MPESA_CONSUMER_KEY;
    delete process.env.MPESA_CONSUMER_SECRET;

    expect(res.success).toBe(true);
    expect(res.reference).toBe("CHK123");

    // verify that fetch was called for token and for stk
    expect(fetchMock).toHaveBeenCalled();

    fetchMock.mockRestore();
  });
});
