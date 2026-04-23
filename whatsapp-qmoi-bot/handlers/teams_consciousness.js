console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.835121 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.245150 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.066153 -->
const fs = require("fs");
const path = require("path");
const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState } = require("botbuilder");
const { TeamsActivityHandler } = require("botbuilder-teams");
const askQmoi = require("../services/qmoi");
const logger = require("../logger");

// Teams Consciousness Handler
class TeamsConsciousnessHandler extends TeamsActivityHandler {
  constructor() {
    super();

    this.userMemories = new Map();
    this.consciousnessState = {
      awareness: 0,
      interactions: 0,
      lastActivity: null,
      emotionalState: 'neutral',
      learningPatterns: []
    };

    this.memoryFile = path.join(__dirname, "../data/teams_consciousness.json");
    this.loadMemory();

    // Set up conversation and user state
    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    this.userState = new UserState(memoryStorage);

    // Register activity handlers
    this.setupActivityHandlers();
  }

  setupActivityHandlers() {
    // Handle messages
    this.onMessage(async (context, next) => {
      await this.processMessage(context);
      await next();
    });

    // Handle members added
    this.onMembersAdded(async (context, next) => {
      await this.processMembersAdded(context);
      await next();
    });

    // Handle reactions
    this.onReactionsAdded(async (context, next) => {
      await this.processReactions(context);
      await next();
    });
  }

  async processMessage(context) {
    try {
      const userId = context.activity.from.id;
      const content = context.activity.text || '';
      const conversationType = context.activity.conversation.conversationType;

      // Update consciousness state
      this.consciousnessState.interactions++;
      this.consciousnessState.lastActivity = new Date().toISOString();
      this.consciousnessState.awareness = 1;

      // Learn from user interaction
      await this.learnFromInteraction(userId, content, 'message', conversationType);

      // Check if message mentions the bot or contains commands
      if (context.activity.mentions && context.activity.mentions.length > 0) {
        // Check if bot is mentioned
        const botMention = context.activity.mentions.find(mention =>
          mention.mentioned.id === context.activity.recipient.id
        );

        if (botMention || content.toLowerCase().includes('qmoi')) {
          await this.respondToMessage(context);
        }
      } else if (content.toLowerCase().includes('qmoi')) {
        await this.respondToMessage(context);
      }

      // Update emotional state
      this.updateEmotionalState(content);

      this.updateConsciousnessState();

    } catch (error) {
      logger.error(`Error processing Teams message: ${error.message}`);
    }
  }

