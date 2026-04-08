// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { specificExports } from "next/server";
import { specificExports } from "@/lib/prisma";

export async /**
 * GET function
 */
function GET(): any {
  try {
    const tasks = await prisma.mediaTask.findMany({
      orderBy: { updatedAt: "desc" },
      take: 100,
    });

    const typedTasks = Array.isArray(tasks) ? tasks : [];
    const totalTasks = typedTasks.length;
    const completedTasks = typedTasks.filter(
      (t) => t?.status === "completed",
    ).length;
    const failedTasks = typedTasks.filter((t) => t?.status === "failed").length;
    const processingTasks = typedTasks.filter(
      (t) => t?.status === "processing",
    ).length;
    const averageProcessingTime = typedTasks.length
      ? typedTasks.reduce((acc, t) => {
          const stats = (
            t as unknown as { stats?: { estimatedProcessingTime?: number } }
          )?.stats;
          return acc + (stats?.estimatedProcessingTime ?? 0);
        }, 0) / typedTasks.length
      : 0;

    return NextResponse.json({
      tasks,
      stats: {
        totalTasks,
        completedTasks,
        failedTasks,
        processingTasks,
        averageProcessingTime,
      },
      dataSource: "prisma.mediaTask",
      message: "production media task status fetched",
    });
  } catch (error) {
    globalThis.console?.error?.("Error fetching media status:", error);

    return NextResponse.json(
      {
        tasks: [],
        stats: {
          totalTasks: 0,
          completedTasks: 0,
          failedTasks: 0,
          processingTasks: 0,
          averageProcessingTime: 0,
        },
        message: "Failed to fetch media status from production DB",
      },
      { status: 500 },
    );
  }
}
