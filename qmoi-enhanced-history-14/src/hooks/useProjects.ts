export type Project = {
  id: string;
  name: string;
  status: string;
};

export function useProjects() {
  return {
    projects: [] as Project[],
    isLoading: false,
    createProject: async () => undefined,
    updateProject: async () => undefined,
  };
}
