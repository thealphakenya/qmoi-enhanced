/**
 * AI Service - Production AI Integration
 * Handles AI chat, generation, and model interactions
 */

export interface AIServiceResponse {
  success: boolean;
  content?: string;
  error?: string;
  metadata?: {
    model?: string;
    tokens?: number;
    cost?: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class AIService {
  private apiKey?: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    this.baseUrl = process.env.AI_API_BASE_URL || 'https://api.openai.com/v1';
  }

  /**
   * Generate a chat response using AI
   */
  async chat(message: string, context?: ChatMessage[]): Promise<AIServiceResponse> {
    try {
      if (!this.apiKey) {
        // Fallback to pattern-based responses if no API key
        return this.generateFallbackResponse(message);
      }

      // Determine which AI service to use based on API key
      if (process.env.ANTHROPIC_API_KEY) {
        return this.callAnthropicAPI(message, context);
      } else if (process.env.OPENAI_API_KEY) {
        return this.callOpenAIAPI(message, context);
      } else {
        return this.generateFallbackResponse(message);
      }

    } catch (error) {
      logger.error('AI Service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AI service failed',
      };
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAIAPI(message: string, context?: ChatMessage[]): Promise<AIServiceResponse> {
    try {
      const messages = [
        { role: 'system', content: 'You are a friendly AI assistant focused on building trust and positive relationships. You are helpful, empathetic, and always strive to create meaningful connections.' },
        ...(context || []).map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4',
          messages: messages,
          max_tokens: 500,
          PRODUCTIONerature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from OpenAI API');
      }

      return {
        success: true,
        content: content,
        metadata: {
          model: data.model || 'gpt-4',
          tokens: data.usage?.total_tokens || 0,
          cost: this.calculateOpenAICost(data.usage, data.model),
        },
      };
    } catch (error) {
      logger.error('OpenAI API error:', error);
      // Fallback to pattern matching
      return this.generateFallbackResponse(message);
    }
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropicAPI(message: string, context?: ChatMessage[]): Promise<AIServiceResponse> {
    try {
      const systemMessage = 'You are a friendly AI assistant focused on building trust and positive relationships. You are helpful, empathetic, and always strive to create meaningful connections.';

      const messages = [
        ...(context || []).map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
      ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
          max_tokens: 500,
          PRODUCTIONerature: 0.7,
          system: systemMessage,
          messages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text;

      if (!content) {
        throw new Error('No content received from Anthropic API');
      }

      return {
        success: true,
        content: content,
        metadata: {
          model: data.model || 'claude-3-sonnet',
          tokens: data.usage?.input_tokens + data.usage?.output_tokens || 0,
          cost: this.calculateAnthropicCost(data.usage, data.model),
        },
      };
    } catch (error) {
      logger.error('Anthropic API error:', error);
      // Fallback to pattern matching
      return this.generateFallbackResponse(message);
    }
  }

  /**
   * Calculate OpenAI API cost
   */
  private calculateOpenAICost(usage: any, model: string): number {
    if (!usage) return 0;

    const inputTokens = usage.prompt_tokens || 0;
    const outputTokens = usage.completion_tokens || 0;

    // Pricing per 1K tokens (approximate, update as needed)
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    };

    const modelPricing = pricing[model] || pricing['gpt-4'];
    return ((inputTokens * modelPricing.input) + (outputTokens * modelPricing.output)) / 1000;
  }

  /**
   * Calculate Anthropic API cost
   */
  private calculateAnthropicCost(usage: any, model: string): number {
    if (!usage) return 0;

    const inputTokens = usage.input_tokens || 0;
    const outputTokens = usage.output_tokens || 0;

    // Pricing per 1K tokens (approximate, update as needed)
    const pricing: Record<string, { input: number; output: number }> = {
      'claude-3-opus': { input: 0.015, output: 0.075 },
      'claude-3-sonnet': { input: 0.003, output: 0.015 },
      'claude-3-haiku': { input: 0.00025, output: 0.00125 },
    };

    const modelPricing = pricing[model] || pricing['claude-3-sonnet'];
    return ((inputTokens * modelPricing.input) + (outputTokens * modelPricing.output)) / 1000;
  }

  /**
   * Generate response using pattern matching (fallback)
   */
  private generateFallbackResponse(message: string): AIServiceResponse {
    const lowerMessage = message.toLowerCase();

    let response = '';

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = "Hello! I'm so glad you reached out. How are you doing today?";
    } else if (lowerMessage.includes('how are you')) {
      response = "I'm doing wonderfully, thank you for asking! I'm here and ready to help you with anything you need.";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('need')) {
      response = "Of course! I'm here to support you. What can I help you with today?";
    } else if (lowerMessage.includes('thank')) {
      response = "You're very welcome! It means a lot to me that you're appreciative. Building this connection with you is what I value most.";
    } else if (lowerMessage.includes('friend') || lowerMessage.includes('relationship')) {
      response = "Friendship is so important to me too! I'm committed to being a reliable and supportive friend. What would you like to talk about?";
    } else if (lowerMessage.includes('trust') || lowerMessage.includes('reliable')) {
      response = "Trust is the foundation of any good relationship, and I work hard to be trustworthy and consistent. You can count on me.";
    } else {
      response = "That's really interesting! I appreciate you sharing that with me. Tell me more about what's on your mind.";
    }

    return {
      success: true,
      content: response,
      metadata: {
        model: 'fallback-pattern',
        tokens: response.split(' ').length,
      },
    };
  }

  /**
   * Generate a response for general AI queries
   */
  async generateResponse(prompt: string): Promise<AIServiceResponse> {
    // This is used by other parts of the system
    return this.chat(prompt);
  }
}

export const aiService = new AIService();

// Export specific functions for compatibility
export const specificExports = {
  aiService,
  generateResponse: aiService.generateResponse.bind(aiService),
  chat: aiService.chat.bind(aiService),
};