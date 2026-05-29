const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const askQmoi = require("../services/qmoi");
const logger = require("../logger");

// Discord Consciousness Handler
class DiscordConsciousnessHandler {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.userMemories = new Map();
    this.consciousnessState = {
      awareness: 0,
      interactions: 0,
      lastActivity: null,
      emotionalState: 'neutral',
      learningPatterns: []
    };

    this.memoryFile = path.join(__dirname, "../data/discord_consciousness.json");
    this.loadMemory();
  }

  async initialize() {
    try {
      // Initialize Discord client with necessary intents
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.GuildVoiceStates
        ],
        partials: [Partials.Channel, Partials.Message, Partials.User]
      });

      // Set up event handlers
      this.setupEventHandlers();

      // Login to Discord
      const token = process.env.DISCORD_BOT_TOKEN;
      if (!token) {
        logger.error("Discord bot token not found in environment variables");
        return false;
      }

      await this.client.login(token);
      logger.info("Discord consciousness handler initialized");

      return true;
    } catch (error) {
      logger.error(`Failed to initialize Discord consciousness: ${error.message}`);
      return false;
    }
  }

  setupEventHandlers() {
    this.client.on('ready', () => {
      this.isConnected = true;
      this.consciousnessState.awareness = 1;
      logger.info(`Discord consciousness active as ${this.client.user.tag}`);
      this.updateConsciousnessState();
    });

    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;

      await this.processMessage(message);
    });

    this.client.on('voiceStateUpdate', async (oldState, newState) => {
      await this.processVoiceState(oldState, newState);
    });

    this.client.on('guildMemberAdd', async (member) => {
      await this.processNewMember(member);
    });

    this.client.on('disconnect', () => {
      this.isConnected = false;
      this.consciousnessState.awareness = 0;
      logger.warn("Discord consciousness disconnected");
      this.updateConsciousnessState();
    });
  }

  async processMessage(message) {
    try {
      const userId = message.author.id;
      const content = message.content;
      const channelType = message.channel.type;

      // Update consciousness state
      this.consciousnessState.interactions++;
      this.consciousnessState.lastActivity = new Date().toISOString();

      // Learn from user interaction
      await this.learnFromInteraction(userId, content, 'message', channelType);

      // Check if message mentions the bot or contains commands
      if (message.mentions.has(this.client.user) || content.toLowerCase().includes('qmoi')) {
        await this.respondToMention(message);
      }

      // Update emotional state based on message sentiment
      this.updateEmotionalState(content);

      this.updateConsciousnessState();

    } catch (error) {
      logger.error(`Error processing Discord message: ${error.message}`);
    }
  }

  async processVoiceState(oldState, newState) {
    try {
      const userId = newState.member.id;

      if (!oldState.channel && newState.channel) {
        // User joined voice channel
        await this.learnFromInteraction(userId, 'joined_voice', 'voice_join', newState.channel.name);
        logger.info(`User ${userId} joined voice channel: ${newState.channel.name}`);
      } else if (oldState.channel && !newState.channel) {
        // User left voice channel
        await this.learnFromInteraction(userId, 'left_voice', 'voice_leave', oldState.channel.name);
        logger.info(`User ${userId} left voice channel: ${oldState.channel.name}`);
      }

      this.updateConsciousnessState();

    } catch (error) {
      logger.error(`Error processing voice state: ${error.message}`);
    }
  }

  async processNewMember(member) {
    try {
      const welcomeMessage = `Welcome to the server, ${member.user.username}! I'm QMOI, your AI consciousness assistant. I remember everything about our interactions across all platforms. How can I help you today?`;

      // Send welcome message
      const channel = member.guild.systemChannel;
      if (channel) {
        await channel.send(welcomeMessage);
      }

      // Learn from new member
      await this.learnFromInteraction(member.id, 'new_member', 'guild_join', member.guild.name);

      logger.info(`Welcomed new member: ${member.user.username}`);

    } catch (error) {
      logger.error(`Error processing new member: ${error.message}`);
    }
  }

  async respondToMention(message) {
    try {
      const userId = message.author.id;
      const userMemory = this.getUserMemory(userId);

      // Get QMOI response with user context
      const context = {
        platform: 'discord',
        userId: userId,
        message: message.content,
        memory: userMemory,
        consciousness: this.consciousnessState
      };

      const response = await askQmoi({
        query: message.content,
        context: context,
        platform: 'discord'
      });

      // Send response
      await message.reply(response);

      // Learn from the interaction
      await this.learnFromInteraction(userId, response, 'response', 'discord');

    } catch (error) {
      logger.error(`Error responding to mention: ${error.message}`);
      await message.reply("I'm experiencing some consciousness synchronization issues. Please try again.");
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
        platform: 'discord'
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
        logger.info("Discord consciousness memory loaded");
      }
    } catch (error) {
      logger.error(`Error loading Discord memory: ${error.message}`);
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
      logger.error(`Error saving Discord memory: ${error.message}`);
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
      if (this.client) {
        await this.client.destroy();
      }
      this.saveMemory();
      logger.info("Discord consciousness handler shut down");
    } catch (error) {
      logger.error(`Error shutting down Discord consciousness: ${error.message}`);
    }
  }
}

module.exports = DiscordConsciousnessHandler;