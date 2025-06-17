import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'master' | 'sister' | 'user';
  passwordHash: string;
  salt: string;
  createdAt: number;
  lastLogin: number;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    tradingEnabled: boolean;
  };
}

interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: number;
  expiresAt: number;
  ip: string;
  userAgent: string;
}

export class AuthManager {
  private static instance: AuthManager;
  private users: Map<string, User>;
  private sessions: Map<string, Session>;
  private masterOnlyFeatures: Set<string>;

  private constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.masterOnlyFeatures = new Set([
      'trading',
      'invention_projects',
      'system_configuration',
      'user_management',
      'download_qcity',
    ]);
  }

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  public async registerUser(
    username: string,
    email: string,
    password: string,
    role: 'master' | 'sister' | 'user' = 'user'
  ): Promise<User> {
    // Check if user already exists
    if (this.findUserByEmail(email)) {
      throw new Error('User already exists');
    }

    // Generate salt and hash password
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = this.hashPassword(password, salt);

    // Create new user
    const user: User = {
      id: uuidv4(),
      username,
      email,
      role,
      passwordHash,
      salt,
      createdAt: Date.now(),
      lastLogin: Date.now(),
      preferences: {
        theme: 'system',
        notifications: true,
        tradingEnabled: false,
      },
    };

    // Save user
    this.users.set(user.id, user);
    return user;
  }

  public async login(email: string, password: string, ip: string, userAgent: string): Promise<Session> {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const passwordHash = this.hashPassword(password, user.salt);
    if (passwordHash !== user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    // Create session
    const session: Session = {
      id: uuidv4(),
      userId: user.id,
      token: this.generateToken(),
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      ip,
      userAgent,
    };

    // Save session
    this.sessions.set(session.id, session);

    // Update last login
    user.lastLogin = Date.now();
    this.users.set(user.id, user);

    return session;
  }

  public async logout(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  public async validateSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      this.sessions.delete(sessionId);
      return false;
    }

    return true;
  }

  public async getUser(sessionId: string): Promise<User | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    return this.users.get(session.userId) || null;
  }

  public async hasAccess(sessionId: string, feature: string): Promise<boolean> {
    const user = await this.getUser(sessionId);
    if (!user) {
      return false;
    }

    // Master has access to everything
    if (user.role === 'master') {
      return true;
    }

    // Check if feature is master-only
    if (this.masterOnlyFeatures.has(feature)) {
      return false;
    }

    // Sister has access to everything except master-only features
    if (user.role === 'sister') {
      return true;
    }

    // Regular users have limited access
    return !this.masterOnlyFeatures.has(feature);
  }

  private findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  private hashPassword(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  public async updateUserPreferences(
    sessionId: string,
    preferences: Partial<User['preferences']>
  ): Promise<User> {
    const user = await this.getUser(sessionId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update preferences
    user.preferences = {
      ...user.preferences,
      ...preferences,
    };

    // Save user
    this.users.set(user.id, user);
    return user;
  }

  public async changePassword(
    sessionId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.getUser(sessionId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const currentHash = this.hashPassword(currentPassword, user.salt);
    if (currentHash !== user.passwordHash) {
      throw new Error('Invalid current password');
    }

    // Generate new salt and hash
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = this.hashPassword(newPassword, newSalt);

    // Update user
    user.salt = newSalt;
    user.passwordHash = newHash;
    this.users.set(user.id, user);
  }
}

// Export singleton instance
export const authManager = AuthManager.getInstance(); 