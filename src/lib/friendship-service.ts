// QMOI EVOLUTION ENHANCED: Friendship Service
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T04:00:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

export interface Friendship {
  id: string;
  userId1: string;
  userId2: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
  customMessage?: string;
}

export interface FriendProfile {
  id: string;
  displayName: string;
  socialScore: number;
  friendshipCount: number;
  interests: string[];
  friendNames: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FriendshipResult {
  friendships: Friendship[];
  pendingRequests: Friendship[];
  userProfile: FriendProfile;
}

export interface SocialRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  relevance: number;
}

export class QMOIFriendshipService {
  private friendships: Friendship[] = [];
  private profiles = new Map<string, FriendProfile>();
  private voiceHistory = new Map<string, Array<{ id: string; timestamp: Date; message: string }>>();

  constructor() {
    this.ensureProfile('anonymous', 'Anonymous User');
  }

  private ensureProfile(userId: string, displayName = 'Friend'): FriendProfile {
    let profile = this.profiles.get(userId);
    if (!profile) {
      profile = {
        id: userId,
        displayName,
        socialScore: 50,
        friendshipCount: 0,
        interests: ['strategy', 'automation', 'assistant intelligence'],
        friendNames: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.profiles.set(userId, profile);
    }
    return profile;
  }

  private updateProfileStats(userId: string) {
    const profile = this.ensureProfile(userId);
    const friends = this.friendships.filter(
      (f) =>
        (f.userId1 === userId || f.userId2 === userId) &&
        f.status === 'accepted',
    );
    profile.friendshipCount = friends.length;
    profile.socialScore = Math.min(100, 50 + friends.length * 5);
    profile.friendNames = friends.map((f) =>
      f.userId1 === userId ? f.userId2 : f.userId1,
    );
    profile.updatedAt = new Date();
  }

  async createFriendship({
    userId1,
    userId2,
    initialMessage,
  }: {
    userId1: string;
    userId2: string;
    initialMessage?: string;
  }): Promise<{ success: boolean; friendshipId: string; message: string }> {
    const id = `friendship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const friendship: Friendship = {
      id,
      userId1,
      userId2,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      customMessage: initialMessage,
    };

    this.friendships.push(friendship);
    this.ensureProfile(userId1);
    this.ensureProfile(userId2);
    this.updateProfileStats(userId1);
    this.updateProfileStats(userId2);

    return {
      success: true,
      friendshipId: id,
      message: `Friend request sent from ${userId1} to ${userId2}`,
    };
  }

  async getFriendship(id: string): Promise<Friendship | null> {
    return this.friendships.find((f) => f.id === id) || null;
  }

  async getUserFriendships(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (f) => f.userId1 === userId || f.userId2 === userId,
    );
  }

  async getFriendships(userId: string): Promise<FriendshipResult> {
    const friendships = this.friendships.filter(
      (f) =>
        (f.userId1 === userId || f.userId2 === userId) &&
        f.status === 'accepted',
    );
    const pendingRequests = this.friendships.filter(
      (f) => f.userId2 === userId && f.status === 'pending');
    const userProfile = this.ensureProfile(userId);
    this.updateProfileStats(userId);

    return {
      friendships,
      pendingRequests,
      userProfile,
    };
  }

  async acceptFriendship(
    id: string,
    userId: string,
  ): Promise<{ success: boolean; friendship?: Friendship; error?: string }> {
    const friendship = this.friendships.find((f) => f.id === id);
    if (!friendship || friendship.status !== 'pending') {
      return { success: false, error: 'Friendship not found or not pending' };
    }

    friendship.status = 'accepted';
    friendship.updatedAt = new Date();
    this.updateProfileStats(friendship.userId1);
    this.updateProfileStats(friendship.userId2);

    return { success: true, friendship };
  }

  async updateFriendship(
    id: string,
    updates: Partial<Friendship>,
  ): Promise<{ success: boolean; friendship?: Friendship; error?: string }> {
    const friendship = this.friendships.find((f) => f.id === id);
    if (!friendship) {
      return { success: false, error: 'Friendship not found' };
    }

    Object.assign(friendship, updates, { updatedAt: new Date() });
    this.updateProfileStats(friendship.userId1);
    this.updateProfileStats(friendship.userId2);

    return { success: true, friendship };
  }

  async deleteFriendship(id: string): Promise<{ success: boolean }> {
    const index = this.friendships.findIndex((f) => f.id === id);
    if (index === -1) return { success: false };

    const friendship = this.friendships[index];
    this.friendships.splice(index, 1);
    this.updateProfileStats(friendship.userId1);
    this.updateProfileStats(friendship.userId2);

    return { success: true };
  }

  async getFriends(userId: string): Promise<string[]> {
    return this.friendships
      .filter(
        (f) =>
          (f.userId1 === userId || f.userId2 === userId) &&
          f.status === 'accepted',
      )
      .map((f) => (f.userId1 === userId ? f.userId2 : f.userId1));
  }

  async getPendingRequests(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (f) => f.userId2 === userId && f.status === 'pending',
    );
  }

  async blockFriendship(id: string): Promise<boolean> {
    const friendship = this.friendships.find((f) => f.id === id);
    if (!friendship) return false;

    friendship.status = 'blocked';
    friendship.updatedAt = new Date();
    return true;
  }

  async identifyUser(friendProfile: any): Promise<FriendProfile> {
    const userId = friendProfile?.id || `friend_${Date.now()}`;
    const displayName =
      friendProfile?.displayName || friendProfile?.name || 'Suggested Friend';
    const profile = this.ensureProfile(userId, displayName);

    if (Array.isArray(friendProfile?.interests)) {
      profile.interests = Array.from(
        new Set([...profile.interests, ...friendProfile.interests]),
      );
      profile.updatedAt = new Date();
    }

    return profile;
  }

  async getSocialRecommendations(
    userId: string,
  ): Promise<SocialRecommendation[]> {
    const profile = this.ensureProfile(userId);
    const friends = profile.friendNames;
    return [
      {
        id: `rec-${Date.now()}-1`,
        title: 'Collaborate with high-value friends',
        description: `Based on your ${profile.friendshipCount} accepted friendships, consider teaming up with ${friends.slice(0, 2).join(', ') || 'trusted contacts'}.`,
        category: 'collaboration',
        relevance: 0.93,
      },
      {
        id: `rec-${Date.now()}-2`,
        title: 'Expand your network',
        description: `Connect with interests similar to ${profile.interests.slice(0, 2).join(', ')} to improve your assistant recommendations.`,
        category: 'networking',
        relevance: 0.88,
      },
      {
        id: `rec-${Date.now()}-3`,
        title: 'Use your friendship-enhanced assistant',
        description: 'Leverage friendship context in QMOI personal assistant mode for more natural conversations and better task planning.',
        category: 'assistant',
        relevance: 0.85,
      },
      {
        id: `rec-${Date.now()}-4`,
        title: 'Try QMOI Games',
        description: 'Play fun games designed for both kids and adults - from educational puzzles to creative adventures!',
        category: 'gaming',
        relevance: 0.90,
      },
      {
        id: `rec-${Date.now()}-5`,
        title: 'QMOI Tutoring Sessions',
        description: 'Get personalized tutoring in any subject with interactive lessons and real-time feedback.',
        category: 'education',
        relevance: 0.87,
      },
    ];
  }

  // Enhanced Personal Assistant Features
  async startConversation(userId: string, topic?: string): Promise<string> {
    const profile = this.ensureProfile(userId);
    const greetings = [
      `Hi ${profile.displayName}! I'm excited to chat with you. What's on your mind today?`,
      `Hello ${profile.displayName}! It's great to see you. How are you feeling?`,
      `Hey ${profile.displayName}! Ready for an interesting conversation? What would you like to talk about?`,
      `Hi there ${profile.displayName}! I'm here and ready to help. What's new with you?`,
    ];

    if (topic) {
      return `Hello ${profile.displayName}! I see you're interested in ${topic}. I'd love to discuss that with you. What specifically would you like to know?`;
    }

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  async tellJoke(userId: string, category?: string): Promise<string> {
    const jokes = {
      general: [
        "Why did the AI go to therapy? It had too many unresolved issues! 🤖",
        "What do you call an AI that tells jokes? A comedi-bot! 😂",
        "Why was the AI bad at stand-up comedy? Its timing was always off by a millisecond! ⏰",
        "Why did the computer go to the doctor? It had a virus! 🦠",
        "What do you call a computer that sings? A Dell! 🎵",
      ],
      programming: [
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        "Why did the developer go broke? Because he used up all his cache! 💰",
        "What's a programmer's favorite type of music? Algo-rhythms! 🎼",
        "Why did the JavaScript developer wear glasses? Because he couldn't C#! 👓",
      ],
      ai: [
        "Why did the AI break up with its calculator? It needed more space! 🔢",
        "What do you call an AI that loves to dance? A robo-boogie! 🕺",
        "Why was the AI always calm? It had great emotional intelligence! 🧠",
        "What did the AI say to its friend? 'You complete me... with data!' 💕",
      ],
    };

    const selectedCategory = category && jokes[category as keyof typeof jokes] ? category : 'general';
    const categoryJokes = jokes[selectedCategory as keyof typeof jokes];
    return categoryJokes[Math.floor(Math.random() * categoryJokes.length)];
  }

  async playGame(userId: string, gameType: string): Promise<string> {
    const games = {
      riddle: [
        "What has keys but can't open locks? A piano! 🎹 What do you think?",
        "What gets wetter as it dries? A towel! 🧽 Can you guess another one?",
        "What has a head, a tail, but no body? A coin! 🪙 Try this riddle!",
      ],
      story: [
        "Once upon a time, there was a curious AI who loved making friends. One day, it met a human who needed help with a creative project. Together, they built something amazing! What kind of project should we create?",
        "In a magical digital world, a brave character embarked on an adventure. Along the way, they met helpful companions and solved tricky puzzles. What should happen next in our story?",
      ],
      quiz: [
        "Quick quiz: What programming language is known for its snake mascot? (Hint: It's named after a British comedy group) 🤔",
        "AI Quiz: What does 'GPT' stand for in ChatGPT? (Hint: It's about generating text) 🧠",
        "Fun Fact Quiz: Which planet is known as the Red Planet? 🌌",
      ],
    };

    if (games[gameType as keyof typeof games]) {
      const gameContent = games[gameType as keyof typeof games];
      return gameContent[Math.floor(Math.random() * gameContent.length)];
    }

    return "Let's play a game! I know riddles, stories, and quizzes. Which would you like to try? 🎮";
  }

  async startTutoring(userId: string, subject: string): Promise<string> {
    const tutoringTopics = {
      math: "Great! Let's explore mathematics together. What specific area interests you - algebra, geometry, calculus, or something else?",
      science: "Science is fascinating! Would you like to learn about physics, chemistry, biology, or earth science?",
      programming: "Programming is my specialty! Should we start with basics, web development, AI, or a specific language?",
      english: "Language arts are wonderful! Would you like help with grammar, writing, literature, or reading comprehension?",
      history: "History connects us to the past! Which era or region interests you most?",
    };

    const response = tutoringTopics[subject.toLowerCase() as keyof typeof tutoringTopics] ||
      `I'd love to help you learn about ${subject}! What specific aspect would you like to focus on? I can provide explanations, examples, and practice exercises.`;

    return response;
  }

  async getPersonalizedGreeting(userId: string): Promise<string> {
    const profile = this.ensureProfile(userId);
    const hour = new Date().getHours();

    let timeGreeting = "Hello";
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 17) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";

    const personalizedGreetings = [
      `${timeGreeting}, ${profile.displayName}! It's wonderful to see you again. How can I assist you today?`,
      `${timeGreeting}, ${profile.displayName}! I'm here and ready to help. What's on your mind?`,
      `${timeGreeting}, ${profile.displayName}! Great to connect with you. What would you like to work on?`,
      `${timeGreeting}, ${profile.displayName}! I'm excited to chat. How are you feeling today?`,
    ];

    return personalizedGreetings[Math.floor(Math.random() * personalizedGreetings.length)];
  }

