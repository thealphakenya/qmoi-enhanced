import React, { useState } from "react";
import { ProjectList } from "../../../components/projects/ProjectList";
import { ProjectForm } from "../../../components/projects/ProjectForm";
import { useProjects } from "../../../hooks/useProjects";

export default function ProjectsPage() {
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const { projects, createProject } = useProjects();

  const handleCreateProject = async (projectData: any) => {
    try {
      await createProject(projectData);
      setShowNewProjectForm(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Management</h1>
        <button
          onClick={() => setShowNewProjectForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Project
        </button>
      </div>

      {showNewProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Project</h2>
              <button
                onClick={() => setShowNewProjectForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ProjectForm onSuccess={() => setShowNewProjectForm(false)} />
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-2">Active Projects</h3>
            <p className="text-3xl font-bold">
              {projects.filter((p) => p.status === "in-progress").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-2">Completed Projects</h3>
            <p className="text-3xl font-bold">
              {projects.filter((p) => p.status === "completed").length}
            </p>
          </div>
        </div>
      </div>

      <ProjectList />
    </div>
  );
}
