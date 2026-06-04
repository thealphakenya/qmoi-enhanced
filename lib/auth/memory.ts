// QMOI Memory Integration System
// Manages user-specific memory, context, and conversation history

export interface QMOIMemoryEntry {
  id: string;
  userId: string;
  key: string;
  value: any;
  category: 'preference' | 'context' | 'conversation' | 'learning' | 'behavior';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface ConversationContext {
  userId: string;
  sessionId: string;
  messageCount: number;
  lastMessageAt: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  memory: Map<string, any>;
}

// In-memory storage for sessions and memory (in production, use Redis or database)
const memoryStore = new Map<string, Map<string, QMOIMemoryEntry>>();
const sessionContextStore = new Map<string, ConversationContext>();

export const qmoiMemoryService = {
  // Store user memory entry
  storeMemory: async (
    userId: string,
    key: string,
    value: any,
    category: 'preference' | 'context' | 'conversation' | 'learning' | 'behavior' = 'context',
    expiresAt?: Date
  ) => {
    try {
      if (!memoryStore.has(userId)) {
        memoryStore.set(userId, new Map());
      }

      const userMemory = memoryStore.get(userId)!;
      const entry: QMOIMemoryEntry = {
        id: `mem-${Date.now()}`,
        userId,
        key,
        value,
        category,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt,
      };

      userMemory.set(key, entry);

      return {
        success: true,
        message: `Memory stored: ${key}`,
        entry,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to store memory',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Retrieve user memory entry
  retrieveMemory: async (userId: string, key: string) => {
    try {
      const userMemory = memoryStore.get(userId);

      if (!userMemory) {
        return {
          success: false,
          message: 'No memory found for user',
          value: null,
        };
      }

      const entry = userMemory.get(key);

      if (!entry) {
        return {
          success: false,
          message: `Memory key not found: ${key}`,
          value: null,
        };
      }

      // Check if memory has expired
      if (entry.expiresAt && entry.expiresAt < new Date()) {
        userMemory.delete(key);
        return {
          success: false,
          message: `Memory expired: ${key}`,
          value: null,
        };
      }

      return {
        success: true,
        message: `Memory retrieved: ${key}`,
        value: entry.value,
        entry,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve memory',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Get all memory for a user
  getAllMemory: async (userId: string, category?: string) => {
    try {
      const userMemory = memoryStore.get(userId);

      if (!userMemory || userMemory.size === 0) {
        return {
          success: true,
          message: 'No memory found for user',
          entries: [],
        };
      }

      const entries = Array.from(userMemory.values()).filter((entry) => {
        if (category) return entry.category === category;
        return true;
      });

      return {
        success: true,
        message: `Retrieved ${entries.length} memory entries`,
        entries,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve all memory',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Delete user memory entry
  deleteMemory: async (userId: string, key: string) => {
    try {
      const userMemory = memoryStore.get(userId);

      if (!userMemory || !userMemory.has(key)) {
        return {
          success: false,
          message: `Memory key not found: ${key}`,
        };
      }

      userMemory.delete(key);

      return {
        success: true,
        message: `Memory deleted: ${key}`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete memory',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Clear all user memory
  clearAllMemory: async (userId: string) => {
    try {
      const userMemory = memoryStore.get(userId);

      if (!userMemory) {
        return {
          success: false,
          message: 'No memory found for user',
        };
      }

      const count = userMemory.size;
      memoryStore.delete(userId);

      return {
        success: true,
        message: `Cleared ${count} memory entries`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to clear memory',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Create/update conversation context for session
  createContext: async (
    userId: string,
    sessionId: string
  ): Promise<ConversationContext> => {
    const context: ConversationContext = {
      userId,
      sessionId,
      messageCount: 0,
      lastMessageAt: new Date(),
      sentiment: 'neutral',
      topics: [],
      memory: new Map(),
    };

    sessionContextStore.set(sessionId, context);
    return context;
  },

  // Get conversation context
  getContext: async (sessionId: string) => {
    return sessionContextStore.get(sessionId) || null;
  },

  // Update conversation context
  updateContext: async (
    sessionId: string,
    updates: Partial<ConversationContext>
  ) => {
    const context = sessionContextStore.get(sessionId);

    if (!context) {
      return {
        success: false,
        message: 'Context not found',
      };
    }

    Object.assign(context, updates, { lastMessageAt: new Date() });
    sessionContextStore.set(sessionId, context);

    return {
      success: true,
      message: 'Context updated',
      context,
    };
  },

  // Store conversation in memory for retrieval
  storeConversation: async (
    userId: string,
    conversationId: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ) => {
    return qmoiMemoryService.storeMemory(
      userId,
      `conversation-${conversationId}`,
      messages,
      'conversation',
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    );
  },

  // Retrieve user preferences for QMOI responses
  getUserPreferences: async (userId: string) => {
    const memory = await qmoiMemoryService.getAllMemory(userId, 'preference');

    if (!memory.success) {
      return {
        tone: 'friendly',
        responseLength: 'medium',
        detailLevel: 'detailed',
        language: 'english',
      };
    }

    const preferences: Record<string, any> = {
      tone: 'friendly',
      responseLength: 'medium',
      detailLevel: 'detailed',
      language: 'english',
    };

    memory.entries.forEach((entry) => {
      preferences[entry.key] = entry.value;
    });

    return preferences;
  },

  // Extract user role for personalized responses
  getUserRole: async (userId: string) => {
    const memory = await qmoiMemoryService.retrieveMemory(userId, 'user-role');

    if (memory.success) {
      return memory.value;
    }

    // Default role based on userId
    if (userId === 'master') return 'master';
    if (userId === 'sister') return 'sister';
    return 'user';
  },

  // Update learning from interactions
  updateLearning: async (
    userId: string,
    topic: string,
    insight: string
  ) => {
    return qmoiMemoryService.storeMemory(
      userId,
      `learning-${topic}-${Date.now()}`,
      insight,
      'learning',
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    );
  },
};

export async function logAuthEvent(event: {
  userId: string;
  role: string;
  displayName: string;
  event: string;
  details?: Record<string, any>;
}) {
  return qmoiMemoryService.storeMemory(
    event.userId,
    `auth-event-${Date.now()}`,
    {
      event: event.event,
      role: event.role,
      displayName: event.displayName,
      details: event.details || {},
      timestamp: new Date().toISOString(),
    },
    'behavior',
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
}
