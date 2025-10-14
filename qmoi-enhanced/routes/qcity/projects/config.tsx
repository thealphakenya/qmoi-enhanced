import React, { useState } from "react";
import { useProjects } from "../../../hooks/useProjects";
import { ProjectConfig } from "../../../types/projects";

export default function ProjectConfigPage() {
  const { config, updateConfig } = useProjects();
  const [formData, setFormData] = useState<Partial<ProjectConfig>>(
    config || {
      enabled: true,
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
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateConfig(formData);
    } catch (error) {
      console.error("Failed to update project configuration:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [name]: checked,
      },
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setFormData((prev) => ({ ...prev, defaultTags: tags }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Configuration</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enabled"
                name="enabled"
                checked={formData.enabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="enabled"
                className="ml-2 block text-sm text-gray-900"
              >
                Enable Project Management
              </label>
            </div>

            <div>
              <label
                htmlFor="defaultPriority"
                className="block text-sm font-medium text-gray-700"
              >
                Default Priority
              </label>
              <select
                id="defaultPriority"
                name="defaultPriority"
                value={formData.defaultPriority}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoAssign"
                name="autoAssign"
                checked={formData.autoAssign}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="autoAssign"
                className="ml-2 block text-sm text-gray-900"
              >
                Auto-assign Tasks
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="onTaskAssigned"
                name="onTaskAssigned"
                checked={formData.notificationSettings?.onTaskAssigned}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="onTaskAssigned"
                className="ml-2 block text-sm text-gray-900"
              >
                Notify on Task Assignment
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="onTaskCompleted"
                name="onTaskCompleted"
                checked={formData.notificationSettings?.onTaskCompleted}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="onTaskCompleted"
                className="ml-2 block text-sm text-gray-900"
              >
                Notify on Task Completion
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="onProjectStatusChange"
                name="onProjectStatusChange"
                checked={formData.notificationSettings?.onProjectStatusChange}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="onProjectStatusChange"
                className="ml-2 block text-sm text-gray-900"
              >
                Notify on Project Status Change
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="onResourceAllocation"
                name="onResourceAllocation"
                checked={formData.notificationSettings?.onResourceAllocation}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="onResourceAllocation"
                className="ml-2 block text-sm text-gray-900"
              >
                Notify on Resource Allocation
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Limits and Defaults</h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="defaultTags"
                className="block text-sm font-medium text-gray-700"
              >
                Default Tags (comma-separated)
              </label>
              <input
                type="text"
                id="defaultTags"
                name="defaultTags"
                value={formData.defaultTags?.join(", ")}
                onChange={handleTagsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="maxTeamSize"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Team Size
              </label>
              <input
                type="number"
                id="maxTeamSize"
                name="maxTeamSize"
                value={formData.maxTeamSize}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="maxConcurrentProjects"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Concurrent Projects
              </label>
              <input
                type="number"
                id="maxConcurrentProjects"
                name="maxConcurrentProjects"
                value={formData.maxConcurrentProjects}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
