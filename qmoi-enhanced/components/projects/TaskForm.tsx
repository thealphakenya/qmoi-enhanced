import React, { useState } from "react";
import { useProjects } from "../../hooks/useProjects";
import { Task } from "../../types/projects";

interface TaskFormProps {
  projectId: string;
  task?: Task;
  onSuccess?: () => void;
}

export function TaskForm({ projectId, task, onSuccess }: TaskFormProps) {
  const { projects, addTask, updateTask } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const [formData, setFormData] = useState<Partial<Task>>(
    task || {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignee: "",
      dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      estimatedHours: 0,
      actualHours: 0,
      dependencies: [],
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (task) {
        await updateTask(projectId, task.id, formData);
      } else {
        await addTask(
          projectId,
          formData as Omit<
            Task,
            "id" | "projectId" | "createdAt" | "updatedAt"
          >,
        );
      }
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDependenciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dependencies = e.target.value.split(",").map((id) => id.trim());
    setFormData((prev) => ({ ...prev, dependencies }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Task Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="assignee"
          className="block text-sm font-medium text-gray-700"
        >
          Assignee
        </label>
        <select
          id="assignee"
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select Assignee</option>
          {project?.team.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={new Date(formData.dueDate || 0).toISOString().split("T")[0]}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              dueDate: new Date(e.target.value).getTime(),
            }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="estimatedHours"
            className="block text-sm font-medium text-gray-700"
          >
            Estimated Hours
          </label>
          <input
            type="number"
            id="estimatedHours"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleChange}
            min="0"
            step="0.5"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="actualHours"
            className="block text-sm font-medium text-gray-700"
          >
            Actual Hours
          </label>
          <input
            type="number"
            id="actualHours"
            name="actualHours"
            value={formData.actualHours}
            onChange={handleChange}
            min="0"
            step="0.5"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="dependencies"
          className="block text-sm font-medium text-gray-700"
        >
          Dependencies (comma-separated task IDs)
        </label>
        <input
          type="text"
          id="dependencies"
          name="dependencies"
          value={formData.dependencies?.join(", ")}
          onChange={handleDependenciesChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {task ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
