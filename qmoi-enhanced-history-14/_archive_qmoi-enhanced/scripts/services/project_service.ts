import { logger } from "../utils/logger";
import { NotificationService } from "./notification_service";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in-progress" | "completed" | "on-hold" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  startDate: number;
  endDate: number;
  owner: string;
  team: string[];
  tasks: Task[];
  resources: Resource[];
  progress: number;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  assignee: string;
  dueDate: number;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  createdAt: number;
  updatedAt: number;
}

interface Resource {
  id: string;
  projectId: string;
  name: string;
  type: "human" | "equipment" | "software" | "other";
  status: "available" | "allocated" | "maintenance";
  cost: number;
  allocation: number;
  startDate: number;
  endDate: number;
}

interface ProjectConfig {
  enabled: boolean;
  defaultPriority: "low" | "medium" | "high" | "critical";
  autoAssign: boolean;
  notificationSettings: {
    onTaskAssigned: boolean;
    onTaskCompleted: boolean;
    onProjectStatusChange: boolean;
    onResourceAllocation: boolean;
  };
  defaultTags: string[];
  maxTeamSize: number;
  maxConcurrentProjects: number;
}

export class ProjectService {
  private config: ProjectConfig;
  private projects: Project[] = [];
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
    this.config = {
      enabled: false,
      defaultPriority: "medium",
      autoAssign: false,
      notificationSettings: {
        onTaskAssigned: true,
        onTaskCompleted: true,
        onProjectStatusChange: true,
        onResourceAllocation: true,
      },
      defaultTags: [],
      maxTeamSize: 10,
      maxConcurrentProjects: 5,
    };
  }

  async initialize(): Promise<void> {
    try {
      logger.info("Initializing project service...");
      await this.loadConfig();
      await this.loadProjects();
      logger.info("Project service initialized successfully");
      await this.notificationService.sendNotification(
        "Project Service",
        "Project service has been initialized successfully.",
      );
    } catch (error) {
      logger.error("Failed to initialize project service:", error);
      throw error;
    }
  }

  private async loadConfig(): Promise<void> {
    try {
      this.config = {
        enabled: process.env.ENABLE_PROJECTS === "true",
        defaultPriority: (process.env.DEFAULT_PROJECT_PRIORITY || "medium") as
          | "low"
          | "medium"
          | "high"
          | "critical",
        autoAssign: process.env.PROJECT_AUTO_ASSIGN === "true",
        notificationSettings: {
          onTaskAssigned: process.env.NOTIFY_TASK_ASSIGNED === "true",
          onTaskCompleted: process.env.NOTIFY_TASK_COMPLETED === "true",
          onProjectStatusChange: process.env.NOTIFY_PROJECT_STATUS === "true",
          onResourceAllocation:
            process.env.NOTIFY_RESOURCE_ALLOCATION === "true",
        },
        defaultTags: (process.env.DEFAULT_PROJECT_TAGS || "").split(","),
        maxTeamSize: parseInt(process.env.MAX_TEAM_SIZE || "10"),
        maxConcurrentProjects: parseInt(
          process.env.MAX_CONCURRENT_PROJECTS || "5",
        ),
      };
      logger.info("Project configuration loaded successfully");
    } catch (error) {
      logger.error("Failed to load project configuration:", error);
      throw error;
    }
  }

  private async loadProjects(): Promise<void> {
    try {
      logger.info("Loading projects...");
      // Implementation for loading projects from storage
      logger.info("Projects loaded successfully");
    } catch (error) {
      logger.error("Failed to load projects:", error);
      throw error;
    }
  }

  public async createProject(
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ): Promise<Project> {
    try {
      if (!this.config.enabled) {
        throw new Error("Project service is not enabled");
      }

      if (this.projects.length >= this.config.maxConcurrentProjects) {
        throw new Error("Maximum number of concurrent projects reached");
      }

      const project: Project = {
        ...projectData,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tasks: [],
        resources: [],
        progress: 0,
      };

      this.projects.push(project);
      logger.info(`Project created: ${JSON.stringify(project)}`);

      await this.notificationService.sendNotification(
        "New Project Created",
        `Project "${project.name}" has been created.`,
      );

      return project;
    } catch (error) {
      logger.error("Failed to create project:", error);
      throw error;
    }
  }

  public async updateProject(
    projectId: string,
    updates: Partial<Project>,
  ): Promise<Project> {
    try {
      const project = this.projects.find((p) => p.id === projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      const updatedProject = {
        ...project,
        ...updates,
        updatedAt: Date.now(),
      };

      const index = this.projects.findIndex((p) => p.id === projectId);
      this.projects[index] = updatedProject;

      logger.info(`Project updated: ${JSON.stringify(updatedProject)}`);

      if (updates.status) {
        await this.notificationService.sendNotification(
          "Project Status Updated",
          `Project "${project.name}" status changed to ${updates.status}.`,
        );
      }

      return updatedProject;
    } catch (error) {
      logger.error("Failed to update project:", error);
      throw error;
    }
  }

  public async addTask(
    projectId: string,
    taskData: Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">,
  ): Promise<Task> {
    try {
      const project = this.projects.find((p) => p.id === projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      const task: Task = {
        ...taskData,
        id: Date.now().toString(),
        projectId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      project.tasks.push(task);
      project.updatedAt = Date.now();

      logger.info(`Task added: ${JSON.stringify(task)}`);

      if (this.config.notificationSettings.onTaskAssigned) {
        await this.notificationService.sendNotification(
          "New Task Assigned",
          `Task "${task.title}" has been assigned to ${task.assignee}.`,
        );
      }

      return task;
    } catch (error) {
      logger.error("Failed to add task:", error);
      throw error;
    }
  }

  public async updateTask(
    projectId: string,
    taskId: string,
    updates: Partial<Task>,
  ): Promise<Task> {
    try {
      const project = this.projects.find((p) => p.id === projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      const task = project.tasks.find((t) => t.id === taskId);
      if (!task) {
        throw new Error("Task not found");
      }

      const updatedTask = {
        ...task,
        ...updates,
        updatedAt: Date.now(),
      };

      const index = project.tasks.findIndex((t) => t.id === taskId);
      project.tasks[index] = updatedTask;
      project.updatedAt = Date.now();

      logger.info(`Task updated: ${JSON.stringify(updatedTask)}`);

      if (
        updates.status === "completed" &&
        this.config.notificationSettings.onTaskCompleted
      ) {
        await this.notificationService.sendNotification(
          "Task Completed",
          `Task "${task.title}" has been completed.`,
        );
      }

      return updatedTask;
    } catch (error) {
      logger.error("Failed to update task:", error);
      throw error;
    }
  }

  public async allocateResource(
    projectId: string,
    resourceData: Omit<Resource, "id" | "projectId">,
  ): Promise<Resource> {
    try {
      const project = this.projects.find((p) => p.id === projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      const resource: Resource = {
        ...resourceData,
        id: Date.now().toString(),
        projectId,
      };

      project.resources.push(resource);
      project.updatedAt = Date.now();

      logger.info(`Resource allocated: ${JSON.stringify(resource)}`);

      if (this.config.notificationSettings.onResourceAllocation) {
        await this.notificationService.sendNotification(
          "Resource Allocated",
          `Resource "${resource.name}" has been allocated to project "${project.name}".`,
        );
      }

      return resource;
    } catch (error) {
      logger.error("Failed to allocate resource:", error);
      throw error;
    }
  }

  public getProjects(): Project[] {
    return this.projects;
  }

  public getProject(projectId: string): Project | undefined {
    return this.projects.find((p) => p.id === projectId);
  }

  public getConfig(): ProjectConfig {
    return this.config;
  }

  public async updateConfig(newConfig: Partial<ProjectConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...newConfig };
      logger.info("Project configuration updated successfully");
    } catch (error) {
      logger.error("Failed to update project configuration:", error);
      throw error;
    }
  }
}
