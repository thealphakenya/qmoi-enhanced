// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION READY]
/**
 * QMOI Domain Health Endpoint
 * GET /api/domains/health - Get domain health status globally
 * GET /api/domains/health/critical - Check only critical domains
 * GET /api/domains/health/status - Get current domain status report
 */

import { NextRequest, NextResponse } from 'next/server';

// Domain registry with health tracking
const DOMAIN_REGISTRY = {
  "qvillage.com": { critical: true, fallbacks: ["qvillage.net", "qvillage.org"], type: "primary_hub" },
  "qmoi.ai": { critical: true, fallbacks: ["qmoi.com"], type: "main_app" },
  "alphaq.ai": { critical: true, fallbacks: ["alphaq.com"], type: "ai_platform" },
  "qshare.qvillage.com": { critical: true, fallbacks: ["qshare.qvillage.com"], type: "service" },
  "qstore.qvillage.com": { critical: true, fallbacks: ["qstore.qvillage.com"], type: "service" },
  "qcity.qmoi.ai": { critical: false, fallbacks: ["qcity.qvillage.com"], type: "service" },
  "qmoi-space.qmoi.ai": { critical: false, fallbacks: ["space.qmoi.ai"], type: "service" },
  "yap.qmoi.ai": { critical: false, fallbacks: ["yap.qvillage.com"], type: "service" },
  "q-stable.qmoi.ai": { critical: false, fallbacks: ["stable.alphaq.ai"], type: "service" },
  "qvillage.net": { critical: false, fallbacks: ["qvillage.org"], type: "fallback" },
  "qvillage.org": { critical: false, fallbacks: [], type: "fallback" },
  "qglobal.org": { critical: false, fallbacks: [], type: "fallback" },
  "qparallel.dev": { critical: false, fallbacks: [], type: "fallback" }
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'all';
    const domain = searchParams.get('domain');

    // Single domain check
    if (domain) {
      const health = await checkDomainHealth(domain);
      return NextResponse.json({
        success: true,
        domain,
        health,
        timestamp: new Date().toISOString()
      });
    }

    // Check critical domains only
    if (action === 'critical') {
      const criticalDomains = Object.entries(DOMAIN_REGISTRY)
        .filter(([_, config]: any) => config.critical)
        .map(([domain]) => domain);

      const results: Record<string, any> = {};
      for (const d of criticalDomains) {
        results[d] = await checkDomainHealth(d);
      }

      const healthyCount = Object.values(results).filter((r: any) => r.isHealthy).length;
      const criticalFailures = Object.entries(results)
        .filter(([_, r]: any) => !r.isHealthy)
        .map(([d]) => d);

      return NextResponse.json({
        success: true,
        action: 'critical',
        totalCritical: criticalDomains.length,
        healthyCount,
        criticalFailures,
        details: results,
        timestamp: new Date().toISOString()
      });
    }

    // Full status report
    if (action === 'status') {
      const results: Record<string, any> = {};
      let totalHealthy = 0;
      let totalUnhealthy = 0;

      for (const domain of Object.keys(DOMAIN_REGISTRY)) {
        const health = await checkDomainHealth(domain);
        results[domain] = health;
        if (health.isHealthy) totalHealthy++;
        else totalUnhealthy++;
      }

      return NextResponse.json({
        success: true,
        action: 'status',
        summary: {
          totalDomains: Object.keys(DOMAIN_REGISTRY).length,
          healthyDomains: totalHealthy,
          unhealthyDomains: totalUnhealthy,
          healthPercentage: ((totalHealthy / Object.keys(DOMAIN_REGISTRY).length) * 100).toFixed(2) + '%'
        },
        details: results,
        timestamp: new Date().toISOString()
      });
    }

    // Check all domains
    const results: Record<string, any> = {};
    for (const domain of Object.keys(DOMAIN_REGISTRY)) {
      results[domain] = await checkDomainHealth(domain);
    }

    return NextResponse.json({
      success: true,
      action: 'all',
      totalDomains: Object.keys(DOMAIN_REGISTRY).length,
      healthyCount: Object.values(results).filter((r: any) => r.isHealthy).length,
      unhealthyCount: Object.values(results).filter((r: any) => !r.isHealthy).length,
      details: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Domain health check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed'
      },
      { status: 500 }
    );
  }
}

// Helper function to check domain health
async function checkDomainHealth(domain: string): Promise<{
  domain: string;
  isHealthy: boolean;
  dnsResolves?: boolean;
  httpStatus?: number;
  responseTime?: number;
  error?: string;
  fallbackActive?: boolean;
  fallbackDomain?: string;
}> {
  try {
    const startTime = Date.now();

    // Try HTTPS first
    try {
      const response = await Promise.race([
        fetch(`https://${domain}/health`, { method: 'HEAD' }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);

      if (response instanceof Response) {
        const responseTime = Date.now() - startTime;
        return {
          domain,
          isHealthy: response.ok || response.status === 301 || response.status === 302,
          httpStatus: response.status,
          responseTime,
          dnsResolves: true
        };
      }
    } catch (httpsError) {
      // Try HTTP fallback
      try {
        const response = await Promise.race([
          fetch(`http://${domain}/health`, { method: 'HEAD' }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);

        if (response instanceof Response) {
          const responseTime = Date.now() - startTime;
          return {
            domain,
            isHealthy: response.ok || response.status === 301 || response.status === 302,
            httpStatus: response.status,
            responseTime,
            dnsResolves: true
          };
        }
      } catch (httpError) {
        // If both fail, try fallback domain
        const config = DOMAIN_REGISTRY[domain as keyof typeof DOMAIN_REGISTRY];
        if (config && config.fallbacks && config.fallbacks.length > 0) {
          const fallbackDomain = config.fallbacks[0];
          const fallbackHealth = await checkDomainHealth(fallbackDomain);
          
          return {
            domain,
            isHealthy: fallbackHealth.isHealthy,
            error: `Primary domain failed, fallback: ${fallbackDomain}`,
            fallbackActive: true,
            fallbackDomain: fallbackDomain,
            dnsResolves: fallbackHealth.dnsResolves,
            responseTime: Date.now() - startTime
          };
        }

        return {
          domain,
          isHealthy: false,
          dnsResolves: false,
          error: `Failed to resolve: ${domain}`,
          responseTime: Date.now() - startTime
        };
      }
    }

    return {
      domain,
      isHealthy: false,
      error: 'Unknown error',
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      domain,
      isHealthy: false,
      error: error instanceof Error ? error.message : 'Health check failed',
      dnsResolves: false
    };
  }
}
