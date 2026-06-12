"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import ThemeSelector from "@/app/components/theme/ThemeSelector";
import { useAuth } from "@/app/hooks/useAuth";
import { AppShellHeader } from "@/components/shared/ui";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  completionTime: string;
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: string;
}

interface ResearchProject {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  progress: number;
  team: string[];
}

interface QAlphaStats {
  learningModulesCompleted: number;
  modelsDeployed: number;
  researchPapers: number;
  communityContributions: number;
}

const defaultStats: QAlphaStats = {
  learningModulesCompleted: 47,
  modelsDeployed: 12,
  researchPapers: 8,
  communityContributions: 23,
};

const defaultLearningPaths: LearningPath[] = [
  {
    id: "LP-001",
    title: "Advanced Neural Networks",
    description: "Deep dive into modern neural network architectures",
    progress: 75,
    difficulty: "advanced",
    completionTime: "6 weeks",
  },
  {
    id: "LP-002",
    title: "Reinforcement Learning Fundamentals",
    description: "Learn RL principles and practical applications",
    progress: 45,
    difficulty: "intermediate",
    completionTime: "4 weeks",
  },
  {
    id: "LP-003",
    title: "NLP & Transformers",
    description: "Natural Language Processing with transformer models",
    progress: 60,
    difficulty: "advanced",
    completionTime: "8 weeks",
  },
];

const defaultModelMetrics: ModelMetrics = {
  accuracy: 0.94,
  precision: 0.92,
  recall: 0.89,
  f1Score: 0.905,
  trainingTime: "2.3h",
};

const defaultResearchProjects: ResearchProject[] = [
  {
    id: "RP-001",
    name: "Multi-Modal AI Integration",
    status: "active",
    progress: 65,
    team: ["Dr. Chen", "Prof. Kumar", "Sarah M."],
  },
  {
    id: "RP-002",
    name: "Federated Learning Framework",
    status: "active",
    progress: 40,
    team: ["Alex T.", "Emma S.", "James P."],
  },
  {
    id: "RP-003",
    name: "Quantum ML Applications",
    status: "paused",
    progress: 25,
    team: ["Dr. Williams", "Nina R."],
  },
];

