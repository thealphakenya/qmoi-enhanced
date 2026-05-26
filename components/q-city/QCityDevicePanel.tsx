"use client";
import React, { useEffect, useState } from "react";
interface Workspace {
  id: string;
  name: string;
  status: "active" | "stopped" | "error";
}
const sampleWorkspaces: Workspace[] = [
  { id: "ws-1", name: "QCity Lab", status: "active" },
  { id: "ws-2", name: "Edge Node", status: "stopped" },
];
export default function QCityDevicePanel() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(sampleWorkspaces);
  const [logs, setLogs] = useState<Record<string, string>>({});
  const [isMaster, setIsMaster] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("qcityMaster");
    if (stored === "false") setIsMaster(false);
  }, []);
  const handleAction = (workspaceId: string, action: string) => {
    setLogs((prev) => ({
      ...prev,
      [workspaceId]: `${action} requested at ${new Date().toLocaleTimeString()}`,
    }));
  };
  return (
    <div className="space-y-6 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">QCity Device Panel</h2>
        <p className="text-sm text-slate-500">Manage QCity workspaces and device offload sessions.</p>
      </div>
      {!isMaster ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-red-700">
          Master access required to manage QCity devices.
        </div>
      ) : (
        <div className="space-y-4">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{workspace.name}</div>
                  <div className="text-sm text-slate-500">Status: {workspace.status}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction(workspace.id, "sync")}
                    className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Sync
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(workspace.id, "stop")}
                    className="rounded-2xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Stop
                  </button>
                </div>
              </div>
              {logs[workspace.id] && (
                <div className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
                  {logs[workspace.id]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
