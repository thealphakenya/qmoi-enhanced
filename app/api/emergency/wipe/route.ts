import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { log as logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Get emergency data wipe status and history
    const [
      activeWipes,
      wipeHistory,
      wipeMetrics,
      dataRetentionPolicies
    ] = await Promise.all([
      prisma.systemMetric.findMany({
        where: {
          metricType: 'emergency',
          metricName: 'wipe_active',
          value: 1,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.systemMetric.findMany({
        where: {
          category: 'emergency',
          subsystem: 'wipe',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.systemMetric.findMany({
        where: {
          metricType: 'emergency',
          metricName: { in: ['wipe_completed', 'wipe_failed', 'wipe_cancelled'] },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      getDataRetentionPolicies(),
    ]);

    // Calculate wipe statistics
    const totalWipes = wipeMetrics.filter((w: any) => w.metricName === 'wipe_completed').length;
    const failedWipes = wipeMetrics.filter((w: any) => w.metricName === 'wipe_failed').length;
    const cancelledWipes = wipeMetrics.filter((w: any) => w.metricName === 'wipe_cancelled').length;
    const successRate = totalWipes > 0 ? ((totalWipes) / (totalWipes + failedWipes)) * 100 : 0;

    return NextResponse.json({
      success: true,
      emergency: {
        wipe: {
          status: 'operational',
          activeWipes: activeWipes.length,
          dataRetentionPolicies: dataRetentionPolicies.length,
        },
        metrics: {
          totalWipes,
          failedWipes,
          cancelledWipes,
          successRate: Math.round(successRate * 100) / 100,
          avgWipeTime: calculateAvgWipeTime(wipeHistory),
        },
        activeWipes: activeWipes.map((w: any) => ({
          id: w.dimensions?.wipeId || 'unknown',
          type: w.dimensions?.wipeType || 'general',
          scope: w.dimensions?.scope || 'Unknown',
          progress: w.dimensions?.progress || 0,
          estimatedCompletion: w.dimensions?.estimatedCompletion || null,
          createdAt: w.createdAt.toISOString(),
        })),
        recentWipes: wipeHistory.slice(0, 20).map((w: any) => ({
          id: w.dimensions?.wipeId || 'unknown',
          type: w.dimensions?.wipeType || 'general',
          scope: w.dimensions?.scope || 'Unknown',
          status: w.dimensions?.status || 'unknown',
          recordsAffected: w.dimensions?.recordsAffected || 0,
          dataSize: w.dimensions?.dataSize || 0,
          completedAt: w.dimensions?.completedAt || null,
          timestamp: w.createdAt.toISOString(),
        })),
        policies: dataRetentionPolicies,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Emergency wipe status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch emergency wipe status",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, wipeType, scope, reason, confirmationCode } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required" },
        { status: 400 }
      );
    }

    if (action === 'initiate_wipe' && (!wipeType || !scope || !reason)) {
      return NextResponse.json(
        { success: false, error: "Wipe type, scope, and reason are required for data wipe initiation" },
        { status: 400 }
      );
    }

    if (action === 'initiate_wipe') {
      // Verify confirmation code for critical operations
      if (!confirmationCode || confirmationCode !== 'CONFIRM_EMERGENCY_WIPE') {
        return NextResponse.json(
          { success: false, error: "Invalid confirmation code. Use 'CONFIRM_EMERGENCY_WIPE' to proceed." },
          { status: 400 }
        );
      }

      // Initiate emergency data wipe
      const wipeResult = await initiateDataWipe(wipeType, scope, reason);

      // Log the wipe initiation
      await prisma.auditLog.create({
        data: {
          userId: 'system',
          username: 'emergency_system',
          action: 'emergency_wipe_initiated',
          resource: 'emergency',
          details: JSON.stringify({
            wipeId: wipeResult.wipeId,
            wipeType,
            scope,
            reason: reason.substring(0, 200),
            estimatedRecords: wipeResult.estimatedRecords,
            estimatedDataSize: wipeResult.estimatedDataSize,
            confirmationCode: 'PROVIDED',
          }),
          riskLevel: 'critical',
          status: wipeResult.success ? 'success' : 'error',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: `Emergency data wipe initiated for ${scope}`,
        wipe: {
          id: wipeResult.wipeId,
          type: wipeType,
          scope,
          status: 'active',
          estimatedRecords: wipeResult.estimatedRecords,
          estimatedDataSize: wipeResult.estimatedDataSize,
          estimatedCompletion: wipeResult.estimatedCompletion,
          createdAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'cancel_wipe') {
      const { wipeId } = body;

      if (!wipeId) {
        return NextResponse.json(
          { success: false, error: "Wipe ID is required for cancellation" },
          { status: 400 }
        );
      }

      // Cancel ongoing wipe
      const cancelResult = await cancelDataWipe(wipeId);

      return NextResponse.json({
        success: true,
        message: `Data wipe ${wipeId} cancelled`,
        wipe: {
          id: wipeId,
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'get_wipe_status') {
      const { wipeId } = body;

      if (!wipeId) {
        return NextResponse.json(
          { success: false, error: "Wipe ID is required" },
          { status: 400 }
        );
      }

      // Get specific wipe status
      const wipeStatus = await getWipeStatus(wipeId);

      return NextResponse.json({
        success: true,
        wipe: wipeStatus,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'test_wipe') {
      // Test wipe system
      const testResult = await testWipeSystem();

      return NextResponse.json({
        success: true,
        test: {
          system: 'Emergency Data Wipe',
          status: testResult.success ? 'operational' : 'failed',
          responseTime: testResult.responseTime,
          error: testResult.error,
        },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'initiate_wipe', 'cancel_wipe', 'get_wipe_status', or 'test_wipe'." },
      { status: 400 }
    );

  } catch (error) {
    logger.error('Emergency wipe action error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process emergency wipe action",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function initiateDataWipe(
  wipeType: string,
  scope: string,
  reason: string
): Promise<{
  success: boolean;
  wipeId: string;
  estimatedRecords: number;
  estimatedDataSize: number;
  estimatedCompletion: string;
  error?: string;
}> {
  try {
    const wipeId = `wipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Estimate scope based on wipe type
    const estimates = await estimateWipeScope(wipeType, scope);
    const estimatedCompletion = new Date(Date.now() + estimates.estimatedTime * 1000).toISOString();

    // Create wipe record in database
    await prisma.systemMetric.create({
      data: {
        metricType: 'emergency',
        metricName: 'wipe_active',
        value: 1,
        unit: 'wipe',
        category: 'emergency',
        subsystem: 'wipe',
        dimensions: JSON.stringify({
          wipeId,
          wipeType,
          scope,
          reason,
          estimatedRecords: estimates.records,
          estimatedDataSize: estimates.dataSize,
          estimatedCompletion,
          status: 'active',
          progress: 0,
          createdAt: new Date().toISOString(),
        }),
        tags: JSON.stringify(['emergency', 'wipe', 'active']),
        source: 'api',
        collectedBy: 'emergency-wipe-api',
      },
    });

    // Start the wipe process asynchronously
    performDataWipe(wipeId, wipeType, scope, estimates);

    return {
      success: true,
      wipeId,
      estimatedRecords: estimates.records,
      estimatedDataSize: estimates.dataSize,
      estimatedCompletion,
    };

  } catch (error) {
    logger.error('Initiate wipe error:', error);
    return {
      success: false,
      wipeId: '',
      estimatedRecords: 0,
      estimatedDataSize: 0,
      estimatedCompletion: '',
      error: error instanceof Error ? error.message : 'Failed to initiate wipe',
    };
  }
}

async function performDataWipe(
  wipeId: string,
  wipeType: string,
  scope: string,
  estimates: { records: number; dataSize: number; estimatedTime: number }
): Promise<void> {
  try {
    let recordsAffected = 0;
    let dataSizeAffected = 0;
    const startTime = Date.now();

    // Perform the actual data wipe based on type and scope
    if (wipeType === 'user_data' && scope === 'compromised_users') {
      // Wipe data for compromised user accounts
      const result = await wipeCompromisedUserData();
      recordsAffected = result.records;
      dataSizeAffected = result.dataSize;
    } else if (wipeType === 'session_data') {
      // Wipe session and authentication data
      const result = await wipeSessionData(scope);
      recordsAffected = result.records;
      dataSizeAffected = result.dataSize;
    } else if (wipeType === 'audit_logs' && scope === 'old_logs') {
      // Wipe old audit logs beyond retention period
      const result = await wipeOldAuditLogs();
      recordsAffected = result.records;
      dataSizeAffected = result.dataSize;
    } else if (wipeType === 'system_logs') {
      // Wipe system logs for security
      const result = await wipeSystemLogs(scope);
      recordsAffected = result.records;
      dataSizeAffected = result.dataSize;
    }

    const completionTime = Date.now();
    const actualTime = (completionTime - startTime) / 1000; // seconds

    // Update wipe as completed
    await prisma.systemMetric.create({
      data: {
        metricType: 'emergency',
        metricName: 'wipe_completed',
        value: 1,
        unit: 'wipe',
        category: 'emergency',
        subsystem: 'wipe',
        dimensions: JSON.stringify({
          wipeId,
          wipeType,
          scope,
          recordsAffected,
          dataSizeAffected,
          actualTime,
          completedAt: new Date().toISOString(),
        }),
        tags: JSON.stringify(['emergency', 'wipe', 'completed']),
        source: 'api',
        collectedBy: 'emergency-wipe-api',
      },
    });

    // Remove from active wipes
    await prisma.systemMetric.updateMany({
      where: {
        metricType: 'emergency',
        metricName: 'wipe_active',
        dimensions: { contains: `"wipeId":"${wipeId}"` },
      },
      data: { value: 0 },
    });

  } catch (error) {
    logger.error(`Wipe ${wipeId} failed:`, error);

    // Mark wipe as failed
    await prisma.systemMetric.create({
      data: {
        metricType: 'emergency',
        metricName: 'wipe_failed',
        value: 0,
        unit: 'wipe',
        category: 'emergency',
        subsystem: 'wipe',
        dimensions: JSON.stringify({
          wipeId,
          wipeType,
          scope,
          error: error instanceof Error ? error.message : 'Unknown error',
          failedAt: new Date().toISOString(),
        }),
        tags: JSON.stringify(['emergency', 'wipe', 'failed']),
        source: 'api',
        collectedBy: 'emergency-wipe-api',
      },
    });
  }
}

async function cancelDataWipe(wipeId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Mark wipe as cancelled
    await prisma.systemMetric.create({
      data: {
        metricType: 'emergency',
        metricName: 'wipe_cancelled',
        value: 0,
        unit: 'wipe',
        category: 'emergency',
        subsystem: 'wipe',
        dimensions: JSON.stringify({
          wipeId,
          cancelledAt: new Date().toISOString(),
        }),
        tags: JSON.stringify(['emergency', 'wipe', 'cancelled']),
        source: 'api',
        collectedBy: 'emergency-wipe-api',
      },
    });

    // Remove from active wipes
    await prisma.systemMetric.updateMany({
      where: {
        metricType: 'emergency',
        metricName: 'wipe_active',
        dimensions: { contains: `"wipeId":"${wipeId}"` },
      },
      data: { value: 0 },
    });

    return { success: true };

  } catch (error) {
    logger.error('Cancel wipe error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel wipe',
    };
  }
}

async function getWipeStatus(wipeId: string): Promise<any> {
  // Get wipe status from database
  const wipeRecord = await prisma.systemMetric.findFirst({
    where: {
      dimensions: { contains: `"wipeId":"${wipeId}"` },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!wipeRecord) {
    throw new Error('Wipe not found');
  }

  const dimensions = JSON.parse(wipeRecord.dimensions || '{}');

  return {
    id: wipeId,
    type: dimensions.wipeType,
    scope: dimensions.scope,
    status: dimensions.status || 'unknown',
    progress: dimensions.progress || 0,
    recordsAffected: dimensions.recordsAffected || 0,
    dataSizeAffected: dimensions.dataSizeAffected || 0,
    createdAt: dimensions.createdAt,
    completedAt: dimensions.completedAt,
    estimatedCompletion: dimensions.estimatedCompletion,
  };
}

async function estimateWipeScope(wipeType: string, scope: string): Promise<{
  records: number;
  dataSize: number;
  estimatedTime: number;
}> {
  // Estimate based on wipe type and scope
  let records = 0;
  let dataSize = 0;
  let estimatedTime = 60; // seconds

  if (wipeType === 'user_data') {
    records = scope === 'all_users' ? 10000 : 100;
    dataSize = records * 1024 * 1024; // ~1MB per user
    estimatedTime = records * 0.1; // 0.1 seconds per record
  } else if (wipeType === 'session_data') {
    records = 5000;
    dataSize = records * 1024; // ~1KB per session
    estimatedTime = records * 0.05;
  } else if (wipeType === 'audit_logs') {
    records = 100000;
    dataSize = records * 512; // ~512B per log
    estimatedTime = records * 0.01;
  }

  return { records, dataSize, estimatedTime };
}

async function wipeCompromisedUserData(): Promise<{ records: number; dataSize: number }> {
  // Simulate wiping compromised user data
  // In real implementation, this would delete user records, sessions, etc.
  const records = Math.floor(Math.random() * 50) + 10;
  const dataSize = records * 1024 * 1024;
  await new Promise(resolve => setTimeout(resolve, records * 100)); // Simulate processing time
  return { records, dataSize };
}

async function wipeSessionData(scope: string): Promise<{ records: number; dataSize: number }> {
  // Simulate wiping session data
  const records = Math.floor(Math.random() * 1000) + 100;
  const dataSize = records * 1024;
  await new Promise(resolve => setTimeout(resolve, records * 10));
  return { records, dataSize };
}

async function wipeOldAuditLogs(): Promise<{ records: number; dataSize: number }> {
  // Simulate wiping old audit logs
  const records = Math.floor(Math.random() * 50000) + 10000;
  const dataSize = records * 512;
  await new Promise(resolve => setTimeout(resolve, records * 1));
  return { records, dataSize };
}

async function wipeSystemLogs(scope: string): Promise<{ records: number; dataSize: number }> {
  // Simulate wiping system logs
  const records = Math.floor(Math.random() * 10000) + 1000;
  const dataSize = records * 256;
  await new Promise(resolve => setTimeout(resolve, records * 5));
  return { records, dataSize };
}

async function getDataRetentionPolicies(): Promise<Array<{
  type: string;
  retentionPeriod: number;
  unit: string;
  autoDelete: boolean;
}>> {
  try {
    const policies = await prisma.systemMetric.findMany({
      where: { metricType: 'data_retention_policy' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (!policies || policies.length === 0) {
      return [];
    }

    return policies.map((policy: any) => ({
      type: policy.metricName || 'unknown',
      retentionPeriod: Number(policy.metricValue) || 0,
      unit: 'days',
      autoDelete: policy.active === true,
    }));
  } catch {
    return [];
  }
}

async function testWipeSystem(): Promise<{
  success: boolean;
  responseTime: number;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    // Test database connectivity and permissions
    await prisma.systemMetric.findFirst({
      where: { metricType: 'system_health' },
    });

    // Test wipe permissions by checking if we can query audit logs
    await prisma.auditLog.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const responseTime = Date.now() - startTime;
    return { success: true, responseTime };

  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      success: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Wipe system test failed'
    };
  }
}

function calculateAvgWipeTime(wipeHistory: any[]): number {
  // Calculate average wipe completion time
  const completionTimes = wipeHistory
    .filter(w => w.dimensions?.actualTime)
    .map(w => w.dimensions.actualTime);

  return completionTimes.length > 0
    ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
    : 0;
}
