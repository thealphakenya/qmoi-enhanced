import { ContentPlatformAdapter, PlatformConfig, ApprovalFlow } from "../types";

export class YouTubeAdapter implements ContentPlatformAdapter {
  platformId = "youtube";
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
  async uploadContent(content: unknown, metadata: unknown) {
    const r = await this.requestApproval("uploadContent", {
      content,
      metadata,
    });
    return `approval:${r.id}`;
  }
  async updateContent(contentId: string, updates: unknown) {
    return true;
  }
  async getContentMetrics(contentId: string) {
    return { views: 0 };
  }
}

export default YouTubeAdapter;
