// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-disable @typescript-eslint/no-explicit-any */
import { specificExports } from "next/server";
import { specificExports } from "@/lib/projects-service";

export async /**
 * GET function
 */
function GET(req: Request): any {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const projectId = searchParams.get("projectId");
    const category = searchParams.get("category");

    if (action === "list") {
      const projects = await ProjectsService.getProjects(
        userId || undefined,
      );
      return NextResponse.json({
        success: true,
        projects,
        count: projects.length,
      });
    }

    if (action === "get" && projectId) {
      const project = await ProjectsService.getProjectById(projectId);
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, project });
    }

    if (action === "capabilities") {
      const capabilities = await ProjectsService.getCapabilities(
        category || undefined,
      );
      return NextResponse.json({
        success: true,
        capabilities,
        count: capabilities.length,
      });
    }

    if (action === "analytics") {
      const analytics = await ProjectsService.getProjectAnalytics(
        userId || undefined,
      );
      return NextResponse.json({ success: true, analytics });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Projects API GET error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}

export async /**
 * POST function
 */
function POST(req: Request): any {
  try {
    const body = await req.json();
    const {
      action,
      userId,
      projectId,
      name,
      description,
      priority,
      tags,
      deadline,
      taskData,
      capabilityData,
      updates,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    if (action === "create") {
      const project = await ProjectsService.createProject({
        name,
        description,
        ownerId: userId,
        priority,
        tags,
        deadline,
      });
      return NextResponse.json({
        success: true,
        project,
        message: "Project created successfully",
      });
    }

    if (action === "update" && projectId && updates) {
      const project = await ProjectsService.updateProject(
        projectId,
        updates,
      );
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        project,
        message: "Project updated successfully",
      });
    }

    if (action === "delete" && projectId) {
      const result = await ProjectsService.deleteProject(projectId);
      return NextResponse.json(result);
    }

    if (action === "add-task" && projectId && taskData) {
      const task = await ProjectsService.addTask(projectId, taskData);
      if (!task) {
        return NextResponse.json(
          { error: "Failed to add task" },
          { status: 400 },
        );
      }
      return NextResponse.json({
        success: true,
        task,
        message: "Task added successfully",
      });
    }

    if (action === "update-task" && projectId && taskData?.id) {
      const task = await ProjectsService.updateTask(
        projectId,
        taskData.id,
        taskData,
      );
      if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        task,
        message: "Task updated successfully",
      });
    }

    if (action === "register-capability" && capabilityData) {
      const capability =
        await ProjectsService.registerCapability(capabilityData);
      return NextResponse.json({
        success: true,
        capability,
        message: "Capability registered successfully",
      });
    }

    if (action === "update-capability-usage" && capabilityData?.id) {
      await ProjectsService.updateCapabilityUsage(
        capabilityData.id,
        capabilityData.metrics || {},
      );
      return NextResponse.json({
        success: true,
        message: "Capability usage updated",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Projects API POST error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
