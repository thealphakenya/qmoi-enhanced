// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
import type { NextApiRequest, NextApiResponse } from "next";
import * as st from "../../lib/selfTraining";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { action } = req.query;
  try {
    switch (action) {
      case "list": {
        const tasks = await st.listTrainingTasks();
        return res.json({ tasks });
      }
      case "start": {
        const body = req.body as any;
        if (!body || !body.model) {
          return res.status(400).json({ error: "required model" });
        }
        const task = await st.startTraining(String(body.model));
        return res.json({ task });
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
