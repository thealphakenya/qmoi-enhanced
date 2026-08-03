// QMOI Friendship Advanced System - Proactive Support & Intelligence
// This module implements advanced friendship capabilities for comprehensive user support

class QMOIFriendshipAdvanced {
  constructor() {
    this.supportStrategies = new Map();
    this.financialAdvisors = new Map();
    this.healthCoaches = new Map();
    this.relationshipCounselors = new Map();
    this.careerAdvisors = new Map();
    this.culturalIntelligence = new Map();
    this.proactiveTriggers = new Map();
    this.learningModules = new Map();
  }

  // Proactive Support & Suggestions
  async generateProactiveSupport(userId, userProfile, context) {
    const supportModules = {
      financial: await this.generateFinancialSupport(userId, userProfile),
      health: await this.generateHealthSupport(userId, userProfile),
      career: await this.generateCareerSupport(userId, userProfile),
      relationships: await this.generateRelationshipSupport(
        userId,
        userProfile,
      ),
      personal: await this.generatePersonalDevelopmentSupport(
        userId,
        userProfile,
      ),
    };

    // Prioritize support based on user needs and context
    const prioritizedSupport = this.prioritizeSupport(supportModules, context);

    return {
      primarySupport: prioritizedSupport.primary,
      secondarySupport: prioritizedSupport.secondary,
      suggestions: prioritizedSupport.suggestions,
    };
  }

  prioritizeSupport(supportModules, context) {
    const priorities = [];

    // Financial priority indicators
    if (context.financialStress || context.budgetConcerns) {
      priorities.push({
        type: "financial",
        priority: 9,
        module: supportModules.financial,
      });
    }

    // Health priority indicators
    if (context.healthConcerns || context.stressLevel === "high") {
      priorities.push({
        type: "health",
        priority: 8,
        module: supportModules.health,
      });
    }

    // Career priority indicators
    if (context.careerChallenges || context.workStress) {
      priorities.push({
        type: "career",
        priority: 7,
        module: supportModules.career,
      });
    }

    // Relationship priority indicators
    if (context.relationshipIssues || context.socialIsolation) {
      priorities.push({
        type: "relationships",
        priority: 6,
        module: supportModules.relationships,
      });
    }

    // Personal development as default
    priorities.push({
      type: "personal",
      priority: 5,
      module: supportModules.personal,
    });

    // Sort by priority
    priorities.sort((a, b) => b.priority - a.priority);

    return {
      primary: priorities[0]?.module,
      secondary: priorities[1]?.module,
      suggestions: priorities.slice(2).map((p) => p.module),
    };
  }

  // Financial Intelligence & Support
  async generateFinancialSupport(userId, userProfile) {
    const financialProfile = userProfile.financial || {};
    const financialStrategies = {
      budgeting: {
        title: "Smart Budgeting Strategy",
        message:
          "Let's create a budget that works for your lifestyle. I can help you track expenses and set realistic financial goals.",
        actions: [
          "Create personalized budget plan",
          "Set up expense tracking system",
          "Identify spending patterns",
          "Establish financial goals",
        ],
        tools: ["budget_calculator", "expense_tracker", "goal_setter"],
      },
      debt: {
        title: "Debt Management Plan",
        message:
          "Managing debt can feel overwhelming, but we can tackle it step by step. Let's create a strategy that works for you.",
        actions: [
          "Assess current debt situation",
          "Create debt payoff strategy",
          "Prioritize high-interest debt",
          "Build emergency fund",
        ],
        tools: ["debt_calculator", "payoff_strategy", "emergency_fund"],
      },
      investment: {
        title: "Investment Guidance",
        message:
          "Investing can help you build wealth over time. Let's explore options that match your risk tolerance and goals.",
        actions: [
          "Assess risk tolerance",
          "Explore investment options",
          "Create investment plan",
          "Monitor and adjust",
        ],
        tools: [
          "risk_assessment",
          "investment_calculator",
          "portfolio_tracker",
        ],
      },
      emergency: {
        title: "Emergency Fund Planning",
        message:
          "An emergency fund provides financial security. Let's calculate how much you should aim to save.",
        actions: [
          "Calculate emergency fund target",
          "Set up automatic savings",
          "Choose savings account",
          "Track progress",
        ],
        tools: ["emergency_calculator", "savings_planner", "progress_tracker"],
      },
    };

    // Determine appropriate financial strategy
    const strategy = this.analyzeFinancialNeeds(financialProfile);
    return financialStrategies[strategy] || financialStrategies.budgeting;
  }

