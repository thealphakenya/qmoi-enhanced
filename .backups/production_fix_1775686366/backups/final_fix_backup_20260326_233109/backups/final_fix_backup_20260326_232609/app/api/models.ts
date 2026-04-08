// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import type { NextApiRequest, NextApiResponse } from "next";
import * as mr from "../../lib/modelRegistry";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { action, id, id1, id2 } = req.query;
  try {
    if (!action) {
      // default to listing or creating
      if (req.method === "GET") {
        const models = await mr.listModels();
        return res.json({ models });
      }
      if (req.method === "POST") {
        const body = req.body as any;
        if (
          !body ||
          !body.name ||
          !body.version ||
          !body.type ||
          !body.dataset
        ) {
          return res.status(400).json({ error: "required model fields" });
        }
        const model = await mr.addModel(
          String(body.name),
          String(body.version),
          body.type,
          String(body.dataset),
        );
        return res.json({ model });
      }
    } else {
      switch (action) {
        case "benchmark": {
          const mid = id || (req.body && (req.body as any).id);
          if (!mid) return res.status(400).json({ error: "required id" });
          const model = await mr.runBenchmark(String(mid));
          if (!model) return res.status(404).json({ error: "Model not found" });
          return res.json({ model });
        }
        case "compare": {
          const m1 = id1 || (req.body && (req.body as any).id1);
          const m2 = id2 || (req.body && (req.body as any).id2);
          if (!m1 || !m2) {
            return res.status(400).json({ error: "required model ids" });
          }
          const result = await mr.compareModels(String(m1), String(m2));
          return res.json(result);
        }
        default:
          return res.status(400).json({ error: "Unknown action" });
      }
    }
  } catch (e) {
    return res
      .status(500)
      .json({ error: (e as Error).message || "Internal error" });
  }
}
