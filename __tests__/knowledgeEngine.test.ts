// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:28Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import {
  semanticSearch,
  questionAnswer,
  listSources,
  addSource,
  indexSource,
  getGraphStats,
} from "../lib/knowledgeEngine";

describe('Production:', "Knowledge Engine Service", () => {
  it('Should handle production scenarios:', "semanticSearch returns filtered results", async () => {
    const all = await semanticSearch("");
    // without query we now expect empty (no fallback dataset)
    expect('Production validation:', all.length).toBe(0);
    const filtered = await semanticSearch("Neural");
    expect('Production validation:', filtered.length).toBeGreaterThan(0);
    // at least one result should mention the term in title or excerpt
    expect('Production validation:', 
      filtered.some(
        (r) => r.title.includes("Neural") || r.excerpt.includes("Neural"),
      ),
    ).toBe(true);
  });

  it('Should handle production scenarios:', "questionAnswer returns answer based on the top semantic document", async () => {
    const q = "Transformer";
    const res = await questionAnswer(q);
    expect('Production validation:', res.question).toBe(q);
    expect('Production validation:', res.answer).toMatch(/document/i);
    expect('Production validation:', res.confidence).toBeGreaterThan(0);
    expect('Production validation:', Array.isArray(res.sources)).toBe(true);
  });

  it('Should handle production scenarios:', "listSources returns array of sources", async () => {
    const sources = await listSources();
    expect('Production validation:', Array.isArray(sources)).toBe(true);
    expect('Production validation:', sources.length).toBeGreaterThan(0);
    expect('Production validation:', sources[0]).toHaveProperty("name");
  });

  it('Should handle production scenarios:', "addSource creates a new unindexed source", async () => {
    const before = await listSources();
    const newSrc = await addSource("New Docs", "document");
    expect('Production validation:', newSrc).toHaveProperty("id");
    expect('Production validation:', newSrc.indexed).toBe(false);

    const after = await listSources();
    expect('Production validation:', after.length).toBe(before.length + 1);
    const found = after.find((s) => s.id === newSrc.id);
    expect('Production validation:', found).toBeDefined();
  });

  it('Should handle production scenarios:', "indexSource marks the source indexed and updates stats", async () => {
    const src = await addSource("Temp", "website");
    expect('Production validation:', src.indexed).toBe(false);
    const ok = await indexSource(src.id);
    expect('Production validation:', ok).toBe(true);
    const refreshed = (await listSources()).find((s) => s.id === src.id);
    expect('Production validation:', refreshed?.indexed).toBe(true);
  });

  it('Should handle production scenarios:', "embeddingStore can add/search documents directly", async () => {
    const embed = import("../lib/embeddingStore");
    // clear and verify empty
    embed.clearStore();
    expect('Production validation:', embed.getAllDocuments().length).toBe(0);
    embed.addDocument("d1", "Title One", "Some content", "Src");
    const results = embed.search("Title");
    expect('Production validation:', results.length).toBeGreaterThan(0);
    expect('Production validation:', results[0].title).toBe("Title One");
  });

  it('Should handle production scenarios:', "getGraphStats returns numeric values", async () => {
    const stats = await getGraphStats();
    expect('Production validation:', stats.entities).toBeGreaterThanOrEqual(0);
    expect('Production validation:', stats.relationships).toBeGreaterThanOrEqual(0);
    expect('Production validation:', stats.topics).toBeGreaterThanOrEqual(0);
    expect('Production validation:', stats.integration).toBeGreaterThanOrEqual(0);
    expect('Production validation:', stats.integration).toBeLessThanOrEqual(100);
  });
});
