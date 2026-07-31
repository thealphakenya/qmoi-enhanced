import React from "react";
import { useProjects } from "../../hooks/useProjects";
import { Project } from "../../types/projects";

export function ProjectList() {
  const { projects, error } = useProjects();

  if (error) {
    return (
      <div className="text-red-500">
        Error loading projects: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    planning: "bg-blue-100 text-blue-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    "on-hold": "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-yellow-100 text-yellow-800",
    critical: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <span
          className={`px-2 py-1 rounded-full text-sm ${statusColors[project.status]}`}
        >
          {project.status}
        </span>
      </div>
      <p className="text-gray-600 mt-2">{project.description}</p>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Priority</span>
          <span
            className={`px-2 py-1 rounded-full text-sm ${priorityColors[project.priority]}`}
          >
            {project.priority}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Progress</span>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Team Size</span>
          <span className="text-sm">{project.team.length} members</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Tasks</span>
          <span className="text-sm">{project.tasks.length} tasks</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
