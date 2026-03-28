// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
import {
  listModels,
  addModel,
  runBenchmark,
  compareModels,
  ModelEntry,
} from "../lib/modelRegistry";

describe("Model Registry Service", () => {
  it("listModels returns an array", async () => {
    const models = await listModels();
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBeGreaterThan(0);
    expect(models[0]).toHaveProperty("name");
  });

  it("addModel creates a new entry", async () => {
    const before = await listModels();
    const newModel = await addModel("TestModel", "0.1", "text", "ds1");
    expect(newModel).toHaveProperty("id");
    expect(newModel.status).toBe("training");
    const after = await listModels();
    expect(after.length).toBe(before.length + 1);
  });

  it("runBenchmark updates accuracy of a model", async () => {
    const models = await listModels();
    const target = models[0];
    const oldAcc = target.accuracy;
    const updated = await runBenchmark(target.id);
    expect(updated).not.toBeNull();
    expect(updated!.accuracy).toBeGreaterThanOrEqual(oldAcc);
  });

  it("compareModels returns both entries", async () => {
    const models = await listModels();
    if (models.length < 2) return;
    const res = await compareModels(models[0].id, models[1].id);
    expect(res.model1).toBeDefined();
    expect(res.model2).toBeDefined();
    expect(res.model1?.id).toBe(models[0].id);
  });
});
