import { NextApiRequest, NextApiResponse } from 'next';
import { TradingService } from '../../../../scripts/services/trading_service';
import { logger } from '../../../../scripts/utils/logger';

const tradingService = new TradingService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const positions = tradingService.getPositions();
      res.status(200).json(positions);
    } else if (req.method === 'POST') {
      const { symbol, type, size } = req.body;
      const position = await tradingService.openPosition(symbol, type, size);
      res.status(200).json(position);
    } else if (req.method === 'DELETE') {
      const { positionId } = req.body;
      await tradingService.closePosition(positionId);
      res.status(200).json({ message: 'Position closed successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('Error in trading positions endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 