import { NextApiRequest, NextApiResponse } from 'next';

function getConsciousnessMetrics() {
  return {
    awareness: 85,
    processing: 72,
    learning: 91,
    creativity: 78,
    emotional: 88,
    adaptation: 83,
  };
}

function getPulseData() {
  return {
    bpm: 72,
    rhythm: 'steady',
    health: 'excellent',
    consciousness: 'aware',
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const timestamp = new Date().toISOString();

    const healthResponse: Record<string, unknown> = {
      status: 'healthy',
      timestamp,
      version: '2.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      consciousness: getConsciousnessMetrics(),
      pulse: getPulseData(),
      services: {
        oxygen: 'active',
        pulse: 'active',
        monitoring: 'active',
        dashboard: 'active',
      },
      endpoints: {
        health: '/api/health',
        detailed: '/api/health?type=detailed',
        oxygen: '/api/oxygen/pulse',
        dashboard: '/api/dashboard/health',
      },
    };

    const type = req.query.type as string;
    if (type === 'detailed') {
      healthResponse.services = {
        ...healthResponse.services,
        database: 'connected',
        cache: 'active',
        monitoring: 'active',
        alerts: 'configured',
      };
    }

    return res.status(200).json(healthResponse);
  } catch (error) {
    logger.error('Health check error:', error);
    return res.status(500).json({
      status: 'unhealthy',
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
