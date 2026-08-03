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
