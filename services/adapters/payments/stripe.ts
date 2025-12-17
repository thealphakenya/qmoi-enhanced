import { PaymentGatewayAdapter, PlatformConfig, ApprovalFlow } from "../types";
import WalletManager from "../../walletManager";
import { markIdempotent, getIdempotent } from "./utils";

export class StripeAdapter implements PaymentGatewayAdapter {
  platformId = "stripe";
  private config?: PlatformConfig;

  async initialize(config: PlatformConfig) {
    this.config = config;
    console.log("[StripeAdapter] sandbox=%s", !!config.sandboxMode);
  }
  async validateCredentials() {
    return !!this.config?.credentials?.accessToken;
  }
  async requestApproval(action: string, payload: unknown) {
    return ApprovalFlow.requestApproval(this.platformId, action, payload);
  }
  async isApproved(requestId: string) {
    return ApprovalFlow.checkApproval(requestId);
  }
  async getAnalytics() {
    return { processed: 0 };
  }

  // PaymentGatewayAdapter
  async createPaymentIntent(amount: number, currency: string) {
    // Dry-run: create an idempotent placeholder
    const key = `stripe:createPaymentIntent:${amount}:${currency}`;
    const existing = getIdempotent(key);
    if (existing) {
      console.log(
        "[StripeAdapter] returning existing idempotent payment intent",
        existing.record.id,
      );
      return existing.record.id;
    }
    const pid = `pi_${Math.random().toString(36).slice(2)}`;
    console.log(
      "[StripeAdapter] dry-createPaymentIntent",
      amount,
      currency,
      pid,
    );
    markIdempotent(key, { id: pid, amount, currency });
    WalletManager.appendAudit({
      event: "payment_intent_created",
      gateway: "stripe",
      id: pid,
      amount,
      currency,
    });
    return pid;
  }

  async capturePayment(paymentId: string) {
    console.log("[StripeAdapter] dry-capture", paymentId);
    return true;
  }
  async refundPayment(paymentId: string, amount?: number) {
    console.log("[StripeAdapter] dry-refund", paymentId, amount);
    return true;
  }
  async getTransactionHistory(startDate: Date, endDate: Date) {
    return [];
  }
}

export default StripeAdapter;
