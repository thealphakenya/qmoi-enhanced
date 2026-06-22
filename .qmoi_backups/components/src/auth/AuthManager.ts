import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { log as logger } from "@/lib/logger";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "master" | "sister" | "user";
  passwordHash: string;
  salt: string;
  createdAt: number;
  lastLogin: number;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    tradingEnabled: boolean;
  };
}

export interface Session {
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
  private users = new Map<string, User>();
  private sessions = new Map<string, Session>();
  private rememberedDevices = new Map<string, string>();
  private masterOnlyFeatures = new Set<string>([
    "trading",
    "invention_projects",
    "system_configuration",
    "user_management",
    "download_qcity",
  ]);

  // Move sensitive defaults to environment variables for production
  private static MASTER_EMAIL = process.env.MASTER_EMAIL || "";
  private static MASTER_PASSWORD = process.env.MASTER_PASSWORD || "";
  private static SISTER_EMAIL = process.env.SISTER_EMAIL || "";
  private static SISTER_PASSWORD = process.env.SISTER_PASSWORD || "";
  private static MASTER_USERNAME = process.env.MASTER_USERNAME || "master";
  private static SISTER_USERNAME = process.env.SISTER_USERNAME || "sister";
  private static SESSION_STORE_FILE = process.env.SESSION_STORE_FILE || "";
  private usePrisma = false;
  private prismaAdapter: any = null;

  private constructor() {
    this.ensureMasterAndSisterAccounts();
    void this.loadStoreFromFile();

    // If DATABASE_URL is set, attempt to use the Prisma adapter if available.
    if (process.env.DATABASE_URL) {
      try {
        // require at runtime to avoid hard dependency during dry edits
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // @ts-ignore
        const adapter = require("./prismaAdapter").default;
        if (adapter) {
          this.prismaAdapter = adapter;
          this.usePrisma = true;
        }
      } catch (err: any) {
        logger.warn("Prisma adapter not available; falling back to in-memory store.", err);
        this.usePrisma = false;
      }
    }
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
    role: "master" | "sister" | "user" = "user",
  ): Promise<User> {
    if (this.usePrisma && this.prismaAdapter) {
      return await this.prismaAdapter.registerUser(username, email, password, role);
    }

    if (this.findUserByEmail(email)) {
      throw new Error("User already exists");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = this.hashPassword(password, salt);

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
        theme: "system",
        notifications: true,
        tradingEnabled: false,
      },
    };

