// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
import { listTrainingTasks, startTraining } from "../lib/selfTraining";

describe("Self-Training Service", () => {
  it("listTrainingTasks returns an array", async () => {
    const tasks = await listTrainingTasks();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0]).toHaveProperty("model");
  });

  it("startTraining adds a new queued task", async () => {
    const before = await listTrainingTasks();
    const newTask = await startTraining("Test Model");
    expect(newTask).toHaveProperty("id");
    expect(newTask.status).toBe("queued");
    const after = await listTrainingTasks();
    expect(after.length).toBe(before.length + 1);
  });
});