  analyzeFinancialNeeds(financialProfile) {
    if (financialProfile.debtLevel === "high") return "debt";
    if (financialProfile.emergencyFund === "low") return "emergency";
    if (financialProfile.investmentExperience === "low") return "investment";
    return "budgeting";
  }

  // Health & Wellness Support
  async generateHealthSupport(userId, userProfile) {
    const healthProfile = userProfile.health || {};
    const healthStrategies = {
      physical: {
        title: "Physical Health Optimization",
        message:
          "Your physical health is the foundation for everything else. Let's create a plan that fits your lifestyle.",
        actions: [
          "Assess current fitness level",
          "Create exercise plan",
          "Improve nutrition habits",
          "Track health metrics",
        ],
        tools: ["fitness_assessment", "exercise_planner", "nutrition_tracker"],
      },
      mental: {
        title: "Mental Health Support",
        message:
          "Mental health is just as important as physical health. I'm here to support your emotional well-being.",
        actions: [
          "Practice stress management",
          "Develop mindfulness habits",
          "Build emotional resilience",
          "Seek professional support when needed",
        ],
        tools: ["stress_assessment", "mindfulness_guide", "mood_tracker"],
      },
      sleep: {
        title: "Sleep Optimization",
        message:
          "Quality sleep is essential for overall health. Let's improve your sleep habits and environment.",
        actions: [
          "Assess sleep quality",
          "Create bedtime routine",
          "Optimize sleep environment",
          "Track sleep patterns",
        ],
        tools: ["sleep_assessment", "routine_planner", "sleep_tracker"],
      },
      nutrition: {
        title: "Nutrition Guidance",
        message:
          "Good nutrition fuels both body and mind. Let's create healthy eating habits that work for you.",
        actions: [
          "Assess current eating habits",
          "Create meal planning system",
          "Learn about nutrition",
          "Track food intake",
        ],
        tools: ["nutrition_assessment", "meal_planner", "food_tracker"],
      },
    };

    const strategy = this.analyzeHealthNeeds(healthProfile);
    return healthStrategies[strategy] || healthStrategies.physical;
  }

  analyzeHealthNeeds(healthProfile) {
    if (healthProfile.stressLevel === "high") return "mental";
    if (healthProfile.sleepQuality === "poor") return "sleep";
    if (healthProfile.nutritionScore === "low") return "nutrition";
    return "physical";
  }

  // Career & Professional Development
  async generateCareerSupport(userId, userProfile) {
    const careerProfile = userProfile.career || {};
    const careerStrategies = {
      skillDevelopment: {
        title: "Skill Development Plan",
        message:
          "Continuous learning is key to career growth. Let's identify skills that will advance your career.",
        actions: [
          "Assess current skills",
          "Identify skill gaps",
          "Create learning plan",
          "Track progress",
        ],
        tools: ["skill_assessment", "learning_planner", "progress_tracker"],
      },
      networking: {
        title: "Professional Networking",
        message:
          "Building professional relationships can open new opportunities. Let's develop your networking strategy.",
        actions: [
          "Identify networking goals",
          "Create networking plan",
          "Attend professional events",
          "Maintain relationships",
        ],
        tools: ["networking_planner", "contact_manager", "event_finder"],
      },
      workLifeBalance: {
        title: "Work-Life Balance",
        message:
          "Maintaining balance between work and personal life is crucial for long-term success and happiness.",
        actions: [
          "Assess current balance",
          "Set boundaries",
          "Create time management system",
          "Prioritize self-care",
        ],
        tools: ["balance_assessment", "time_planner", "boundary_setter"],
      },
      careerAdvancement: {
        title: "Career Advancement Strategy",
        message:
          "Let's create a plan to advance your career and achieve your professional goals.",
        actions: [
          "Define career goals",
          "Create advancement plan",
          "Build professional brand",
          "Track progress",
        ],
        tools: ["goal_setter", "career_planner", "brand_builder"],
      },
    };

    const strategy = this.analyzeCareerNeeds(careerProfile);
    return careerStrategies[strategy] || careerStrategies.skillDevelopment;
  }

