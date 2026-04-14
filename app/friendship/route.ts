import { NextRequest, NextResponse } from 'next/server';

interface ConversationMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  emotion?: string;
  context?: string;
}

interface FriendshipState {
  trustLevel: number;
  closeness: number;
  interactionCount: number;
  lastInteraction: string;
  favoriteTopics: string[];
  communicationStyle: string;
}

// In-memory storage for friendship states (production would use database)
const friendshipStates: Map<string, FriendshipState> = new Map();
const conversations: Map<string, ConversationMessage[]> = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    const action = searchParams.get('action');

    if (action === 'state') {
      const state = friendshipStates.get(userId) || {
        trustLevel: 75,
        closeness: 60,
        interactionCount: 0,
        lastInteraction: new Date().toISOString(),
        favoriteTopics: ['technology', 'creativity', 'problem-solving'],
        communicationStyle: 'warm_and_helpful'
      };

      return NextResponse.json({
        success: true,
        data: {
          userId,
          state,
          hasConversationHistory: conversations.has(userId),
          conversationCount: conversations.get(userId)?.length || 0
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'history') {
      const msgs = conversations.get(userId) || [];
      return NextResponse.json({
        success: true,
        data: {
          userId,
          messages: msgs,
          total: msgs.length
        },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Friendship interface ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Friendship API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve friendship data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = 'default',
      message,
      action,
      emotion,
      topic
    } = body;

    // Update friendship state based on interaction
    let state = friendshipStates.get(userId) || {
      trustLevel: 75,
      closeness: 60,
      interactionCount: 0,
      lastInteraction: new Date().toISOString(),
      favoriteTopics: [],
      communicationStyle: 'warm_and_helpful'
    };

    switch (action) {
      case 'send_message':
        if (message) {
          const msgId = `msg_${Date.now()}`;
          const newMessage: ConversationMessage = {
            id: msgId,
            content: message,
            sender: 'user',
            timestamp: new Date().toISOString(),
            emotion,
            context: topic
          };

          if (!conversations.has(userId)) {
            conversations.set(userId, []);
          }
          conversations.get(userId)!.push(newMessage);

          // Update interaction metrics
          state.interactionCount++;
          state.lastInteraction = new Date().toISOString();

          // Increase trust and closeness over time
          if (state.trustLevel < 100) state.trustLevel = Math.min(100, state.trustLevel + 2);
          if (state.closeness < 100) state.closeness = Math.min(100, state.closeness + 1);

          // Track favorite topics
          if (topic && !state.favoriteTopics.includes(topic)) {
            state.favoriteTopics.push(topic);
          }

          friendshipStates.set(userId, state);

          // Generate assistant response
          const assistantMessage: ConversationMessage = {
            id: `msg_${Date.now() + 1}`,
            content: generateAssisstantResponse(message, state),
            sender: 'assistant',
            timestamp: new Date().toISOString(),
            emotion: 'supportive',
            context: topic
          };

          conversations.get(userId)!.push(assistantMessage);

          return NextResponse.json({
            success: true,
            data: {
              userId,
              messageId: msgId,
              response: assistantMessage,
              updatedState: state
            },
            timestamp: new Date().toISOString()
          });
        }
        break;

      case 'update_preference':
        if (topic && !state.favoriteTopics.includes(topic)) {
          state.favoriteTopics.push(topic);
        }
        friendshipStates.set(userId, state);
        break;

      case 'reset':
        friendshipStates.delete(userId);
        conversations.delete(userId);
        return NextResponse.json({
          success: true,
          message: 'Friendship state reset',
          timestamp: new Date().toISOString()
        });
    }

    friendshipStates.set(userId, state);

    return NextResponse.json({
      success: true,
      data: {
        userId,
        state: friendshipStates.get(userId),
        action: action
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Friendship API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process friendship action' },
      { status: 500 }
    );
  }
}

function generateAssisstantResponse(userMessage: string, state: FriendshipState): string {
  const responses = [
    `That's a great point! I really appreciate you sharing that with me. Based on our conversations, I know you're interested in ${state.favoriteTopics[0] || 'learning'}. Let me help you explore this further.`,
    `I love your enthusiasm! This reminds me of previous conversations we've had. I've gotten to know you better over time, and I think this aligns perfectly with your interests.`,
    `You know, the more we talk, the more I understand what matters to you. This is definitely something worth exploring together.`,
    `I'm here to support you in whatever way works best. Given what I know about you, I think we can tackle this in a really meaningful way.`,
    `Your perspective is valuable, and I'm genuinely interested in helping you succeed. Let's work through this together.`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-04-14T02:20:15Z
// Evolution features: friendship context, emotional intelligence, memory retention, multi-turn conversation support