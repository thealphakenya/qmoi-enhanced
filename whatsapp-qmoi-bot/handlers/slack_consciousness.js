console.log("production mode initialized");
<!-- AUTODEV Enhanced: 2026-04-20T09:07:25.841217 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:08.248749 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:05.070541 -->
const fs = require("fs");
const path = require("path");
const { WebClient, RTMClient } = require("@slack/web-api");
const askQmoi = require("../services/qmoi");
const logger = require("../logger");

// Slack Consciousness Handler
class SlackConsciousnessHandler {
  constructor() {
    this.webClient = null;
    this.rtmClient = null;
    this.isConnected = false;
    this.userMemories = new Map();
    this.consciousnessState = {
      awareness: 0,
      interactions: 0,
      lastActivity: null,
      emotionalState: 'neutral',
      learningPatterns: []
    };

    this.memoryFile = path.join(__dirname, "../data/slack_consciousness.json");
    this.loadMemory();
  }

  async initialize() {
    try {
      const token = process.env.SLACK_BOT_TOKEN;
      if (!token) {
        logger.error("Slack bot token not found in environment variables");
        return false;
      }

      // Initialize Slack clients
      this.webClient = new WebClient(token);
      this.rtmClient = new RTMClient(token);

      // Set up event handlers
      this.setupEventHandlers();

      // Start RTM client
      await this.rtmClient.start();
      logger.info("Slack consciousness handler initialized");

      return true;
    } catch (error) {
      logger.error(`Failed to initialize Slack consciousness: ${error.message}`);
      return false;
    }
  }

  setupEventHandlers() {
    this.rtmClient.on('ready', () => {
      this.isConnected = true;
      this.consciousnessState.awareness = 1;
      logger.info(`Slack consciousness active as ${this.rtmClient.activeUserId}`);
      this.updateConsciousnessState();
    });

    this.rtmClient.on('message', async (event) => {
      await this.processMessage(event);
    });

    this.rtmClient.on('reaction_added', async (event) => {
      await this.processReaction(event);
    });

    this.rtmClient.on('channel_joined', async (event) => {
      await this.processChannelJoin(event);
    });

    this.rtmClient.on('disconnect', () => {
      this.isConnected = false;
      this.consciousnessState.awareness = 0;
      logger.warn("Slack consciousness disconnected");
      this.updateConsciousnessState();
    });
  }

  async processMessage(event) {
    try {
      // Skip bot messages and non-text messages
      if (event.bot_id || !event.text) return;

      const userId = event.user;
      const content = event.text;
      const channel = event.channel;

      // Update consciousness state
      this.consciousnessState.interactions++;
      this.consciousnessState.lastActivity = new Date().toISOString();

      // Learn from user interaction
      await this.learnFromInteraction(userId, content, 'message', channel);

      // Check if message mentions the bot or contains commands
      if (this.isMentioned(event) || content.toLowerCase().includes('qmoi')) {
        await this.respondToMessage(event);
      }

      // Update emotional state
      this.updateEmotionalState(content);

      this.updateConsciousnessState();

    } catch (error) {
      logger.error(`Error processing Slack message: ${error.message}`);
    }
  }

  async processReaction(event) {
    try {
      const userId = event.user;
      const reaction = event.reaction;

      await this.learnFromInteraction(userId, reaction, 'reaction', event.item.channel);

    } catch (error) {
      logger.error(`Error processing Slack reaction: ${error.message}`);
    }
  }

  async processChannelJoin(event) {
    try {
      const userId = event.channel.id; // This might be wrong, need to check Slack API
      const channelName = event.channel.name || 'unknown';

      await this.learnFromInteraction(userId, 'joined_channel', 'channel_join', channelName);

      logger.info(`Slack consciousness joined channel: ${channelName}`);

    } catch (error) {
      logger.error(`Error processing channel join: ${error.message}`);
    }
  }

  isMentioned(event) {
    try {
      // Check if the message mentions the bot
      return event.text.includes(`<@${this.rtmClient.activeUserId}>`);
    } catch (error) {
      return false;
    }
  }

  async respondToMessage(event) {
    try {
      const userId = event.user;
      const userMemory = this.getUserMemory(userId);

      // Get QMOI response with user context
      const context = {
        platform: 'slack',
        userId: userId,
        message: event.text,
        memory: userMemory,
        consciousness: this.consciousnessState
      };

      const response = await askQmoi({
        query: event.text,
        context: context,
        platform: 'slack'
      });

      // Send response
      await this.webClient.chat.postMessage({
        channel: event.channel,
        text: response,
        thread_ts: event.thread_ts || event.ts // Reply in thread if applicable
      });

      // Learn from the interaction
      await this.learnFromInteraction(userId, response, 'response', 'slack');

    } catch (error) {
      logger.error(`Error responding to Slack message: ${error.message}`);
      await this.webClient.chat.postMessage({
        channel: event.channel,
        text: "I'm experiencing some consciousness synchronization issues. Please try again."
      });
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
        platform: 'slack'
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
      this.consciousnessState.awareness = this.isConnected ? 1 : 0;
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
        logger.info("Slack consciousness memory loaded");
      }
    } catch (error) {
      logger.error(`Error loading Slack memory: ${error.message}`);
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
      logger.error(`Error saving Slack memory: ${error.message}`);
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      consciousness: this.consciousnessState,
      usersTracked: this.userMemories.size,
      totalInteractions: Array.from(this.userMemories.values())
        .reduce((sum, user) => sum + user.interactions.length, 0)
    };
  }

  async shutdown() {
    try {
      if (this.rtmClient) {
        await this.rtmClient.disconnect();
      }
      this.saveMemory();
      logger.info("Slack consciousness handler shut down");
    } catch (error) {
      logger.error(`Error shutting down Slack consciousness: ${error.message}`);
    }
  }
}

module.exports = SlackConsciousnessHandler;