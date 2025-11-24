import { useState, useEffect, useCallback } from "react";

interface AutoProject {
  id: string;
  name: string;
  description: string;
  status: "planned" | "in-progress" | "completed" | "failed";
  type:
    | "web-app"
    | "mobile-app"
    | "game"
    | "animation"
    | "tool"
    | "api"
    | "automation";
  priority: "low" | "medium" | "high" | "critical";
  startedAt?: string;
  completedAt?: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  technologies: string[];
  features: string[];
  documentation: boolean;
  testing: boolean;
  deployment: boolean;
}

interface DailyPlan {
  date: string;
  projects: AutoProject[];
  totalEstimatedTime: number;
  status: "draft" | "active" | "completed";
}

interface UseAutoProjectsReturn {
  projects: AutoProject[];
  dailyPlan: DailyPlan | null;
  isLoading: boolean;
  createProject: (
    project: Omit<AutoProject, "id" | "status" | "startedAt">,
  ) => Promise<void>;
  updateProjectStatus: (
    id: string,
    status: AutoProject["status"],
  ) => Promise<void>;
  generateDailyPlan: () => Promise<void>;
  notifyMaster: (message: string) => Promise<void>;
  createWhatsAppGroup: () => Promise<void>;
  postToWhatsAppGroup: (message: string) => Promise<void>;
  getProjectStats: () => {
    total: number;
    completed: number;
    inProgress: number;
    planned: number;
    successRate: number;
  };
}

