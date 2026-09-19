import {
  DistributionPlatformAdapter,
  PlatformConfig,
  ApprovalFlow,
} from "../types";

export class AmazonAdapter implements DistributionPlatformAdapter {
  platformId = "amazon";
  private config?: PlatformConfig;

  async initialize(config: PlatformConfig) {
    this.config = config;
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
  async createListing(product: unknown) {
    const r = await this.requestApproval("createListing", product);
    return `approval:${r.id}`;
  }
  async updateInventory(productId: string, quantity: number) {
    return true;
  }
  async getSalesMetrics(productId: string) {
    return { sales: 0 };
  }
}

export default AmazonAdapter;
