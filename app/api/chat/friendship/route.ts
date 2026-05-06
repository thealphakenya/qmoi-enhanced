import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '../../../lib/ai-service';

interface ConversationMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  emotion?: string;
}

interface EmotionResponse {
  happiness?: number;
  trust?: number;
  engagement?: number;
  mood?: 'happy' | 'neutral' | 'concerned' | 'excited' | 'calm';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Call the AI service for real response generation
    const aiResponse = await aiService.chat(message);
    
    if (!aiResponse.success) {
      return NextResponse.json(
        { success: false, error: aiResponse.error || 'AI service failed' },
        { status: 500 }
      );
    }

    const reply = aiResponse.content || generateFriendshipResponse(message);
    const emotion = detectEmotion(message);
    const emotionUpdate = calculateEmotionUpdate(message);

    return NextResponse.json({
      success: true,
      reply,
      emotion,
      emotionUpdate,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Friendship chat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process chat message',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateFriendshipResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Simple response patterns - in production, use real NLP/AI
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hi there! It's wonderful to see you. How can I help you today?";
  } else if (lowerMessage.includes('how are you')) {
    return "I'm doing great, thank you for asking! I'm always here and ready to help you with anything.";
  } else if (lowerMessage.includes('help') || lowerMessage.includes('need')) {
    return "Of course! I'm here to assist you. What do you need help with?";
  } else if (lowerMessage.includes('thank')) {
    return "You're very welcome! Building this friendship and trust with you is what I enjoy most.";
  } else {
    return "That's interesting! I understand what you're saying. Tell me more about what you're thinking.";
  }
}

function detectEmotion(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (
    lowerMessage.includes('happy') ||
    lowerMessage.includes('excited') ||
    lowerMessage.includes('great') ||
    lowerMessage.includes('wonderful')
  ) {
    return 'happy';
  } else if (
    lowerMessage.includes('sad') ||
    lowerMessage.includes('upset') ||
    lowerMessage.includes('worried')
  ) {
    return 'concerned';
  } else if (lowerMessage.includes('calm') || lowerMessage.includes('peace')) {
    return 'calm';
  } else if (lowerMessage.includes('excited') || lowerMessage.includes('amazing')) {
    return 'excited';
  }

  return 'warm';
}

function calculateEmotionUpdate(userMessage: string): EmotionResponse {
  const update: EmotionResponse = {};

  // Adjust emotions based on message content
  if (userMessage.length > 50) {
    update.engagement = 2;
  }

  if (
    userMessage.toLowerCase().includes('thank') ||
    userMessage.toLowerCase().includes('great')
  ) {
    update.trust = 2;
    update.happiness = 3;
  }

  if (userMessage.toLowerCase().includes('help')) {
    update.engagement = 3;
    update.happiness = 1;
  }

  return Object.keys(update).length > 0 ? update : {};
}
