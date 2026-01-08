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

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 2
  ): Promise<Response> {
    let attempt = 0;
    let lastError: unknown = null;
    while (attempt <= retries) {
      try {
        const res = await fetch(url, options);
        return res;
      } catch (err) {
        lastError = err;
        attempt++;
        const wait = Math.pow(2, attempt) * 100;
        await new Promise((r) => setTimeout(r, wait));
      }
    }
    throw lastError;
  }

  private async getAccessToken(): Promise<string> {
    const cfgErr = this.validateConfig();
    if (cfgErr) throw new Error(cfgErr);

    const res = await this.fetchWithRetry(this.oauthUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${this.consumerKey}:${this.consumerSecret}`
        ).toString("base64")}`,
      },
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(
        `Failed to obtain M-Pesa access token: ${res.status} ${txt}`
      );
    }

    const data = await res.json();
    return data.access_token;
  }

  /**
   * Non-destructive validation that the OAuth endpoint is reachable and credentials look valid.
   */
  public async validate(): Promise<{
    success: boolean;
    status?: number;
    message?: string;
  }> {
    const cfgErr = this.validateConfig();
    if (cfgErr) return { success: false, message: cfgErr };

    try {
      const ac = new AbortController();
      const timeout = setTimeout(() => ac.abort(), 5000);
      const res = await fetch(this.oauthUrl, {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.consumerKey}:${this.consumerSecret}`
          ).toString("base64")}`,
        },
        signal: ac.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        return { success: false, status: res.status, message: txt };
      }

      return { success: true, status: res.status, message: "ok" };
    } catch (_err) {
      const msg = _err instanceof Error ? _err.message : String(_err);
      return { success: false, message: `fetch error: ${msg}` };
    }
  }

  private generateTimestamp(): string {
    return new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);
  }

  private generatePassword(
    timestamp: string,
    businessShortCode: string,
    passkey: string
  ): string {
    return Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString(
      "base64"
    );
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

      const timestamp = this.generateTimestamp();
      const businessShortCode =
        process.env.MPESA_BUSINESS_SHORTCODE || "174379";
      const passkey = process.env.MPESA_PASSKEY || "";
      const payload = {
        BusinessShortCode: businessShortCode,
        Password: this.generatePassword(timestamp, businessShortCode, passkey),
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: phone,
        PartyB: businessShortCode,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL || "",
        AccountReference: accountRef,
        TransactionDesc: description,
      };

      const res = await this.fetchWithRetry(this.stkUrl, {
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

      // Attempt to extract CheckoutRequestID from common locations in the payload
      const findCheckoutId = (obj: unknown): string | undefined => {
        if (!obj || typeof obj !== "object") return undefined;
        const o = obj as Record<string, unknown>;
        if (o.CheckoutRequestID) return String(o.CheckoutRequestID as unknown);
        if (o.Response && typeof o.Response === "object") {
          const r = o.Response as Record<string, unknown>;
          if (r.CheckoutRequestID)
            return String(r.CheckoutRequestID as unknown);
        }
        if (o.Result && typeof o.Result === "object") {
          const r = o.Result as Record<string, unknown>;
          if (r.CheckoutRequestID)
            return String(r.CheckoutRequestID as unknown);
        }
        // Pesky nested result structures
        for (const k of Object.keys(o)) {
          const val = o[k];
          if (val && typeof val === "object") {
            const found = findCheckoutId(val);
            if (found) return found;
          }
        }
        // Some MPESA responses include a `Body.StkCallback.CheckoutRequestID` nested path
        if (
          o.Body &&
          typeof o.Body === "object" &&
          (o.Body as Record<string, unknown>).stkCallback &&
          typeof (o.Body as Record<string, unknown>).stkCallback === "object"
        ) {
          const cb = (o.Body as Record<string, unknown>).stkCallback as Record<
            string,
            unknown
          >;
          if (cb.CheckoutRequestID)
            return String(cb.CheckoutRequestID as unknown);
        }
        return undefined;
      };

      const checkout = findCheckoutId(data) || String(Date.now());
      return { success: true, reference: checkout };
    } catch (_error) {
      const err = _error instanceof Error ? _error.message : String(_error);
      return { success: false, error: err };
    }
  }
}
