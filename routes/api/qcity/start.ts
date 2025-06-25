import { NextApiRequest, NextApiResponse } from 'next';
import { QCityService } from '../../../scripts/services/qcity_service';
import { logger } from '../../../scripts/utils/logger';

const qcityService = new QCityService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      await qcityService.initialize();
      res.status(200).json({ message: 'Q-City started successfully' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('Error in Q-City start endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 