  analyzeCareerNeeds(careerProfile) {
    if (careerProfile.workLifeBalance === "poor") return "workLifeBalance";
    if (careerProfile.networkingLevel === "low") return "networking";
    if (careerProfile.advancementGoals === "high") return "careerAdvancement";
    return "skillDevelopment";
  }

  // Relationship & Family Support
  async generateRelationshipSupport(userId, userProfile) {
    const familyProfile = userProfile.family || {};
    const relationshipStrategies = {
      communication: {
        title: "Communication Skills",
        message:
          "Good communication is the foundation of healthy relationships. Let's improve your communication skills.",
        actions: [
          "Learn active listening",
          "Practice empathy",
          "Develop conflict resolution skills",
          "Build emotional intelligence",
        ],
        tools: [
          "communication_assessment",
          "skill_practice",
          "conflict_resolver",
        ],
      },
      familyDynamics: {
        title: "Family Relationship Support",
        message:
          "Family relationships can be complex. Let's work on understanding and improving your family dynamics.",
        actions: [
          "Understand family patterns",
          "Improve family communication",
          "Set healthy boundaries",
          "Build stronger connections",
        ],
        tools: ["family_assessment", "communication_guide", "boundary_setter"],
      },
      socialSkills: {
        title: "Social Skills Development",
        message:
          "Strong social skills help build meaningful relationships. Let's develop your interpersonal skills.",
        actions: [
          "Build confidence",
          "Practice social interactions",
          "Develop conversation skills",
          "Create social opportunities",
        ],
        tools: ["confidence_builder", "social_practice", "conversation_guide"],
      },
      conflictResolution: {
        title: "Conflict Resolution",
        message:
          "Conflicts are normal in relationships. Let's learn healthy ways to resolve disagreements.",
        actions: [
          "Understand conflict patterns",
          "Learn resolution techniques",
          "Practice active listening",
          "Build compromise skills",
        ],
        tools: [
          "conflict_assessment",
          "resolution_guide",
          "practice_scenarios",
        ],
      },
    };

    const strategy = this.analyzeRelationshipNeeds(familyProfile);
    return (
      relationshipStrategies[strategy] || relationshipStrategies.communication
    );
  }

  analyzeRelationshipNeeds(familyProfile) {
    if (familyProfile.conflictLevel === "high") return "conflictResolution";
    if (familyProfile.communicationQuality === "poor") return "communication";
    if (familyProfile.socialIsolation === "high") return "socialSkills";
    return "familyDynamics";
  }

