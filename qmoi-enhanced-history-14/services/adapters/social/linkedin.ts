import { SocialPlatformAdapter, PlatformConfig, ApprovalFlow } from "../types";

export class LinkedInAdapter implements SocialPlatformAdapter {
  platformId = "linkedin";
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
  async getAnalytics() {
    return { views: 0 };
  }
  async createPost(content: unknown, approval = true) {
    const r = await this.requestApproval("createPost", content);
    return `approval:${r.id}`;
  }
  async deletePost(postId: string) {
    return true;
  }
  async getEngagementMetrics(postId: string) {
    return { reactions: 0 };
  }
}

export default LinkedInAdapter;