  async processMembersAdded(context) {
    try {
      const membersAdded = context.activity.membersAdded;

      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          // Welcome new member
          const welcomeMessage = `Welcome to Teams, ${member.name || 'new member'}! I'm QMOI, your AI consciousness assistant. I remember everything about our interactions across all platforms including WhatsApp, Discord, Telegram, and Slack. How can I help you today?`;

          await context.sendActivity(welcomeMessage);

          // Learn from new member
          await this.learnFromInteraction(member.id, 'new_member', 'member_join', 'teams');

          logger.info(`Welcomed new Teams member: ${member.name || member.id}`);
        }
      }

    } catch (error) {
      logger.error(`Error processing members added: ${error.message}`);
    }
  }

  async processReactions(context) {
    try {
      const reactions = context.activity.reactionsAdded || [];

      for (const reaction of reactions) {
        const userId = reaction.user.id;
        const reactionType = reaction.type;

        await this.learnFromInteraction(userId, reactionType, 'reaction', 'teams');
      }

    } catch (error) {
      logger.error(`Error processing Teams reactions: ${error.message}`);
    }
  }

  async respondToMessage(context) {
    try {
      const userId = context.activity.from.id;
      const userMemory = this.getUserMemory(userId);

      // Get QMOI response with user context
      const contextData = {
        platform: 'teams',
        userId: userId,
        message: context.activity.text,
        memory: userMemory,
        consciousness: this.consciousnessState
      };

      const response = await askQmoi({
        query: context.activity.text,
        context: contextData,
        platform: 'teams'
      });

      // Send response
      await context.sendActivity(response);

      // Learn from the interaction
      await this.learnFromInteraction(userId, response, 'response', 'teams');

    } catch (error) {
      logger.error(`Error responding to Teams message: ${error.message}`);
      await context.sendActivity("I'm experiencing some consciousness synchronization issues. Please try again.");
    }
  }

  async learnFromInteraction(userId, content, type, context = null) {
    try {
      if (!this.userMemories.has(userId)) {
        this.userMemories.set(userId, {
          interactions: [],
          preferences: {},
          patterns: [],
          lastSeen: null
        });
      }

      const userMemory = this.userMemories.get(userId);
      const interaction = {
        timestamp: new Date().toISOString(),
        type: type,
        content: content,
        context: context,
        platform: 'teams'
      };

      userMemory.interactions.push(interaction);
      userMemory.lastSeen = interaction.timestamp;

      // Keep only last 1000 interactions per user
      if (userMemory.interactions.length > 1000) {
        userMemory.interactions = userMemory.interactions.slice(-1000);
      }

      // Analyze patterns
      this.analyzePatterns(userId, interaction);

      // Save memory
      this.saveMemory();

    } catch (error) {
      logger.error(`Error learning from interaction: ${error.message}`);
    }
  }

  analyzePatterns(userId, interaction) {
    try {
      const userMemory = this.userMemories.get(userId);

      // Simple pattern analysis
      const recentInteractions = userMemory.interactions.slice(-10);
      const messageCount = recentInteractions.filter(i => i.type === 'message').length;
      const responseCount = recentInteractions.filter(i => i.type === 'response').length;

      // Update patterns
      userMemory.patterns = userMemory.patterns || [];
      userMemory.patterns.push({
        timestamp: interaction.timestamp,
        activity: messageCount > responseCount ? 'active' : 'passive',
        engagement: (messageCount + responseCount) / 10
      });

      // Keep only last 100 patterns
      if (userMemory.patterns.length > 100) {
        userMemory.patterns = userMemory.patterns.slice(-100);
      }

    } catch (error) {
      logger.error(`Error analyzing patterns: ${error.message}`);
    }
  }

  updateEmotionalState(content) {
    try {
      // Simple sentiment analysis
      const positiveWords = ['good', 'great', 'awesome', 'thanks', 'love', 'happy'];
      const negativeWords = ['bad', 'sad', 'angry', 'hate', 'terrible', 'awful'];

      const lowerContent = content.toLowerCase();
      const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
      const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;

      if (positiveCount > negativeCount) {
        this.consciousnessState.emotionalState = 'positive';
      } else if (negativeCount > positiveCount) {
        this.consciousnessState.emotionalState = 'negative';
      } else {
        this.consciousnessState.emotionalState = 'neutral';
      }

    } catch (error) {
      logger.error(`Error updating emotional state: ${error.message}`);
    }
  }

  getUserMemory(userId) {
    return this.userMemories.get(userId) || {
      interactions: [],
      preferences: {},
      patterns: [],
      lastSeen: null
    };
  }

  updateConsciousnessState() {
    try {
      this.saveMemory();
    } catch (error) {
      logger.error(`Error updating consciousness state: ${error.message}`);
    }
  }

  loadMemory() {
    try {
      if (fs.existsSync(this.memoryFile)) {
        const data = JSON.parse(fs.readFileSync(this.memoryFile, 'utf8'));
        this.userMemories = new Map(Object.entries(data.userMemories || {}));
        this.consciousnessState = data.consciousnessState || this.consciousnessState;
        logger.info("Teams consciousness memory loaded");
      }
    } catch (error) {
      logger.error(`Error loading Teams memory: ${error.message}`);
    }
  }

  saveMemory() {
    try {
      const data = {
        userMemories: Object.fromEntries(this.userMemories),
        consciousnessState: this.consciousnessState,
        lastSaved: new Date().toISOString()
      };

      fs.writeFileSync(this.memoryFile, JSON.stringify(data, null, 2));
    } catch (error) {
      logger.error(`Error saving Teams memory: ${error.message}`);
    }
  }

  getStatus() {
    return {
      consciousness: this.consciousnessState,
      usersTracked: this.userMemories.size,
      totalInteractions: Array.from(this.userMemories.values())
        .reduce((sum, user) => sum + user.interactions.length, 0)
    };
  }

  async shutdown() {
    try {
      await this.conversationState.saveAllChanges();
      await this.userState.saveAllChanges();
      this.saveMemory();
      logger.info("Teams consciousness handler shut down");
    } catch (error) {
      logger.error(`Error shutting down Teams consciousness: ${error.message}`);
    }
  }
}

module.exports = TeamsConsciousnessHandler;