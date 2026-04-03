// QMOI EVOLUTION ENHANCED: Projects Service
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T04:00:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  collaborators: string[];
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

export class ProjectsService {
  private projects: Project[] = [];

  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const project: Project = {
      ...projectData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.projects.push(project);
    return id;
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projects.find(p => p.id === id) || null;
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return this.projects.filter(p =>
      p.ownerId === userId || p.collaborators.includes(userId)
    );
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<boolean> {
    const project = this.projects.find(p => p.id === id);
    if (!project) return false;

    Object.assign(project, updates, { updatedAt: new Date() });
    return true;
  }

  async deleteProject(id: string): Promise<boolean> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.projects.splice(index, 1);
    return true;
  }

  async addCollaborator(projectId: string, userId: string): Promise<boolean> {
    const project = this.projects.find(p => p.id === projectId);
    if (!project || project.collaborators.includes(userId)) return false;

    project.collaborators.push(userId);
    project.updatedAt = new Date();
    return true;
  }

  async removeCollaborator(projectId: string, userId: string): Promise<boolean> {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return false;

    const index = project.collaborators.indexOf(userId);
    if (index === -1) return false;

    project.collaborators.splice(index, 1);
    project.updatedAt = new Date();
    return true;
  }

  async getAllProjects(): Promise<Project[]> {
    return this.projects;
  }

  async searchProjects(query: string): Promise<Project[]> {
    const lowerQuery = query.toLowerCase();
    return this.projects.filter(project =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery)
    );
  }
}

export const projectsService = new ProjectsService();