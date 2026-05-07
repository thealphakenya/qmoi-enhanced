"use client";

import React, { useState, useEffect } from "react";

export default function AdminPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeSessions: 0,
    systemHealth: 100,
    uptime: "99.9%"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();

      if (data.success) {
        setMetrics({
          totalUsers: data.data.totalUsers,
          activeSessions: data.data.activeSessions,
          systemHealth: data.data.systemHealth,
          uptime: data.data.uptime
        });
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err) {
      setError("Network error loading dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
          <div className="text-white">Loading...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
          <div className="text-red-400">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-gray-400">Total Users</div>
            <div className="text-3xl font-bold text-white mt-2">{metrics.totalUsers.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-gray-400">Active Sessions</div>
            <div className="text-3xl font-bold text-white mt-2">{metrics.activeSessions.toLocaleString()}</div>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-gray-400">System Health</div>
            <div className="text-3xl font-bold text-green-500 mt-2">{metrics.systemHealth}%</div>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-gray-400">Uptime</div>
            <div className="text-3xl font-bold text-white mt-2">{metrics.uptime}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
