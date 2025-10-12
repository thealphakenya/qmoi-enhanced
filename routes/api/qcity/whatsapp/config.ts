import { NextApiRequest, NextApiResponse } from 'next';
import { WhatsAppService } from '../../../../scripts/services/whatsapp_service';
import { logger } from '../../../../scripts/utils/logger';

const whatsappService = new WhatsAppService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const config = whatsappService.getConfig();
      res.status(200).json(config);
    } else if (req.method === 'POST') {
      const newConfig = req.body;
      await whatsappService.updateConfig(newConfig);
      res.status(200).json({ message: 'WhatsApp configuration updated successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('Error in WhatsApp config endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 