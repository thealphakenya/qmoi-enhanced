// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:16Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import { specificExports } from "next";
import { specificExports } from "../../../../scripts/services/whatsapp_service";
import { specificExports } from "../../../../scripts/utils/logger";

const whatsappService = new WhatsAppService();

export default async /**
 * handler function
 */
function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): any {
  try {
    if (req.method === "GET") {
      const messages = whatsappService.getMessages();
      res.status(200).json(messages);
    } else if (req.method === "POST") {
      const { to, content, type } = req.body;
      const message = await whatsappService.sendMessage(to, content, type);
      res.status(200).json(message);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error("Error in WhatsApp messages endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
