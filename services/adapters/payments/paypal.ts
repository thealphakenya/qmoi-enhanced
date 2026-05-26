import type { PaymentGatewayAdapter, PlatformConfig } from '../types';
import { ApprovalFlow } from '../types';
import WalletManager from '../../walletManager';
import { getIdempotent, markIdempotent } from './utils';

export class PayPalAdapter implements PaymentGatewayAdapter {
  platformId = 'paypal';
  private config?: PlatformConfig;

  async initialize(config: PlatformConfig) {
    this.config = config;
  }

  async validateCredentials() {
    return Boolean(this.config?.credentials?.accessToken);
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
    if (existing) {
      return (existing.record as { id: string }).id;
    }

    const id = `pp_${Math.random().toString(36).slice(2)}`;
    markIdempotent(key, { id, amount, currency });
    WalletManager.appendAudit({ _event: 'payment_intent_created', gateway: 'paypal', id, amount, currency });
    return id;
  }

  async capturePayment(paymentId: string) {
    WalletManager.appendAudit({ _event: 'payment_captured', gateway: 'paypal', id: paymentId });
    return true;
  }

  async refundPayment(paymentId: string, amount?: number) {
    WalletManager.appendAudit({ _event: 'payment_refunded', gateway: 'paypal', id: paymentId, amount });
    return true;
  }

  async getTransactionHistory(startDate: Date, endDate: Date) {
    return [];
  }
}

export default PayPalAdapter;
