import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Resource } from '../../types/projects';

interface ResourceListProps {
  projectId: string;
}

export function ResourceList({ projectId }: ResourceListProps) {
  const { projects, updateProject } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const resources = project?.resources || [];

  const handleStatusChange = async (resourceId: string, newStatus: Resource['status']) => {
    try {
      const updatedResources = resources.map((resource) =>
        resource.id === resourceId ? { ...resource, status: newStatus } : resource
      );
      await updateProject(projectId, { resources: updatedResources });
    } catch (error) {
      console.error('Failed to update resource status:', error);
    }
  };

  const typeColors = {
    human: 'bg-blue-100 text-blue-800',
    equipment: 'bg-green-100 text-green-800',
    software: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800',
  };

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    allocated: 'bg-yellow-100 text-yellow-800',
    maintenance: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Resources</h3>
      <div className="space-y-2">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{resource.name}</h4>
                <div className="flex space-x-2 mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${typeColors[resource.type]}`}
                  >
                    {resource.type}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${statusColors[resource.status]}`}
                  >
                    {resource.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Cost</div>
                <div className="font-medium">${resource.cost.toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Allocation:</span>
                <span className="ml-2">{resource.allocation}%</span>
              </div>
              <div>
                <span className="text-gray-500">Start Date:</span>
                <span className="ml-2">
                  {new Date(resource.startDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">End Date:</span>
                <span className="ml-2">
                  {new Date(resource.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor={`status-${resource.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                Update Status
              </label>
              <select
                id={`status-${resource.id}`}
                value={resource.status}
                onChange={(e) =>
                  handleStatusChange(resource.id, e.target.value as Resource['status'])
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="available">Available</option>
                <option value="allocated">Allocated</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-500">Allocation Progress</div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${resource.allocation}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 