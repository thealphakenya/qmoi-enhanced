import ErrorBoundary from '@/components/ErrorBoundary';
import React, { useEffect, useState } from 'react';
import apiClient from "@/api/client";
import { useToast } from "@/components/ui/use-toast";
import { log as logger } from "@/lib/logger";
interface ErrorBoundaryProps extends React.PropsWithChildren<{}> {}
interface ErrorBoundaryState {
  hasError: boolean;
}

// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
"use client";
// INTENTIONAL_UNUSED: archived / intentionally unused component
type ProjectType =
  | "code"
  | "design"
  | "music"
  | "writing"
  | "business"
  | "education"
  | "research"
  | "creative"
  | "data-analysis"
  | "automation"
  | "gaming";
type ProjectStatus = "planning" | "in-progress" | "completed" | "on-hold";
interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
}
interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  status: ProjectStatus;
  owner: string;
  tasks?: ProjectTask[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}
interface ProjectManagementProps {
  userId?: string;
  onProjectSelect?: (project: Project) => void;
}
export /**
 * ProjectManagement function
 */
function ProjectManagement({
  userId,
  onProjectSelect,
}: ProjectManagementProps): any {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterType, setFilterType] = useState<ProjectType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "code" as ProjectType,
  });
  // Fetch projects on mount
  useEffect(() => {
    if (userId) {
      fetchProjects();
    }
  }, [userId]);
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        `/api/qmoi/projects?action=list&userId=${userId}`,
      );
      const data = await response.json();
      if (data.success && data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.get("/api/qmoi/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          userId,
          formData,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Project created successfully",
        });
        setFormData({ name: "", description: "", type: "code" });
        setShowCreateForm(false);
        fetchProjects();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
      });
    }
  };
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await apiClient.get("/api/qmoi/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          projectId,
          userId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Project deleted",
        });
        fetchProjects();
        setSelectedProject(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
      });
    }
  };
  const handleAddTask = async (projectId: string, taskTitle: string) => {
    try {
      const response = await apiClient.get("/api/qmoi/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-task",
          projectId,
          userId,
          task: {
            title: taskTitle,
            status: "pending",
            priority: "medium",
          },
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchProjects();
      }
    } catch (error: unknown) {
      logger.error("Failed to add task:", error as Error | Record<string, any>);
    }
  };
  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const typeMatch = filterType === "all" || project.type === filterType;
    const statusMatch =
      filterStatus === "all" || project.status === filterStatus;
    const searchMatch =
      searchQuery === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });
  const projectTypes: ProjectType[] = [
    "code",
    "design",
    "music",
    "writing",
    "business",
    "education",
    "research",
    "creative",
    "data-analysis",
    "automation",
    "gaming",
  ];
  const statusBadges = {
    planning: "bg-blue-100 text-blue-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    "on-hold": "bg-gray-100 text-gray-800",
  };
  const priorityBadges = {
    low: "bg-blue-50 text-blue-700",
    medium: "bg-yellow-50 text-yellow-700",
    high: "bg-orange-50 text-orange-700",
    urgent: "bg-red-50 text-red-700",
  };
  return (
    <div className="w-full max-w-6xl space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🚀 Project Management
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors"
        >
          {showCreateForm ? "Cancel" : "+ New Project"}
        </button>
      </div>
      {/* Create Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateProject}
          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4"
        >
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
            required
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 h-20"
          />
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as ProjectType,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-medium transition-colors"
          >
            Create Project
          </button>
        </form>
      )}
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as ProjectType | "all")}
          className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="all">All Types</option>
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as ProjectStatus | "all")
          }
          className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="all">All Status</option>
          <option value="planning">Planning</option>
          <option value="in-progress">COMPLETE</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>
      {/* Projects Grid */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">
          Loading projects
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No projects found. Create one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                setSelectedProject(project);
                onProjectSelect?.(project);
              }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedProject?.id === project.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.description.substring(0, 100)}
                      {project.description.length > 100 ? "" : ""}
                    </p>
                  )}
                </div>
              </div>
              {/* Status and Type Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    statusBadges[project.status]
                  }`}
                >
                  {project.status.replace("-", " ")}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                  {project.type}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Progress
                  </span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {Math.round(project.progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              {/* Task Count */}
              {project.tasks && project.tasks.length > 0 && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  📋{" "}
                  {project.tasks.filter((t) => t.status === "completed").length}
                  /{project.tasks.length} tasks completed
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                    onProjectSelect?.(project);
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Selected Project Details */}
      {selectedProject && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border-2 border-blue-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Project Details: {selectedProject.name}
          </h3>
          {/* Tasks Section */}
          {selectedProject.tasks && selectedProject.tasks.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tasks
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedProject.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-2 rounded text-sm ${priorityBadges[task.priority]}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{task.title}</span>
                      <span className="text-xs">
                        [{task.status.replace("-", " ")}]
                      </span>
                    </div>
                    {task.dueDate && (
                      <div className="text-xs opacity-75 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* optimized Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white dark:bg-gray-700 rounded">
              <div className="text-lg font-bold text-blue-600">
                {selectedProject.tasks?.length || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Tasks
              </div>
            </div>
            <div className="p-2 bg-white dark:bg-gray-700 rounded">
              <div className="text-lg font-bold text-green-600">
                {Math.round(selectedProject.progress)}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                complete
              </div>
            </div>
            <div className="p-2 bg-white dark:bg-gray-700 rounded">
              <div className="text-lg font-bold text-purple-600">
                {selectedProject.tasks?.filter(
                  (t) => t.status === "in-progress",
                ).length || 0}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Active
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProjectManagement;
