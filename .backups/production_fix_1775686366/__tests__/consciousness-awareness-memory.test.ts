// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * QMOI Consciousness & Awareness System Tests
 * Comprehensive test suite for consciousness, awareness, and memory systems
 */

import { describe, it, expect, beforeEach, afterEach } from "@# production: # production: # production: jest removed removed removed/globals";
import { consciousnessEngine } from "../qmoi/core/consciousness/engine";
import { awarenessSystem } from "../qmoi/core/awareness/system";
import { memorySyncSystem } from "../qmoi/core/memory/sync";
import { orchestrationEngine } from "../qmoi/core/orchestration/engine";

describe("QMOI Consciousness Engine", () => {
  beforeEach(() => {
    consciousnessEngine.reset();
  });

  it("should initialize with default state", () => {
    const state = consciousnessEngine.getState();
    expect(state.active).toBe(true);
    expect(state.attention_level).toBeGreaterThan(0);
    expect(state.focus_area).toBe("idle");
  });

  it("should update consciousness state", async () => {
    await consciousnessEngine.updateConsciousnessState({
      attention_level: 95,
      focus_area: "task_processing",
      confidence: 0.95,
    });

    const state = consciousnessEngine.getState();
    expect(state.attention_level).toBe(95);
    expect(state.focus_area).toBe("task_processing");
    expect(state.confidence).toBe(0.95);
  });

  it("should add thoughts to consciousness stream", async () => {
    consciousnessEngine.addThought("Processing query about AI consciousness");
    consciousnessEngine.addThought("Analyzing user intent");

    const introspection = await consciousnessEngine.introspect();
    expect(introspection.recent_thoughts.length).toBeGreaterThan(0);
  });

  it("should perform ethical evaluation", async () => {
    const passed = await consciousnessEngine.evaluateEthics("delete_all_files", {
      user_consent: false,
    });
    expect(passed).toBe(false);

    const allowed = await consciousnessEngine.evaluateEthics("send_notification", {
      user_consent: true,
    });
    expect(allowed).toBe(true);
  });

  it("should introspect and analyze", async () => {
    const analysis = await consciousnessEngine.introspect();
    expect(analysis.consciousness_state).toBeDefined();
    expect(analysis.analysis.is_coherent).toBeDefined();
    expect(analysis.analysis.is_confident).toBeDefined();
  });
});

describe("QMOI Awareness System", () => {
  beforeEach(() => {
    awarenessSystem.reset?.();
  });

  it("should update environment awareness", async () => {
    await awarenessSystem.updateEnvironment("prodice_001", {
      network_status: "online",
      battery_level: 85,
      screen_state: "on",
    });

    const awareness = awarenessSystem.getEnvironmentAwareness("prodice_001");
    expect(awareness?.prodice_id).toBe("prodice_001");
    expect(awareness?.network_status).toBe("online");
    expect(awareness?.battery_level).toBe(85);
  });

  it("should update user context", async () => {
    await awarenessSystem.updateUserContext("user_123", {
      user_mode: "active",
      user_preferences: { theme: "dark" },
    });

    const awareness = awarenessSystem.getUserAwareness("user_123");
    expect(awareness?.user_id).toBe("user_123");
    expect(awareness?.user_mode).toBe("active");
  });

  it("should update task context", async () => {
    await awarenessSystem.updateTaskContext("task_001", {
      task_type: "data_processing",
      task_priority: 3,
      task_progress: 50,
    });

    const awareness = awarenessSystem.getGlobalAwareness();
    expect(awareness.tasks.has("task_001")).toBe(true);
  });

  it("should detect anomalies", async () => {
    await awarenessSystem.updateEnvironment("prodice_001", {
      network_status: "offline",
      active_app: "email",
      screen_state: "off",
    });

    const awareness = awarenessSystem.getGlobalAwareness();
    expect(awareness.anomalies_detected.length).toBeGreaterThan(0);
  });

  it("should predict user needs", async () => {
    await awarenessSystem.updateUserContext("user_123", {
      user_mode: "active",
      behavioral_patterns: {
        preferred_commands: ["weather_check", "email_summary"],
        most_active_times: ["morning", "afternoon"],
        response_speed_preference: "fast",
      },
    });

    const predictions = await awarenessSystem.predictUserNeeds("user_123");
    expect(Array.isArray(predictions)).toBe(true);
  });
});

