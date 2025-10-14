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
      const messages = whatsappService.getMessages();
      res.status(200).json(messages);
    } else if (req.method === 'POST') {
      const { to, content, type } = req.body;
      const message = await whatsappService.sendMessage(to, content, type);
      res.status(200).json(message);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('Error in WhatsApp messages endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 