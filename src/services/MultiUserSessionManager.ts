import { EventEmitter } from "events";

export interface User {
  id: string;
  name: string;
  email?: string;
  whatsappId?: string; // WhatsApp phone or ID for cross-interface mapping
  role: "master" | "admin" | "user" | "guest";
  sessionId: string;
  context: UserContext;
  preferences: UserPreferences;
  lastActive: Date;
  isOnline: boolean;
  groupIds: string[];
}

export interface UserContext {
  currentProject?: string;
  currentTask?: string;
  recentFiles: string[];
  searchHistory: string[];
  aiMode: "assistant" | "collaborator" | "teacher" | "mentor";
  relationshipType: "individual" | "group" | "class" | "team";
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  language: string;
  timezone: string;
  notifications: boolean;
  autoSave: boolean;
  aiResponseStyle: "concise" | "detailed" | "conversational";
}

export interface Group {
  id: string;
  name: string;
  type: "class" | "team" | "project" | "study";
  members: string[];
  admins: string[];
  settings: GroupSettings;
  createdAt: Date;
  lastActivity: Date;
}

export interface GroupSettings {
  maxMembers: number;
  allowGuestAccess: boolean;
  requireApproval: boolean;
  sharedContext: boolean;
  aiMode: "shared" | "individual" | "hybrid";
}

export interface Session {
  id: string;
  users: Map<string, User>;
  groups: Map<string, Group>;
  activeContexts: Map<string, any>;
  sharedResources: Map<string, any>;
  createdAt: Date;
  lastActivity: Date;
}

export class MultiUserSessionManager extends EventEmitter {
  private sessions: Map<string, Session> = new Map();
  private userSessions: Map<string, string> = new Map(); // userId -> sessionId
  private whatsappToUserId: Map<string, string> = new Map(); // whatsappId -> userId
  private globalContext: any = {};

  constructor() {
    super();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.on("userJoined", this.handleUserJoined.bind(this));
    this.on("userLeft", this.handleUserLeft.bind(this));
    this.on("groupCreated", this.handleGroupCreated.bind(this));
    this.on("contextChanged", this.handleContextChanged.bind(this));
  }

  // Session Management
  createSession(sessionId: string): Session {
    const session: Session = {
      id: sessionId,
      users: new Map(),
      groups: new Map(),
      activeContexts: new Map(),
      sharedResources: new Map(),
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.sessions.set(sessionId, session);
    this.emit("sessionCreated", sessionId);
    return session;
  }

  joinSession(
    userId: string,
    sessionId: string,
    userData: Partial<User>,
  ): User {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = this.createSession(sessionId);
    }

    const user: User = {
      id: userId,
      name: userData.name || `User_${userId}`,
      email: userData.email,
      whatsappId: userData.whatsappId, // Added whatsappId
      role: userData.role || "user",
      sessionId,
      context: {
        recentFiles: [],
        searchHistory: [],
        aiMode: "assistant",
        relationshipType: "individual",
        ...userData.context,
      },
      preferences: {
        theme: "auto",
        language: "en",
        timezone: "UTC",
        notifications: true,
        autoSave: true,
        aiResponseStyle: "conversational",
        ...userData.preferences,
      },
      lastActive: new Date(),
      isOnline: true,
      groupIds: [],
      ...userData,
    };

    session.users.set(userId, user);
    this.userSessions.set(userId, sessionId);
    session.lastActivity = new Date();

    this.emit("userJoined", { user, sessionId });
    return user;
  }

  leaveSession(userId: string): void {
    const sessionId = this.userSessions.get(userId);
    if (!sessionId) return;

    const session = this.sessions.get(sessionId);
    if (!session) return;

    const user = session.users.get(userId);
    if (user) {
      user.isOnline = false;
      user.lastActive = new Date();
      session.lastActivity = new Date();

      // Remove from all groups
      user.groupIds.forEach((groupId) => {
        this.removeUserFromGroup(userId, groupId);
      });

      this.emit("userLeft", { user, sessionId });
    }
  }

  // Group Management
  createGroup(sessionId: string, groupData: Partial<Group>): Group {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error("Session not found");

    const group: Group = {
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: groupData.name || "New Group",
      type: groupData.type || "team",
      members: groupData.members || [],
      admins: groupData.admins || [],
      settings: {
        maxMembers: 50,
        allowGuestAccess: false,
        requireApproval: false,
        sharedContext: true,
        aiMode: "shared",
        ...groupData.settings,
      },
      createdAt: new Date(),
      lastActivity: new Date(),
      ...groupData,
    };

    session.groups.set(group.id, group);
    session.lastActivity = new Date();

    this.emit("groupCreated", { group, sessionId });
    return group;
  }

