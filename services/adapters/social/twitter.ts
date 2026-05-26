import type { PlatformConfig, SocialPlatformAdapter } from "../types";
import { ApprovalFlow } from "../types";

export class TwitterAdapter implements SocialPlatformAdapter {
  readonly platformId = "twitter";
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
      const request = await this.requestApproval("create_tweet", content);
      if (!(await this.isApproved(request.id))) {
        throw new Error("Approval required");
      }
    }
    return `twitter-post-${Date.now()}`;
  }

  async deletePost(postId: string): Promise<boolean> {
    return true;
  }

  async getEngagementMetrics(postId: string): Promise<Record<string, number>> {
    return { likes: 0, retweets: 0, replies: 0 };
  }

  async getAnalytics(): Promise<Record<string, number>> {
    return { totalTweets: 0, totalImpressions: 0 };
  }
}

export default TwitterAdapter;