  // Personal Development Support
  async generatePersonalDevelopmentSupport(userId, userProfile) {
    const personalStrategies = {
      goalSetting: {
        title: "Goal Setting & Achievement",
        message:
          "Setting and achieving goals gives life direction and purpose. Let's create a plan for your personal growth.",
        actions: [
          "Define personal goals",
          "Create action plans",
          "Track progress",
          "Celebrate achievements",
        ],
        tools: ["goal_setter", "action_planner", "progress_tracker"],
      },
      habitFormation: {
        title: "Positive Habit Formation",
        message:
          "Good habits create the foundation for success. Let's build habits that support your goals.",
        actions: [
          "Identify target habits",
          "Create habit plans",
          "Track habit progress",
          "Build consistency",
        ],
        tools: ["habit_assessment", "habit_planner", "consistency_tracker"],
      },
      selfAwareness: {
        title: "Self-Awareness Development",
        message:
          "Understanding yourself better leads to better decisions and relationships. Let's explore your strengths and areas for growth.",
        actions: [
          "Assess personality traits",
          "Identify strengths",
          "Explore values",
          "Develop self-reflection",
        ],
        tools: [
          "personality_assessment",
          "strength_finder",
          "values_clarifier",
        ],
      },
      lifeOptimization: {
        title: "Life Optimization",
        message:
          "Let's optimize your daily life for maximum happiness and productivity. Small changes can make big differences.",
        actions: [
          "Assess life satisfaction",
          "Identify improvement areas",
          "Create optimization plan",
          "Track improvements",
        ],
        tools: [
          "life_assessment",
          "optimization_planner",
          "satisfaction_tracker",
        ],
      },
    };

    // Default to goal setting for personal development
    return personalStrategies.goalSetting;
  }

  // Cultural Intelligence
  async adaptToCulturalContext(userId, userProfile, message) {
    const culturalProfile = userProfile.cultural || {};
    const culturalAdaptations = {
      communicationStyle: this.adaptCommunicationStyle(culturalProfile),
      formalityLevel: this.adaptFormalityLevel(culturalProfile),
      humorStyle: this.adaptHumorStyle(culturalProfile),
      supportStyle: this.adaptSupportStyle(culturalProfile),
    };

    return culturalAdaptations;
  }

  adaptCommunicationStyle(culturalProfile) {
    const styles = {
      direct: "I'll be direct and clear in my communication.",
      indirect: "I'll use more subtle and contextual communication.",
      formal: "I'll maintain a formal and respectful tone.",
      casual: "I'll use a friendly and casual communication style.",
    };

    return styles[culturalProfile.communicationStyle] || styles.casual;
  }

  adaptFormalityLevel(culturalProfile) {
    if (culturalProfile.formalityPreference === "high") return "formal";
    if (culturalProfile.formalityPreference === "low") return "casual";
    return "balanced";
  }

  adaptHumorStyle(culturalProfile) {
    const humorStyles = {
      playful: "I'll include light humor and playful moments.",
      respectful: "I'll maintain respectful and appropriate humor.",
      minimal: "I'll keep humor minimal and focused on support.",
      contextual: "I'll adapt humor to the specific context and culture.",
    };

    return humorStyles[culturalProfile.humorStyle] || humorStyles.respectful;
  }

  adaptSupportStyle(culturalProfile) {
    const supportStyles = {
      individualistic:
        "I'll focus on individual achievement and personal goals.",
      collectivistic: "I'll emphasize community and family relationships.",
      practical: "I'll provide practical, actionable advice and solutions.",
      emotional: "I'll focus on emotional support and understanding.",
    };

    return (
      supportStyles[culturalProfile.supportStyle] || supportStyles.balanced
    );
  }

  // Proactive Triggers & Monitoring
  async setupProactiveTriggers(userId, userProfile) {
    const triggers = {
      financial: {
        condition: () => this.checkFinancialTriggers(userProfile),
        action: () => this.generateFinancialSupport(userId, userProfile),
        frequency: "weekly",
      },
      health: {
        condition: () => this.checkHealthTriggers(userProfile),
        action: () => this.generateHealthSupport(userId, userProfile),
        frequency: "daily",
      },
      career: {
        condition: () => this.checkCareerTriggers(userProfile),
        action: () => this.generateCareerSupport(userId, userProfile),
        frequency: "weekly",
      },
      relationships: {
        condition: () => this.checkRelationshipTriggers(userProfile),
        action: () => this.generateRelationshipSupport(userId, userProfile),
        frequency: "daily",
      },
    };

    this.proactiveTriggers.set(userId, triggers);
    return triggers;
  }

  checkFinancialTriggers(userProfile) {
    const financial = userProfile.financial || {};
    return (
      financial.stressLevel === "high" ||
      financial.debtLevel === "high" ||
      financial.emergencyFund === "low"
    );
  }

