const msw = require("msw");
const helpers = msw.rest || msw.http;
import { server } from "../../../mocks/server";
import PesapalService from "../PesapalService";
import * as prodGuard from "../../../../lib/prodGuard";

describe("PesapalService integration (MSW)", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "warn" });
  });

  afterEach(() => {
    server.resetHandlers();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  test("createOrder returns redirectUrl when service returns form with action", async () => {
    jest.spyOn(prodGuard, "isProductionConfirmed").mockReturnValue(true);

    process.env.PESAPAL_API_URL = "http://localhost/pesapal";
    process.env.PESAPAL_CONSUMER_KEY = "testkey";
    process.env.PESAPAL_CONSUMER_SECRET = "testsecret";

    const responseHtml = `<html><body><form action="https://pesapal.example/checkout"></form></body></html>`;

    server.use(
      helpers.post(
        "http://localhost/pesapal/api/PostPesapalDirectOrderV4",
        (_req, res, ctx) => {
          if (ctx && typeof (ctx as any).status === "function") {
            return res(
              (ctx as any).status(200),
              (ctx as any).text(responseHtml)
            );
          }
          return new Response(responseHtml, {
            status: 200,
            headers: { "content-type": "text/html" },
          });
        }
      )
    );

    const svc = new PesapalService();
    const res = await svc.createOrder(100);

    expect(res.success).toBe(true);
    expect(res.redirectUrl).toBe("https://pesapal.example/checkout");

    delete process.env.PESAPAL_API_URL;
    delete process.env.PESAPAL_CONSUMER_KEY;
    delete process.env.PESAPAL_CONSUMER_SECRET;
  });
});
