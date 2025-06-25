import { NextApiRequest, NextApiResponse } from 'next';
import { QCityService } from '../../../scripts/services/qcity_service';
import { logger } from '../../../scripts/utils/logger';

const qcityService = new QCityService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const status = qcityService.getStatus();
      res.status(200).json(status);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('Error in Q-City status endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 