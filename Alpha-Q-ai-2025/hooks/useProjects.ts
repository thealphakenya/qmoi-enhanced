import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
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
  isColabProject?: boolean;
  startImmediatelyInColab?: boolean;
}

interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dueDate: number;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  createdAt: number;
  updatedAt: number;
}

interface Resource {
  id: string;
  projectId: string;
  name: string;
  type: 'human' | 'equipment' | 'software' | 'other';
  status: 'available' | 'allocated' | 'maintenance';
  cost: number;
  allocation: number;
  startDate: number;
  endDate: number;
}

interface ProjectConfig {
  enabled: boolean;
  defaultPriority: 'low' | 'medium' | 'high' | 'critical';
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
  colabJobConfig?: {
    defaultJobType: string;
    defaultJobName: string;
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<ProjectConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Fetch projects
  const { data: projectsData, refetch: refetchProjects } = useQuery<Project[], AxiosError>(
    'projects',
    async () => {
      const response = await axios.get('/api/qcity/projects');
      return response.data;
    },
    {
      refetchInterval: 5000, // Poll every 5 seconds
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Fetch project config
  const { data: configData, refetch: refetchConfig } = useQuery<ProjectConfig, AxiosError>(
    'project-config',
    async () => {
      const response = await axios.get('/api/qcity/projects/config');
      return response.data;
    },
    {
      onError: (err: AxiosError) => setError(err),
    }
  );

  // New function to start Colab job for a project (defined before `createProject` uses it)
  const startColabJobForProject = useCallback(async (projectId: string, projectType: string, projectName: string) => {
    try {
      const response = await axios.post('/api/colab-job?executeJob=true', {
        jobSpec: {
          projectId,
          projectType,
          projectName,
          // Add any other relevant project details for Colab job
        },
      });
      console.log('Colab job initiated:', response.data);
      refetchProjects();
    } catch (err) {
      console.error('Error initiating Colab job:', err);
      setError(err as AxiosError);
    }
  }, [refetchProjects]);

  // Create project mutation
  const createProjectMutation = useMutation<Project, AxiosError, Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>(
    async (projectData) => {
      const response = await axios.post('/api/qcity/projects', projectData);
      return response.data;
    },
    {
      onSuccess: (newProject) => {
        refetchProjects();
        if (newProject.isColabProject && newProject.startImmediatelyInColab) {
          startColabJobForProject(newProject.id, newProject.name, newProject.description);
        }
      },
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Update project mutation
  const updateProjectMutation = useMutation<Project, AxiosError, { id: string; updates: Partial<Project> }>(
    async ({ id, updates }) => {
      const response = await axios.put(`/api/qcity/projects/${id}`, updates);
      return response.data;
    },
    {
      onSuccess: () => refetchProjects(),
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Add task mutation
  const addTaskMutation = useMutation<Task, AxiosError, { projectId: string; taskData: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> }>(
    async ({ projectId, taskData }) => {
      const response = await axios.post(`/api/qcity/projects/${projectId}/tasks`, taskData);
      return response.data;
    },
    {
      onSuccess: () => refetchProjects(),
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Update task mutation
  const updateTaskMutation = useMutation<Task, AxiosError, { projectId: string; taskId: string; updates: Partial<Task> }>(
    async ({ projectId, taskId, updates }) => {
      const response = await axios.put(`/api/qcity/projects/${projectId}/tasks/${taskId}`, updates);
      return response.data;
    },
    {
      onSuccess: () => refetchProjects(),
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Update config mutation
  const updateConfigMutation = useMutation<void, AxiosError, Partial<ProjectConfig>>(
    async (newConfig) => {
      const response = await axios.post('/api/qcity/projects/config', newConfig);
      return response.data;
    },
    {
      onSuccess: () => {
        refetchConfig();
        refetchProjects();
      },
      onError: (err: AxiosError) => setError(err),
    }
  );

  // Update projects and config when data changes
  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  useEffect(() => {
    if (configData) {
      setConfig(configData);
    }
  }, [configData]);

  // Create project
  const createProject = useCallback(
    (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
      createProjectMutation.mutate(projectData);
    },
    [createProjectMutation, startColabJobForProject] // Add startColabJobForProject to dependencies
  );

  // Update project
  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      updateProjectMutation.mutate({ id, updates });
    },
    [updateProjectMutation]
  );

  // Add task
  const addTask = useCallback(
    (projectId: string, taskData: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
      addTaskMutation.mutate({ projectId, taskData });
    },
    [addTaskMutation]
  );

  // Update task
  const updateTask = useCallback(
    (projectId: string, taskId: string, updates: Partial<Task>) => {
      updateTaskMutation.mutate({ projectId, taskId, updates });
    },
    [updateTaskMutation]
  );

  // Update config
  const updateConfig = useCallback(
    (newConfig: Partial<ProjectConfig>) => {
      updateConfigMutation.mutate(newConfig);
    },
    [updateConfigMutation]
  );

  return {
    projects,
    config,
    error,
    createProject,
    updateProject,
    addTask,
    updateTask,
    updateConfig,
    refetchProjects,
    refetchConfig,
    startColabJobForProject,
  };
} 