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

  async getBalance(): Promise<{
    success: boolean;
    balance?: { available: number; pending: number; total: number };
    currency?: string;
    error?: string;
  }> {
    try {
      console.log("[PayPalAdapter] Getting account balance...");

      return new Promise((resolve) => {
        // Use PayPal's payout balance API to get available balance
        paypal.payout.getBalance({}, (error: any, balance: any) => {
          if (error) {
            console.error("[PayPalAdapter] Balance check failed:", error);
            resolve({
              success: false,
              error: error.message || "Failed to retrieve PayPal balance",
            });
          } else {
            console.log("[PayPalAdapter] Balance retrieved successfully");

            // Parse balance response
            const balances = balance.balances || [];
            const usdBalance =
              balances.find((b: any) => b.currency === "USD") || balances[0];

            if (usdBalance) {
              const available = parseFloat(usdBalance.value) || 0;
              const pending = 0; // PayPal payout balance doesn't show pending separately
              const total = available;

              resolve({
                success: true,
                balance: {
                  available,
                  pending,
                  total,
                },
                currency: usdBalance.currency || "USD",
              });
            } else {
              resolve({
                success: true,
                balance: {
                  available: 0,
                  pending: 0,
                  total: 0,
                },
                currency: "USD",
              });
            }
          }
        });
      });
    } catch (error) {
      console.error("[PayPalAdapter] Balance check error:", error);
      return {
        success: false,
        error: error.message || "System error during balance check",
      };
    }
  }
}

export default PayPalAdapter;
