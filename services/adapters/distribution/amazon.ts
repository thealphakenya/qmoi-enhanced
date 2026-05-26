import type { DistributionPlatformAdapter, PlatformConfig } from "../types";
import { ApprovalFlow } from "../types";

export class AmazonAdapter implements DistributionPlatformAdapter {
  readonly platformId = "amazon";
  private config: PlatformConfig | null = null;

  async initialize(config: PlatformConfig): Promise<void> {
    this.config = config;
  }

  async validateCredentials(): Promise<boolean> {
    return Boolean(this.config?.credentials?.accessToken);
  }

  async requestApproval(action: string, payload: unknown) {
    return ApprovalFlow.requestApproval(this.platformId, action, payload);
  }

  async isApproved(requestId: string): Promise<boolean> {
    return ApprovalFlow.checkApproval(requestId);
  }

  async createListing(product: unknown): Promise<string> {
    const approval = await this.requestApproval("createListing", product);
    return `approval:${approval.id}`;
  }

  async updateInventory(productId: string, quantity: number): Promise<boolean> {
    return true;
  }

  async getSalesMetrics(productId: string): Promise<{ sales: number }> {
    return { sales: 0 };
  }
}

export default AmazonAdapter;
