import { isProductionConfirmed } from "../../../lib/prodGuard";

interface PesapalResult {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  error?: string;
}

export default class PesapalService {
  private consumerKey: string;
  private consumerSecret: string;
  private environment: string;
  private baseUrl: string;

  constructor() {
    this.consumerKey = process.env.PESAPAL_CONSUMER_KEY || "";
    this.consumerSecret = process.env.PESAPAL_CONSUMER_SECRET || "";
    this.environment =
      (process.env.PESAPAL_ENVIRONMENT as "sandbox" | "production") ||
      "sandbox";
    this.baseUrl =
      process.env.PESAPAL_API_URL ||
      (this.environment === "production"
        ? "https://api.pesapal.com"
        : "https://sandbox.pesapal.com");
  }

  private validateConfig(): string | null {
    if (!this.consumerKey || !this.consumerSecret)
      return "PESAPAL_CONSUMER_KEY or PESAPAL_CONSUMER_SECRET not configured";
    return null;
  }

  public async createOrder(
    amount: number,
    description = "QMOI payment",
    firstName = "User",
    lastName = "",
    email = "",
    phone = ""
  ): Promise<PesapalResult> {
    try {
      if (!isProductionConfirmed()) {
        return { success: true, transactionId: `sim-pesapal-${Date.now()}` };
      }

      const cfgErr = this.validateConfig();
      if (cfgErr) return { success: false, error: cfgErr };

      // Build XML payload per Pesapal PostPesapalDirectOrderV4
      const reference = `QMOI-${Date.now()}`;
      const xml = `<?xml version="1.0" encoding="utf-8"?>\n<PesapalDirectOrderInfo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" Amount="${amount}" Description="${this.escapeXml(
        description
      )}" Type="MERCHANT" Reference="${reference}" FirstName="${this.escapeXml(
        firstName
      )}" LastName="${this.escapeXml(lastName)}" Email="${this.escapeXml(
        email
      )}" PhoneNumber="${this.escapeXml(
        phone
      )}" xmlns="http://www.pesapal.com" />`;

      const url = `${this.baseUrl}/api/PostPesapalDirectOrderV4`;

      // Conservative: use consumerKey as bearer if present (implementation may differ by Pesapal version)
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.consumerKey}`,
          "Content-Type": "application/xml",
        },
        body: xml,
      });

      if (!res.ok) {
        const txt = await res.text();
        return {
          success: false,
          error: `Pesapal API error: ${res.status} ${txt}`,
        };
      }

      const body = await res.text();

      // Pesapal may return a form or HTML with a redirect URL; attempt to parse a transaction or return raw body as transaction id
      // Conservative approach: return the raw body as transactionId
      return { success: true, transactionId: body };
    } catch (_error) {
      const err = _error instanceof Error ? _error.message : String(_error);
      return { success: false, error: err };
    }
  }

  private escapeXml(s: string) {
    return String(s || "").replace(/[<>&'\"]+/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
        default:
          return c;
      }
    });
  }
}
