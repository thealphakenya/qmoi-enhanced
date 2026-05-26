import type { PlatformConfig, SocialPlatformAdapter } from "../types";
import { ApprovalFlow } from "../types";

export class InstagramAdapter implements SocialPlatformAdapter {
  readonly platformId = "instagram";
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

  async createPost(content: unknown, requireApproval = true): Promise<string> {
    if (requireApproval) {
      const request = await this.requestApproval("create_post", content);
      if (!(await this.isApproved(request.id))) {
        throw new Error("Approval required");
      }
    }

    return `instagram-post-${Date.now()}`;
  }

  async deletePost(postId: string): Promise<boolean> {
    return true;
  }

  async getEngagementMetrics(postId: string): Promise<Record<string, number>> {
    return {
      likes: 0,
      comments: 0,
      saves: 0,
      reach: 0,
      impressions: 0,
    };
  }

  async getAnalytics(): Promise<Record<string, number>> {
    return {
      totalFollowers: 0,
      totalImpressions: 0,
      totalEngagement: 0,
    };
  }
}

export default InstagramAdapter;