export const useAutoProjects = (): UseAutoProjectsReturn => {
  const [projects, setProjects] = useState<AutoProject[]>([]);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem("qmoi-auto-projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }

    const savedDailyPlan = localStorage.getItem("qmoi-daily-plan");
    if (savedDailyPlan) {
      setDailyPlan(JSON.parse(savedDailyPlan));
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("qmoi-auto-projects", JSON.stringify(projects));
  }, [projects]);

  // Save daily plan to localStorage whenever it changes
  useEffect(() => {
    if (dailyPlan) {
      localStorage.setItem("qmoi-daily-plan", JSON.stringify(dailyPlan));
    }
  }, [dailyPlan]);

  const createProject = useCallback(
    async (projectData: Omit<AutoProject, "id" | "status" | "startedAt">) => {
      setIsLoading(true);
      try {
        const newProject: AutoProject = {
          ...projectData,
          id: `project-${Date.now()}`,
          status: "planned",
          startedAt: undefined,
        };

        setProjects((prev) => [...prev, newProject]);

        // Notify master about new project
        await notifyMaster(
          `🆕 New project planned: ${newProject.name}\nType: ${newProject.type}\nPriority: ${newProject.priority}\nEstimated time: ${newProject.estimatedDuration} minutes`,
        );
      } catch (error) {
        console.error("Error creating project:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const updateProjectStatus = useCallback(
    async (id: string, status: AutoProject["status"]) => {
      setIsLoading(true);
      try {
        setProjects((prev) =>
          prev.map((project) => {
            if (project.id === id) {
              const updatedProject = { ...project, status };

              if (status === "in-progress" && !project.startedAt) {
                updatedProject.startedAt = new Date().toISOString();
              }

              if (status === "completed" && !project.completedAt) {
                updatedProject.completedAt = new Date().toISOString();
                if (project.startedAt) {
                  const startTime = new Date(project.startedAt).getTime();
                  const endTime = new Date().getTime();
                  updatedProject.actualDuration = Math.round(
                    (endTime - startTime) / (1000 * 60),
                  ); // Convert to minutes
                }
              }

              return updatedProject;
            }
            return project;
          }),
        );

        // Notify master about status change
        const project = projects.find((p) => p.id === id);
        if (project) {
          await notifyMaster(
            `📊 Project status updated: ${project.name}\nNew status: ${status}${status === "completed" ? " ✅" : status === "in-progress" ? " 🔄" : " 📋"}`,
          );
        }
      } catch (error) {
        console.error("Error updating project status:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [projects],
  );

  const generateDailyPlan = useCallback(async () => {
    setIsLoading(true);
    try {
      // Generate 10+ projects for the day
      const projectTypes: AutoProject["type"][] = [
        "web-app",
        "mobile-app",
        "game",
        "animation",
        "tool",
        "api",
        "automation",
      ];
      const priorities: AutoProject["priority"][] = [
        "low",
        "medium",
        "high",
        "critical",
      ];

      const newProjects: AutoProject[] = [];

      for (let i = 0; i < 12; i++) {
        // Generate 12 projects
        const project: AutoProject = {
          id: `daily-project-${Date.now()}-${i}`,
          name: `Auto Project ${i + 1}`,
          description: `Automatically generated project ${i + 1} for daily plan`,
          status: "planned",
          type: projectTypes[Math.floor(Math.random() * projectTypes.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          estimatedDuration: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
          technologies: ["React", "TypeScript", "Node.js", "Python"],
          features: [
            "Responsive Design",
            "API Integration",
            "Database",
            "Authentication",
          ],
          documentation: true,
          testing: true,
          deployment: true,
        };
        newProjects.push(project);
      }

      const plan: DailyPlan = {
        date: new Date().toISOString().split("T")[0],
        projects: newProjects,
        totalEstimatedTime: newProjects.reduce(
          (sum, p) => sum + p.estimatedDuration,
          0,
        ),
        status: "active",
      };

      setDailyPlan(plan);
      setProjects((prev) => [...prev, ...newProjects]);

      // Notify master about daily plan
      await notifyMaster(
        `📅 Daily plan generated for ${plan.date}\nTotal projects: ${newProjects.length}\nEstimated time: ${Math.round(plan.totalEstimatedTime / 60)} hours\nStatus: ${plan.status}`,
      );

      // Post to WhatsApp group
      await postToWhatsAppGroup(
        `📋 Daily Plan - ${plan.date}\n\nProjects planned: ${newProjects.length}\nEstimated time: ${Math.round(plan.totalEstimatedTime / 60)} hours\n\nProjects:\n${newProjects.map((p, i) => `${i + 1}. ${p.name} (${p.type}) - ${p.estimatedDuration}min`).join("\n")}`,
      );
    } catch (error) {
      console.error("Error generating daily plan:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const notifyMaster = useCallback(async (message: string) => {
    try {
      // Simulate WhatsApp notification to master
      console.log("📱 WhatsApp notification to master:", message);

      // In real implementation, this would call the WhatsApp API
      // await fetch('/api/whatsapp/notify-master', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message })
      // });
    } catch (error) {
      console.error("Error notifying master:", error);
    }
  }, []);

  const createWhatsAppGroup = useCallback(async () => {
    try {
      // Simulate creating WhatsApp group
      console.log('📱 Creating "Qmoi Auto Projects" WhatsApp group');

      // In real implementation, this would call the WhatsApp API
      // await fetch('/api/whatsapp/create-group', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: 'Qmoi Auto Projects',
      //     description: 'Automated project updates and notifications'
      //   })
      // });
    } catch (error) {
      console.error("Error creating WhatsApp group:", error);
    }
  }, []);

  const postToWhatsAppGroup = useCallback(async (message: string) => {
    try {
      // Simulate posting to WhatsApp group
      console.log("📱 Posting to WhatsApp group:", message);

      // In real implementation, this would call the WhatsApp API
      // await fetch('/api/whatsapp/post-to-group', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message })
      // });
    } catch (error) {
      console.error("Error posting to WhatsApp group:", error);
    }
  }, []);

  const getProjectStats = useCallback(() => {
    const total = projects.length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const inProgress = projects.filter(
      (p) => p.status === "in-progress",
    ).length;
    const planned = projects.filter((p) => p.status === "planned").length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      planned,
      successRate,
    };
  }, [projects]);

  return {
    projects,
    dailyPlan,
    isLoading,
    createProject,
    updateProjectStatus,
    generateDailyPlan,
    notifyMaster,
    createWhatsAppGroup,
    postToWhatsAppGroup,
    getProjectStats,
  };
};
