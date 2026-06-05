import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { authService } from "../../../../lib/auth/service";
import { aiService } from "../../../../lib/ai-service";
import { log as logger } from "@/lib/logger";

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

    // Get user's media generation history
    const mediaTasks = await prisma.mediaTask.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        type: true,
        prompt: true,
        status: true,
        resultUrl: true,
        createdAt: true,
        completedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Media generation history retrieved",
      history: mediaTasks,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Media generate GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch media generation history",
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
    const {
      type,
      prompt,
      style,
      size = '512x512',
      count = 1,
      model = 'dall-e-3'
    } = body;

    // Validation
    if (!type || !prompt) {
      return NextResponse.json(
        { success: false, error: "Type and prompt are required" },
        { status: 400 }
      );
    }

    if (!['image', 'video', 'audio'].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid media type. Supported: image, video, audio" },
        { status: 400 }
      );
    }

    // Create media generation task
    const mediaTask = await prisma.mediaTask.create({
      data: {
        userId: decoded.userId,
        type,
        prompt,
        status: 'processing',
        model,
        parameters: JSON.stringify({
          style,
          size,
          count,
        }),
      },
    });

    // Start async media generation
    generateMedia(mediaTask.id, {
      type,
      prompt,
      style,
      size,
      count,
      model,
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: decoded.userId,
        username: decoded.email || 'unknown',
        action: 'media_generate',
        resource: 'media',
        details: JSON.stringify({
          mediaTaskId: mediaTask.id,
          type,
          prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
          model,
          userAgent: req.headers.get('user-agent'),
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        riskLevel: 'low',
        status: 'success',
      } as any,
    });

    return NextResponse.json({
      success: true,
      message: "Media generation started",
      task: {
        id: mediaTask.id,
        type: mediaTask.type,
        prompt: mediaTask.prompt,
        status: mediaTask.status,
        model: mediaTask.model,
        createdAt: mediaTask.createdAt,
      },
      estimatedTime: type === 'image' ? '30 seconds' : type === 'video' ? '5 minutes' : '2 minutes',
      timestamp: new Date().toISOString()
    }, { status: 202 });

  } catch (error) {
    logger.error('Media generate POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to start media generation",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function generateMedia(taskId: string, params: {
  type: string;
  prompt: string;
  style?: string;
  size: string;
  count: number;
  model: string;
}) {
  try {
    let resultUrl = null;
    let resultData = null;

    if (params.type === 'image') {
      // Simulate DALL-E or similar image generation
      resultUrl = `/generated/image_${taskId}.png`;
      resultData = {
        width: 512,
        height: 512,
        format: 'png',
        style: params.style || 'natural',
      };
    } else if (params.type === 'video') {
      // Simulate video generation
      resultUrl = `/generated/video_${taskId}.mp4`;
      resultData = {
        duration: 10,
        resolution: '1080p',
        format: 'mp4',
      };
    } else if (params.type === 'audio') {
      // Simulate audio generation
      resultUrl = `/generated/audio_${taskId}.mp3`;
      resultData = {
        duration: 30,
        format: 'mp3',
        voice: 'natural',
      };
    }

    // Simulate processing time
    const processingTime = params.type === 'image' ? 5000 : params.type === 'video' ? 30000 : 10000;
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Update task with results
    await prisma.mediaTask.update({
      where: { id: taskId },
      data: {
        status: 'completed',
        resultUrl,
        resultData: JSON.stringify(resultData),
        completedAt: new Date(),
      },
    });

  } catch (error) {
    logger.error('Media generation failed:', error);

    // Update task with failure
    await prisma.mediaTask.update({
      where: { id: taskId },
      data: {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Generation failed',
        completedAt: new Date(),
      },
    });
  }
}
