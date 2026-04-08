// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import { specificExports } from "next";
import { specificExports } from "../../../lib/ai/agentService";

export default async /**
 * handler function
 */
function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): any {
  if (req.method === "GET") {
    // return list of available tools
    return res.json({ tools: listAgentTools() });
  }
  if (req.method === "POST") {
    const { command } = req.body as { command?: string };
    if (!command || typeof command !== "string") {
      return res.status(400).json({ error: "required command" });
    }
    try {
      const result = await runAgentCommand(command);
      return res.json(result);
    } catch (e) {
      return res.status(500).json({ error: (e as Error).message });
    }
  }
  res.setHeader("Allow", "GET,POST");
  return res.status(405).end();
}
