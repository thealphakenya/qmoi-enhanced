import { isProductionConfirmed } from "../../lib/prodGuard";

export default class WhatsAppCloudService {
  private token: string;
  private phoneNumberId: string;

  constructor() {
    this.token = process.env.WHATSAPP_CLOUD_TOKEN || "";
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
  }

  public validateConfig(): string | null {
    if (!this.token) return "WHATSAPP_CLOUD_TOKEN is not configured";
    if (!this.phoneNumberId)
      return "WHATSAPP_PHONE_NUMBER_ID is not configured";
    return null;
  }

  public async sendMessage(to: string, message: string): Promise<void> {
    if (!to) throw new Error("No recipient provided");

    if (!isProductionConfirmed()) {
      console.log("[SIMULATED WhatsApp Cloud] ->", to, message);
      return;
    }

    const cfgErr = this.validateConfig();
    if (cfgErr) throw new Error(cfgErr);

    const url = `https://graph.facebook.com/v17.0/${this.phoneNumberId}/messages`;

    const body = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: message },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`WhatsApp Cloud API error: ${res.status} ${text}`);
    }

    return;
  }
}
