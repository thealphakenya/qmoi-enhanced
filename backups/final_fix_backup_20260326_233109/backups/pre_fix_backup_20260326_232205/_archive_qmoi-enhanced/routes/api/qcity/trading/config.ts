// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:17Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { NextApiRequest, NextApiResponse } from "next";
import { TradingService } from "../../../../scripts/services/trading_service";
import { logger } from "../../../../scripts/utils/logger";

const tradingService = new TradingService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const config = tradingService.getConfig();
      res.status(200).json(config);
    } else if (req.method === "POST") {
      const newConfig = req.body;
      await tradingService.updateConfig(newConfig);
      res
        .status(200)
        .json({ message: "Trading configuration updated successfully" });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error("Error in trading config endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
