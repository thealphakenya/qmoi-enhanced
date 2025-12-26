// NOTE: 3 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get media tasks from database
    const tasks = await prisma.mediaTask.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const failedTasks = tasks.filter((task) => task.status === "failed").length;
    const processingTasks = tasks.filter(
      (task) => task.status === "processing"
    ).length;

    const averageProcessingTime =
      completedTasks > 0
        ? tasks
            .filter((task) => task.status === "completed")
            .reduce((acc, task) => {
              const processingTime =
                new Date(task.updatedAt).getTime() -
                new Date(task.createdAt).getTime();
              return acc + processingTime;
            }, 0) /
          completedTasks /
          1000 // Convert to seconds
        : 0;

    return NextResponse.json({
      tasks: tasks.map((task) => ({
        id: task.id,
        type: task.type,
        status: task.status,
        progress: task.progress,
        result: task.result,
        error: task.error,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      })),
      stats: {
        totalTasks,
        completedTasks,
        failedTasks,
        processingTasks,
        averageProcessingTime: Math.round(averageProcessingTime),
      },
      settings: {
        maxConcurrentTasks: 3,
        outputQuality: "high",
        autoSave: true,
        defaultFormat: "png",
      },
    });
  } catch (error) {
    console.error("Error fetching media status:", error);
    return NextResponse.json(
      { error: "Failed to fetch media status" },
      { status: 500 }
    );
  }
}