  addUserToGroup(
    userId: string,
    groupId: string,
    role: "member" | "admin" = "member",
  ): boolean {
    const sessionId = this.userSessions.get(userId);
    if (!sessionId) return false;

    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const group = session.groups.get(groupId);
    if (!group) return false;

    const user = session.users.get(userId);
    if (!user) return false;

    if (group.members.includes(userId)) return false;

    if (group.members.length >= group.settings.maxMembers) {
      throw new Error("Group is full");
    }

    group.members.push(userId);
    if (role === "admin") {
      group.admins.push(userId);
    }

    user.groupIds.push(groupId);
    group.lastActivity = new Date();
    session.lastActivity = new Date();

    this.emit("userAddedToGroup", { userId, groupId, role, sessionId });
    return true;
  }

  removeUserFromGroup(userId: string, groupId: string): boolean {
    const sessionId = this.userSessions.get(userId);
    if (!sessionId) return false;

    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const group = session.groups.get(groupId);
    if (!group) return false;

    const user = session.users.get(userId);
    if (!user) return false;

    group.members = group.members.filter((id) => id !== userId);
    group.admins = group.admins.filter((id) => id !== userId);
    user.groupIds = user.groupIds.filter((id) => id !== groupId);

    group.lastActivity = new Date();
    session.lastActivity = new Date();

    this.emit("userRemovedFromGroup", { userId, groupId, sessionId });
    return true;
  }

  // Context Management
  updateUserContext(userId: string, context: Partial<UserContext>): void {
    const sessionId = this.userSessions.get(userId);
    if (!sessionId) return;

    const session = this.sessions.get(sessionId);
    if (!session) return;

    const user = session.users.get(userId);
    if (!user) return;

    user.context = { ...user.context, ...context };
    user.lastActive = new Date();
    session.lastActivity = new Date();

    this.emit("contextChanged", { userId, context: user.context, sessionId });
  }

  getSharedContext(groupId: string): any {
    const group = this.findGroup(groupId);
    if (!group || !group.settings.sharedContext) return null;

    const session = this.sessions.get(this.findSessionByGroup(groupId));
    if (!session) return null;

    return session.activeContexts.get(groupId) || {};
  }

  updateSharedContext(groupId: string, context: any): void {
    const group = this.findGroup(groupId);
    if (!group || !group.settings.sharedContext) return;

    const session = this.sessions.get(this.findSessionByGroup(groupId));
    if (!session) return;

    session.activeContexts.set(groupId, context);
    session.lastActivity = new Date();

    this.emit("sharedContextUpdated", { groupId, context });
  }

  // AI Relationship Management
  getAIRelationshipContext(userId: string, targetUserId?: string): any {
    const user = this.getUser(userId);
    if (!user) return null;

    if (targetUserId) {
      // Individual relationship
      const targetUser = this.getUser(targetUserId);
      if (!targetUser) return null;

      return {
        type: "individual",
        users: [user, targetUser],
        context: this.mergeUserContexts([user.context, targetUser.context]),
        aiMode: this.determineAIMode(user, targetUser),
      };
    } else {
      // Group relationship
      const groupContexts = user.groupIds
        .map((groupId) => {
          const group = this.findGroup(groupId);
          if (!group) return null;

          const groupUsers = group.members
            .map((memberId) => this.getUser(memberId))
            .filter((u): u is User => Boolean(u));
          return {
            groupId,
            group,
            users: groupUsers,
            context: this.mergeUserContexts(groupUsers.map((u) => u.context)),
            aiMode: group.settings.aiMode,
          };
        })
        .filter(Boolean);

      return {
        type: "group",
        user,
        groups: groupContexts,
        aiMode: this.determineGroupAIMode(user),
      };
    }
  }

