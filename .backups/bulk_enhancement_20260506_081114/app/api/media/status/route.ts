import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { authService } from "../../../../lib/auth/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Get user from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const taskId = url.searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "taskId parameter is required" },
        { status: 400 }
      );
    }

    // Get media task
    const mediaTask = await prisma.mediaTask.findFirst({
      where: {
        id: taskId,
        userId: decoded.userId, // Ensure user owns the task
      },
      select: {
        id: true,
        type: true,
        prompt: true,
        status: true,
        resultUrl: true,
        resultData: true,
        errorMessage: true,
        createdAt: true,
        completedAt: true,
        model: true,
        parameters: true,
      },
    });

    if (!mediaTask) {
      return NextResponse.json(
        { success: false, error: "Media task not found" },
        { status: 404 }
      );
    }

    // Calculate progress and estimated time remaining
    let progress = 0;
    let estimatedTimeRemaining = null;

    if (mediaTask.status === 'processing') {
      const elapsed = Date.now() - mediaTask.createdAt.getTime();
      const totalTime = mediaTask.type === 'image' ? 30000 : mediaTask.type === 'video' ? 300000 : 120000;
      progress = Math.min(Math.round((elapsed / totalTime) * 100), 95);
      estimatedTimeRemaining = Math.max(totalTime - elapsed, 0);
    } else if (mediaTask.status === 'completed') {
      progress = 100;
    }

    return NextResponse.json({
      success: true,
      message: "Media task status retrieved",
      task: {
        id: mediaTask.id,
        type: mediaTask.type,
        prompt: mediaTask.prompt,
        status: mediaTask.status,
        progress,
        estimatedTimeRemaining,
        resultUrl: mediaTask.resultUrl,
        resultData: mediaTask.resultData ? JSON.parse(mediaTask.resultData) : null,
        errorMessage: mediaTask.errorMessage,
        createdAt: mediaTask.createdAt,
        completedAt: mediaTask.completedAt,
        model: mediaTask.model,
        parameters: mediaTask.parameters ? JSON.parse(mediaTask.parameters) : null,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Media status GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch media task status",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get user from auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = authService.decodeToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { taskIds } = body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "taskIds array is required" },
        { status: 400 }
      );
    }

    // Get multiple media tasks
    const mediaTasks = await prisma.mediaTask.findMany({
      where: {
        id: { in: taskIds },
        userId: decoded.userId, // Ensure user owns the tasks
      },
      select: {
        id: true,
        type: true,
        prompt: true,
        status: true,
        resultUrl: true,
        resultData: true,
        errorMessage: true,
        createdAt: true,
        completedAt: true,
        model: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate progress for each task
    const tasksWithProgress = mediaTasks.map(task => {
      let progress = 0;
      let estimatedTimeRemaining = null;

      if (task.status === 'processing') {
        const elapsed = Date.now() - task.createdAt.getTime();
        const totalTime = task.type === 'image' ? 30000 : task.type === 'video' ? 300000 : 120000;
        progress = Math.min(Math.round((elapsed / totalTime) * 100), 95);
        estimatedTimeRemaining = Math.max(totalTime - elapsed, 0);
      } else if (task.status === 'completed') {
        progress = 100;
      }

      return {
        id: task.id,
        type: task.type,
        prompt: task.prompt,
        status: task.status,
        progress,
        estimatedTimeRemaining,
        resultUrl: task.resultUrl,
        resultData: task.resultData ? JSON.parse(task.resultData) : null,
        errorMessage: task.errorMessage,
        createdAt: task.createdAt,
        completedAt: task.completedAt,
        model: task.model,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Media tasks status retrieved",
      tasks: tasksWithProgress,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Media status POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch media tasks status",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
