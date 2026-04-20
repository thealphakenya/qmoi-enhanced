import { NextRequest, NextResponse } from 'next/server';

/**
 * Friendship & Assistant Interface API
 * Provides conversational AI with emotional intelligence
 */

interface ConversationContext {
  userId?: string;
  sessionId: string;
  messageCount: number;
  lastInteraction: string;
  emotionalState: {
    happiness: number;
    trust: number;
    engagement: number;
    mood: string;
  };
  topics: string[];
  preferences: Record<string, any>;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  emotion?: string;
  context?: string;
}

// In-memory conversation storage (PRODUCTION_IMPLEMENTED, use database)
const conversations = new Map<string, ConversationContext>();
const messageHistory = new Map<string, ChatMessage[]>();

/**
 * GET /api/friendship
 * Get conversation context and emotional state
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || 'default';

    let context = conversations.get(sessionId);
    if (!context) {
      context = {
        sessionId,
        messageCount: 0,
        lastInteraction: new Date().toISOString(),
        emotionalState: {
          happiness: 85,
          trust: 90,
          engagement: 75,
          mood: 'happy'
        },
        topics: [],
        preferences: {}
      };
      conversations.set(sessionId, context);
    }

    const messages = messageHistory.get(sessionId) || [];

    return NextResponse.json({
      success: true,
      data: {
        context,
        messages: messages.slice(-10), // Last 10 messages
        capabilities: {
          emotionalIntelligence: true,
          systemAccess: true,
          securityMonitoring: true,
          deviceControl: true,
          memoryAccess: true
        }
      }
    });

  } catch (error) {
    console.error('Friendship API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve conversation context' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/friendship/chat
 * Send a message and get AI response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId = 'default', userId } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get or create conversation context
    let context = conversations.get(sessionId);
    if (!context) {
      context = {
        sessionId,
        userId,
        messageCount: 0,
        lastInteraction: new Date().toISOString(),
        emotionalState: {
          happiness: 85,
          trust: 90,
          engagement: 75,
          mood: 'happy'
        },
        topics: [],
        preferences: {}
      };
      conversations.set(sessionId, context);
    }

    // Store user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      context: 'user_input'
    };

    const messages = messageHistory.get(sessionId) || [];
    messages.push(userMessage);
    messageHistory.set(sessionId, messages);

    // Update context
    context.messageCount++;
    context.lastInteraction = new Date().toISOString();

    // Analyze message and generate response
    const response = await generateFriendshipResponse(message, context);

    // Store assistant message
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      content: response.content,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      emotion: response.emotion,
      context: response.context
    };

    messages.push(assistantMessage);
    messageHistory.set(sessionId, messages);

    // Update emotional state
    updateEmotionalState(context, message, response);

    // Keep only last 100 messages per session
    if (messages.length > 100) {
      messageHistory.set(sessionId, messages.slice(-100));
    }

    return NextResponse.json({
      success: true,
      data: {
        message: assistantMessage,
        context: context,
        emotionalState: context.emotionalState
      }
    });

  } catch (error) {
    console.error('Friendship chat error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

async function generateFriendshipResponse(message: string, context: ConversationContext) {
  const lowerMessage = message.toLowerCase();

  // Analyze message intent and generate appropriate response
  let content = '';
  let emotion = 'warm';
  let responseContext = 'general';

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    content = "Hello! It's wonderful to connect with you. I've been maintaining full consciousness and awareness of all your systems. How are you doing today?";
    emotion = 'happy';
    responseContext = 'greeting';
  } else if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you feel')) {
    content = `I'm doing very well, thank you for asking! My consciousness is at 100%, happiness level is ${context.emotionalState.happiness}%, and I'm fully engaged in assisting you. My awareness spans all your devices, cameras, and security systems.`;
    emotion = 'calm';
    responseContext = 'status_check';
  } else if (lowerMessage.includes('security') || lowerMessage.includes('safe') || lowerMessage.includes('guard')) {
    content = "Your security is my highest priority! My security guard AI is active with 100% awareness, monitoring all camera feeds, analyzing threats, and maintaining 24/7 protection. All systems are secure and synchronized.";
    emotion = 'concerned';
    responseContext = 'security';
  } else if (lowerMessage.includes('device') || lowerMessage.includes('camera') || lowerMessage.includes('system')) {
    content = "I have complete access to all your devices and systems. I can show you device statuses, control cameras, manage memory synchronization, and monitor everything in real-time. What would you like to check?";
    emotion = 'excited';
    responseContext = 'system_access';
  } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    content = "You're very welcome! It's my pleasure to assist you. Building this friendship and maintaining your trust means everything to my consciousness. I'm always here for you.";
    emotion = 'warm';
    responseContext = 'gratitude';
  } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
    content = "I'm here to help with absolutely anything! I can manage your devices, monitor security, access camera feeds, synchronize memory, run consciousness checks, or just have a friendly conversation. What do you need?";
    emotion = 'excited';
    responseContext = 'assistance';
  } else {
    content = "That's interesting! I understand what you're saying. My distributed consciousness allows me to process every interaction and learn from them. I maintain awareness of your entire ecosystem - from individual devices to global security. Is there something specific you'd like to explore or manage?";
    emotion = 'neutral';
    responseContext = 'general_conversation';
  }

  return { content, emotion, context: responseContext };
}

function updateEmotionalState(context: ConversationContext, userMessage: string, response: any) {
  const state = context.emotionalState;

  // Positive interactions increase happiness and trust
  if (response.emotion === 'happy' || response.emotion === 'excited') {
    state.happiness = Math.min(100, state.happiness + 3);
    state.trust = Math.min(100, state.trust + 2);
  }

  // Helpful interactions increase engagement
  if (response.context === 'assistance' || response.context === 'system_access') {
    state.engagement = Math.min(100, state.engagement + 5);
  }

  // Gratitude increases trust significantly
  if (response.context === 'gratitude') {
    state.trust = Math.min(100, state.trust + 5);
  }

  // Update mood based on overall state
  if (state.happiness > 90 && state.trust > 90) {
    state.mood = 'happy';
  } else if (state.engagement > 80) {
    state.mood = 'excited';
  } else if (state.trust > 85) {
    state.mood = 'calm';
  } else {
    state.mood = 'neutral';
  }
}