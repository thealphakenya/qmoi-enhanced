export interface Project {
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

export interface Task {
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

export interface Resource {
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

export interface ProjectConfig {
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
