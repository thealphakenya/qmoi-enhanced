/* eslint-disable @typescript-eslint/no-explicit-any */
import * as notif from "../NotificationService";

describe("NotificationService basic tests", () => {
  beforeEach(() => {
    // ensure non-production by clearing PRODUCTION_CONFIRMED
    delete process.env.PRODUCTION_CONFIRMED;
    delete process.env.QMOI_WHATSAPP_PROVIDER;
  });

  test("sendWhatsApp simulates when not in production", async () => {
    const res = await notif.sendWhatsApp("+254700000000", "hello");
    expect(res.success).toBe(true);
    expect(res.simulated).toBe(true);
  });

  test("sendWhatsApp returns error when provider is twilio and credentials missing", async () => {
    process.env.PRODUCTION_CONFIRMED = "true";
    process.env.QMOI_WHATSAPP_PROVIDER = "twilio";

    const res = await notif.sendWhatsApp("254700000000", "hi");
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Twilio WhatsApp credentials missing/);
  });

  test("sendWhatsApp uses WhatsApp Cloud when configured", async () => {
    process.env.PRODUCTION_CONFIRMED = "true";
    process.env.QMOI_WHATSAPP_PROVIDER = "whatsapp_cloud";
    process.env.WHATSAPP_CLOUD_TOKEN = "TEST_TOKEN";
    process.env.WHATSAPP_PHONE_NUMBER_ID = "12345";

    const mockFetch = jest.spyOn(global, "fetch" as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "msg_1" }),
    } as any);

    const res = await notif.sendWhatsApp("254700000000", "cloud hello");
    expect(res.success).toBe(true);
    mockFetch.mockRestore();
  });
});
