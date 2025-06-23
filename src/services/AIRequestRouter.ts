import { MultiUserSessionManager, User } from './MultiUserSessionManager';
import { ContextEngine } from './ContextEngine';

export type AIRequestSource = 'whatsapp' | 'chat';

export interface AIRequest {
  userId?: string;
  whatsappId?: string;
  source: AIRequestSource;
  message: string;
  context?: any;
}

export class AIRequestRouter {
  private sessionManager: MultiUserSessionManager;
  private contextEngine: ContextEngine;

  constructor(sessionManager: MultiUserSessionManager, contextEngine: ContextEngine) {
    this.sessionManager = sessionManager;
    this.contextEngine = contextEngine;
  }

  // Main entry point for all requests
  async handleRequest(request: AIRequest): Promise<any> {
    let user: User | undefined;
    if (request.whatsappId) {
      user = this.sessionManager.getUserByWhatsAppId(request.whatsappId);
      if (!user && request.userId) {
        // Link WhatsApp to user if not already linked
        this.sessionManager.linkWhatsAppToUser(request.whatsappId, request.userId);
        user = this.sessionManager.getUser(request.userId);
      }
    } else if (request.userId) {
      user = this.sessionManager.getUser(request.userId);
    }
    if (!user) {
      throw new Error('User not found for request');
    }

    // Sync context if provided
    if (request.context) {
      this.sessionManager.updateUserContext(user.id, request.context);
      this.contextEngine.saveUserContext({ userId: user.id, ...request.context });
    }

    // Route request based on message content
    if (/file|edit|modify|save|rollback/i.test(request.message)) {
      return this.handleFileRequest(user, request);
    }
    if (/project|task|switch|continue/i.test(request.message)) {
      return this.handleProjectRequest(user, request);
    }
    if (/wallet|fund|mpesa|airtel|pesapal|finance|transaction/i.test(request.message)) {
      return this.handleFinancialRequest(user, request);
    }
    if (/version|changelog|update|release/i.test(request.message)) {
      return this.handleVersionRequest(user, request);
    }
    // Default: chat/AI conversation
    return this.handleChatRequest(user, request);
  }

  private async handleFileRequest(user: User, request: AIRequest) {
    // TODO: Implement file editing, preview, commit/rollback logic
    return { status: 'file-handled', user: user.id, message: request.message };
  }

  private async handleProjectRequest(user: User, request: AIRequest) {
    // TODO: Implement project/task switching/continuation logic
    return { status: 'project-handled', user: user.id, message: request.message };
  }

  private async handleFinancialRequest(user: User, request: AIRequest) {
    // TODO: Integrate with wallet, Mpesa, Airtel, Pesapal, etc.
    return { status: 'financial-handled', user: user.id, message: request.message };
  }

  private async handleVersionRequest(user: User, request: AIRequest) {
    // TODO: Return version info, changelog, etc.
    return { status: 'version-handled', user: user.id, message: request.message };
  }

  private async handleChatRequest(user: User, request: AIRequest) {
    // TODO: Integrate with AI chat/response engine
    return { status: 'chat-handled', user: user.id, message: request.message };
  }
} 