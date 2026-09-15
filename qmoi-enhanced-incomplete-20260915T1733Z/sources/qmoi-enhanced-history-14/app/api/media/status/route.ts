/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextResponse } from "next/server";

// Conditionally import Prisma
let prisma: unknown = null;
let prismaInitialized = false;

async function getPrismaClient() {
  // Return a mock Prisma client for build compatibility
  // Production: Import real Prisma client: import { prisma } from '@/lib/prisma'
  return {
    mediaTask: {
      findMany: async () => [],
    },
  };
}

export async function GET() {
  try {
    const prisma = await getPrismaClient();
    // Check if Prisma is available and database is configured
    const isPrismaAvailable =
      prisma &&
      process.env.DATABASE_URL &&
      !process.env.DATABASE_URL.includes("your_database_url_here");

    if (!isPrismaAvailable) {
      return NextResponse.json({
        tasks: [
          {
            id: "mock-task-1",
            type: "image_processing",
            status: "completed",
            progress: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: { format: "jpg", size: 2048 },
          },
        ],
        stats: {
          totalTasks: 1,
          completedTasks: 1,
          failedTasks: 0,
          processingTasks: 0,
          averageProcessingTime: 150,
        },
        message: "Using mock data - database not configured",
      });
    } else {
      // Database code temporarily disabled
      // Production: Query real Prisma DB for media metadata
      // await prisma.media.findMany()
      return NextResponse.json({
        tasks: [],
        stats: {
          totalTasks: 0,
          completedTasks: 0,
          failedTasks: 0,
          processingTasks: 0,
          averageProcessingTime: 0,
        },
        message: "Database temporarily disabled for build compatibility",
      });
    }
  } catch (error) {
    (console as any).error("Error fetching media status:", error);
    return NextResponse.json(
      { error: "Failed to fetch media status" },
      { status: 500 },
    );
  }
}
