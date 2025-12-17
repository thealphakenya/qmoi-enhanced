import { NextApiRequest, NextApiResponse } from "next";
import { QCityService } from "../../../scripts/services/qcity_service";
import { logger } from "../../../scripts/utils/logger";
import { QCityConfig } from "../../../types/qcity";

const qcityService = new QCityService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const config = qcityService.getConfig();
      res.status(200).json(config);
    } else if (req.method === "POST") {
      const newConfig = req.body as Partial<QCityConfig>;
      await qcityService.updateConfig(newConfig);
      res.status(200).json({ message: "Configuration updated successfully" });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error("Error in Q-City config endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
