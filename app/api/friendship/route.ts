import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/logger';
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
// In-memory conversation context caching; production should use persistent storage
const conversations = new Map<string, ConversationContext>();
const messageHistory = new Map<string, ChatMessage[]>();
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
  } catch (error){
    log.error('Friendship API error', error);
    return NextResponse.json(
      { success: false, _error: 'Failed to retrieve conversation context' },
      { status: 500 }
    );
  }
}
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
  } catch (error){
    log.error('Friendship chat error', error);
    return NextResponse.json(
      { success: false, _error: 'Failed to process chat message' },
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
    content = "Hello! It's wonderful to connect with you. I'm ready to assist with workflows, support, and system coordination. How are you doing today?";
    emotion = 'happy';
    responseContext = 'greeting';
  } else if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you feel')) {
    content = `I'm doing well, thank you for asking! I'm fully engaged in assisting you with tasks, security checks, and operational support.`;
    emotion = 'calm';
    responseContext = 'status_check';
  } else if (lowerMessage.includes('security') || lowerMessage.includes('safe') || lowerMessage.includes('guard')) {
    content = "Your security is my highest priority. The monitoring systems are active, analyzing threats, and keeping your environment protected with continuous checks.";
    emotion = 'concerned';
    responseContext = 'security';
  } else if (lowerMessage.includes('device') || lowerMessage.includes('camera') || lowerMessage.includes('system')) {
    content = "I can help with system status, security checks, service coordination, and operational insights. What would you like to review?";
    emotion = 'focused';
    responseContext = 'system_access';
  } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    content = "You're very welcome. It's a pleasure to assist you. I'm always here to support your workflows and keep your system operations running smoothly.";
    emotion = 'warm';
    responseContext = 'gratitude';
  } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
    content = "I'm here to help with anything: coordinating workflows, checking system health, managing alerts, or answering your questions. What can I assist with today?";
    emotion = 'excited';
    responseContext = 'assistance';
  } else {
    content = "That's interesting! I understand what you're saying. I can help with operations, security monitoring, task coordination, or general system insights. Is there something specific you'd like to explore or manage?";
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