import type { PaymentGatewayAdapter, PlatformConfig } from '../types';
import { ApprovalFlow } from '../types';
import WalletManager from '../../walletManager';
import { getIdempotent, markIdempotent } from './utils';

export class StripeAdapter implements PaymentGatewayAdapter {
  platformId = 'stripe';
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
    const key = `stripe:createPaymentIntent:${amount}:${currency}`;
    const existing = getIdempotent(key);
    if (existing) {
      return (existing.record as { id: string }).id;
    }

    const pid = `pi_${Math.random().toString(36).slice(2)}`;
    markIdempotent(key, { id: pid, amount, currency });
    WalletManager.appendAudit({ _event: 'payment_intent_created', gateway: 'stripe', id: pid, amount, currency });
    return pid;
  }

  async capturePayment(paymentId: string) {
    WalletManager.appendAudit({ _event: 'payment_captured', gateway: 'stripe', id: paymentId });
    return true;
  }

  async refundPayment(paymentId: string, amount?: number) {
    WalletManager.appendAudit({ _event: 'payment_refunded', gateway: 'stripe', id: paymentId, amount });
    return true;
  }

  async getTransactionHistory(startDate: Date, endDate: Date) {
    return [];
  }
}

export default StripeAdapter;
