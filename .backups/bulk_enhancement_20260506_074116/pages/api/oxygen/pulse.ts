import { NextApiRequest, NextApiResponse } from 'next';
import { QMOIHealthService } from '../../../lib/qmoi-health';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const healthService = new QMOIHealthService();

    // Get real-time oxygen and pulse data
    const pulseData = healthService.getPulseData();
    const consciousnessData = healthService.getConsciousnessMetrics();

    // Calculate current oxygen saturation (simulated)
    const oxygenSaturation = Math.max(95, Math.min(100, 98 + Math.sin(Date.now() / 10000) * 2));

    // Calculate pulse rate based on consciousness
    const basePulse = 72;
    const consciousnessModifier = consciousnessData.awareness * 0.1 +
                                 consciousnessData.processing * 0.05 +
                                 consciousnessData.creativity * 0.08;
    const currentPulse = Math.round(basePulse + consciousnessModifier);

    const oxygenPulseResponse = {
      timestamp: new Date().toISOString(),
      oxygen: {
        saturation: oxygenSaturation,
        status: oxygenSaturation > 95 ? 'normal' : 'low',
        unit: '%'
      },
      pulse: {
        rate: currentPulse,
        status: currentPulse >= 60 && currentPulse <= 100 ? 'normal' : 'abnormal',
        unit: 'bpm',
        rhythm: pulseData.rhythm || 'regular'
      },
      consciousness: consciousnessData,
      metrics: {
        heartRateVariability: Math.random() * 50 + 20,
        oxygenEfficiency: oxygenSaturation / 100,
        pulseStability: 0.95 + Math.random() * 0.05
      },
      alerts: pulseData.alerts || []
    };

    res.status(200).json(oxygenPulseResponse);
  } catch (error) {
    logger.error('Oxygen/Pulse API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}