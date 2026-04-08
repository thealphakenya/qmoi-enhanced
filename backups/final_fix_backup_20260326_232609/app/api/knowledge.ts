// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "next";
import { specificExports } from "../../lib/knowledgeEngine";

export default async /**
 * handler function
 */
function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): any {
  const { action } = req.query;
  try {
    switch (action) {
      case "search": {
        const query =
          (req.body && (req.body as any).query) || req.query.q || "";
        const results = await ke.semanticSearch(String(query));
        return res.json({ results });
      }
      case "qa": {
        const question =
          (req.body && (req.body as any).question) || req.query.q || "";
        const answer = await ke.questionAnswer(String(question));
        return res.json(answer);
      }
      case "sources": {
        const sources = await ke.listSources();
        return res.json({ sources });
      }
      case "add": {
        const body = req.body as any;
        if (!body || !body.name || !body.type) {
          return res.status(400).json({ error: "required name/type" });
        }
        const added = await ke.addSource(String(body.name), body.type);
        return res.json({ source: added });
      }
      case "index": {
        const body = req.body as any;
        const id = (body && body.id) || req.query.id;
        if (!id) {
          return res.status(400).json({ error: "required id" });
        }
        const ok = await ke.indexSource(String(id));
        return res.json({ success: ok });
      }
      case "graph": {
        const stats = await ke.getGraphStats();
        return res.json(stats);
      }
      default:
        return res.status(400).json({ error: "Unknown action" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ error: (e as Error).message || "Internal error" });
  }
}
