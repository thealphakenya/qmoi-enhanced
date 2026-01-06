import { isProductionConfirmed } from "../../lib/prodGuard";

export async function sendWhatsApp(
  to: string,
  message: string
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  if (!to) return { success: false, error: "No recipient provided" };

  const provider = (
    process.env.QMOI_WHATSAPP_PROVIDER || "local"
  ).toLowerCase();

  // Non-production simulated path
  if (!isProductionConfirmed()) {
    console.log(`[SIMULATED:${provider}] WhatsApp →`, to, message);
    return { success: true, simulated: true };
  }

  try {
    if (provider === "twilio") {
      // Send via Twilio Messages API using WhatsApp channel
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. 'whatsapp:+1415XXXXXXX'

      if (!sid || !token || !from) {
        const err = "Twilio WhatsApp credentials missing";
        console.error(err);
        return { success: false, error: err };
      }

      const body = new URLSearchParams();
      body.append("To", `whatsapp:${to}`);
      body.append("From", from);
      body.append("Body", message);

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString(
              "base64"
            )}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Twilio WhatsApp send failed:", res.status, text);
        return { success: false, error: `Twilio error ${res.status}` };
      }

      return { success: true };
    }

    if (provider === "whatsapp_cloud") {
      // Use Meta/WhatsApp Cloud API
      const WhatsAppCloudService = (await import("./WhatsAppCloudService"))
        .default;
      const cloud = new WhatsAppCloudService();
      await cloud.sendMessage(to, message);
      return { success: true };
    }

    // default: local whatsapp-web.js based connector
    const WA =
      (await import("./WhatsAppService")).WhatsAppService ||
      (await import("./WhatsAppService")).default;
    const wa = WA.getInstance();
    await wa.sendMessage(to, message);
    return { success: true };
  } catch (_err) {
    const error = _err instanceof Error ? _err.message : String(_err);
    console.error("WhatsApp send failed:", error);
    return { success: false, error };
  }
}

export async function sendSms(
  to: string,
  message: string
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  if (!to) return { success: false, error: "No recipient provided" };

  if (!isProductionConfirmed()) {
    console.log("[SIMULATED] SMS →", to, message);
    return { success: true, simulated: true };
  }

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  if (!sid || !token || !from) {
    const err = "Twilio credentials missing";
    console.error(err);
    return { success: false, error: err };
  }

  try {
    const body = new URLSearchParams();
    body.append("To", to);
    body.append("From", from);
    body.append("Body", message);

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString(
            "base64"
          )}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Twilio send failed:", res.status, text);
      return { success: false, error: `Twilio error ${res.status}` };
    }

    return { success: true };
  } catch (_err) {
    const error = _err instanceof Error ? _err.message : String(_err);
    console.error("SMS send failed:", error);
    return { success: false, error };
  }
}

export async function sendPush(
  deviceId: string,
  payload: Record<string, any>
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  if (!deviceId) return { success: false, error: "No device id provided" };

  if (!isProductionConfirmed()) {
    console.log("[SIMULATED] Push →", deviceId, payload);
    return { success: true, simulated: true };
  }

  // Production push providers (FCM/APNs) can be integrated here.
  // For now, log and return not implemented.
  console.error("Push notifications are not implemented in production yet");
  return { success: false, error: "Not implemented" };
}
