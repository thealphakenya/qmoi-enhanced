import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";
import { authService } from "@/lib/auth/service";
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

    const url = new URL(req.url);
    const query = url.searchParams.get('q') || '';
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const model = url.searchParams.get('model');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    // Build search filters
    const where: any = {
      userId: decoded.userId,
    };

    if (query) {
      where.prompt = {
        contains: query,
        mode: 'insensitive',
      };
    }

    if (type && ['image', 'video', 'audio'].includes(type)) {
      where.type = type;
    }

    if (status && ['processing', 'completed', 'failed'].includes(status)) {
      where.status = status;
    }

    if (model) {
      where.model = model;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.mediaTask.count({ where });

    // Get media tasks with search and pagination
    const mediaTasks = await prisma.mediaTask.findMany({
      where,
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
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    // Parse result data for each task
    const tasksWithParsedData = mediaTasks.map((task: any) => ({
      id: task.id,
      type: task.type,
      prompt: task.prompt,
      status: task.status,
      resultUrl: task.resultUrl,
      resultData: task.resultData ? JSON.parse(task.resultData) : null,
      errorMessage: task.errorMessage,
      createdAt: task.createdAt,
      completedAt: task.completedAt,
      model: task.model,
      parameters: task.parameters ? JSON.parse(task.parameters) : null,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      message: "Media search completed",
      search: {
        query,
        filters: {
          type,
          status,
          model,
        },
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        sort: {
          by: sortBy,
          order: sortOrder,
        },
      },
      results: tasksWithParsedData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Media search GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search media",
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
      query = '',
      type,
      status,
      model,
      dateFrom,
      dateTo,
      tags,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = body;

    // Build advanced search filters
    const where: any = {
      userId: decoded.userId,
    };

    if (query) {
      where.OR = [
        { prompt: { contains: query, mode: 'insensitive' } },
        { resultData: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (type && ['image', 'video', 'audio'].includes(type)) {
      where.type = type;
    }

    if (status && ['processing', 'completed', 'failed'].includes(status)) {
      where.status = status;
    }

    if (model) {
      where.model = model;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.mediaTask.count({ where });

    // Get media tasks with advanced search and pagination
    const mediaTasks = await prisma.mediaTask.findMany({
      where,
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
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    // Parse result data and add metadata
    const tasksWithMetadata = mediaTasks.map((task: any) => {
      const resultData = task.resultData ? JSON.parse(task.resultData) : null;
      const parameters = task.parameters ? JSON.parse(task.parameters) : null;

      return {
        id: task.id,
        type: task.type,
        prompt: task.prompt,
        status: task.status,
        resultUrl: task.resultUrl,
        resultData,
        errorMessage: task.errorMessage,
        createdAt: task.createdAt,
        completedAt: task.completedAt,
        model: task.model,
        parameters,
        metadata: {
          fileSize: resultData?.fileSize || null,
          dimensions: resultData?.width && resultData?.height ? `${resultData.width}x${resultData.height}` : null,
          duration: resultData?.duration || null,
          format: resultData?.format || null,
        },
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    // Create audit log for search
    await prisma.auditLog.create({
      data: {
        userId: decoded.userId,
        username: decoded.email || 'unknown',
        action: 'media_search',
        resource: 'media',
        details: JSON.stringify({
          query,
          filters: { type, status, model, dateFrom, dateTo },
          resultCount: tasksWithMetadata.length,
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
      message: "Advanced media search completed",
      search: {
        query,
        filters: {
          type,
          status,
          model,
          dateFrom,
          dateTo,
          tags,
        },
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        sort: {
          by: sortBy,
          order: sortOrder,
        },
      },
      results: tasksWithMetadata,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Media search POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform advanced media search",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
