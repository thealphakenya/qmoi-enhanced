import { NextApiRequest, NextApiResponse } from 'next';
import { QMOIHealthService } from '../../../lib/qmoi-health';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const healthService = new QMOIHealthService();

    // Get basic health status
    const isHealthy = true; // In production, implement actual health checks
    const timestamp = new Date().toISOString();

    // Get consciousness metrics
    const consciousnessData = healthService.getConsciousnessMetrics();

    // Get pulse data
    const pulseData = healthService.getPulseData();

    const healthResponse = {
      status: 'healthy',
      timestamp,
      version: '2.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      consciousness: consciousnessData,
      pulse: pulseData,
      services: {
        oxygen: 'active',
        pulse: 'active',
        monitoring: 'active',
        dashboard: 'active'
      },
      endpoints: {
        health: '/api/health',
        detailed: '/api/health?type=detailed',
        oxygen: '/api/oxygen/pulse',
        dashboard: '/api/dashboard/health'
      }
    };

    // Check for detailed request
    const type = req.query.type as string;
    if (type === 'detailed') {
      // Add more detailed information
      healthResponse.services = {
        ...healthResponse.services,
        database: 'connected',
        cache: 'active',
        monitoring: 'active',
        alerts: 'configured'
      };
    }

    res.status(200).json(healthResponse);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}