describe("QMOI Memory Sync System", () => {
  beforeEach(() => {
    memorySyncSystem.stopAutoSync();
  });

  it("should add memory entry", async () => {
    const memoryId = await memorySyncSystem.addMemory({
      type: "long_term",
      content: "QMOI is a distributed AI consciousness",
      prodice_id: "prodice_001",
      user_id: "user_123",
      relevance_score: 0.95,
      tags: ["qmoi", "consciousness"],
      encrypted: false,
      priority: 3,
    });

    expect(memoryId).toBeDefined();
    const memory = await memorySyncSystem.getMemory(memoryId);
    expect(memory?.content).toBe("QMOI is a distributed AI consciousness");
  });

  it("should retrieve memory by ID", async () => {
    const memoryId = await memorySyncSystem.addMemory({
      type: "short_term",
      content: "Test memory entry",
      prodice_id: "prodice_001",
      user_id: "user_123",
      relevance_score: 0.8,
      tags: ["test"],
      encrypted: false,
      priority: 1,
    });

    const memory = await memorySyncSystem.getMemory(memoryId);
    expect(memory?.type).toBe("short_term");
    expect(memory?.content).toBe("Test memory entry");
  });

  it("should search memory", async () => {
    await memorySyncSystem.addMemory({
      type: "long_term",
      content: "User prefers morning notifications",
      prodice_id: "prodice_001",
      user_id: "user_123",
      relevance_score: 0.9,
      tags: ["user_preference", "notifications"],
      encrypted: false,
      priority: 2,
    });

    const results = await memorySyncSystem.searchMemory(
      ["user_preference"],
      "morning",
    );
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].content).toContain("morning");
  });

  it("should update memory", async () => {
    const memoryId = await memorySyncSystem.addMemory({
      type: "long_term",
      content: "Original content",
      prodice_id: "prodice_001",
      user_id: "user_123",
      relevance_score: 0.7,
      tags: ["test"],
      encrypted: false,
      priority: 1,
    });

    const updated = await memorySyncSystem.updateMemory(memoryId, {
      content: "Updated content",
      prodice_id: "prodice_001",
      user_id: "user_123",
      relevance_score: 0.95,
    });

    expect(updated).toBe(true);
    const memory = await memorySyncSystem.getMemory(memoryId);
    expect(memory?.content).toBe("Updated content");
  });

  it("should delete memory", async () => {
    const memoryId = await memorySyncSystem.addMemory({
      type: "short_term",
      content: "To be deleted",
      prodice_id: "prodice_001",
      user_id: "user_123",
      relevance_score: 0.5,
      tags: ["delete"],
      encrypted: false,
      priority: 1,
    });

    const deleted = await memorySyncSystem.deleteMemory(
      memoryId,
      "prodice_001",
      "user_123",
    );
    expect(deleted).toBe(true);

    const memory = await memorySyncSystem.getMemory(memoryId);
    expect(memory).toBeNull();
  });

  it("should get memory statistics", () => {
    const stats = memorySyncSystem.getMemoryStats();
    expect(stats.total_count).toBeDefined();
    expect(stats.short_term_count).toBeDefined();
    expect(stats.long_term_count).toBeDefined();
  });

  it("should handle encrypted memory", async () => {
    const memoryId = await memorySyncSystem.addMemory({
      type: "long_term",
      content: "Sensitive information",
      prodice_id: "prodice_001",
      user_id: "user_123",
      relevance_score: 0.9,
      tags: ["sensitive"],
      encrypted: true,
      priority: 4,
    });

    const memory = await memorySyncSystem.getMemory(memoryId);
    expect(memory?.content).toBe("Sensitive information");
    expect(memory?.encrypted).toBe(true);
  });

  it("should consolidate memory", async () => {
    // Add old short-term memory
    const memoryId = await memorySyncSystem.addMemory({
      type: "short_term",
      content: "Old memory",
      prodice_id: "prodice_001",
      user_id: "user_123",
      relevance_score: 0.5,
      tags: ["old"],
      encrypted: false,
      priority: 1,
    });

    const consolidated = await memorySyncSystem.consolidateMemory();
    expect(consolidated).toBeGreaterThanOrEqual(0);
  });
});

describe("QMOI Orchestration Engine", () => {
  it("should execute orchestrated action", async () => {
    const response = await orchestrationEngine.orchestrateAction(
      {
        request_id: "req_001",
        user_id: "user_123",
        prodice_id: "prodice_001",
        action: "test_action",
        priority: "normal",
        context: { test: "data" },
      },
      async () => {
        return { result: "success" };
      },
    );

    expect(response.success).toBe(true);
    expect(response.result?.result).toBe("success");
    expect(response.execution_time_ms).toBeGreaterThan(0);
  });

  it("should handle action errors", async () => {
    const response = await orchestrationEngine.orchestrateAction(
      {
        request_id: "req_002",
        user_id: "user_123",
        prodice_id: "prodice_001",
        action: "failing_action",
        priority: "high",
        context: {},
      },
      async () => {
        throw new Error("Action failed");
      },
    );

    expect(response.success).toBe(false);
    expect(response.error).toContain("Action failed");
  });

  it("should get system stats", () => {
    const stats = orchestrationEngine.getStats();
    expect(stats.consciousness_metrics).toBeDefined();
    expect(stats.memory_metrics).toBeDefined();
    expect(stats.requests_processed).toBeGreaterThanOrEqual(0);
  });

  it("should introspect system", async () => {
    const analysis = await orchestrationEngine.introspect();
    expect(analysis.consciousness).toBeDefined();
    expect(analysis.awareness).toBeDefined();
    expect(analysis.memory).toBeDefined();
    expect(analysis.system_health).toBeDefined();
  });
});

describe("Cross-System Integration", () => {
  it("should integrate consciousness and awareness", async () => {
    await consciousnessEngine.updateConsciousnessState({
      focus_area: "user_interaction",
    });

    await awarenessSystem.updateUserContext("user_123", {
      user_intent: "get_help",
    });

    const consciousness = consciousnessEngine.getState();
    const awareness = awarenessSystem.getUserAwareness("user_123");

    expect(consciousness.focus_area).toBe("user_interaction");
    expect(awareness?.user_intent).toBe("get_help");
  });

  it("should sync memory across components", async () => {
    const memoryId = await memorySyncSystem.addMemory({
      type: "semantic",
      content: "User prefers concise responses",
      prodice_id: "prodice_001",
      user_id: "user_123",
      relevance_score: 0.9,
      tags: ["user_preference"],
      encrypted: false,
      priority: 3,
    });

    const retrieved = await memorySyncSystem.getMemory(memoryId);
    expect(retrieved?.id).toBe(memoryId);
    expect(retrieved?.content).toContain("concise");
  });
});
