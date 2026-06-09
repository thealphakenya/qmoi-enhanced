"use client";

import type { QmoiUser } from "@/hooks/useAuth";

interface AuthStatusCardProps {
  user: QmoiUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  onLogout: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export default function AuthStatusCard({ user, isAuthenticated, isLoading, onLogout, onRefresh }: AuthStatusCardProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-700 bg-slate-950 p-6 shadow-xl shadow-slate-950/30">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Universal Auth Status</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{isAuthenticated ? "Authenticated" : "Guest Mode"}</h2>
        </div>
        <div className="rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-300">
          {isAuthenticated ? user.role.toUpperCase() : "GUEST"}
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900 p-4 text-sm text-slate-300">
        <p><span className="font-semibold text-slate-100">Display Name:</span> {user.displayName}</p>
        <p><span className="font-semibold text-slate-100">User ID:</span> {user.id}</p>
        <p><span className="font-semibold text-slate-100">Access Level:</span> {user.accessLevel}</p>
        <p><span className="font-semibold text-slate-100">Permissions:</span> {user.permissions.join(", ")}</p>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          disabled={isLoading}
          onClick={onRefresh}
          className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Refresh Session
        </button>
        <button
          type="button"
          disabled={!isAuthenticated || isLoading}
          onClick={onLogout}
          className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white transition hover:border-slate-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAuthenticated ? "Logout Universal Session" : "Not Logged In"}
        </button>
      </div>
    </div>
  );
}
