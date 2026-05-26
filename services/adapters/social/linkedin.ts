import type { PlatformConfig, SocialPlatformAdapter } from "../types";
import { ApprovalFlow } from "../types";

export class LinkedInAdapter implements SocialPlatformAdapter {
  readonly platformId = "linkedin";
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

  async createPost(content: unknown, approval = true): Promise<string> {
    if (approval) {
      const request = await this.requestApproval("create_post", content);
      if (!(await this.isApproved(request.id))) {
        throw new Error("Approval required");
      }
    }
    return `linkedin-post-${Date.now()}`;
  }

  async deletePost(postId: string): Promise<boolean> {
    return true;
  }

  async getEngagementMetrics(postId: string): Promise<Record<string, number>> {
    return { reactions: 0, comments: 0, shares: 0 };
  }

  async getAnalytics(): Promise<Record<string, number>> {
    return { totalViews: 0, totalInteractions: 0 };
  }
}

export default LinkedInAdapter;
