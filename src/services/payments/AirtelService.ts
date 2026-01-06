import { isProductionConfirmed } from "../../../lib/prodGuard";

interface AirtelResult {
  success: boolean;
  reference?: string;
  error?: string;
}

export default class AirtelService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.AIRTEL_CLIENT_ID || "";
    this.clientSecret = process.env.AIRTEL_CLIENT_SECRET || "";
    this.baseUrl =
      process.env.AIRTEL_API_URL || "https://openapiuat.airtel.africa";
  }

  private validateConfig(): string | null {
    if (!this.clientId) return "AIRTEL_CLIENT_ID not configured";
    return null;
  }

  public async sendPayment(
    msisdn: string,
    amount: number,
    currency = "KES",
    reference = "QMOI_TX"
  ): Promise<AirtelResult> {
    try {
      if (!isProductionConfirmed()) {
        return { success: true, reference: `sim-airtel-${Date.now()}` };
      }

      const cfgErr = this.validateConfig();
      if (cfgErr) return { success: false, error: cfgErr };

      const url = `${this.baseUrl}/merchant/v1/payments/`;
      const body = {
        reference: reference,
        subscriber: { country: "KE", currency, msisdn },
        transaction: {
          amount,
          country: "KE",
          currency,
          id: `${reference}_${Date.now()}`,
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.clientId}`,
          "Content-Type": "application/json",
          "X-Country": "KE",
          "X-Currency": currency,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        return {
          success: false,
          error: `Airtel API error: ${res.status} ${txt}`,
        };
      }

      const data = await res.json();
      return {
        success: true,
        reference: data?.data?.transaction?.id || `${reference}_${Date.now()}`,
      };
    } catch (_error) {
      const err = _error instanceof Error ? _error.message : String(_error);
      return { success: false, error: err };
    }
  }
}
