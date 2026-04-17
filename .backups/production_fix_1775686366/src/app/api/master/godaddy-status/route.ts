/**
 * Master GoDaddy Status API Route
 *
 * Provides GoDaddy integration status for all domains
 * Master-only access required
 *
 * Location: src/app/api/master/godaddy-status/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';

// Check if request is from master
function isMasterAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const masterToken = process.env.MASTER_TOKEN || '';

  if (!authHeader || !masterToken) {
    return false;
  }

  const token = authHeader.replace('Bearer ', '');
  return token === masterToken;
}


const MOCK_GODADDY_STATUS: Record<string, any> = {
  'qmoi.ai': {
    registered: true,
    sslActive: true,
    dnsConfigured: true,
    paidFeatures: ['SSL Certificate', 'DNS Management', 'Domain Privacy'],
    revenue: 2500,
    lastSync: new Date().toISOString()
  },
  'stableq.ai': {
    registered: true,
    sslActive: true,
    dnsConfigured: true,
    paidFeatures: ['SSL Certificate', 'DNS Management'],
    revenue: 1800,
    lastSync: new Date().toISOString()
  },
  'qvillage.com': {
    registered: true,
    sslActive: true,
    dnsConfigured: true,
    paidFeatures: ['SSL Certificate', 'DNS Management', 'Domain Privacy'],
    revenue: 3200,
    lastSync: new Date().toISOString()
  },
  // Add more domains with mock data...
  'api.qmoi.com': {
    registered: true,
    sslActive: true,
    dnsConfigured: true,
    paidFeatures: ['SSL Certificate'],
    revenue: 800,
    lastSync: new Date().toISOString()
  },
  'auth.qmoi.com': {
    registered: true,
    sslActive: true,
    dnsConfigured: true,
    paidFeatures: ['SSL Certificate'],
    revenue: 600,
    lastSync: new Date().toISOString()
  },
  // Default status for other domains
  'default': {
    registered: true,
    sslActive: false,
    dnsConfigured: true,
    paidFeatures: [],
    revenue: 0,
    lastSync: new Date().toISOString()
  }
};

export async function GET(request: NextRequest) {
  try {
    // Check master authorization
    if (!isMasterAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Master token required' },
        { status: 401 }
      );
    }

    // In production, this would call actual GoDaddy APIs
    // For now, return mock data
    const status = { ...MOCK_GODADDY_STATUS };

    // Add default status for domains not explicitly defined
    const allDomains = [
      'qmoi.ai', 'stableq.ai', 'qvillage.com',
      'api.qmoi.com', 'auth.qmoi.com', 'cdn.qmoi.com', 'qcity.io', 'qvillage.org', 'qglobal.ai',
      'qvs.qmoi.ai', 'websphereelite.qmoi.com', 'hostmasternexus.qmoi.com',
      'qparallel.prod', 'web.qmoi.prod', 'test.qmoi.prod', 'production.qmoi.prod',
      'qmoi-space.qmoi.ai', 'q-stable.qmoi.ai', 'qshare.qmoi.ai', 'yap.qmoi.ai',
      'qstore.qmoi.ai', 'qvillage.qmoi.ai', 'status.qmoi.ai',
      'qmoisystem.com', 'downloads.qmoi.app', 'qcity.qmoi.app', 'api.qmoi.app',
      'huggingface.co', 'ngrok.io'
    ];

    allDomains.forEach(domain => {
      if (!status[domain]) {
        status[domain] = { ...MOCK_GODADDY_STATUS.default };
      }
    });

    return NextResponse.json({
      success: true,
      status,
      totalDomains: allDomains.length,
      godaddyManaged: Object.values(status).filter((s: any) => s.registered).length,
      sslActive: Object.values(status).filter((s: any) => s.sslActive).length,
      totalRevenue: Object.values(status).reduce((sum: number, s: any) => sum + s.revenue, 0)
    });

  } catch (error) {
    console.error('GoDaddy status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}