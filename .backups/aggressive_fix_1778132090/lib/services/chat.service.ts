/**
 * AI Chat Service - production API Integration
 * Handles AI chat, conversation management, and model selection
 */

import { apiService, type ApiResponse } from './api.service';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  timestamp: string;
  tokens?: {
    input: number;
    output: number;
  };
  metadata?: Record<string, unknown>;
}

export interface ChatConversation {
  id: string;
  title: string;
  model: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface ChatModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'local' | 'custom';
  version: string;
  contextWindow: number;
  costPer1kTokens: number;
  enabled: boolean;
}

export interface ChatStats {
  totalConversations: number;
  totalMessages: number;
  totalTokensUsed: number;
  totalCostUsd: number;
  lastUpdated: string;
}

class ChatService {
  /**
   * Start new conversation
   */
  async startConversation(title: string, model: string = 'auto'): Promise<ApiResponse<ChatConversation>> {
    return apiService.post<ChatConversation>('/chat/conversations', { title, model });
  }

  /**
   * Get all conversations
   */
  async getConversations(archived: boolean = false): Promise<ApiResponse<ChatConversation[]>> {
    return apiService.get<ChatConversation[]>(`/chat/conversations?archived=${archived}`, true);
  }

  /**
   * Get single conversation
   */
  async getConversation(conversationId: string): Promise<ApiResponse<ChatConversation>> {
    return apiService.get<ChatConversation>(`/chat/conversations/${conversationId}`);
  }

  /**
   * Send message and get response (streaming-compatible)
   */
  async sendMessage(
    conversationId: string,
    content: string,
    model?: string
  ): Promise<ApiResponse<ChatMessage>> {
    return apiService.post<ChatMessage>(`/chat/conversations/${conversationId}/messages`, {
      content,
      model,
    });
  }

  /**
   * Get conversation messages
   */
  async getMessages(conversationId: string, limit: number = 50, offset: number = 0): Promise<ApiResponse<ChatMessage[]>> {
    return apiService.get<ChatMessage[]>(
      `/chat/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * Update conversation title
   */
  async updateConversation(
    conversationId: string,
    updates: Partial<ChatConversation>
  ): Promise<ApiResponse<ChatConversation>> {
    return apiService.put<ChatConversation>(`/chat/conversations/${conversationId}`, updates);
  }

  /**
   * Archive conversation
   */
  async archiveConversation(conversationId: string): Promise<ApiResponse<ChatConversation>> {
    return apiService.patch<ChatConversation>(`/chat/conversations/${conversationId}`, { archived: true });
  }

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`/chat/conversations/${conversationId}`);
  }

  /**
   * Get available models
   */
  async getAvailableModels(): Promise<ApiResponse<ChatModel[]>> {
    return apiService.get<ChatModel[]>('/chat/models', true);
  }

  /**
   * Get chat statistics
   */
  async getChatStats(): Promise<ApiResponse<ChatStats>> {
    return apiService.get<ChatStats>('/chat/stats');
  }

  /**
   * Stream message (for real-time responses)
   */
  async streamMessage(
    conversationId: string,
    content: string,
    onChunk: (chunk: string) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      const authToken = this.getAuthToken();
      const response = await fetch(`${this.getBaseUrl()}/chat/conversations/${conversationId}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`Stream error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                onChunk(data.chunk);
              }
            } catch (e) {
              // Invalid JSON, skip
            }
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Stream failed';
      onError?.(message);
    }
  }

  private getAuthToken(): string {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token') || '';
      }
    } catch {
      // Server-side
    }
    return '';
  }

  private getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || '/api';
  }
}

export const chatService = new ChatService();
