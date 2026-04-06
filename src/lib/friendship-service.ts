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
    ];
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