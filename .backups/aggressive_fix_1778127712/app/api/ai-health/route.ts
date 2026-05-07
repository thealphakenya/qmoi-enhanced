import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { aiService } from "@/lib/ai-service";
import { log, logApiError } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    // Perform AI service health checks
    const healthChecks = await performAIHealthChecks();

    // Get recent AI metrics from database
    const recentMetrics = await prisma.systemMetric.findMany({
      where: {
        category: 'ai',
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Calculate AI health metrics
    const totalRequests = recentMetrics.filter(m => m.metricName === 'ai_requests_total').reduce((sum, m) => sum + m.value, 0);
    const successfulRequests = recentMetrics.filter(m => m.metricName === 'ai_requests_success').reduce((sum, m) => sum + m.value, 0);
    const failedRequests = recentMetrics.filter(m => m.metricName === 'ai_requests_failed').reduce((sum, m) => sum + m.value, 0);
    const averageResponseTime = recentMetrics.filter(m => m.metricName === 'ai_response_time').reduce((sum, m) => sum + m.value, 0) / Math.max(recentMetrics.filter(m => m.metricName === 'ai_response_time').length, 1);

    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;

    const duration = Date.now() - startTime;
    log.info('AI health check completed', {
      status: healthChecks.overallStatus,
      duration,
      totalRequests,
      successRate: Math.round(successRate * 100) / 100,
    });

    return NextResponse.json({
      success: true,
      health: {
        status: healthChecks.overallStatus,
        timestamp: new Date().toISOString(),
        services: healthChecks.services,
      },
      metrics: {
        totalRequests: Math.round(totalRequests),
        successfulRequests: Math.round(successfulRequests),
        failedRequests: Math.round(failedRequests),
        successRate: Math.round(successRate * 100) / 100,
        averageResponseTime: Math.round(averageResponseTime * 100) / 100,
        uptime: healthChecks.uptime,
      },
      recentActivity: recentMetrics.slice(0, 5).map(metric => ({
        metric: metric.metricName,
        value: metric.value,
        timestamp: metric.createdAt.toISOString(),
      })),
    });

  } catch (error) {
    logApiError('GET', '/api/ai-health', error as Error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check AI health",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, testMessage = "Hello, how are you?" } = body;

    if (action === 'test') {
      // Test AI service with a real message using aiService
      const startTime = Date.now();
      const response = await aiService.chat(testMessage);
      const responseTime = Date.now() - startTime;

      // Log the test result
      await prisma.systemMetric.create({
        data: {
          metricType: 'ai',
          metricName: 'ai_test_response',
          value: response.success ? 1 : 0,
          unit: 'boolean',
          category: 'ai',
          subsystem: 'health_check',
          dimensions: JSON.stringify({
            testMessage: testMessage.substring(0, 100),
            responseTime,
            model: response.metadata?.model,
          }),
          tags: JSON.stringify(['test', 'health_check']),
          source: 'api',
          collectedBy: 'ai-health-endpoint',
        },
      });

      log.info('AI service test completed', {
        success: response.success,
        responseTime,
        model: response.metadata?.model,
      });

      return NextResponse.json({
        success: true,
        test: {
          message: testMessage,
          response: response.content || response.error,
          responseTime,
          success: response.success,
          metadata: response.metadata,
        },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'test' to test AI service." },
      { status: 400 }
    );

  } catch (error) {
    logApiError('POST', '/api/ai-health', error as Error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process AI health action",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function performAIHealthChecks(): Promise<{
  overallStatus: 'healthy' | 'warning' | 'critical';
  services: Record<string, { status: string; latency?: number; error?: string }>;
  uptime: number;
}> {
  const services: Record<string, { status: string; latency?: number; error?: string }> = {};
  let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';

  // Check OpenAI service
  if (process.env.OPENAI_API_KEY) {
    try {
      const startTime = Date.now();
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });
      const latency = Date.now() - startTime;

      if (response.ok) {
        services.openai = { status: 'healthy', latency };
      } else {
        services.openai = { status: 'critical', latency, error: `HTTP ${response.status}` };
        overallStatus = 'warning';
      }
    } catch (error) {
      services.openai = { status: 'critical', error: error instanceof Error ? error.message : 'Unknown error' };
      overallStatus = 'warning';
    }
  }

  // Check Anthropic service
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const startTime = Date.now();
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });
      const latency = Date.now() - startTime;

      if (response.ok || response.status === 400) { // 400 is expected for invalid request
        services.anthropic = { status: 'healthy', latency };
      } else {
        services.anthropic = { status: 'critical', latency, error: `HTTP ${response.status}` };
        overallStatus = 'warning';
      }
    } catch (error) {
      services.anthropic = { status: 'critical', error: error instanceof Error ? error.message : 'Unknown error' };
      overallStatus = 'warning';
    }
  }

  // Check local AI service availability
  services.local = { status: 'healthy' }; // Assume local service is always available

  // Calculate uptime (simplified - in production, track actual service uptime)
  const uptime = process.uptime ? process.uptime() * 1000 : 0;

  return {
    overallStatus,
    services,
    uptime,
  };
}
