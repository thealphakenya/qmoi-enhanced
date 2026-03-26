// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/**
 * QMOI Link Validation API Endpoint
 * POST /api/links/validate - Validate links and get suggestions
 * POST /api/links/validate-batch - Batch validate multiple links
 * GET /api/links/health - Get link health status
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { urls, action } = await request.json();

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'urls array is required' },
        { status: 400 }
      );
    }

    // Get QMOI domain registry
    const domainRegistry = getDomainRegistry();

    if (action === 'validate') {
      // Single URL validation
      const url = urls[0];
      const result = validateLink(url, domainRegistry);
      
      return NextResponse.json({
        success: true,
        validation: result,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'validate-batch') {
      // Batch validation
      const validations = urls.map(url => validateLink(url, domainRegistry));
      
      const stats = {
        total: urls.length,
        valid: validations.filter(v => v.isValid).length,
        broken: validations.filter(v => !v.isValid).length,
        validationRate: validations.filter(v => v.isValid).length / urls.length
      };

      return NextResponse.json({
        success: true,
        stats,
        validations,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'auto-fix') {
      // Auto-fix broken links
      const fixes = urls.map(url => ({
        original: url,
        fixed: fixBrokenLink(url, domainRegistry),
        wasFixed: fixBrokenLink(url, domainRegistry) !== undefined
      }));

      return NextResponse.json({
        success: true,
        fixes,
        fixedCount: fixes.filter(f => f.wasFixed).length,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Link validation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Validation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const domain = searchParams.get('domain');

    if (action === 'health' && domain) {
      // Check single domain health
      const domainRegistry = getDomainRegistry();
      const health = await checkDomainHealth(domain, domainRegistry);
      
      return NextResponse.json({
        success: true,
        domain,
        health,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'critical-domains') {
      // Check all critical domains
      const domainRegistry = getDomainRegistry();
      const criticalDomains = Object.values(domainRegistry)
        .filter((d: any) => d.critical)
        .map((d: any) => d.domain);

      const healthStatus: Record<string, any> = {};
      for (const d of criticalDomains) {
        healthStatus[d] = await checkDomainHealth(d, domainRegistry);
      }

      return NextResponse.json({
        success: true,
        criticalDomainsCount: criticalDomains.length,
        healthStatus,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Link health check error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Health check failed' },
      { status: 500 }
    );
  }
}

// Helper functions

function getDomainRegistry(): Record<string, any> {
  return {
    "qvillage.com": {
      type: "primary_hub",
      critical: true,
      fallbacks: ["qvillage.net", "qvillage.org"],
      sslEnabled: true,
      status: "active"
    },
    "qmoi.ai": {
      type: "main_app",
      critical: true,
      fallbacks: ["qmoi.com"],
      sslEnabled: true,
      status: "active"
    },
    "alphaq.ai": {
      type: "ai_platform",
      critical: true,
      fallbacks: ["alphaq.com"],
      sslEnabled: true,
      status: "active"
    },
    "qshare.qvillage.com": {
      type: "service",
      critical: true,
      fallbacks: ["qshare.qvillage.com", "qshare.qglobal.org"],
      sslEnabled: true,
      status: "active"
    },
    "qstore.qvillage.com": {
      type: "service",
      critical: true,
      fallbacks: ["qstore.qvillage.com"],
      sslEnabled: true,
      status: "active"
    },
    "qcity.qmoi.ai": {
      type: "service",
      critical: false,
      fallbacks: ["qcity.qvillage.com"],
      sslEnabled: true,
      status: "active"
    },
    "qmoi-space.qmoi.ai": {
      type: "service",
      critical: false,
      fallbacks: ["space.qmoi.ai"],
      sslEnabled: true,
      status: "active"
    },
    "yap.qmoi.ai": {
      type: "service",
      critical: false,
      fallbacks: ["yap.qvillage.com"],
      sslEnabled: true,
      status: "active"
    },
    "q-stable.qmoi.ai": {
      type: "service",
      critical: false,
      fallbacks: ["stable.alphaq.ai"],
      sslEnabled: true,
      status: "active"
    }
  };
}

function validateLink(url: string, registry: Record<string, any>): {
  url: string;
  isValid: boolean;
  linkType: string;
  suggestion?: string;
  error?: string;
} {
  if (!url) {
    return {
      url,
      isValid: false,
      linkType: 'standard',
      error: 'Empty URL'
    };
  }

  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const domain = urlObj.hostname;

    // Check registry
    if (registry[domain]) {
      const entry = registry[domain];
      const isValid = entry.status === 'active' || entry.status === 'maintenance';
      const suggestion = !isValid && entry.fallbacks?.length > 0
        ? url.replace(domain, entry.fallbacks[0])
        : undefined;

      return {
        url,
        isValid,
        linkType: categorizeLink(url),
        suggestion,
        error: !isValid ? `Domain status: ${entry.status}` : undefined
      };
    }

    // Check for subdomain matches
    for (const [registeredDomain, entry] of Object.entries(registry)) {
      if (domain.endsWith(registeredDomain)) {
        const isValid = .status === 'active';
        return {
          url,
          isValid,
          linkType: categorizeLink(url),
          error: !isValid ? `Domain status: ${.status}` : undefined
        };
      }
    }

    return {
      url,
      isValid: true,
      linkType: categorizeLink(url)
    };
  } catch (error) {
    return {
      url,
      isValid: false,
      linkType: 'standard',
      error: 'Invalid URL format'
    };
  }
}

function fixBrokenLink(url: string, registry: Record<string, any>): string | undefined {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const domain = urlObj.hostname;

    if (registry[domain]) {
      const entry = registry[domain];
      if (entry.fallbacks && entry.fallbacks.length > 0) {
        return url.replace(domain, entry.fallbacks[0]);
      }
    }

    // Check for subdomain matches
    for (const [registeredDomain, entry] of Object.entries(registry)) {
      if (domain.endsWith(registeredDomain) && .fallbacks?.length > 0) {
        return url.replace(domain, .fallbacks[0]);
      }
    }

    return undefined;
  } catch {
    return undefined;
  }
}

function categorizeLink(url: string): string {
  if (url.includes('api')) return 'api';
  if (url.includes('download') || url.match(/\.(zip|exe|apk|ipa)$/)) return 'download';
  if (url.includes('store')) return 'store';
  if (url.includes('share')) return 'sharing';
  if (url.includes('qcity')) return 'city';
  if (url.includes('space')) return 'space';
  if (url.includes('yap')) return 'messaging';
  if (url.includes('stable')) return 'models';
  return 'standard';
}

async function checkDomainHealth(domain: string, registry: Record<string, any>): Promise<{
  isHealthy: boolean;
  status?: string;
  responseTime?: number;
  error?: string;
}> {
  try {
    const entry = registry[domain];
    if (!entry) {
      return {
        isHealthy: false,
        error: 'Domain not in registry'
      };
    }

    const protocol = entry.sslEnabled ? 'https' : 'http';
    const healthUrl = `${protocol}://${domain}/health`;

    const startTime = Date.now();
    const response = await fetch(healthUrl, { 
      method: 'HEAD',
      timeout: 5000
    });
    const responseTime = Date.now() - startTime;

    const isHealthy = response.ok || response.status === 301 || response.status === 302;

    return {
      isHealthy,
      status: response.statusText,
      responseTime
    };
  } catch (error) {
    // Try fallback
    const entry = registry[domain];
    if (entry?.fallbacks?.length > 0) {
      return checkDomainHealth(entry.fallbacks[0], registry);
    }

    return {
      isHealthy: false,
      error: error instanceof Error ? error.message : 'Health check failed'
    };
  }
}
