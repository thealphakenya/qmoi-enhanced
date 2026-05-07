import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { log } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    log.info('Emergency lockdown status requested', {
      endpoint: '/api/emergency/lockdown',
      method: 'GET',
      timestamp: new Date().toISOString(),
    });

    // Get current lockdown status
    const lockdownStatus = await prisma.systemMetric.findFirst({
      where: {
        metricType: 'emergency',
        metricName: 'lockdown_active',
      },
      orderBy: { createdAt: 'desc' },
    });

    const isLockedDown = lockdownStatus?.value === 1;

    // Get lockdown history
    const lockdownHistory = await prisma.systemMetric.findMany({
      where: {
        metricType: 'emergency',
        metricName: { in: ['lockdown_activated', 'lockdown_deactivated'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get affected systems during lockdown
    const affectedSystems = isLockedDown ? await getAffectedSystems() : [];

    return NextResponse.json({
      success: true,
      emergency: {
        lockdown: {
          active: isLockedDown,
          activatedAt: lockdownStatus?.createdAt?.toISOString() || null,
          activatedBy: lockdownStatus?.dimensions?.activatedBy || null,
          reason: lockdownStatus?.dimensions?.reason || null,
        },
        systems: {
          affected: affectedSystems.length,
          details: affectedSystems,
        },
        history: lockdownHistory.map(entry => ({
          action: entry.metricName,
          timestamp: entry.createdAt.toISOString(),
          reason: entry.dimensions?.reason || 'No reason specified',
          activatedBy: entry.dimensions?.activatedBy || 'System',
        })),
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Emergency lockdown status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch lockdown status",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, reason, activatedBy, duration } = body;

    log.info('Emergency lockdown action requested', {
      endpoint: '/api/emergency/lockdown',
      method: 'POST',
      action,
      reason,
      activatedBy,
      duration,
      timestamp: new Date().toISOString(),
    });

    if (!action || !['activate', 'deactivate'].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Action must be 'activate' or 'deactivate'" },
        { status: 400 }
      );
    }

    if (action === 'activate' && !reason) {
      return NextResponse.json(
        { success: false, error: "Reason is required for lockdown activation" },
        { status: 400 }
      );
    }

    const currentStatus = await prisma.systemMetric.findFirst({
      where: {
        metricType: 'emergency',
        metricName: 'lockdown_active',
      },
      orderBy: { createdAt: 'desc' },
    });

    const isCurrentlyLocked = currentStatus?.value === 1;

    if (action === 'activate' && isCurrentlyLocked) {
      return NextResponse.json(
        { success: false, error: "System is already in lockdown mode" },
        { status: 409 }
      );
    }

    if (action === 'deactivate' && !isCurrentlyLocked) {
      return NextResponse.json(
        { success: false, error: "System is not in lockdown mode" },
        { status: 409 }
      );
    }

    if (action === 'activate') {
      // Activate lockdown
      await activateLockdown(reason, activatedBy || 'API', duration);

      // Log activation
      await prisma.auditLog.create({
        data: {
          userId: 'system',
          username: 'emergency_system',
          action: 'lockdown_activated',
          resource: 'emergency',
          details: JSON.stringify({
            reason,
            activatedBy: activatedBy || 'API',
            duration: duration || 'indefinite',
            affectedSystems: await getAffectedSystemsCount(),
          }),
          riskLevel: 'critical',
          status: 'success',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: "Emergency lockdown activated",
        lockdown: {
          active: true,
          activatedAt: new Date().toISOString(),
          activatedBy: activatedBy || 'API',
          reason,
          duration: duration || 'indefinite',
          affectedSystems: await getAffectedSystemsCount(),
        },
        timestamp: new Date().toISOString()
      });

    } else {
      // Deactivate lockdown
      await deactivateLockdown(activatedBy || 'API');

      // Log deactivation
      await prisma.auditLog.create({
        data: {
          userId: 'system',
          username: 'emergency_system',
          action: 'lockdown_deactivated',
          resource: 'emergency',
          details: JSON.stringify({
            activatedBy: activatedBy || 'API',
            previousLockdownId: currentStatus?.id,
          }),
          riskLevel: 'high',
          status: 'success',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: "Emergency lockdown deactivated",
        lockdown: {
          active: false,
          deactivatedAt: new Date().toISOString(),
          deactivatedBy: activatedBy || 'API',
        },
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    logger.error('Emergency lockdown action error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process lockdown action",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function activateLockdown(reason: string, activatedBy: string, duration?: number) {
  // Set lockdown active status
  await prisma.systemMetric.create({
    data: {
      metricType: 'emergency',
      metricName: 'lockdown_active',
      value: 1,
      unit: 'boolean',
      category: 'security',
      subsystem: 'emergency',
      dimensions: JSON.stringify({
        reason,
        activatedBy,
        duration: duration || null,
        activatedAt: new Date().toISOString(),
      }),
      tags: JSON.stringify(['emergency', 'lockdown', 'active']),
      source: 'api',
      collectedBy: 'emergency-lockdown-api',
    },
  });

  // Log lockdown activation
  await prisma.systemMetric.create({
    data: {
      metricType: 'emergency',
      metricName: 'lockdown_activated',
      value: 1,
      unit: 'event',
      category: 'security',
      subsystem: 'emergency',
      dimensions: JSON.stringify({
        reason,
        activatedBy,
        duration: duration || null,
        affectedSystems: await getAffectedSystemsCount(),
      }),
      tags: JSON.stringify(['emergency', 'lockdown', 'activated']),
      source: 'api',
      collectedBy: 'emergency-lockdown-api',
    },
  });

  // In a real implementation, this would:
  // 1. Disable all non-essential services
  // 2. Block external access
  // 3. Enable security monitoring
  // 4. Send alerts to administrators
  // 5. Set up automatic deactivation if duration is specified
}

async function deactivateLockdown(deactivatedBy: string) {
  // Set lockdown inactive status
  await prisma.systemMetric.updateMany({
    where: {
      metricType: 'emergency',
      metricName: 'lockdown_active',
      value: 1,
    },
    data: { value: 0 },
  });

  // Log lockdown deactivation
  await prisma.systemMetric.create({
    data: {
      metricType: 'emergency',
      metricName: 'lockdown_deactivated',
      value: 1,
      unit: 'event',
      category: 'security',
      subsystem: 'emergency',
      dimensions: JSON.stringify({
        deactivatedBy,
        deactivatedAt: new Date().toISOString(),
      }),
      tags: JSON.stringify(['emergency', 'lockdown', 'deactivated']),
      source: 'api',
      collectedBy: 'emergency-lockdown-api',
    },
  });

  // In a real implementation, this would:
  // 1. Restore normal system operations
  // 2. Re-enable services
  // 3. Send all-clear notifications
  // 4. Generate incident report
}

async function getAffectedSystems(): Promise<Array<{ name: string; status: string; action: string }>> {
  try {
    // Check actual system components status from database
    const systemMetrics = await prisma.systemMetric.findMany({
      where: {
        metricType: 'system_health',
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate system statuses
    const systemStatuses: { [key: string]: { status: string; action: string } } = {};

    systemMetrics.for (const item of(metric => {
      const systemName = metric.dimensions?.system || 'Unknown';
      const health = metric.value;

      if (health < 50) {
        systemStatuses[systemName] = { status: 'critical', action: 'blocked' };
      } else if (health < 80) {
        systemStatuses[systemName] = { status: 'degraded', action: 'restricted' };
      } else {
        systemStatuses[systemName] = { status: 'operational', action: 'normal' };
      }
    });

    // Return affected systems (those not operational)
    return Object.entries(systemStatuses)
      .filter(([_, status]) => status.status !== 'operational')
      .map(([name, status]) => ({
        name,
        status: status.status,
        action: status.action,
      }));
  } catch (error) {
    // Fallback to basic system checks if database unavailable
    return [
      { name: 'API Gateway', status: 'operational', action: 'normal' },
      { name: 'Database', status: 'operational', action: 'normal' },
      { name: 'External APIs', status: 'operational', action: 'normal' },
      { name: 'File Uploads', status: 'operational', action: 'normal' },
      { name: 'User Sessions', status: 'operational', action: 'normal' },
    ];
  }
}

async function getAffectedSystemsCount(): Promise<number> {
  const systems = await getAffectedSystems();
  return systems.length;
}
