import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { prisma } from "../../lib/db/prisma";
import { log } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Get production API status and metrics
    const [
      totalUsers,
      activeUsers,
      totalSessions,
      recentLogs,
      systemHealth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { accountStatus: 'active' } }),
      prisma.session.count({ where: { isActive: true } }),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { timestamp: 'desc' },
        select: {
          action: true,
          resource: true,
          riskLevel: true,
          timestamp: true,
        },
      }),
      prisma.systemHealth.findFirst({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Get API metrics from system metrics
    const apiMetrics = await prisma.systemMetric.findMany({
      where: {
        category: 'api',
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalRequests = apiMetrics
      .filter((m: any) => m.metricName === 'api_requests_total')
      .reduce((sum: any, m: any) => sum + m.value, 0);

    const errorRate = totalRequests > 0
      ? (apiMetrics.filter((m: any) => m.metricName === 'api_requests_error').reduce((sum: any, m: any) => sum + m.value, 0) / totalRequests) * 100
      : 0;

    const avgResponseTime = apiMetrics
      .filter((m: any) => m.metricName === 'api_response_time')
      .reduce((sum: any, m: any) => sum + m.value, 0) /
      Math.max(apiMetrics.filter((m: any) => m.metricName === 'api_response_time').length, 1);

    return NextResponse.json({
      success: true,
      production: {
        status: systemHealth?.status || 'operational',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'production',
        uptime: process.uptime ? Math.floor(process.uptime()) : 0,
        timestamp: new Date().toISOString(),
      },
      metrics: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
        },
        sessions: {
          active: totalSessions,
        },
        api: {
          totalRequests: Math.round(totalRequests),
          errorRate: Math.round(errorRate * 100) / 100,
          avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        },
      },
      recentActivity: recentLogs.map((log: any) => ({
        action: log.action,
        resource: log.resource,
        riskLevel: log.riskLevel,
        timestamp: log.timestamp.toISOString(),
      })),
      endpoints: {
        total: await getTotalEndpoints(),
        implemented: await getImplementedEndpoints(),
        incomplete: await getIncompleteEndpointCount(),
      },
    });

  } catch (error) {
    log.error('production API status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch production API status",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, metric, value } = body;

    if (action === 'log_metric' && metric && typeof value === 'number') {
      // Log a custom metric
      await prisma.systemMetric.create({
        data: {
          metricType: 'api',
          metricName: metric,
          value: value,
          unit: 'count',
          category: 'api',
          subsystem: 'production_api',
          source: 'manual',
          collectedBy: 'production-api-endpoint',
        },
      });

      return NextResponse.json({
        success: true,
        message: `Metric ${metric} logged with value ${value}`,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'health_check') {
      // Perform comprehensive health check
      const healthCheck = await performHealthCheck();

      return NextResponse.json({
        success: true,
        healthCheck,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'log_metric' or 'health_check'." },
      { status: 400 }
    );

  } catch (error) {
    log.error('production API POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process production API action",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function getTotalEndpoints(): Promise<number> {
  // Count all API route files
  try {
    const result = execSync("find app/api -name \"*.ts\" -o -name \"*.js\" | grep -v '\\.backups' | grep -v '\\bbackups\\b' | wc -l", { encoding: 'utf8' });
    return parseInt(result.trim()) || 0;
  } catch (error) {
    log.warn('Failed to count endpoints', error);
    return 0;
  }
}

async function getImplementedEndpoints(): Promise<number> {
  // Count routes without incomplete endpoint markers
  try {
    const total = execSync("find app/api -name \"*.ts\" -o -name \"*.js\" | grep -v '\\.backups' | grep -v '\\bbackups\\b' | wc -l", { encoding: 'utf8' });
    const incomplete = execSync('find app/api -name "*.ts" -o -name "*.js" | grep -v ".backups" | grep -v "\\bbackups\\b" | xargs grep -l "\\${routeName}" | wc -l', { encoding: 'utf8' });
    return (parseInt(total.trim()) || 0) - (parseInt(incomplete.trim()) || 0);
  } catch (error) {
    log.warn('Failed to count implemented endpoints', error);
    return 0;
  }
}

async function getIncompleteEndpointCount(): Promise<number> {
  // Count routes with incomplete endpoint markers
  try {
    const result = execSync('find app/api -name "*.ts" -o -name "*.js" | grep -v ".backups" | grep -v "\\bbackups\\b" | xargs grep -l "\\${routeName}" | wc -l', { encoding: 'utf8' });
    return parseInt(result.trim()) || 0;
  } catch (error) {
    log.warn('Failed to count incomplete endpoints', error);
    return 0;
  }
}

async function performHealthCheck(): Promise<{
  database: boolean;
  cache: boolean;
  externalAPIs: Record<string, boolean>;
  overall: boolean;
}> {
  const health = {
    database: false,
    cache: true, // Assume cache is working if no Redis
    externalAPIs: {} as Record<string, boolean>,
    overall: false,
  };

  // Check database
  try {
    await prisma.user.count();
    health.database = true;
  } catch (error) {
  log.error('Database health check failed:', error);
  }

  // Check external APIs
  const apis = [
    { name: 'openai', url: 'https://api.openai.com/v1/models', key: process.env.OPENAI_API_KEY },
    { name: 'anthropic', url: 'https://api.anthropic.com/v1/messages', key: process.env.ANTHROPIC_API_KEY },
  ];

  for (const api of apis) {
    if (api.key) {
      try {
        const response = await fetch(api.url, {
          method: 'HEAD',
          headers: api.name === 'anthropic'
            ? { 'x-api-key': api.key, 'anthropic-version': '2023-06-01' }
            : { 'Authorization': `Bearer ${api.key}` },
        });
        health.externalAPIs[api.name] = response.ok;
      } catch {
        health.externalAPIs[api.name] = false;
      }
    }
  }

  health.overall = health.database && Object.values(health.externalAPIs).every(status => status !== false);

  return health;
}
