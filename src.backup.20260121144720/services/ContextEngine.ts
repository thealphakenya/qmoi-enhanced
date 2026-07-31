// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/services/ContextEngine.ts -->
// ContextEngine: Manages user context, preferences, and adapts to personality traits
export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  personalityTraits: string[];
  moodHistory: { date: Date; mood: string }[];
}

export class ContextEngine {
  private contexts: Record<string, UserContext> = {};
  private whatsappToUserId: Record<string, string> = {};

  constructor() {
    // Initialize context and preference management
  }

  saveUserContext(context: UserContext) {
    this.contexts[context.userId] = context;
  }

  getUserContext(userId: string): UserContext | null {
    return this.contexts[userId] || null;
  }

  // Link WhatsApp ID to userId
  linkWhatsAppToUser(whatsappId: string, userId: string) {
    this.whatsappToUserId[whatsappId] = userId;
  }

  // Get context by WhatsApp ID
  getUserContextByWhatsApp(whatsappId: string): UserContext | null {
    const userId = this.whatsappToUserId[whatsappId];
    if (!userId) return null;
    return this.getUserContext(userId);
  }

  // Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(whatsappId: string, context: Partial<UserContext>) {
    const userId = this.whatsappToUserId[whatsappId];
    if (userId && this.contexts[userId]) {
      this.contexts[userId] = { ...this.contexts[userId], ...context };
    }
  }

  adaptToUser(userId: string, personalityTraits: string[]) {
    if (this.contexts[userId]) {
      this.contexts[userId].personalityTraits = personalityTraits;
    }
  }

  learnFromInteraction(userId: string, interaction: unknown) {
    // Analyze interaction and update context
    // Example: sentiment analysis, mood tracking
    if (this.contexts[userId]) {
      // ... update moodHistory, preferences, etc.
    }
  }
}
