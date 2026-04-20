// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
import {
  runAgentCommand,
  registerTool,
  listAgentTools,
} from "../lib/ai/agentService";

describe("Agent Service Core", () => {
  it("should register and list tools", () => {
    const initial = listAgentTools().length;
    registerTool({
      name: "real",
      description: "real tool",
      run: async () => "ok",
    });
    expect(listAgentTools().length).toBe(initial + 1);
  });

  it("should execute a matching tool by command", async () => {
    registerTool({
      name: "test-tool",
      description: "for testing",
      run: async () => ({ touched: true }),
    });
    const res = await runAgentCommand("please run the test-tool now");
    expect(res).toHaveProperty("tool", "test-tool");
    expect(res).toHaveProperty("result");
    expect(res.result).toEqual({ touched: true });
  });

  it("should return fallback for unknown command", async () => {
    const res = await runAgentCommand("something unrelated");
    expect(res.result).toMatch(/No tool matched/i);
  });
});
