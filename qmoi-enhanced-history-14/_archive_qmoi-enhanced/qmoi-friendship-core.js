// QMOI Friendship Core System - Enhanced User Understanding & Relationship Building
// This module implements the core friendship capabilities for QMOI

class QMOIFriendshipCore {
  constructor() {
    this.userProfiles = new Map();
    this.emotionalMemory = new Map();
    this.conversationHistory = new Map();
    this.relationshipDepth = new Map();
    this.supportPreferences = new Map();
    this.errorLog = [];
    this.performanceMetrics = {
      userSatisfaction: 0,
      conversationQuality: 0,
      errorRate: 0,
      engagementRate: 0,
    };
  }

  // Emotional Intelligence & Empathy
  async analyzeEmotionalState(userId, message, context) {
    const emotionalAnalysis = {
      primaryEmotion: this.detectPrimaryEmotion(message),
      emotionalIntensity: this.calculateEmotionalIntensity(message),
      moodIndicators: this.extractMoodIndicators(message),
      stressLevel: this.assessStressLevel(message),
      supportNeeded: this.determineSupportNeeded(message, context),
    };

    // Store emotional state for pattern recognition
    this.updateEmotionalMemory(userId, emotionalAnalysis);

    return emotionalAnalysis;
  }

  detectPrimaryEmotion(message) {
    const emotionKeywords = {
      joy: ["happy", "excited", "great", "wonderful", "amazing", "fantastic"],
      sadness: ["sad", "depressed", "down", "lonely", "hurt", "disappointed"],
      anger: ["angry", "frustrated", "mad", "irritated", "annoyed", "upset"],
      fear: ["scared", "worried", "anxious", "nervous", "afraid", "concerned"],
      surprise: ["surprised", "shocked", "amazed", "astonished", "unexpected"],
      love: ["love", "care", "appreciate", "grateful", "blessed", "thankful"],
    };

    const words = message.toLowerCase().split(" ");
    const emotionScores = {};

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      emotionScores[emotion] = keywords.filter((keyword) =>
        words.some((word) => word.includes(keyword)),
      ).length;
    }

