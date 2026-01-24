import { PaymentGatewayAdapter, PlatformConfig, ApprovalFlow } from "../types";
import WalletManager from "../../walletManager";
import { markIdempotent, getIdempotent } from "./utils";
import paypal from "paypal-rest-sdk";

export class PayPalAdapter implements PaymentGatewayAdapter {
  platformId = "paypal";
  private config?: PlatformConfig;

  async initialize(config: PlatformConfig) {
    this.config = config;

    // Configure PayPal SDK
    paypal.configure({
      mode: config.sandboxMode ? "sandbox" : "live",
      client_id:
        config.credentials?.clientId || process.env.PAYPAL_CLIENT_ID || "",
      client_secret:
        config.credentials?.clientSecret ||
        process.env.PAYPAL_CLIENT_SECRET ||
        "",
    });

    console.log(
      "[PayPalAdapter] initialized in %s mode",
      config.sandboxMode ? "sandbox" : "live",
    );
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

    return new Promise((resolve, reject) => {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "https://qmoi.ai/payment/success",
          cancel_url: "https://qmoi.ai/payment/cancel",
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "QMOI Trading Deposit",
                  sku: "deposit",
                  price: amount.toString(),
                  currency: currency,
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: currency,
              total: amount.toString(),
            },
            description: "Deposit to CashOn Trading Wallet",
          },
        ],
      };

      paypal.payment.create(create_payment_json, (error: any, payment: any) => {
        if (error) {
          console.error("[PayPalAdapter] Payment creation failed:", error);
          reject(error);
        } else {
          const paymentId = payment.id;
          markIdempotent(key, { id: paymentId, amount, currency });

          WalletManager.appendAudit({
            _event: "payment_intent_created",
            gateway: "paypal",
            id: paymentId,
            amount,
            currency,
            paypal_payment: payment,
          });

          console.log("[PayPalAdapter] Payment created:", paymentId);
          resolve(paymentId);
        }
      });
    });
  }
  async capturePayment(paymentId: string) {
    console.log("[PayPalAdapter] Executing payment:", paymentId);

    return new Promise((resolve, reject) => {
      paypal.payment.execute(
        paymentId,
        { payer_id: "APPROVED" },
        (error: any, payment: any) => {
          if (error) {
            console.error("[PayPalAdapter] Payment execution failed:", error);
            WalletManager.appendAudit({
              _event: "payment_capture_failed",
              gateway: "paypal",
              paymentId,
              error: error.message,
            });
            reject(error);
          } else {
            console.log(
              "[PayPalAdapter] Payment executed successfully:",
              paymentId,
            );
            WalletManager.appendAudit({
              _event: "payment_captured",
              gateway: "paypal",
              paymentId,
              amount: payment.transactions[0].amount.total,
              currency: payment.transactions[0].amount.currency,
              paypal_payment: payment,
            });
            resolve(true);
          }
        },
      );
    });
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