  private mergeUserContexts(contexts: UserContext[]): UserContext {
    return contexts.reduce(
      (merged, context) => ({
        currentProject: merged.currentProject || context.currentProject,
        currentTask: merged.currentTask || context.currentTask,
        recentFiles: [
          ...new Set([
            ...(merged.recentFiles || []),
            ...(context.recentFiles || []),
          ]),
        ],
        searchHistory: [
          ...new Set([
            ...(merged.searchHistory || []),
            ...(context.searchHistory || []),
          ]),
        ],
        aiMode: context.aiMode || merged.aiMode || "assistant",
        relationshipType:
          context.relationshipType || merged.relationshipType || "individual",
      }),
      {
        currentProject: undefined,
        currentTask: undefined,
        recentFiles: [],
        searchHistory: [],
        aiMode: "assistant",
        relationshipType: "individual",
      },
    );
  }

  private determineAIMode(user1: User, user2: User): string {
    if (user1.role === "master" || user2.role === "master") return "mentor";
    if (user1.role === "admin" || user2.role === "admin") return "teacher";
    return "collaborator";
  }

  private determineGroupAIMode(user: User): string {
    if (user.role === "master") return "mentor";
    if (user.role === "admin") return "teacher";
    return "assistant";
  }

  // Utility Methods
  getUser(userId: string): User | undefined {
    const sessionId = this.userSessions.get(userId);
    if (!sessionId) return undefined;

    const session = this.sessions.get(sessionId);
    return session?.users.get(userId);
  }

  findGroup(groupId: string): Group | undefined {
    for (const session of this.sessions.values()) {
      const group = session.groups.get(groupId);
      if (group) return group;
    }
    return undefined;
  }

  private findSessionByGroup(groupId: string): string | undefined {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.groups.has(groupId)) return sessionId;
    }
    return undefined;
  }

  getSessionUsers(sessionId: string): User[] {
    const session = this.sessions.get(sessionId);
    return session ? Array.from(session.users.values()) : [];
  }

  getSessionGroups(sessionId: string): Group[] {
    const session = this.sessions.get(sessionId);
    return session ? Array.from(session.groups.values()) : [];
  }

  // New: Link WhatsApp ID to user
  linkWhatsAppToUser(
    whatsappId: string | undefined,
    userId: string | undefined,
  ) {
    if (!whatsappId || !userId || typeof userId !== "string") return;
    this.whatsappToUserId.set(whatsappId, userId as string);
    const user = this.getUser(userId as string);
    if (user) user.whatsappId = whatsappId;
  }

  // New: Get user by WhatsApp ID
  getUserByWhatsAppId(whatsappId: string | undefined): User | undefined {
    if (!whatsappId) return undefined;
    const userId = this.whatsappToUserId.get(whatsappId);
    if (!userId || typeof userId !== "string") return undefined;
    return this.getUser(userId as string);
  }

  // New: Sync context from WhatsApp or chat
  syncUserContextByWhatsApp(
    whatsappId: string | undefined,
    context: Partial<UserContext>,
  ) {
    if (!whatsappId) return;
    const user = this.getUserByWhatsAppId(whatsappId);
    if (user && typeof user.id === "string") {
      this.updateUserContext(user.id as string, context);
    }
  }

  // Utility: treat 'master' as 'admin' everywhere
  static isAdminOrMaster(user: User): boolean {
    return user.role === "admin" || user.role === "master";
  }

  // Example usage in permission checks (add wherever needed):
  // if (!MultiUserSessionManager.isAdminOrMaster(user)) { throw new Error('Admin or master required'); }

  // Event Handlers
  private handleUserJoined(data: { user: User; sessionId: string }) {
    console.log(`User ${data.user.name} joined session ${data.sessionId}`);
  }

  private handleUserLeft(data: { user: User; sessionId: string }) {
    console.log(`User ${data.user.name} left session ${data.sessionId}`);
  }

  private handleGroupCreated(data: { group: Group; sessionId: string }) {
    console.log(
      `Group ${data.group.name} created in session ${data.sessionId}`,
    );
  }

  private handleContextChanged(data: {
    userId: string;
    context: UserContext;
    sessionId: string;
  }) {
    console.log(
      `Context changed for user ${data.userId} in session ${data.sessionId}`,
    );
  }

  // Cleanup
  cleanupInactiveSessions(timeoutMinutes = 60): void {
    const cutoff = new Date(Date.now() - timeoutMinutes * 60 * 1000);

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < cutoff && session.users.size === 0) {
        this.sessions.delete(sessionId);
        this.emit("sessionCleaned", sessionId);
      }
    }
  }
}

export default MultiUserSessionManager;