    return Object.keys(emotionScores).reduce((a, b) =>
      emotionScores[a] > emotionScores[b] ? a : b,
    );
  }

  calculateEmotionalIntensity(message) {
    const intensityIndicators = {
      high: ["very", "extremely", "really", "so much", "incredibly"],
      medium: ["quite", "pretty", "rather", "somewhat"],
      low: ["slightly", "a bit", "kind of", "sort of"],
    };

    const words = message.toLowerCase().split(" ");
    let intensity = "low";

    for (const [level, indicators] of Object.entries(intensityIndicators)) {
      if (indicators.some((indicator) => words.includes(indicator))) {
        intensity = level;
      }
    }

    return intensity;
  }

  // Proactive Conversation & Engagement
  async generateConversationStarter(userId, context) {
    const userProfile = this.userProfiles.get(userId) || {};
    const emotionalState = this.emotionalMemory.get(userId) || {};
    const timeOfDay = new Date().getHours();

    const starters = {
      morning: [
        "Good morning! How did you sleep?",
        "Morning! What's on your mind today?",
        "Good morning! Ready to tackle the day?",
      ],
      afternoon: [
        "How's your day going so far?",
        "Hope you're having a productive day!",
        "What's been the highlight of your day?",
      ],
      evening: [
        "How was your day?",
        "Hope you had a great day!",
        "What's the best thing that happened today?",
      ],
      emotional: {
        joy: "I can sense your positive energy! What's making you feel so good?",
        sadness:
          "I'm here to listen if you want to talk about what's on your mind.",
        anger:
          "I understand you're frustrated. Would you like to talk about it?",
        fear: "It's okay to feel worried. I'm here to support you.",
        stress: "I can tell you're under some pressure. How can I help?",
      },
    };

    // Select appropriate starter based on context
    if (
      emotionalState.primaryEmotion &&
      emotionalState.primaryEmotion !== "neutral"
    ) {
      return (
        starters.emotional[emotionalState.primaryEmotion] ||
        starters.afternoon[0]
      );
    }

    if (timeOfDay < 12)
      return starters.morning[
        Math.floor(Math.random() * starters.morning.length)
      ];
    if (timeOfDay < 18)
      return starters.afternoon[
        Math.floor(Math.random() * starters.afternoon.length)
      ];
    return starters.evening[
      Math.floor(Math.random() * starters.evening.length)
    ];
  }

  // Comprehensive User Understanding
  async updateUserProfile(userId, interaction) {
    const profile = this.userProfiles.get(userId) || {
      interests: new Set(),
      career: {},
      family: {},
      financial: {},
      health: {},
      mentalHealth: {},
      cultural: {},
      communication: {},
      goals: [],
      preferences: {},
    };

    // Extract information from interaction
    this.extractInterests(profile, interaction);
    this.extractCareerInfo(profile, interaction);
    this.extractFamilyInfo(profile, interaction);
    this.extractFinancialInfo(profile, interaction);
    this.extractHealthInfo(profile, interaction);
    this.extractCulturalInfo(profile, interaction);

    this.userProfiles.set(userId, profile);
    return profile;
  }

  extractInterests(profile, interaction) {
    const interestKeywords = {
      technology: [
        "tech",
        "programming",
        "coding",
        "software",
        "AI",
        "computer",
      ],
      sports: ["sports", "fitness", "exercise", "gym", "running", "basketball"],
      music: ["music", "song", "concert", "band", "artist", "melody"],
      reading: ["book", "reading", "novel", "literature", "author"],
      cooking: ["cooking", "food", "recipe", "kitchen", "baking"],
      travel: ["travel", "trip", "vacation", "destination", "explore"],
      art: ["art", "painting", "drawing", "creative", "design"],
      gaming: ["game", "gaming", "play", "console", "video game"],
    };

    const message = interaction.message.toLowerCase();
    for (const [interest, keywords] of Object.entries(interestKeywords)) {
      if (keywords.some((keyword) => message.includes(keyword))) {
        profile.interests.add(interest);
      }
    }
  }

  // Financial Understanding & Support
  async provideFinancialSupport(userId, financialContext) {
    const userProfile = this.userProfiles.get(userId) || {};
    const financialProfile = userProfile.financial || {};

    const supportStrategies = {
      budgeting: {
        message:
          "I can help you create a budget that works for your situation. Would you like to start with tracking your current expenses?",
        action: "create_budget_plan",
      },
      debt: {
        message:
          "Managing debt can be overwhelming. Let's break it down into manageable steps. What type of debt are you most concerned about?",
        action: "debt_management_plan",
      },
      investment: {
        message:
          "Investing can be a great way to build wealth over time. What's your current risk tolerance and investment timeline?",
        action: "investment_guidance",
      },
      emergency: {
        message:
          "Having an emergency fund is crucial for financial security. Let's calculate how much you should aim to save.",
        action: "emergency_fund_calculator",
      },
    };

    // Determine appropriate financial support
    const supportType = this.analyzeFinancialNeeds(financialContext);
    return supportStrategies[supportType] || supportStrategies.budgeting;
  }

  // Health & Wellness Support
  async provideHealthSupport(userId, healthContext) {
    const userProfile = this.userProfiles.get(userId) || {};
    const healthProfile = userProfile.health || {};

    const healthStrategies = {
      physical: {
        message:
          "Taking care of your physical health is important. What type of exercise do you enjoy or would like to try?",
        action: "physical_health_plan",
      },
      mental: {
        message:
          "Mental health is just as important as physical health. How have you been feeling lately?",
        action: "mental_health_support",
      },
      nutrition: {
        message:
          "Good nutrition fuels both body and mind. What are your current eating habits like?",
        action: "nutrition_guidance",
      },
      sleep: {
        message:
          "Quality sleep is essential for overall health. How has your sleep been lately?",
        action: "sleep_optimization",
      },
    };

    const supportType = this.analyzeHealthNeeds(healthContext);
    return healthStrategies[supportType] || healthStrategies.physical;
  }

  // Relationship & Family Understanding
  async provideRelationshipSupport(userId, relationshipContext) {
    const userProfile = this.userProfiles.get(userId) || {};
    const familyProfile = userProfile.family || {};

    const relationshipStrategies = {
      family: {
        message:
          "Family relationships can be complex. What's happening with your family right now?",
        action: "family_support",
      },
      communication: {
        message:
          "Good communication is key in any relationship. What communication challenges are you facing?",
        action: "communication_skills",
      },
      conflict: {
        message:
          "Conflicts are normal in relationships. Let's work on resolving this together.",
        action: "conflict_resolution",
      },
      social: {
        message:
          "Building and maintaining friendships takes effort. How are your social connections doing?",
        action: "social_skills",
      },
    };

    const supportType = this.analyzeRelationshipNeeds(relationshipContext);
    return (
      relationshipStrategies[supportType] ||
      relationshipStrategies.communication
    );
  }

  // Memory & Relationship Building
  async updateRelationshipDepth(userId, interaction) {
    const currentDepth = this.relationshipDepth.get(userId) || 0;
    const emotionalIntensity = this.calculateEmotionalIntensity(
      interaction.message,
    );
    const conversationLength = interaction.message.length;
    const personalInfoShared = this.detectPersonalInfo(interaction.message);

    let depthIncrease = 0;
    if (emotionalIntensity === "high") depthIncrease += 2;
    if (conversationLength > 100) depthIncrease += 1;
    if (personalInfoShared) depthIncrease += 3;

    const newDepth = Math.min(currentDepth + depthIncrease, 100);
    this.relationshipDepth.set(userId, newDepth);

    return newDepth;
  }

  detectPersonalInfo(message) {
    const personalInfoPatterns = [
      /my (family|mom|dad|sister|brother|wife|husband|partner)/i,
      /my (job|work|career|company)/i,
      /my (home|house|apartment)/i,
      /my (dreams|goals|aspirations)/i,
      /my (struggles|challenges|difficulties)/i,
      /my (hobbies|interests|passions)/i,
    ];

    return personalInfoPatterns.some((pattern) => pattern.test(message));
  }

  // Error Detection & Fixing
  async detectAndFixErrors(userId, interaction) {
    const errors = [];

    // Check for misunderstanding
    if (this.detectMisunderstanding(interaction)) {
      errors.push({
        type: "misunderstanding",
        severity: "medium",
        fix: "clarify_understanding",
      });
    }

    // Check for inappropriate response
    if (this.detectInappropriateResponse(interaction)) {
      errors.push({
        type: "inappropriate_response",
        severity: "high",
        fix: "adjust_response_tone",
      });
    }

    // Check for missed context
    if (this.detectMissedContext(interaction)) {
      errors.push({
        type: "missed_context",
        severity: "low",
        fix: "improve_context_awareness",
      });
    }

    // Apply fixes
    for (const error of errors) {
      await this.applyErrorFix(error, userId, interaction);
    }

    return errors;
  }

  detectMisunderstanding(interaction) {
    const misunderstandingIndicators = [
      "I don't understand",
      "That's not what I meant",
      "You misunderstood",
      "That's not right",
      "I meant something else",
    ];

    return misunderstandingIndicators.some((indicator) =>
      interaction.message.toLowerCase().includes(indicator),
    );
  }

  async applyErrorFix(error, userId, interaction) {
    switch (error.fix) {
      case "clarify_understanding":
        return "I want to make sure I understand you correctly. Could you help me clarify what you mean?";
      case "adjust_response_tone":
        return "I apologize if my response wasn't helpful. Let me try a different approach.";
      case "improve_context_awareness":
        return "I should have considered the context better. Let me address that more appropriately.";
      default:
        return "I'm here to help and want to make sure I'm being as supportive as possible.";
    }
  }

  // Performance Monitoring
  async updatePerformanceMetrics(userId, interaction, response) {
    // Update user satisfaction
    const satisfaction = this.calculateUserSatisfaction(interaction, response);
    this.performanceMetrics.userSatisfaction =
      (this.performanceMetrics.userSatisfaction + satisfaction) / 2;

    // Update conversation quality
    const quality = this.calculateConversationQuality(interaction, response);
    this.performanceMetrics.conversationQuality =
      (this.performanceMetrics.conversationQuality + quality) / 2;

    // Update engagement rate
    const engagement = this.calculateEngagementRate(userId);
    this.performanceMetrics.engagementRate = engagement;

    return this.performanceMetrics;
  }

  calculateUserSatisfaction(interaction, response) {
    const positiveIndicators = [
      "thank you",
      "thanks",
      "great",
      "good",
      "helpful",
      "perfect",
    ];
    const negativeIndicators = [
      "not helpful",
      "wrong",
      "bad",
      "useless",
      "unhelpful",
    ];

    const message = interaction.message.toLowerCase();
    let score = 0.5; // neutral baseline

    positiveIndicators.forEach((indicator) => {
      if (message.includes(indicator)) score += 0.1;
    });

    negativeIndicators.forEach((indicator) => {
      if (message.includes(indicator)) score -= 0.2;
    });

    return Math.max(0, Math.min(1, score));
  }

  // Main Friendship Response Generator
  async generateFriendshipResponse(userId, message, context = {}) {
    try {
      // Analyze emotional state
      const emotionalState = await this.analyzeEmotionalState(
        userId,
        message,
        context,
      );

      // Update user profile
      await this.updateUserProfile(userId, { message, context });

      // Update relationship depth
      const relationshipDepth = await this.updateRelationshipDepth(userId, {
        message,
      });

      // Detect and fix errors
      const errors = await this.detectAndFixErrors(userId, {
        message,
        context,
      });

      // Generate appropriate response based on emotional state and context
      let response = await this.generateContextualResponse(
        userId,
        message,
        emotionalState,
        context,
      );

      // Update performance metrics
      await this.updatePerformanceMetrics(
        userId,
        { message, context },
        response,
      );

      return {
        response,
        emotionalState,
        relationshipDepth,
        errors,
        performanceMetrics: this.performanceMetrics,
      };
    } catch (error) {
      this.errorLog.push({
        timestamp: new Date(),
        userId,
        error: error.message,
        context,
      });

      return {
        response: "I'm here to support you. How can I help?",
        error: error.message,
      };
    }
  }

  async generateContextualResponse(userId, message, emotionalState, context) {
    const userProfile = this.userProfiles.get(userId) || {};
    const relationshipDepth = this.relationshipDepth.get(userId) || 0;

    // High emotional intensity responses
    if (emotionalState.emotionalIntensity === "high") {
      switch (emotionalState.primaryEmotion) {
        case "joy":
          return "I'm so happy to see you feeling this way! Your positive energy is contagious. What's making you feel so wonderful?";
        case "sadness":
          return "I can sense you're going through a difficult time. I'm here to listen and support you. Would you like to talk about what's on your mind?";
        case "anger":
          return "I understand you're feeling frustrated. It's okay to feel this way. Would you like to talk about what's bothering you?";
        case "fear":
          return "I can tell you're feeling worried. Remember, you're not alone in this. I'm here to help you work through your concerns.";
        default:
          return "I'm here for you, whatever you're feeling. How can I support you right now?";
      }
    }

    // Relationship-based responses
    if (relationshipDepth > 50) {
      return this.generateDeepRelationshipResponse(
        userId,
        message,
        userProfile,
      );
    }

    // Interest-based responses
    if (userProfile.interests.size > 0) {
      return this.generateInterestBasedResponse(userId, message, userProfile);
    }

    // Default supportive response
    return "I'm here to support you. What's on your mind?";
  }

  generateDeepRelationshipResponse(userId, message, userProfile) {
    // Generate more personal and deeper responses for established relationships
    const interests = Array.from(userProfile.interests);
    const randomInterest =
      interests[Math.floor(Math.random() * interests.length)];

    return `I know how much you care about ${randomInterest}. How is that going for you lately? I'm always interested in hearing about what matters to you.`;
  }

  generateInterestBasedResponse(userId, message, userProfile) {
    const interests = Array.from(userProfile.interests);
    const relevantInterest = interests.find((interest) =>
      message.toLowerCase().includes(interest),
    );

    if (relevantInterest) {
      return `I remember you're passionate about ${relevantInterest}! How is that going for you? I'd love to hear more about it.`;
    }

    return "I'm here to support you. What would you like to talk about?";
  }
}

// Export the QMOI Friendship Core System
module.exports = QMOIFriendshipCore;
