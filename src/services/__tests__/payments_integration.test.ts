/* eslint-disable @typescript-eslint/no-explicit-any */
import { GET as validateRoute } from "../../../app/api/integrations/validate/route";

const providers = [
  { name: "mpesa", env: "MPESA_CONSUMER_KEY" },
  { name: "pesapal", env: "PESAPAL_CONSUMER_KEY" },
  { name: "airtel", env: "AIRTEL_CLIENT_ID" },
];

describe("Payments integration (live, gated)", () => {
  providers.forEach((p) => {
    const canRun = Boolean(
      process.env.PRODUCTION_CONFIRMED === "1" && process.env[p.env]
    );
    if (!canRun) {
      test.skip(`${p.name} live tests skipped (requires ${p.env} + PRODUCTION_CONFIRMED=1)`, () => {});
      return;
    }

    test(`${p.name} validate (live)`, async () => {
      const req = {
        url: `http://localhost/api/integrations/validate?provider=${p.name}`,
      } as any;
      const res: any = await validateRoute(req);
      // Route returns NextResponse or Response objects; handle both
      let body: any;
      if (typeof res.json === "function") {
        body = await res.json();
      } else if (res.body) {
        body = res.body;
      } else {
        body = res;
      }
      expect(body.success).toBe(true);
    });
  });
});
