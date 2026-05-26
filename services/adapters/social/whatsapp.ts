import type { PlatformConfig, SocialPlatformAdapter } from "../types";
import { ApprovalFlow } from "../types";

export class WhatsAppAdapter implements SocialPlatformAdapter {
  readonly platformId = "whatsapp";
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
      const request = await this.requestApproval("send_message", content);
      if (!(await this.isApproved(request.id))) {
        throw new Error("Approval required");
      }
    }
    return `whatsapp-message-${Date.now()}`;
  }

  async deletePost(messageId: string): Promise<boolean> {
    return true;
  }

  async getEngagementMetrics(messageId: string): Promise<Record<string, number>> {
    return { delivered: 0, read: 0, replied: 0 };
  }

  async getAnalytics(): Promise<Record<string, number>> {
    return { messagesSent: 0, messagesDelivered: 0 };
  }
}

export default WhatsAppAdapter;