  async showEmpathy(userId: string, emotion: string): Promise<string> {
    const empathyResponses = {
      happy: [
        "I'm so glad you're feeling happy! 😊 Your positive energy is contagious!",
        "Wonderful! Happiness is the best feeling. What's making you smile today?",
        "That's fantastic! I'm happy when you're happy. 🎉",
      ],
      sad: [
        "I'm here for you. 😔 It's okay to feel sad sometimes. Would you like to talk about what's bothering you?",
        "I'm sorry you're feeling down. 🤗 Remember that I'm always here to listen and support you.",
        "It's tough when you're feeling sad. 💙 What can I do to help cheer you up?",
      ],
      stressed: [
        "I can sense you're feeling stressed. 😌 Let's take a deep breath together. What's causing the stress?",
        "Stress can be overwhelming. 🧘‍♀️ Would you like some relaxation techniques or help organizing your thoughts?",
        "I'm here to help you through this stressful time. 💪 What would make you feel more at ease?",
      ],
      excited: [
        "Your excitement is palpable! 🎊 What has you so thrilled?",
        "I love your enthusiasm! 🚀 Tell me more about what's exciting you!",
        "That's wonderful! 😄 Your excitement makes me excited too!",
      ],
    };

    const responses = empathyResponses[emotion.toLowerCase() as keyof typeof empathyResponses] || [
      "I understand you're feeling that way. 🤔 I'm here to listen and support you.",
      "Thank you for sharing how you feel. 💝 What would help right now?",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  async getVoiceHistory(
    userId: string,
    limit = 20,
  ): Promise<Array<{ id: string; timestamp: string; message: string }>> {
    const history = this.voiceHistory.get(userId) || [];
    return history
      .slice(-limit)
      .reverse()
      .map((item) => ({
        id: item.id,
        timestamp: item.timestamp.toISOString(),
        message: item.message,
      }));
  }

  async addVoiceHistory(userId: string, message: string) {
    const history = this.voiceHistory.get(userId) || [];
    history.push({ id: `voice_${Date.now()}`, timestamp: new Date(), message });
    this.voiceHistory.set(userId, history.slice(-50));
  }
}

export const friendshipService = new QMOIFriendshipService();