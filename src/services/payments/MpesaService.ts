import { isProductionConfirmed } from "../../../lib/prodGuard";

interface StkPushResult {
  success: boolean;
  reference?: string;
  error?: string;
}

export default class MpesaService {
  private consumerKey: string;
  private consumerSecret: string;
  private environment: string;
  private oauthUrl: string;
  private stkUrl: string;

  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY || "";
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET || "";
    this.environment = process.env.MPESA_ENVIRONMENT || "sandbox"; // 'sandbox'|'production'
    this.oauthUrl =
      process.env.MPESA_OAUTH_URL ||
      (this.environment === "production"
        ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials");
    this.stkUrl =
      process.env.MPESA_STK_URL ||
      (this.environment === "production"
        ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest");
  }

  private validateConfig(): string | null {
    if (!this.consumerKey || !this.consumerSecret)
      return "MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET not configured";
    return null;
  }

  private async getAccessToken(): Promise<string> {
    const cfgErr = this.validateConfig();
    if (cfgErr) throw new Error(cfgErr);

    const res = await fetch(this.oauthUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${this.consumerKey}:${this.consumerSecret}`
        ).toString("base64")}`,
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(
        `Failed to obtain M-Pesa access token: ${res.status} ${txt}`
      );
    }

    const data = await res.json();
    return data.access_token;
  }

  public async stkPush(
    phone: string,
    amount: number,
    accountRef = "QMOI",
    description = "QMOI payment"
  ): Promise<StkPushResult> {
    try {
      if (!phone) return { success: false, error: "Missing phone number" };
      if (amount <= 0) return { success: false, error: "Invalid amount" };

      if (!isProductionConfirmed()) {
        return { success: true, reference: `sim-mpesa-${Date.now()}` };
      }

      const token = await this.getAccessToken();

      const payload = {
        BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE || "174379",
        Password: process.env.MPESA_PASSKEY || "",
        Timestamp: new Date()
          .toISOString()
          .replace(/[-T:\.Z]/g, "")
          .slice(0, 14),
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: phone,
        PartyB: process.env.MPESA_BUSINESS_SHORTCODE || "174379",
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL || "",
        AccountReference: accountRef,
        TransactionDesc: description,
      };

      const res = await fetch(this.stkUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        return {
          success: false,
          error: `STK Push failed: ${res.status} ${txt}`,
        };
      }

      const data = await res.json();
      return {
        success: true,
        reference:
          data.CheckoutRequestID ||
          data.CheckoutRequestID ||
          String(Date.now()),
      };
    } catch (_error) {
      const err = _error instanceof Error ? _error.message : String(_error);
      return { success: false, error: err };
    }
  }
}
