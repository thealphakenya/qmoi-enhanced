// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:30Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * QMOI Awareness System
 * Manages environmental, user, task, and contextual awareness across all prodices and systems
 * 
 * Features:
 * - Real-time environmental sensing
 * - Multi-prodice context awareness
 * - User behavior pattern recognition
 * - Predictive awareness (anticipating user needs)
 * - Cross-platform awareness sync
 */

import { EventEmitter } from "events";

export interface EnvironmentalContext {
  prodice_id: string;
  prodice_type: string;
  location: {
    latitude?: number;
    longitude?: number;
    place_name?: string;
  };
  network_status: "online" | "offline" | "weak";
  battery_level?: number;
  screen_state?: "on" | "off" | "dimmed";
  active_app?: string;
  sensors?: {
    light_level?: number;
    temperature?: number;
    motion_detected?: boolean;
    noise_level?: number;
  };
}

export interface UserContext {
  user_id: string;
  user_mode: "active" | "idle" | "sleeping" | "driving" | "public";
  user_preferences: Record<string, any>;
  behavioral_patterns: {
    most_active_times: string[];
    preferred_commands: string[];
    response_speed_preference: "fast" | "detailed";
  };
  emotional_indicators: {
    stress_level: number;
    engagement_level: number;
    satisfaction_score: number;
  };
  accessibility_needs: string[];
}

export interface TaskContext {
  current_task_id: string;
  task_type: string;
  task_priority: number;
  task_dependencies: string[];
  estimated_duration_ms: number;
  required_resources: string[];
  constraints: Record<string, any>;
  blocked_by?: string[];
}

export interface GlobalAwareness {
  timestamp: string;
  environments: Map<string, EnvironmentalContext>;
  users: Map<string, UserContext>;
  tasks: Map<string, TaskContext>;
  cross_prodice_context: {
    primary_prodice: string;
    active_prodices: string[];
    connected_prodices: string[];
  };
  anomalies_detected: string[];
}

export class QMOIAwarenessSystem extends EventEmitter {
  private global_awareness: GlobalAwareness;
  private awareness_history: GlobalAwareness[] = [];
  private max_history = 100;
  private prediction_engine: PredictionEngine;

  constructor() {
    super();
    this.global_awareness = this.initializeGlobalAwareness();
    this.prediction_engine = new PredictionEngine();
  }

  private initializeGlobalAwareness(): GlobalAwareness {
    return {
      timestamp: new Date().toISOString(),
      environments: new Map(),
      users: new Map(),
      tasks: new Map(),
      cross_prodice_context: {
        primary_prodice: "",
        active_prodices: [],
        connected_prodices: [],
      },
      anomalies_detected: [],
    };
  }

  /**
   * Update environmental awareness for a prodice
   */
  public async updateEnvironment(
    prodiceId: string,
    context: Partial<EnvironmentalContext>,
  ) {
    const updated = {
      prodice_id: prodiceId,
      ...context,
    } as EnvironmentalContext;

    this.global_awareness.environments.set(prodiceId, updated);
    this.detectAnomalies(updated);
    this.emit("environment_updated", { prodiceId, context: updated });
  }

  /**
   * Update user context across all prodices
   */
  public async updateUserContext(
    userId: string,
    context: Partial<UserContext>,
  ) {
    const existing = this.global_awareness.users.get(userId);
    const updated = {
      user_id: userId,
      ...existing,
      ...context,
    } as UserContext;

    this.global_awareness.users.set(userId, updated);
    this.emit("user_context_updated", { userId, context: updated });

    // Sync to all prodices
    await this.syncAwarenessToAllprodices(userId);
  }

  /**
   * Update task context
   */
  public async updateTaskContext(
    taskId: string,
    context: Partial<TaskContext>,
  ) {
    const existing = this.global_awareness.tasks.get(taskId);
    const updated = {
      current_task_id: taskId,
      ...existing,
      ...context,
    } as TaskContext;

    this.global_awareness.tasks.set(taskId, updated);
    this.emit("task_context_updated", { taskId, context: updated });
  }

  /**
   * Predict user needs based on patterns
   */
  public async predictUserNeeds(userId: string): Promise<string[]> {
    const user = this.global_awareness.users.get(userId);
    if (!user) return [];

    return this.prediction_engine.predictNextActions(user);
  }

  /**
   * Detect anomalies in environmental or user behavior
   */
  private detectAnomalies(context: EnvironmentalContext) {
    const anomalies: string[] = [];

    if (context.network_status === "offline" && context.active_app) {
      anomalies.push(`prodice offline but app active: ${context.active_app}`);
    }

    if (context.battery_level !== undefined && context.battery_level < 5) {
      anomalies.push(`Critical battery level: ${context.battery_level}%`);
    }

    if (context.sensors?.motion_detected && context.screen_state === "off") {
      anomalies.push("Motion detected with screen off");
    }

    this.global_awareness.anomalies_detected.push(...anomalies);
    if (anomalies.length > 0) {
      this.emit("anomalies_detected", anomalies);
    }
  }

  /**
   * Get current global awareness context
   */
  public getContext(): GlobalAwareness {
    return this.global_awareness;
  }
  private async syncAwarenessToAllprodices(userId: string): Promise<void> {
    const prodices = this.global_awareness.cross_prodice_context.active_prodices;
    const user = this.global_awareness.users.get(userId);

    for (const prodiceId of prodices) {
      this.emit("sync_awareness", {
        prodiceId,
        userId,
        awareness: user,
      });
    }
  }

  /**
   * Get complete global awareness snapshot
   */
  public getGlobalAwareness(): GlobalAwareness {
    return JSON.parse(JSON.stringify(this.global_awareness));
  }

  /**
   * Get awareness for specific user
   */
  public getUserAwareness(userId: string): UserContext | undefined {
    return this.global_awareness.users.get(userId);
  }

  /**
   * Get environment awareness for prodice
   */
  public getEnvironmentAwareness(prodiceId: string): EnvironmentalContext | undefined {
    return this.global_awareness.environments.get(prodiceId);
  }

  /**
   * Update cross-prodice context
   */
  public async updateprodiceContext(
    primaryprodice: string,
    activeprodices: string[],
    connectedprodices: string[],
  ) {
    this.global_awareness.cross_prodice_context = {
      primary_prodice: primaryprodice,
      active_prodices: activeprodices,
      connected_prodices: connectedprodices,
    };

    this.emit("prodice_context_updated", this.global_awareness.cross_prodice_context);
  }
}

class PredictionEngine {
  /**
   * Predict next user actions based on behavioral patterns
   */
  predictNextActions(user: UserContext): string[] {
    const predictions: string[] = [];

    // If user is active, predict task-related needs
    if (user.user_mode === "active") {
      predictions.push(...user.behavioral_patterns.preferred_commands);
    }

    // If stress level is high, suggest relaxation or break
    if (user.emotional_indicators.stress_level > 0.7) {
      predictions.push("suggest_break", "offer_relaxation_resources");
    }

    // If engagement is low, suggest activities
    if (user.emotional_indicators.engagement_level < 0.3) {
      predictions.push("offer_interactive_task", "suggest_notification");
    }

    return predictions;
  }
}

export const awarenessSystem = new QMOIAwarenessSystem();
