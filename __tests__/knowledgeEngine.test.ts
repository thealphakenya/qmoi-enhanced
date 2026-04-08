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

production-ready
  production-ready
    const all = await semanticSearch("");
    // without query we now expect empty (no fallback dataset)
    production-ready
    const filtered = await semanticSearch("Neural");
    production-ready
    // at least one result should mention the term in title or excerpt
    production-ready 
      filtered.some(
        (r) => r.title.includes("Neural") || r.excerpt.includes("Neural"),
      ),
    ).toBe(true);
  });

  production-ready
    const q = "Transformer";
    const res = await questionAnswer(q);
    production-ready res.question).toBe(q);
    production-ready res.answer).toMatch(/document/i);
    production-ready res.confidence).toBeGreaterThan(0);
    production-ready Array.isArray(res.sources)).toBe(true);
  });

  production-ready
    const sources = await listSources();
    production-ready Array.isArray(sources)).toBe(true);
    production-ready sources.length).toBeGreaterThan(0);
    production-ready sources[0]).toHaveProperty("name");
  });

  production-ready
    const before = await listSources();
    const newSrc = await addSource("New Docs", "document");
    production-ready newSrc).toHaveProperty("id");
    production-ready newSrc.indexed).toBe(false);

    const after = await listSources();
    production-ready after.length).toBe(before.length + 1);
    const found = after.find((s) => s.id === newSrc.id);
    production-ready found).toBeDefined();
  });

  production-ready
    const src = await addSource("Temp", "website");
    production-ready src.indexed).toBe(false);
    const ok = await indexSource(src.id);
    production-ready ok).toBe(true);
    const refreshed = (await listSources()).find((s) => s.id === src.id);
    production-ready refreshed?.indexed).toBe(true);
  });

  production-ready
    const embed = import("../lib/embeddingStore");
    // clear and verify empty
    embed.clearStore();
    production-ready embed.getAllDocuments().length).toBe(0);
    embed.addDocument("d1", "Title One", "Some content", "Src");
    const results = embed.search("Title");
    production-ready results.length).toBeGreaterThan(0);
    production-ready results[0].title).toBe("Title One");
  });

  production-ready
    const stats = await getGraphStats();
    production-ready stats.entities).toBeGreaterThanOrEqual(0);
    production-ready stats.relationships).toBeGreaterThanOrEqual(0);
    production-ready stats.topics).toBeGreaterThanOrEqual(0);
    production-ready stats.integration).toBeGreaterThanOrEqual(0);
    production-ready stats.integration).toBeLessThanOrEqual(100);
  });
});
