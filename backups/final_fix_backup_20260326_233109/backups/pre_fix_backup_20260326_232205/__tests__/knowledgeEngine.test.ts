// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import {
  semanticSearch,
  questionAnswer,
  listSources,
  addSource,
  indexSource,
  getGraphStats,
} from "../lib/knowledgeEngine";

describe("Knowledge Engine Service", () => {
  it("semanticSearch returns filtered results", async () => {
    const all = await semanticSearch("");
    // without query we now expect empty (no fallback dataset)
    expect(all.length).toBe(0);
    const filtered = await semanticSearch("Neural");
    expect(filtered.length).toBeGreaterThan(0);
    // at least one result should mention the term in title or excerpt
    expect(
      filtered.some(
        (r) => r.title.includes("Neural") || r.excerpt.includes("Neural"),
      ),
    ).toBe(true);
  });

  it("questionAnswer returns answer based on the top semantic document", async () => {
    const q = "Transformer";
    const res = await questionAnswer(q);
    expect(res.question).toBe(q);
    expect(res.answer).toMatch(/document/i);
    expect(res.confidence).toBeGreaterThan(0);
    expect(Array.isArray(res.sources)).toBe(true);
  });

  it("listSources returns array of sources", async () => {
    const sources = await listSources();
    expect(Array.isArray(sources)).toBe(true);
    expect(sources.length).toBeGreaterThan(0);
    expect(sources[0]).toHaveProperty("name");
  });

  it("addSource creates a new unindexed source", async () => {
    const before = await listSources();
    const newSrc = await addSource("New Docs", "document");
    expect(newSrc).toHaveProperty("id");
    expect(newSrc.indexed).toBe(false);

    const after = await listSources();
    expect(after.length).toBe(before.length + 1);
    const found = after.find((s) => s.id === newSrc.id);
    expect(found).toBeDefined();
  });

  it("indexSource marks the source indexed and updates stats", async () => {
    const src = await addSource("Temp", "website");
    expect(src.indexed).toBe(false);
    const ok = await indexSource(src.id);
    expect(ok).toBe(true);
    const refreshed = (await listSources()).find((s) => s.id === src.id);
    expect(refreshed?.indexed).toBe(true);
  });

  it("embeddingStore can add/search documents directly", async () => {
    const embed = require("../lib/embeddingStore");
    // clear and verify empty
    embed.clearStore();
    expect(embed.getAllDocuments().length).toBe(0);
    embed.addDocument("d1", "Title One", "Some content", "Src");
    const results = embed.search("Title");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe("Title One");
  });

  it("getGraphStats returns numeric values", async () => {
    const stats = await getGraphStats();
    expect(stats.entities).toBeGreaterThanOrEqual(0);
    expect(stats.relationships).toBeGreaterThanOrEqual(0);
    expect(stats.topics).toBeGreaterThanOrEqual(0);
    expect(stats.integration).toBeGreaterThanOrEqual(0);
    expect(stats.integration).toBeLessThanOrEqual(100);
  });
});
