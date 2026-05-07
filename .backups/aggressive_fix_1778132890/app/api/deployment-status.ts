import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Get deployment status from database or external services
    const deployments = await prisma.systemHealth.findMany({
      where: {
        category: 'deployment',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get current system health
    const systemHealth = await prisma.systemHealth.findFirst({
      where: { name: 'overall_system' },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate deployment metrics
    const totalDeployments = deployments.length;
    const successfulDeployments = deployments.filter(d => d.status === 'healthy').length;
    const failedDeployments = deployments.filter(d => d.status === 'critical').length;
    const successRate = totalDeployments > 0 ? (successfulDeployments / totalDeployments) * 100 : 0;

    // Get recent deployments
    const recentDeployments = deployments.slice(0, 5).map(deployment => ({
      id: deployment.id,
      name: deployment.name,
      status: deployment.status,
      version: deployment.version,
      deployedAt: deployment.createdAt.toISOString(),
      environment: deployment.environment || 'production',
      duration: deployment.checkInterval || 0,
    }));

    return NextResponse.json({
      success: true,
      deployment: {
        status: systemHealth?.status || 'unknown',
        version: systemHealth?.version || '1.0.0',
        environment: systemHealth?.environment || 'production',
        lastDeployment: recentDeployments[0]?.deployedAt || null,
        uptime: systemHealth ? Date.now() - systemHealth.createdAt.getTime() : 0,
      },
      metrics: {
        totalDeployments,
        successfulDeployments,
        failedDeployments,
        successRate: Math.round(successRate * 100) / 100,
        averageDeploymentTime: deployments.reduce((acc, d) => acc + (d.checkInterval || 0), 0) / Math.max(deployments.length, 1),
      },
      recentDeployments,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Deployment status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch deployment status",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, environment = 'production', version, metadata = {} } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'start':
        // Log deployment start
        result = await prisma.systemHealth.create({
          data: {
            name: `deployment_${Date.now()}`,
            category: 'deployment',
            status: 'warning', // COMPLETE
            environment,
            version: version || 'unknown',
            metadata: JSON.stringify({
              ...metadata,
              action: 'start',
              startTime: new Date().toISOString(),
            }),
          },
        });
        break;

      case 'complete':
        // Update deployment status to healthy
        const deploymentId = metadata.deploymentId;
        if (deploymentId) {
          result = await prisma.systemHealth.update({
            where: { id: deploymentId },
            data: {
              status: 'healthy',
              metadata: JSON.stringify({
                ...metadata,
                action: 'complete',
                endTime: new Date().toISOString(),
              }),
            },
          });
        } else {
          result = await prisma.systemHealth.create({
            data: {
              name: `deployment_complete_${Date.now()}`,
              category: 'deployment',
              status: 'healthy',
              environment,
              version: version || 'unknown',
              metadata: JSON.stringify({
                ...metadata,
                action: 'complete',
                endTime: new Date().toISOString(),
              }),
            },
          });
        }
        break;

      case 'fail':
        // Log deployment failure
        result = await prisma.systemHealth.create({
          data: {
            name: `deployment_failed_${Date.now()}`,
            category: 'deployment',
            status: 'critical',
            environment,
            version: version || 'unknown',
            metadata: JSON.stringify({
              ...metadata,
              action: 'fail',
              failureTime: new Date().toISOString(),
              error: metadata.error || 'Unknown deployment error',
            }),
          },
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Deployment ${action} logged successfully`,
      deploymentId: result.id,
      action,
      environment,
      version,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Deployment status POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process deployment action",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
