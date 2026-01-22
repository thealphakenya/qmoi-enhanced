/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { QMOIProjectService } from "@/lib/project-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const projectId = searchParams.get("projectId");
    const type = searchParams.get("type");
    const query = searchParams.get("query");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const projectService = QMOIProjectService.getInstance();

    if (action === "list") {
      const projects = projectService.getUserProjects(userId);
      return NextResponse.json({
        success: true,
        projects,
        count: projects.length,
      });
    }

    if (action === "get" && projectId) {
      const project = projectService.getProject(projectId);
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, project });
    }

    if (action === "stats") {
      const stats = projectService.getStats(userId);
      return NextResponse.json({ success: true, stats });
    }

    if (action === "search" && query) {
      const results = projectService.searchProjects(userId, query);
      return NextResponse.json({
        success: true,
        results,
        count: results.length,
      });
    }

    if (action === "filter-type" && type) {
      const results = projectService.filterByType(userId, type as any);
      return NextResponse.json({
        success: true,
        results,
        count: results.length,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Project API GET error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      action,
      userId,
      projectId,
      name,
      description,
      type,
      dueDate,
      budget,
      isPublic,
      task,
      asset,
      updates,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const projectService = QMOIProjectService.getInstance();

    if (action === "create") {
      const project = projectService.createProject({
        name,
        description,
        type,
        owner: userId,
        dueDate,
        budget,
        isPublic,
      });
      return NextResponse.json({
        success: true,
        message: "Project created successfully",
        project,
      });
    }

    if (action === "update" && projectId) {
      const project = projectService.updateProject(projectId, updates);
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        message: "Project updated successfully",
        project,
      });
    }

    if (action === "delete" && projectId) {
      const deleted = projectService.deleteProject(projectId);
      if (!deleted) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        message: "Project deleted successfully",
      });
    }

    if (action === "add-task" && projectId && task) {
      const newTask = projectService.addTask(projectId, task);
      if (!newTask) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        message: "Task added successfully",
        task: newTask,
      });
    }

    if (action === "update-task" && projectId && task) {
      const updated = projectService.updateTask(projectId, task.id, task);
      if (!updated) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: "Task updated successfully",
        task: updated,
      });
    }

    if (action === "delete-task" && projectId && task) {
      const deleted = projectService.deleteTask(projectId, task.id);
      if (!deleted) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: "Task deleted successfully",
      });
    }

    if (action === "add-asset" && projectId && asset) {
      const newAsset = projectService.addAsset(projectId, asset);
      if (!newAsset) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        message: "Asset added successfully",
        asset: newAsset,
      });
    }

    if (action === "update-progress" && projectId) {
      const progress = projectService.updateProgress(projectId);
      return NextResponse.json({
        success: true,
        message: "Progress updated",
        progress,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Project API POST error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
