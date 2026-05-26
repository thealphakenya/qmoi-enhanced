import { z } from 'zod';

export const PlatformConfigSchema = z.object({
  platformId: z.string(),
  dryRun: z.boolean().default(true),
  requireMasterApproval: z.boolean().default(true),
  rateLimitPerMinute: z.number().default(60),
  credentials: z
    .object({
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      accessToken: z.string().optional(),
    })
    .optional(),
});

export type PlatformConfig = z.infer<typeof PlatformConfigSchema>;

export interface ApprovalRequest {
  id: string;
  platformId: string;
  action: string;
  payload: unknown;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface PlatformAdapter {
  platformId: string;
  initialize(config: PlatformConfig): Promise<void>;
  validateCredentials(): Promise<boolean>;
  requestApproval(action: string, payload: unknown): Promise<ApprovalRequest>;
  isApproved(requestId: string): Promise<boolean>;
  getAnalytics(): Promise<unknown>;
}

export interface ContentPlatformAdapter extends PlatformAdapter {
  uploadContent(content: unknown, metadata: unknown): Promise<string>;
  updateContent(contentId: string, updates: unknown): Promise<boolean>;
  getContentMetrics(contentId: string): Promise<unknown>;
}

export interface DistributionPlatformAdapter extends PlatformAdapter {
  createListing(product: unknown): Promise<string>;
  updateInventory(productId: string, quantity: number): Promise<boolean>;
  getSalesMetrics(productId: string): Promise<unknown>;
}

export interface PaymentGatewayAdapter extends PlatformAdapter {
  createPaymentIntent(amount: number, currency: string): Promise<string>;
  capturePayment(paymentId: string): Promise<boolean>;
  refundPayment(paymentId: string, amount?: number): Promise<boolean>;
  getTransactionHistory(startDate: Date, endDate: Date): Promise<unknown>;
}

export class ApprovalFlow {
  private static approvals = new Map<string, ApprovalRequest>();

  static async requestApproval(
    platformId: string,
    action: string,
    payload: unknown,
  ): Promise<ApprovalRequest> {
    const request: ApprovalRequest = {
      id: `${platformId}-${Date.now()}`,
      platformId,
      action,
      payload,
      status: 'pending',
      requestedAt: new Date(),
    };

    this.approvals.set(request.id, request);
    return request;
  }

  static async checkApproval(requestId: string): Promise<boolean> {
    const request = this.approvals.get(requestId);
    return request?.status === 'approved';
  }

  static async setApprovalStatus(requestId: string, approved = true): Promise<void> {
    const request = this.approvals.get(requestId);
    if (request) {
      request.status = approved ? 'approved' : 'rejected';
      request.reviewedAt = new Date();
      request.reviewedBy = 'system';
    }
  }
}
