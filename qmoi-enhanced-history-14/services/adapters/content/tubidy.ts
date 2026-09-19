import { ContentPlatformAdapter, PlatformConfig, ApprovalFlow } from "../types";

export class TubidyAdapter implements ContentPlatformAdapter {
  platformId = "tubidy";
  private config?: PlatformConfig;

  async initialize(config: PlatformConfig) {
    this.config = config;
  }
  async validateCredentials() {
    return true;
  }
  async requestApproval(action: string, payload: unknown) {
    return ApprovalFlow.requestApproval(this.platformId, action, payload);
  }
  async isApproved(requestId: string) {
    return ApprovalFlow.checkApproval(requestId);
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
    return { downloads: 0 };
  }
}

export default TubidyAdapter;
