import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Task } from '../../types/projects';

interface TaskListProps {
  projectId: string;
}

export function TaskList({ projectId }: TaskListProps) {
  const { projects, updateTask } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const tasks = project?.tasks || [];

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await updateTask(projectId, taskId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    review: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tasks</h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{task.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              </div>
              <div className="flex space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${statusColors[task.status]}`}
                >
                  {task.status}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${priorityColors[task.priority]}`}
                >
                  {task.priority}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Assignee:</span>
                <span className="ml-2">{task.assignee}</span>
              </div>
              <div>
                <span className="text-gray-500">Due Date:</span>
                <span className="ml-2">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Estimated Hours:</span>
                <span className="ml-2">{task.estimatedHours}</span>
              </div>
              <div>
                <span className="text-gray-500">Actual Hours:</span>
                <span className="ml-2">{task.actualHours}</span>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor={`status-${task.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                Update Status
              </label>
              <select
                id={`status-${task.id}`}
                value={task.status}
                onChange={(e) =>
                  handleStatusChange(task.id, e.target.value as Task['status'])
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {task.dependencies.length > 0 && (
              <div className="mt-4">
                <span className="text-sm text-gray-500">Dependencies:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {task.dependencies.map((depId) => {
                    const depTask = tasks.find((t) => t.id === depId);
                    return (
                      <span
                        key={depId}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {depTask?.title || depId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 