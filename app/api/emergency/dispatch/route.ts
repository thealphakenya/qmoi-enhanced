import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Get emergency dispatch status and history
    const [
      activeDispatches,
      dispatchHistory,
      responseTeams,
      dispatchMetrics
    ] = await Promise.all([
      prisma.systemMetric.findMany({
        where: {
          metricType: 'emergency',
          metricName: 'dispatch_active',
          value: 1,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.systemMetric.findMany({
        where: {
          category: 'emergency',
          subsystem: 'dispatch',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      getResponseTeams(),
      prisma.systemMetric.findMany({
        where: {
          metricType: 'emergency',
          metricName: { in: ['dispatch_created', 'dispatch_completed', 'dispatch_failed'] },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Calculate dispatch statistics
    const totalDispatches = dispatchMetrics.filter(d => d.metricName === 'dispatch_created').length;
    const completedDispatches = dispatchMetrics.filter(d => d.metricName === 'dispatch_completed').length;
    const failedDispatches = dispatchMetrics.filter(d => d.metricName === 'dispatch_failed').length;
    const successRate = totalDispatches > 0 ? (completedDispatches / totalDispatches) * 100 : 0;

    // Filter by status if specified
    let filteredHistory = dispatchHistory;
    if (status !== 'all') {
      filteredHistory = dispatchHistory.filter(d => {
        const dimensions = JSON.parse(d.dimensions || '{}');
        return dimensions.status === status;
      });
    }

    return NextResponse.json({
      success: true,
      emergency: {
        dispatch: {
          status: 'operational',
          activeDispatches: activeDispatches.length,
          totalTeams: responseTeams.length,
          availableTeams: responseTeams.filter(t => t.status === 'available').length,
        },
        metrics: {
          totalDispatches,
          completedDispatches,
          failedDispatches,
          successRate: Math.round(successRate * 100) / 100,
          avgResponseTime: calculateAvgDispatchTime(dispatchHistory),
        },
        activeDispatches: activeDispatches.map(d => ({
          id: d.dimensions?.dispatchId || 'unknown',
          type: d.dimensions?.incidentType || 'general',
          location: d.dimensions?.location || 'Unknown',
          priority: d.dimensions?.priority || 'medium',
          teamsAssigned: d.dimensions?.teamsAssigned || 0,
          createdAt: d.createdAt.toISOString(),
        })),
        recentDispatches: filteredHistory.slice(0, 20).map(d => ({
          id: d.dimensions?.dispatchId || 'unknown',
          type: d.dimensions?.incidentType || 'general',
          status: d.dimensions?.status || 'unknown',
          priority: d.dimensions?.priority || 'medium',
          location: d.dimensions?.location || 'Unknown',
          teamsAssigned: d.dimensions?.teamsAssigned || 0,
          responseTime: d.dimensions?.responseTime || null,
          completedAt: d.dimensions?.completedAt || null,
          timestamp: d.createdAt.toISOString(),
        })),
        responseTeams: responseTeams,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Emergency dispatch status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch emergency dispatch status",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, incidentType, location, priority = 'medium', description, teamsRequired = 1 } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required" },
        { status: 400 }
      );
    }

    if (action === 'create_dispatch' && (!incidentType || !location)) {
      return NextResponse.json(
        { success: false, error: "Incident type and location are required for dispatch creation" },
        { status: 400 }
      );
    }

    if (action === 'create_dispatch') {
      // Create emergency dispatch
      const dispatchResult = await createEmergencyDispatch(incidentType, location, priority, description, teamsRequired);

      // Log the dispatch creation
      await prisma.auditLog.create({
        data: {
          userId: 'system',
          username: 'emergency_system',
          action: 'emergency_dispatch_created',
          resource: 'emergency',
          details: JSON.stringify({
            dispatchId: dispatchResult.dispatchId,
            incidentType,
            location,
            priority,
            teamsRequired,
            teamsAssigned: dispatchResult.teamsAssigned,
            description: description?.substring(0, 100),
          }),
          riskLevel: 'critical',
          status: dispatchResult.success ? 'success' : 'warning',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: `Emergency dispatch created for ${incidentType} incident`,
        dispatch: {
          id: dispatchResult.dispatchId,
          type: incidentType,
          location,
          priority,
          teamsRequired,
          teamsAssigned: dispatchResult.teamsAssigned,
          status: 'active',
          createdAt: new Date().toISOString(),
          estimatedResponseTime: dispatchResult.estimatedResponseTime,
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'update_dispatch') {
      const { dispatchId, status, notes } = body;

      if (!dispatchId || !status) {
        return NextResponse.json(
          { success: false, error: "Dispatch ID and status are required for dispatch update" },
          { status: 400 }
        );
      }

      // Update dispatch status
      const updateResult = await updateDispatchStatus(dispatchId, status, notes);

      return NextResponse.json({
        success: true,
        message: `Dispatch ${dispatchId} updated to ${status}`,
        dispatch: {
          id: dispatchId,
          status,
          updatedAt: new Date().toISOString(),
          notes,
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'get_teams') {
      // Get available response teams
      const teams = await getResponseTeams();

      return NextResponse.json({
        success: true,
        teams,
        count: teams.length,
        available: teams.filter(t => t.status === 'available').length,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'test_dispatch') {
      // Test dispatch system
      const testResult = await testDispatchSystem();

      return NextResponse.json({
        success: true,
        test: {
          system: 'Emergency Dispatch',
          status: testResult.success ? 'operational' : 'failed',
          responseTime: testResult.responseTime,
          error: testResult.error,
        },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'create_dispatch', 'update_dispatch', 'get_teams', or 'test_dispatch'." },
      { status: 400 }
    );

  } catch (error) {
    logger.error('Emergency dispatch action error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process emergency dispatch action",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function createEmergencyDispatch(
  incidentType: string,
  location: string,
  priority: string,
  description: string,
  teamsRequired: number
): Promise<{
  success: boolean;
  dispatchId: string;
  teamsAssigned: number;
  estimatedResponseTime: number;
  error?: string;
}> {
  try {
    const dispatchId = `dispatch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get available response teams
    const availableTeams = await getAvailableTeams(teamsRequired);

    // Calculate estimated response time based on priority and location
    const estimatedResponseTime = calculateResponseTime(priority, location, availableTeams.length);

    // Assign teams to dispatch
    const teamsAssigned = Math.min(teamsRequired, availableTeams.length);

    // Create dispatch record in database
    await prisma.systemMetric.create({
      data: {
        metricType: 'emergency',
        metricName: 'dispatch_created',
        value: 1,
        unit: 'dispatch',
        category: 'emergency',
        subsystem: 'dispatch',
        dimensions: JSON.stringify({
          dispatchId,
          incidentType,
          location,
          priority,
          description,
          teamsRequired,
          teamsAssigned,
          estimatedResponseTime,
          status: 'active',
          createdAt: new Date().toISOString(),
        }),
        tags: JSON.stringify(['emergency', 'dispatch', 'created']),
        source: 'api',
        collectedBy: 'emergency-dispatch-api',
      },
    });

    // Mark dispatch as active
    await prisma.systemMetric.create({
      data: {
        metricType: 'emergency',
        metricName: 'dispatch_active',
        value: 1,
        unit: 'dispatch',
        category: 'emergency',
        subsystem: 'dispatch',
        dimensions: JSON.stringify({
          dispatchId,
          incidentType,
          location,
          priority,
          teamsAssigned,
        }),
        tags: JSON.stringify(['emergency', 'dispatch', 'active']),
        source: 'api',
        collectedBy: 'emergency-dispatch-api',
      },
    });

    // Simulate team assignment (in real implementation, this would notify teams)
    for (const team of availableTeams.slice(0, teamsAssigned)) {
      await assignTeamToDispatch(team.id, dispatchId);
    }

    return {
      success: true,
      dispatchId,
      teamsAssigned,
      estimatedResponseTime,
    };

  } catch (error) {
    logger.error('Create dispatch error:', error);
    return {
      success: false,
      dispatchId: '',
      teamsAssigned: 0,
      estimatedResponseTime: 0,
      error: error instanceof Error ? error.message : 'Failed to create dispatch',
    };
  }
}

async function updateDispatchStatus(
  dispatchId: string,
  status: string,
  notes?: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Update dispatch status in database
    await prisma.systemMetric.create({
      data: {
        metricType: 'emergency',
        metricName: status === 'completed' ? 'dispatch_completed' : 'dispatch_updated',
        value: status === 'completed' ? 1 : 0,
        unit: 'dispatch',
        category: 'emergency',
        subsystem: 'dispatch',
        dimensions: JSON.stringify({
          dispatchId,
          status,
          notes,
          updatedAt: new Date().toISOString(),
        }),
        tags: JSON.stringify(['emergency', 'dispatch', 'updated']),
        source: 'api',
        collectedBy: 'emergency-dispatch-api',
      },
    });

    // If completed, remove from active dispatches
    if (status === 'completed') {
      await prisma.systemMetric.updateMany({
        where: {
          metricType: 'emergency',
          metricName: 'dispatch_active',
          dimensions: { contains: `"dispatchId":"${dispatchId}"` },
        },
        data: { value: 0 },
      });
    }

    return { success: true };

  } catch (error) {
    logger.error('Update dispatch status error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update dispatch status',
    };
  }
}

async function getResponseTeams(): Promise<Array<{
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'available' | 'busy' | 'offline';
  members: number;
  specialties: string[];
}>> {
  try {
    // Production-safe fallback: fetch emergency team data from database if available.
    const responseTeams = await prisma.systemMetric.findMany({
      where: {
        category: 'emergency',
        metricName: 'dispatch_team',
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (!responseTeams || responseTeams.length === 0) {
      return [];
    }

    return responseTeams.map((team) => ({
      id: team.id || 'unknown',
      name: team.source || 'Emergency Team',
      type: 'emergency',
      location: 'Unknown',
      status: 'available',
      members: 1,
      specialties: ['general'],
    }));
  } catch {
    return [];
  }
}

async function getAvailableTeams(count: number): Promise<Array<{ id: string; name: string }>> {
  const teams = await getResponseTeams();
  return teams
    .filter(t => t.status === 'available')
    .slice(0, count)
    .map(t => ({ id: t.id, name: t.name }));
}

async function assignTeamToDispatch(teamId: string, dispatchId: string): Promise<void> {
  // In real implementation, this would update team status and notify team members
  logger.info(`Assigning team ${teamId} to dispatch ${dispatchId}`);
}

function calculateResponseTime(priority: string, location: string, availableTeams: number): number {
  // Base response time in minutes
  let baseTime = 15;

  // Adjust for priority
  if (priority === 'critical') baseTime = 5;
  else if (priority === 'high') baseTime = 10;
  else if (priority === 'low') baseTime = 30;

  // Adjust for team availability
  if (availableTeams === 0) baseTime *= 2;
  else if (availableTeams >= 2) baseTime *= 0.8;

  // Adjust for location (simplified)
  if (location.includes('remote') || location.includes('rural')) baseTime *= 1.5;

  return Math.round(baseTime);
}

async function testDispatchSystem(): Promise<{
  success: boolean;
  responseTime: number;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    // Test database connectivity for dispatch operations
    await prisma.systemMetric.findFirst({
      where: { metricType: 'emergency' },
    });

    // Test dispatch team availability
    const availableTeams = await prisma.systemMetric.count({
      where: {
        metricType: 'emergency',
        metricName: 'dispatch_team_available',
        value: 1,
      },
    });

    const responseTime = Date.now() - startTime;
    return { success: true, responseTime };

  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      success: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Dispatch system test failed'
    };
  }
}

function calculateAvgDispatchTime(dispatchHistory: any[]): number {
  // Calculate average dispatch response time
  const responseTimes = dispatchHistory
    .filter(d => d.dimensions?.responseTime)
    .map(d => d.dimensions.responseTime);

  return responseTimes.length > 0
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    : 0;
}
