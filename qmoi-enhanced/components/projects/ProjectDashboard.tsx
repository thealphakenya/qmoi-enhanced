import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Project } from '../../types/projects';

interface ProjectDashboardProps {
  projectId: string;
}

export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return <div>Project not found</div>;
  }

  const calculateTaskStats = () => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (task) => task.status === 'completed'
    ).length;
    const inProgressTasks = project.tasks.filter(
      (task) => task.status === 'in-progress'
    ).length;
    const todoTasks = project.tasks.filter(
      (task) => task.status === 'todo'
    ).length;

    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      todo: todoTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  };

  const calculateResourceStats = () => {
    const totalResources = project.resources.length;
    const allocatedResources = project.resources.filter(
      (resource) => resource.status === 'allocated'
    ).length;
    const availableResources = project.resources.filter(
      (resource) => resource.status === 'available'
    ).length;
    const totalCost = project.resources.reduce(
      (sum, resource) => sum + resource.cost,
      0
    );

    return {
      total: totalResources,
      allocated: allocatedResources,
      available: availableResources,
      totalCost,
    };
  };

  const taskStats = calculateTaskStats();
  const resourceStats = calculateResourceStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-500">Project Progress</h4>
          <div className="mt-2">
            <div className="text-2xl font-semibold">{project.progress}%</div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-500">Tasks</h4>
          <div className="mt-2">
            <div className="text-2xl font-semibold">{taskStats.total}</div>
            <div className="mt-1 text-sm text-gray-600">
              {taskStats.completed} completed, {taskStats.inProgress} in progress
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-500">Resources</h4>
          <div className="mt-2">
            <div className="text-2xl font-semibold">{resourceStats.total}</div>
            <div className="mt-1 text-sm text-gray-600">
              {resourceStats.allocated} allocated, {resourceStats.available} available
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-500">Total Cost</h4>
          <div className="mt-2">
            <div className="text-2xl font-semibold">
              ${resourceStats.totalCost.toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-gray-600">Project budget</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-500">Task Status</h4>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Completed</span>
              <span className="text-sm font-medium">{taskStats.completed}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${(taskStats.completed / taskStats.total) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">In Progress</span>
              <span className="text-sm font-medium">{taskStats.inProgress}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{
                  width: `${(taskStats.inProgress / taskStats.total) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">To Do</span>
              <span className="text-sm font-medium">{taskStats.todo}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-600 h-2 rounded-full"
                style={{
                  width: `${(taskStats.todo / taskStats.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-medium text-gray-500">Resource Allocation</h4>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Allocated</span>
              <span className="text-sm font-medium">{resourceStats.allocated}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(resourceStats.allocated / resourceStats.total) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Available</span>
              <span className="text-sm font-medium">{resourceStats.available}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${(resourceStats.available / resourceStats.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h4 className="text-sm font-medium text-gray-500">Project Timeline</h4>
        <div className="mt-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{new Date(project.startDate).toLocaleDateString()}</span>
            <span>{new Date(project.endDate).toLocaleDateString()}</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${project.progress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 