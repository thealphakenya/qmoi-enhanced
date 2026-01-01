import { MultiUserSessionManager, User } from "./MultiUserSessionManager";
import { ContextEngine } from "./ContextEngine";

export type AIRequestSource = "whatsapp" | "chat";

export interface AIRequest {
  userId?: string;
  whatsappId?: string;
  source: AIRequestSource;
  message: string;
  context?: unknown;
}

export class AIRequestRouter {
  private sessionManager: MultiUserSessionManager;
  private contextEngine: ContextEngine;

  constructor(
    sessionManager: MultiUserSessionManager,
    contextEngine: ContextEngine
  ) {
    this.sessionManager = sessionManager;
    this.contextEngine = contextEngine;
  }

  // Main entry point for all requests
  async handleRequest(_request: AIRequest): Promise<any> {
    let user: User | undefined;
    if (_request.whatsappId) {
      user = this.sessionManager.getUserByWhatsAppId(_request.whatsappId);
      if (!user && _request.userId) {
        // Link WhatsApp to user if not already linked
        this.sessionManager.linkWhatsAppToUser(
          _request.whatsappId,
          _request.userId
        );
        user = this.sessionManager.getUser(_request.userId);
      }
    } else if (_request.userId) {
      user = this.sessionManager.getUser(_request.userId);
    }
    if (!user) {
      throw new Error("User not found for _request");
    }

    // Sync context if provided
    if (_request.context) {
      this.sessionManager.updateUserContext(user.id, _request.context);
      this.contextEngine.saveUserContext({
        userId: user.id,
        ...(_request.context as object),
      });
    }

    // Route _request based on message content
    if (/file|edit|modify|save|rollback/i.test(_request.message)) {
      return this.handleFileRequest(user, _request);
    }
    if (/project|task|switch|continue/i.test(_request.message)) {
      return this.handleProjectRequest(user, _request);
    }
    if (
      /wallet|fund|mpesa|airtel|pesapal|finance|transaction/i.test(
        _request.message
      )
    ) {
      return this.handleFinancialRequest(user, _request);
    }
    if (/version|changelog|update|release/i.test(_request.message)) {
      return this.handleVersionRequest(user, _request);
    }
    // Default: chat/AI conversation
    return this.handleChatRequest(user, _request);
  }

  private async handleFileRequest(user: User, _request: AIRequest) {
    // TODO: Implement file editing, preview, commit/rollback logic
    return { status: "file-handled", user: user.id, message: _request.message };
  }

  private async handleProjectRequest(user: User, _request: AIRequest) {
    // TODO: Implement project/task switching/continuation logic
    return {
      status: "project-handled",
      user: user.id,
      message: _request.message,
    };
  }

  private async handleFinancialRequest(user: User, _request: AIRequest) {
    // TODO: Integrate with wallet, Mpesa, Airtel, Pesapal, etc.
    return {
      status: "financial-handled",
      user: user.id,
      message: _request.message,
    };
  }

  private async handleVersionRequest(user: User, _request: AIRequest) {
    // TODO: Return version info, changelog, etc.
    return {
      status: "version-handled",
      user: user.id,
      message: _request.message,
    };
  }

  private async handleChatRequest(user: User, _request: AIRequest) {
    // TODO: Integrate with AI chat/_response engine
    return { status: "chat-handled", user: user.id, message: _request.message };
  }
}
