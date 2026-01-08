import * as msw from "msw";
const helpers = (msw as any).rest || (msw as any).http;
import { server } from "../../../mocks/server";
import MpesaService from "../MpesaService";
import * as prodGuard from "../../../../lib/prodGuard";

describe("MpesaService integration (MSW)", () => {
  beforeAll(() => {
    // Start MSW server
    server.listen({ onUnhandledRequest: "warn" });
  });

  afterEach(() => {
    server.resetHandlers();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  test("stkPush performs OAuth and STK push and extracts CheckoutRequestID", async () => {
    jest.spyOn(prodGuard, "isProductionConfirmed").mockReturnValue(true);

    // Use local endpoints to ensure MSW matches
    process.env.MPESA_OAUTH_URL = "http://localhost/mpesa/oauth";
    process.env.MPESA_STK_URL = "http://localhost/mpesa/stk";
    process.env.MPESA_CONSUMER_KEY = "testkey";
    process.env.MPESA_CONSUMER_SECRET = "testsecret";
    process.env.MPESA_BUSINESS_SHORTCODE = "123456";
    process.env.MPESA_PASSKEY = "pass";

    server.use(
      helpers.get("http://localhost/mpesa/oauth", (_req, res, ctx) => {
        console.log("msw oauth handler called");
        if (ctx && typeof (ctx as any).status === "function") {
          return res(
            (ctx as any).status(200),
            (ctx as any).json({ access_token: "tok" })
          );
        }
        return new Response(JSON.stringify({ access_token: "tok" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }),
      helpers.post("http://localhost/mpesa/stk", (_req, res, ctx) => {
        // Return a valid STK Push success payload regardless of headers
        if (ctx && typeof (ctx as any).status === "function") {
          return res(
            (ctx as any).status(200),
            (ctx as any).json({
              Response: { CheckoutRequestID: "CHK-INTEGRATION" },
            })
          );
        }
        return new Response(
          JSON.stringify({
            Response: { CheckoutRequestID: "CHK-INTEGRATION" },
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          }
        );
      })
    );

    const svc = new MpesaService();
    const result = await svc.stkPush("254700000000", 123.45);

    expect(result.success).toBe(true);
    expect(result.reference).toBe("CHK-INTEGRATION");

    // Clean env
    delete process.env.MPESA_OAUTH_URL;
    delete process.env.MPESA_STK_URL;
    delete process.env.MPESA_CONSUMER_KEY;
    delete process.env.MPESA_CONSUMER_SECRET;
    delete process.env.MPESA_BUSINESS_SHORTCODE;
    delete process.env.MPESA_PASSKEY;
  });
});