  checkHealthTriggers(userProfile) {
    const health = userProfile.health || {};
    return (
      health.stressLevel === "high" ||
      health.sleepQuality === "poor" ||
      health.exerciseLevel === "low"
    );
  }

  checkCareerTriggers(userProfile) {
    const career = userProfile.career || {};
    return (
      career.workStress === "high" ||
      career.skillGaps === "significant" ||
      career.advancementGoals === "high"
    );
  }

  checkRelationshipTriggers(userProfile) {
    const family = userProfile.family || {};
    return (
      family.conflictLevel === "high" ||
      family.communicationQuality === "poor" ||
      family.socialIsolation === "high"
    );
  }

  // Learning & Adaptation
  async updateLearningModules(userId, interaction, response) {
    const learningData = {
      timestamp: new Date(),
      interaction,
      response,
      userFeedback: this.extractUserFeedback(interaction.message),
      effectiveness: this.calculateEffectiveness(interaction, response),
    };

    const userModules = this.learningModules.get(userId) || [];
    userModules.push(learningData);

    // Keep only recent learning data
    if (userModules.length > 100) {
      userModules.splice(0, userModules.length - 100);
    }

    this.learningModules.set(userId, userModules);
    return learningData;
  }

  extractUserFeedback(message) {
    const feedback = {
      positive: false,
      negative: false,
      neutral: true,
      specific: null,
    };

    const positiveWords = [
      "thank",
      "great",
      "good",
      "helpful",
      "perfect",
      "love",
    ];
    const negativeWords = ["bad", "wrong", "unhelpful", "useless", "terrible"];

    const words = message.toLowerCase().split(" ");

    if (positiveWords.some((word) => words.includes(word))) {
      feedback.positive = true;
      feedback.neutral = false;
    }

    if (negativeWords.some((word) => words.includes(word))) {
      feedback.negative = true;
      feedback.neutral = false;
    }

    return feedback;
  }

  calculateEffectiveness(interaction, response) {
    // Calculate response effectiveness based on various factors
    let score = 0.5; // neutral baseline

    // Response length appropriateness
    const messageLength = interaction.message.length;
    const responseLength = response.length;
    const lengthRatio = responseLength / messageLength;

    if (lengthRatio >= 0.5 && lengthRatio <= 2.0) score += 0.2;
    else score -= 0.1;

    // Emotional appropriateness
    const emotionalMatch = this.calculateEmotionalMatch(interaction, response);
    score += emotionalMatch * 0.3;

    return Math.max(0, Math.min(1, score));
  }

  calculateEmotionalMatch(interaction, response) {
    const interactionEmotion = this.detectEmotion(interaction.message);
    const responseEmotion = this.detectEmotion(response);

    if (interactionEmotion === responseEmotion) return 0.8;
    if (this.areEmotionsCompatible(interactionEmotion, responseEmotion))
      return 0.6;
    return 0.3;
  }

  detectEmotion(text) {
    const emotions = {
      joy: ["happy", "excited", "great", "wonderful"],
      sadness: ["sad", "depressed", "down", "lonely"],
      anger: ["angry", "frustrated", "mad", "irritated"],
      fear: ["scared", "worried", "anxious", "nervous"],
      neutral: ["okay", "fine", "normal", "alright"],
    };

    const words = text.toLowerCase().split(" ");

    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some((keyword) => words.includes(keyword))) {
        return emotion;
      }
    }

    return "neutral";
  }

  areEmotionsCompatible(emotion1, emotion2) {
    const compatibility = {
      joy: ["joy", "neutral"],
      sadness: ["sadness", "fear", "neutral"],
      anger: ["anger", "neutral"],
      fear: ["fear", "sadness", "neutral"],
      neutral: ["joy", "sadness", "anger", "fear", "neutral"],
    };

    return compatibility[emotion1]?.includes(emotion2) || false;
  }
}

// Export the QMOI Friendship Advanced System
module.exports = QMOIFriendshipAdvanced;
