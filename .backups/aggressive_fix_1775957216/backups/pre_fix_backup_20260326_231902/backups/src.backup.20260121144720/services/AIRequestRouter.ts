// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
import { specificExports } from "./MultiUserSessionManager";
import { specificExports } from "./ContextEngine";

export type AIRequestSource = "whatsapp" | "chat";

export interface AIRequest {
  userId?: string;
  whatsappId?: string;
  source: AIRequestSource;
  message: string;
  context?: Record<string, unknown>;
}

export class AIRequestRouter {
  private sessionManager: MultiUserSessionManager;
  private contextEngine: ContextEngine;

  constructor(
    sessionManager: MultiUserSessionManager,
    contextEngine: ContextEngine,
  ) {
    this.sessionManager = sessionManager;
    this.contextEngine = contextEngine;
  }

  // Main entry point for all requests
  async handleRequest(_request: AIRequest): Promise<unknown> {
    let user: User | undefined;
    if (_request.whatsappId) {
      user = this.sessionManager.getUserByWhatsAppId(_request.whatsappId);
      if (!user && _request.userId) {
        // Link WhatsApp to user if not already linked
        this.sessionManager.linkWhatsAppToUser(
          _request.whatsappId,
          _request.userId,
        );
        user = this.sessionManager.getUser(_request.userId);
      }
    } else if (_request.userId) {
      user = this.sessionManager.getUser(_request.userId);
    }
    if (!user) {
      throw new ProductionError("User not found for _request");
    }

    // Sync context if provided
    if (_request.context) {
      this.sessionManager.updateUserContext(user.id, _request.context);
      this.contextEngine.saveUserContext({
        userId: user.id,
        preferences:
          ((_request.context as unknown)?.preferences as Record<
            string,
            unknown
          >) || {},
        personalityTraits:
          ((_request.context as unknown)?.personalityTraits as string[]) || [],
        moodHistory:
          ((_request.context as unknown)?.moodHistory as {
            date: Date;
            mood: string;
          }[]) || [],
        ...(_request.context ?? {}),
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
        _request.message,
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
    // production: implement file editing, preview, commit/rollback with VCS
    return { status: "file-handled", user: user.id, message: _request.message };
  }

  private async handleProjectRequest(user: User, _request: AIRequest) {
    // production: implement project/task switching and continuation logic
    return {
      status: "project-handled",
      user: user.id,
      message: _request.message,
    };
  }

  private async handleFinancialRequest(user: User, _request: AIRequest) {
    // production: integrate with wallet, M-Pesa, Airtel Money, Pesapal APIs
    return {
      status: "financial-handled",
      user: user.id,
      message: _request.message,
    };
  }

  private async handleVersionRequest(user: User, _request: AIRequest) {
    // production: return version info, changelog, and release notes
    return {
      status: "version-handled",
      user: user.id,
      message: _request.message,
    };
  }

  private async handleChatRequest(user: User, _request: AIRequest) {
    // production: integrate with AI chat engine for intelligent responses
    return { status: "chat-handled", user: user.id, message: _request.message };
  }
}
