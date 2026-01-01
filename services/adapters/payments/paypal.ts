import { PaymentGatewayAdapter, PlatformConfig, ApprovalFlow } from "../types";
import WalletManager from "../../walletManager";
import { markIdempotent, getIdempotent } from "./utils";

export class PayPalAdapter implements PaymentGatewayAdapter {
  platformId = "paypal";
  private config?: PlatformConfig;

  async initialize(config: PlatformConfig) {
    this.config = config;
    console.log("[PayPalAdapter] sandbox=%s", !!config.sandboxMode);
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
  async createPaymentIntent(amount: number, currency: string) {
    const key = `paypal:createPaymentIntent:${amount}:${currency}`;
    const existing = getIdempotent(key);
    if (existing) return existing.record.id;
    const id = `pp-${Date.now()}`;
    markIdempotent(key, { id, amount, currency });
    WalletManager.appendAudit({
      _event: "payment_intent_created",
      gateway: "paypal",
      id,
      amount,
      currency,
    });
    return id;
  }
  async capturePayment(paymentId: string) {
    console.log("[PayPalAdapter] dry-capture", paymentId);
    return true;
  }
  async refundPayment(paymentId: string, amount?: number) {
    console.log("[PayPalAdapter] dry-refund", paymentId, amount);
    return true;
  }
  async getTransactionHistory(startDate: Date, endDate: Date) {
    return [];
  }
}

export default PayPalAdapter;
