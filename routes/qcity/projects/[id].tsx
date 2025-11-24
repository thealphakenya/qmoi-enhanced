import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ProjectDashboard } from '../../../components/projects/ProjectDashboard';
import { TaskList } from '../../../components/projects/TaskList';
import { ResourceList } from '../../../components/projects/ResourceList';
import { ProjectForm } from '../../../components/projects/ProjectForm';
import { useProjects } from '../../../hooks/useProjects';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [showEditForm, setShowEditForm] = useState(false);
  const { projects, updateProject } = useProjects();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Project Not Found</h1>
          <p className="mt-2 text-gray-600">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/qcity/projects')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateProject = async (updates: any) => {
    try {
      await updateProject(project.id, updates);
      setShowEditForm(false);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description}</p>
        </div>
        <button
          onClick={() => setShowEditForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit Project
        </button>
      </div>

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Project</h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ProjectForm project={project} onSuccess={() => setShowEditForm(false)} />
          </div>
        </div>
      )}

      <div className="mb-8">
        <ProjectDashboard projectId={project.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <TaskList projectId={project.id} />
        </div>
        <div>
          <ResourceList projectId={project.id} />
        </div>
      </div>
    </div>
  );
} 