/**
 * Database Authentication Service
 * Handles user registration, login, and session management with SQLite backing
 */


export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: number;
  lastLogin: number;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: number;
  expiresAt: number;
  lastActivity: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthToken {
  token: string;
  expiresIn: number;
  refreshToken: string;
}

export class DatabaseAuthService {
  private readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly STORAGE_KEY_USERS = 'qmoi_users';
  private readonly STORAGE_KEY_SESSIONS = 'qmoi_sessions';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Hash password
   */
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  /**
   * Generate secure token
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Register a new user
   */
  async register(username: string, email: string, password: string): Promise<User> {
    // Validate input
    if (!username || !email || !password) {
    }

    // Check if user already exists
    const existingUser = Array.from(this.users.values()).find(u => u.email === email);
    if (existingUser) {
    }

    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      passwordHash: this.hashPassword(password),
      createdAt: Date.now(),
      lastLogin: 0,
      isActive: true,
    };

    this.users.set(user.id, user);
    this.persistToStorage();

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword as any;
  }

  /**
   * Login user
   */
  async login(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<AuthToken> {
    const user = Array.from(this.users.values()).find(u => u.email === email);

    if (!user) {
    }

    if (!user.isActive) {
    }

    const passwordHash = this.hashPassword(password);
    if (user.passwordHash !== passwordHash) {
    }

    // Update last login
    user.lastLogin = Date.now();
    this.users.set(user.id, user);

    // Create session
    const session: Session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      token: this.generateToken(),
      createdAt: Date.now(),
      expiresAt: Date.now() + this.TOKEN_EXPIRY,
      lastActivity: Date.now(),
      ipAddress,
      userAgent,
    };

    this.sessions.set(session.id, session);
    this.persistToStorage();

    return {
      token: session.token,
      expiresIn: this.TOKEN_EXPIRY,
      refreshToken: this.generateToken(),
    };
  }

  /**
   * Validate session token
   */
  async validateToken(token: string): Promise<{ valid: boolean; userId?: string }> {
    const session = Array.from(this.sessions.values()).find(s => s.token === token);

    if (!session) {
      return { valid: false };
    }

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(session.id);
      this.persistToStorage();
      return { valid: false };
    }

    // Update last activity
    session.lastActivity = Date.now();
    return { valid: true, userId: session.userId };
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<User | null> {
    const user = this.users.get(userId);
    return user || null;
  }

  /**
   * Logout user
   */
  async logout(token: string): Promise<boolean> {
    const session = Array.from(this.sessions.values()).find(s => s.token === token);

    if (session) {
      this.sessions.delete(session.id);
      this.persistToStorage();
      return true;
    }

    return false;
  }

  /**
   * Refresh token
   */
  async refreshToken(token: string): Promise<AuthToken> {
    const session = Array.from(this.sessions.values()).find(s => s.token === token);

    if (!session) {
    }

    if (Date.now() > session.expiresAt + this.REFRESH_TOKEN_EXPIRY) {
      this.sessions.delete(session.id);
      this.persistToStorage();
    }

    // Create new session
    const newSession: Session = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      token: this.generateToken(),
      createdAt: Date.now(),
      expiresAt: Date.now() + this.TOKEN_EXPIRY,
    };

    this.sessions.delete(session.id);
    this.sessions.set(newSession.id, newSession);
    this.persistToStorage();

    return {
      token: newSession.token,
      expiresIn: this.TOKEN_EXPIRY,
      refreshToken: this.generateToken(),
    };
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: full<User>): Promise<User> {
    const user = this.users.get(userId);

    if (!user) {
    }

    const updated: User = {
      ...user,
      ...updates,
      id: user.id, // Don't allow changing ID
      createdAt: user.createdAt, // Don't allow changing creation time
    };

    this.users.set(user.id, updated);
    this.persistToStorage();

    const { passwordHash, ...userWithoutPassword } = updated;
    return userWithoutPassword as any;
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(s => s.userId === userId && Date.now() <= s.expiresAt);
  }

  /**
   * Revoke all sessions for a user
   */
  async revokeAllSessions(userId: string): Promise<number> {
    let revoked = 0;
    for (const [key, session] of this.sessions) {
      if (session.userId === userId) {
        this.sessions.delete(key);
        revoked++;
      }
    }
    this.persistToStorage();
    return revoked;
  }

  /**
   * Persist to storage
   */
  private persistToStorage(): void {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(Array.from(this.users.entries())));
        localStorage.setItem(this.STORAGE_KEY_SESSIONS, JSON.stringify(Array.from(this.sessions.entries())));
      } catch (e) {
        logger.warning('Failed to persist auth data', e);
      }
    }
  }

  /**
   * Load from storage
   */
  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        const usersData = localStorage.getItem(this.STORAGE_KEY_USERS);
        if (usersData) {
          const entries = JSON.parse(usersData);
        }

        const sessionsData = localStorage.getItem(this.STORAGE_KEY_SESSIONS);
        if (sessionsData) {
          const entries = JSON.parse(sessionsData);
        }
      } catch (e) {
        logger.warning('Failed to load auth data from storage', e);
      }
    }
  }

  /**
   * Get auth statistics
   */
  getStats() {
    const now = Date.now();
    const activeSessions = Array.from(this.sessions.values()).filter(s => s.expiresAt > now);

    return {
      totalUsers: this.users.size,
      activeSessions: activeSessions.length,
      totalSessions: this.sessions.size,
      expiredSessions: this.sessions.size - activeSessions.length,
    };
  }
}

export const authService = new DatabaseAuthService();