export default function QAlphaShell(): React.ReactElement {
  const { theme, resolvedTheme } = useTheme();
  const { user, isLoading, refreshUser } = useAuth();
  const [showComponents, setShowComponents] = useState<boolean>(true);
  const isAuthenticated = Boolean(user);

  const effectiveTheme = theme === "system" ? resolvedTheme || "dark" : theme || "dark";
  const shellBackgroundClass =
    effectiveTheme === "light"
      ? "min-h-screen bg-slate-100 text-slate-950"
      : effectiveTheme === "high-contrast"
      ? "min-h-screen bg-black text-white"
      : "min-h-screen bg-slate-950 text-white";
  const [stats, setStats] = useState<QAlphaStats>(defaultStats);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(defaultLearningPaths);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>(defaultModelMetrics);
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>(defaultResearchProjects);
  const [alphaStatusLoading, setAlphaStatusLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    const fetchAlphaData = async (): Promise<void> => {
      try {
        const res = await fetch("/api/qalpha/status", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        if (data?.success) {
          setStats(data.stats || defaultStats);
          setLearningPaths(data.learningPaths || defaultLearningPaths);
          setModelMetrics(data.modelMetrics || defaultModelMetrics);
          setResearchProjects(data.researchProjects || defaultResearchProjects);
        }
      } catch (error) {
        console.error?.("Failed to load QAlpha data:", error);
      }
    };

    const fetchMetrics = async (): Promise<void> => {
      try {
        const res = await fetch("/api/qalpha/metrics", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        if (data?.success && data.modelMetrics) {
          setModelMetrics(data.modelMetrics);
        }
      } catch (error) {
        console.error?.("Failed to load metrics:", error);
      } finally {
        if (active) {
          setAlphaStatusLoading(false);
        }
      }
    };

    fetchAlphaData();
    fetchMetrics();

    return () => {
      active = false;
    };
  }, []);

  const userLevel = useMemo<string>(() => {
    if (user?.role === "master") return "Researcher";
    if (user?.role === "sister") return "Developer";
    if (user?.role === "user") return "Learner";
    return "Guest";
  }, [user?.role]);

  const handleRefresh = useCallback(async (): Promise<void> => {
    await refreshUser?.();
  }, [refreshUser]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white flex items-center justify-center">
        <div className="text-2xl">Loading QAlpha...</div>
      </main>
    );
  }

  return (
    <main className={`${shellBackgroundClass} p-8`}>
      <div className="max-w-7xl mx-auto space-y-10">
        <AppShellHeader
          title="QAlpha Platform"
          tagline="Advanced AI learning, research collaboration, and model development platform."
          iconKey="qalpha"
          accentColor="#9333ea"
          statusMessage={`Session status: ${isAuthenticated ? "Authenticated" : "Guest"} • Role: ${user?.role || "guest"}`}
        />
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-slate-400">Advanced Learning</p>
              <h1 className="text-5xl font-extrabold text-white sm:text-6xl">QAlpha Platform</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-300">
                Advanced AI learning, research collaboration, and model development platform. Master cutting-edge AI technologies.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 px-5 py-4 border border-slate-700 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Your Level</p>
              <p className="mt-2 text-3xl font-semibold text-cyan-300">{userLevel}</p>
              <p className="text-sm text-slate-400">@{user?.displayName || "User"}</p>
              <button
                type="button"
                onClick={handleRefresh}
                className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Refresh User
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Theme Settings</h2>
              <p className="text-sm text-slate-400">Select the theme used across QAlpha and the shared QMOI experience.</p>
            </div>
          </div>
          <div className="mt-5">
            <ThemeSelector />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-4">
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Modules Completed</p>
            <p className="mt-4 text-4xl font-semibold text-cyan-300">{stats.learningModulesCompleted}</p>
            <p className="mt-2 text-sm text-slate-300">+5 this month</p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Models Deployed</p>
            <p className="mt-4 text-4xl font-semibold text-emerald-300">{stats.modelsDeployed}</p>
            <p className="mt-2 text-sm text-slate-300">Active in production</p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Research Papers</p>
            <p className="mt-4 text-4xl font-semibold text-purple-300">{stats.researchPapers}</p>
            <p className="mt-2 text-sm text-slate-300">Published & shared</p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Community Contributions</p>
            <p className="mt-4 text-4xl font-semibold text-yellow-300">{stats.communityContributions}</p>
            <p className="mt-2 text-sm text-slate-300">Shared projects</p>
          </div>
        </section>

        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Active Learning Paths</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {learningPaths.map((path) => (
              <div key={path.id} className="rounded-2xl bg-slate-800 p-6 border border-slate-700 hover:border-slate-600 transition">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-white">{path.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{path.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      path.difficulty === "advanced"
                        ? "bg-red-600/20 text-red-300"
                        : path.difficulty === "intermediate"
                        ? "bg-yellow-600/20 text-yellow-300"
                        : "bg-green-600/20 text-green-300"
                    }`}
                  >
                    {path.difficulty}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span className="text-xs font-semibold text-slate-300">{path.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500" style={{ width: `${path.progress}%` }} />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">Est. {path.completionTime}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Model Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Accuracy</span>
                  <span className="text-sm font-bold text-cyan-300">{(modelMetrics.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${modelMetrics.accuracy * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Precision</span>
                  <span className="text-sm font-bold text-emerald-300">{(modelMetrics.precision * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${modelMetrics.precision * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Recall</span>
                  <span className="text-sm font-bold text-purple-300">{(modelMetrics.recall * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${modelMetrics.recall * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">F1 Score</span>
                  <span className="text-sm font-bold text-yellow-300">{(modelMetrics.f1Score * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: `${modelMetrics.f1Score * 100}%` }} />
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-400">Training time: {modelMetrics.trainingTime}</p>
          </div>

          <div className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Research Projects</h2>
            <div className="space-y-4">
              {researchProjects.map((project) => (
                <div key={project.id} className="rounded-xl bg-slate-800 p-4 border border-slate-700">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">{project.name}</h3>
                      <div className="mt-2 flex gap-1">
                        {project.team.slice(0, 2).map((member) => (
                          <span key={member} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                            {member}
                          </span>
                        ))}
                        {project.team.length > 2 && (
                          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">+{project.team.length - 2}</span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                        project.status === "active"
                          ? "bg-green-600/20 text-green-300"
                          : project.status === "paused"
                          ? "bg-yellow-600/20 text-yellow-300"
                          : "bg-blue-600/20 text-blue-300"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-slate-900 p-8 border border-slate-700 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-3 md:grid-cols-4">
            <Link
              href="/qmoi-ai"
              className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition"
            >
              Back to QMOI AI
            </Link>
            <Link
              href="/qmoi-space"
              className="rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition"
            >
              QMOI Space
            </Link>
            <Link
              href="/qcity"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition"
            >
              QCity
            </Link>
            <button
              onClick={() => setShowComponents(!showComponents)}
              className="rounded-xl bg-slate-700 hover:bg-slate-600 px-4 py-3 text-sm font-semibold text-white transition"
            >
              {showComponents ? "Hide" : "Show"} Components
            </button>
          </div>
        </section>

        {showComponents && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Component Features</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-900 p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4">AI Chat & Analysis</h3>
                <div className="h-40 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                  ChatMessaging Component Ready
                </div>
              </div>
              <div className="rounded-2xl bg-slate-900 p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4">Auto-Fix Dashboard</h3>
                <div className="h-40 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                  QMOIAutoFixDashboard Component Ready
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
