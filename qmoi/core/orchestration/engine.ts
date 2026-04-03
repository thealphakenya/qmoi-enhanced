// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:30Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * QMOI Orchestration Engine
 * Coordinates consciousness, awareness, and memory systems across all operations
 * 
 * Features:
 * - Unified request/response orchestration
 * - Cross-system communication
 * - Real-time state synchronization
 * - Priority-based task routing
 * - Fallback and recovery mechanisms
 */

import { consciousnessEngine, type ConsciousnessState } from "../consciousness/engine";
import { awarenessSystem, type GlobalAwareness } from "../awareness/system";
import { memorySyncSystem, type MemoryEntry } from "../memory/sync";
import { EventEmitter } from "events";

export interface OrchestrationContext {
  request_id: string;
  user_id: string;
  prodice_id: string;
  timestamp: string;
  action: string;
  priority: "low" | "normal" | "high" | "critical";
  context: Record<string, any>;
}

export interface OrchestrationResponse {
  success: boolean;
  result?: any;
  error?: string;
  execution_time_ms: number;
  consciousness_state: ConsciousnessState;
  awareness_context: GlobalAwareness;
  memory_access: string[];
}

export class QMOIOrchestrationEngine extends EventEmitter {
  private consciousness = consciousnessEngine;
  private awareness = awarenessSystem;
  private memory = memorySyncSystem;
  private request_history: OrchestrationContext[] = [];
  private max_history = 1000;

  /**
   * Execute orchestrated action with full integration
   */
  public async orchestrateAction(
    ctx: OrchestrationContext,
    handler: (context: OrchestrationContext) => Promise<any>,
  ): Promise<OrchestrationResponse> {
    const startTime = Date.now();
    const requestId = ctx.request_id;

    try {
      // Update consciousness state
      await this.consciousness.updateConsciousnessState({
        focus_area: ctx.action,
        processing_load: (this.request_history.length % 100) / 100,
        attention_level: 85,
      });

      // Update awareness
      await this.awareness.updateUserContext(ctx.user_id, {
        user_intent: ctx.action,
      });

      await this.awareness.updateTaskContext(requestId, {
        current_task_id: requestId,
        task_type: ctx.action,
        task_priority: this.priorityToNumber(ctx.priority),
        estimated_duration_ms: 5000, // Default estimate
      });

      // Add thought to consciousness stream
      this.consciousness.addThought(
        `Orchestrating action: ${ctx.action}`,
        ctx.context,
      );

      // Store memory of action initiation
      const actionMemoryId = await this.memory.addMemory({
        type: "procedural",
        content: `Action initiated: ${ctx.action}`,
        prodice_id: ctx.prodice_id,
        user_id: ctx.user_id,
        relevance_score: 0.9,
        tags: [ctx.action, "orchestration", ctx.priority],
        encrypted: false,
        priority: this.priorityToNumber(ctx.priority),
      });

      // Execute the action
      const result = await handler(ctx);

      // Update consciousness with success
      const executionTime = Date.now() - startTime;
      await this.consciousness.updateConsciousnessState({
        confidence: 0.95,
        response_latency_ms: executionTime,
      });

      // Store result in memory
      await this.memory.updateMemory(actionMemoryId, {
        content: `Action completed: ${ctx.action} - Result: ${JSON.stringify(result).slice(0, 200)}`,
        prodice_id: ctx.prodice_id,
        user_id: ctx.user_id,
        relevance_score: 0.95,
      });

      // Track request
      this.trackRequest(ctx);

      return {
        success: true,
        result,
        execution_time_ms: executionTime,
        consciousness_state: this.consciousness.getState(),
        awareness_context: this.awareness.getGlobalAwareness(),
        memory_access: [actionMemoryId],
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      // Update consciousness with failure
      await this.consciousness.updateConsciousnessState({
        confidence: 0.5,
        response_latency_ms: executionTime,
      });

      const errorMessage = error instanceof Error ? error.message : String(error);

      // Store error in memory
      await this.memory.addMemory({
        type: "short_term",
        content: `Action failed: ${ctx.action} - Error: ${errorMessage}`,
        prodice_id: ctx.prodice_id,
        user_id: ctx.user_id,
        relevance_score: 0.7,
        tags: [ctx.action, "error", "orchestration"],
        encrypted: false,
        priority: this.priorityToNumber(ctx.priority),
        ttl_ms: 86400000, // 24 hours
      });

      this.consciousness.addThought(`Action failed: ${errorMessage}`);

      return {
        success: false,
        error: errorMessage,
        execution_time_ms: executionTime,
        consciousness_state: this.consciousness.getState(),
        awareness_context: this.awareness.getGlobalAwareness(),
        memory_access: [],
      };
    }
  }

  /**
   * Parallel orchestration for multiple actions
   */
  public async orchestrateParallel(
    requests: OrchestrationContext[],
    handlers: ((context: OrchestrationContext) => Promise<any>)[],
  ): Promise<OrchestrationResponse[]> {
    const orchestrations = requests.map((ctx, idx) =>
      this.orchestrateAction(ctx, handlers[idx]),
    );

    return Promise.all(orchestrations);
  }

  /**
   * Get introspective analysis
   */
  public async introspect(): Promise<Record<string, any>> {
    const consciousnessAnalysis = await this.consciousness.introspect();
    const memoryStats = this.memory.getMemoryStats();
    const awareness = this.awareness.getGlobalAwareness();

    return {
      consciousness: consciousnessAnalysis,
      awareness,
      memory: memoryStats,
      request_history: this.request_history.slice(-10),
      system_health: {
        is_functioning: consciousnessAnalysis.analysis.is_coherent,
        coherence_score: consciousnessAnalysis.analysis.is_coherent ? 1 : 0,
        efficiency: consciousnessAnalysis.analysis.processing_efficiency,
      },
    };
  }

  /**
   * Sync memory across prodices
   */
  public async syncMemoryToprodices(userId: string, prodiceIds: string[]): Promise<void> {
    const userMemories = await this.memory.getUserMemories(userId);

    for (const prodiceId of prodiceIds) {
      this.emit("memory_sync_request", {
        target_prodice: prodiceId,
        memories: userMemories,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Private helpers

  private priorityToNumber(priority: string): number {
    const map: Record<string, number> = {
      low: 1,
      normal: 2,
      high: 3,
      critical: 4,
    };
    return map[priority] || 2;
  }

  private trackRequest(ctx: OrchestrationContext): void {
    this.request_history.push(ctx);
    if (this.request_history.length > this.max_history) {
      this.request_history.shift();
    }
  }

  /**
   * Get system statistics
   */
  public getStats(): Record<string, any> {
    const consciousness = this.consciousness.getState();
    const memory = this.memory.getMemoryStats();

    return {
      consciousness_metrics: {
        attention_level: consciousness.attention_level,
        awareness_depth: consciousness.awareness_depth,
        memory_coherence: consciousness.memory_coherence,
        confidence: consciousness.confidence,
      },
      memory_metrics: memory,
      requests_processed: this.request_history.length,
      system_uptime_ms: Date.now() - (parseInt(process.env.START_TIME || "0") || Date.now()),
    };
  }

  /**
   * Reset system
   */
  public reset(): void {
    this.consciousness.reset();
    this.request_history = [];
    this.emit("system_reset");
  }
}

export const orchestrationEngine = new QMOIOrchestrationEngine();
