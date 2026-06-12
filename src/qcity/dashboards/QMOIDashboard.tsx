"use client";
import React, { useEffect, useState } from "react";
import { readPersistedUser } from "@/app/lib/auth/persistence";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { log as logger } from "@/lib/logger";

type DashboardState = {
  emotion: string;
  activity: string;
  pulse: {
    bpm: number;
    rhythm: string;
    health: "excellent" | "good" | "normal" | "warning" | "critical";
  };
  projects: {
    active: number;
    completed: number;
    deployed: number;
  };
  system: {
    health: "excellent" | "good" | "normal" | "warning" | "critical";
    memory: number;
    cpu: number;
    tasks: number;
  };
  statusLabel: string;
  responseTime: number;
};

const MasterAccessRequired = ({ children }: { children: React.ReactNode }) => {
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    try {
      const persistedUser = readPersistedUser();
      setIsMaster(Boolean(persistedUser?.role === "master"));
    } catch (error) {
      logger.warn("MasterAccessRequired failed to read persisted user", {
        error: error instanceof Error ? error.message : String(error),
      });
      setIsMaster(false);
    }
  }, []);

  if (!isMaster) {
    return (
      <div className="p-4 text-red-600">Access denied: Master users only</div>
    );
  }

  return <>{children}</>;
};

const defaultState: DashboardState = {
  emotion: "focused",
  activity: "processing",
  pulse: {
    bpm: 72,
    rhythm: "steady",
    health: "excellent",
  },
  projects: {
    active: 4,
    completed: 12,
    deployed: 7,
  },
  system: {
    health: "excellent",
    memory: 62,
    cpu: 44,
    tasks: 14,
  },
  statusLabel: "Ready",
  responseTime: 128,
};

const getHealthColor = (
  health: DashboardState["system"]["health"],
): string => {
  switch (health) {
    case "excellent":
      return "text-green-500";
    case "good":
      return "text-blue-500";
    case "normal":
      return "text-slate-500";
    case "warning":
      return "text-yellow-500";
    case "critical":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const QMOIDashboard = () => {
  const [state, setState] = useState<DashboardState>(defaultState);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((prev) => ({
        ...prev,
        pulse: {
          ...prev.pulse,
          bpm: Math.max(50, Math.min(95, prev.pulse.bpm + (Math.random() * 6 - 3))),
        },
        system: {
          ...prev.system,
          memory: Math.max(40, Math.min(90, prev.system.memory + (Math.random() * 6 - 3))),
          cpu: Math.max(25, Math.min(85, prev.system.cpu + (Math.random() * 6 - 3))),
          tasks: Math.max(8, Math.min(20, prev.system.tasks + Math.round(Math.random() * 2 - 1))),
        },
        responseTime: Math.max(90, Math.min(220, prev.responseTime + Math.round(Math.random() * 20 - 10))),
      }));
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <MasterAccessRequired>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">QMOI Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of QMOI state and operational health.
            </p>
          </div>
          <Badge className="rounded-full bg-emerald-500 text-white px-3 py-1">
            Master access
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{state.statusLabel}</div>
              <p className="text-sm text-slate-500">Realtime response performance</p>
              <div className="mt-4 grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Response Time</span>
                  <span>{state.responseTime}ms</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${Math.max(20, 100 - state.responseTime / 3)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-semibold ${getHealthColor(state.system.health)}`}>
                {state.system.health}
              </div>
              <div className="mt-3 grid gap-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>CPU</span>
                  <span>{state.system.cpu}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory</span>
                  <span>{state.system.memory}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Active tasks</span>
                  <span>{state.system.tasks}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QMOI Mind</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold capitalize">{state.emotion}</div>
              <p className="text-sm text-slate-500">Activity: {state.activity}</p>
              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Pulse</span>
                  <span>{Math.round(state.pulse.bpm)} bpm</span>
                </div>
                <div className="flex justify-between">
                  <span>Rhythm</span>
                  <span>{state.pulse.rhythm}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="text-sm text-slate-500">Active projects</div>
                <div className="text-3xl font-semibold">{state.projects.active}</div>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="text-sm text-slate-500">Completed</div>
                <div className="text-3xl font-semibold">{state.projects.completed}</div>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="text-sm text-slate-500">Deployed</div>
                <div className="text-3xl font-semibold">{state.projects.deployed}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MasterAccessRequired>
  );
};

export default QMOIDashboard;
export { QMOIDashboard };
