import { z } from "zod";

// Base platform configuration schema
export const PlatformConfigSchema = z.object({
  platformId: z.string(),
  dryRun: z.boolean().default(true),
  requireMasterApproval: z.boolean().default(true),
  sandboxMode: z.boolean().default(true),
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

// Platform approval request
export interface ApprovalRequest {
  id: string;
  platformId: string;
  action: string;
  payload: unknown;
  status: "pending" | "approved" | "rejected";
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

// Base platform adapter interface
export interface PlatformAdapter {
  platformId: string;
  initialize(config: PlatformConfig): Promise<void>;
  validateCredentials(): Promise<boolean>;
  requestApproval(action: string, payload: unknown): Promise<ApprovalRequest>;
  isApproved(requestId: string): Promise<boolean>;
  getAnalytics(): Promise<unknown>;
}

// Base social platform capabilities
export interface SocialPlatformAdapter extends PlatformAdapter {
  createPost(content: unknown, approval?: boolean): Promise<string>;
  deletePost(postId: string): Promise<boolean>;
  getEngagementMetrics(postId: string): Promise<unknown>;
}

// Base content platform capabilities
export interface ContentPlatformAdapter extends PlatformAdapter {
  uploadContent(content: unknown, metadata: unknown): Promise<string>;
  updateContent(contentId: string, updates: unknown): Promise<boolean>;
  getContentMetrics(contentId: string): Promise<unknown>;
}

// Base distribution platform capabilities
export interface DistributionPlatformAdapter extends PlatformAdapter {
  createListing(product: unknown): Promise<string>;
  updateInventory(productId: string, quantity: number): Promise<boolean>;
  getSalesMetrics(productId: string): Promise<unknown>;
}

// Base payment gateway capabilities
export interface PaymentGatewayAdapter extends PlatformAdapter {
  createPaymentIntent(amount: number, currency: string): Promise<string>;
  capturePayment(paymentId: string): Promise<boolean>;
  refundPayment(paymentId: string, amount?: number): Promise<boolean>;
  getTransactionHistory(startDate: Date, endDate: Date): Promise<unknown>;
}

// Human approval flow helper
export class ApprovalFlow {
  private static approvals = new Map<string, ApprovalRequest>();

  static async requestApproval(
    platformId: string,
    action: string,
    payload: unknown,
  ): Promise<ApprovalRequest> {
    const _request: ApprovalRequest = {
      id: `${platformId}-${Date.now()}`,
      platformId,
      action,
      payload,
      status: "pending",
      requestedAt: new Date(),
    };

    this.approvals.set(request.id, _request);

    // Log the request for human review
    console.log(`[APPROVAL REQUIRED] ${platformId}: ${action}`);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    return request;
  }

  static async checkApproval(requestId: string): Promise<boolean> {
    const _request = this.approvals.get(requestId);
    return request?.status === "approved";
  }

  // For testing/demo only - in production this would be a proper admin UI
  static async simulateApproval(
    requestId: string,
    approved = true,
  ): Promise<void> {
    const _request = this.approvals.get(requestId);
    if (_request) {
      request.status = approved ? "approved" : "rejected";
      request.reviewedAt = new Date();
      request.reviewedBy = "test-admin";
    }
  }
}