    this.users.set(user.id, user);
    return user;
  }

  public async login(
    email: string,
    password: string,
    ip: string,
    userAgent: string,
  ): Promise<Session> {
    if (this.usePrisma && this.prismaAdapter) {
      return await this.prismaAdapter.login(email, password, ip, userAgent);
    }

    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordHash = this.hashPassword(password, user.salt);
    if (passwordHash !== user.passwordHash) {
      throw new Error("Invalid credentials");
    }

    const session: Session = {
      id: uuidv4(),
      userId: user.id,
      token: this.generateToken(),
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      ip,
      userAgent,
    };

    this.sessions.set(session.id, session);
    user.lastLogin = Date.now();
    this.users.set(user.id, user);
    void this.persistStoreToFile();
    return session;
  }

  public async logout(sessionId: string): Promise<void> {
    if (this.usePrisma && this.prismaAdapter) {
      await this.prismaAdapter.logout(sessionId);
      return;
    }

    this.sessions.delete(sessionId);
    void this.persistStoreToFile();
  }

  public async validateSession(sessionId: string): Promise<boolean> {
    if (this.usePrisma && this.prismaAdapter) {
      return await this.prismaAdapter.validateSession(sessionId);
    }

    const session = this.sessions.get(sessionId);
    if (!session) return false;
    if (session.expiresAt < Date.now()) {
      this.sessions.delete(sessionId);
      return false;
    }
    return true;
  }

  public async getUser(sessionId: string): Promise<User | null> {
    if (this.usePrisma && this.prismaAdapter) {
      return await this.prismaAdapter.getUser(sessionId);
    }

    const session = this.sessions.get(sessionId);
    if (!session) return null;
    return this.users.get(session.userId) || null;
  }

  public async hasAccess(sessionId: string, feature: string): Promise<boolean> {
    if (this.usePrisma && this.prismaAdapter) {
      return await this.prismaAdapter.hasAccess(sessionId, feature);
    }

    const user = await this.getUser(sessionId);
    if (!user) return false;
    if (user.role === "master") return true;
    if (this.masterOnlyFeatures.has(feature)) return false;
    return true;
  }

  public async updateUserPreferences(
    sessionId: string,
    preferences: Partial<User["preferences"]>,
  ): Promise<User> {
    if (this.usePrisma && this.prismaAdapter) {
      return await this.prismaAdapter.updateUserPreferences(sessionId, preferences);
    }

    const user = await this.getUser(sessionId);
    if (!user) {
      throw new Error("Session not found");
    }
    user.preferences = { ...user.preferences, ...preferences };
    this.users.set(user.id, user);
    void this.persistStoreToFile();
    return user;
  }

  public async changePassword(
    sessionId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (this.usePrisma && this.prismaAdapter) {
      return await this.prismaAdapter.changePassword(sessionId, currentPassword, newPassword);
    }

    const user = await this.getUser(sessionId);
    if (!user) {
      throw new Error("Session not found");
    }
    const currentHash = this.hashPassword(currentPassword, user.salt);
    if (currentHash !== user.passwordHash) {
      throw new Error("Invalid current password");
    }
    const newSalt = crypto.randomBytes(16).toString("hex");
    user.passwordHash = this.hashPassword(newPassword, newSalt);
    user.salt = newSalt;
    this.users.set(user.id, user);
    void this.persistStoreToFile();
  }

  public async changeEmail(sessionId: string, newEmail: string): Promise<User> {
    if (this.usePrisma && this.prismaAdapter) {
      return await this.prismaAdapter.changeEmail(sessionId, newEmail);
    }

    const user = await this.getUser(sessionId);
    if (!user) throw new Error("Session not found");
    if (this.findUserByEmail(newEmail)) throw new Error("Email already in use");
    user.email = newEmail;
    this.users.set(user.id, user);
    void this.persistStoreToFile();
    return user;
  }

  private findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  private hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  private static getDeviceFingerprint(): string {
    return `${process.platform}-${process.arch}-${process.env.USER || process.env.USERNAME || ""}`;
  }

  public rememberDevice(userId: string): void {
    this.rememberedDevices.set(userId, AuthManager.getDeviceFingerprint());
  }

  public isDeviceRemembered(userId: string): boolean {
    return this.rememberedDevices.get(userId) === AuthManager.getDeviceFingerprint();
  }

  public async confirmIdentity(sessionId: string): Promise<boolean> {
    const user = await this.getUser(sessionId);
    if (!user) return false;
    return user.role === "master" || user.role === "sister";
  }

  private ensureMasterAndSisterAccounts(): void {
    try {
      // Only auto-create default accounts when environment variables are set.
      if (AuthManager.MASTER_EMAIL && AuthManager.MASTER_PASSWORD) {
        if (!this.findUserByEmail(AuthManager.MASTER_EMAIL)) {
          void this.registerUser(
            AuthManager.MASTER_USERNAME,
            AuthManager.MASTER_EMAIL,
            AuthManager.MASTER_PASSWORD,
            "master",
          );
        }
      } else {
        logger.warn("MASTER_EMAIL or MASTER_PASSWORD not set; skipping master account creation.");
      }

      if (AuthManager.SISTER_EMAIL && AuthManager.SISTER_PASSWORD) {
        if (!this.findUserByEmail(AuthManager.SISTER_EMAIL)) {
          void this.registerUser(
            AuthManager.SISTER_USERNAME,
            AuthManager.SISTER_EMAIL,
            AuthManager.SISTER_PASSWORD,
            "sister",
          );
        }
      } else {
        logger.warn("SISTER_EMAIL or SISTER_PASSWORD not set; skipping sister account creation.");
      }
    } catch (error) {
      logger.error("Failed to create default accounts", error);
    }
  }

  private async persistStoreToFile(): Promise<void> {
    try {
      if (!AuthManager.SESSION_STORE_FILE) return;
      const out = {
        users: Array.from(this.users.values()),
        sessions: Array.from(this.sessions.values()),
      };
      const dir = path.dirname(AuthManager.SESSION_STORE_FILE);
      await fs.mkdir(dir, { recursive: true }).catch(() => {});
      await fs.writeFile(AuthManager.SESSION_STORE_FILE, JSON.stringify(out, null, 2), { encoding: "utf8" });
    } catch (err: any) {
      logger.warn("Failed to persist session store", err);
    }
  }

  private async loadStoreFromFile(): Promise<void> {
    try {
      if (!AuthManager.SESSION_STORE_FILE) return;
      const file = AuthManager.SESSION_STORE_FILE;
      const content = await fs.readFile(file, { encoding: "utf8" }).catch(() => null);
      if (!content) return;
      const parsed = JSON.parse(content);
      if (parsed.users && Array.isArray(parsed.users)) {
        parsed.users.forEach((u: any) => this.users.set(u.id, u));
      }
      if (parsed.sessions && Array.isArray(parsed.sessions)) {
        parsed.sessions.forEach((s: any) => this.sessions.set(s.id, s));
      }
    } catch (err: any) {
      logger.warn("Failed to load session store", err);
    }
  }
}

export const authManager = AuthManager.getInstance();
