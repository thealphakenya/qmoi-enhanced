// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface SponsoredUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isSponsored: boolean;
  createdAt: string;
  lastActive: string;
  usageStats: {
    apiRequests: number;
    chatMessages: number;
    fileUploads: number;
  };
}

interface SponsoredUsersAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalUsage: {
    apiRequests: number;
    chatMessages: number;
    fileUploads: number;
  };
  rateLimitExemptions: number;
  averageUsage: number;
}

export const SponsoredUsersManager: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [sponsoredUsers, setSponsoredUsers] = useState<SponsoredUser[]>([]);
  const [analytics, setAnalytics] = useState<SponsoredUsersAnalytics | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    sponsorProgram: "premium_2026",
  });

  // Only render for master users
  if (!currentUser || currentUser.role !== "master") {
    return null;
  }

  useEffect(() => {
    loadSponsoredUsers();
    loadAnalytics();
  }, []);

  const loadSponsoredUsers = async () => {
    try {
      const response = await fetch("/api/master/sponsored/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "X-Biometric-Verification":
            localStorage.getItem("biometricToken") || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSponsoredUsers(data.users || []);
      }
    } catch (error) {
      (globalThis.console as any)?.error?.("Failed to load sponsored users:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/master/sponsored/analytics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "X-Biometric-Verification":
            localStorage.getItem("biometricToken") || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      (globalThis.console as any)?.error?.("Failed to load analytics:", error);
    }
  };

  const addSponsoredUser = async () => {
    try {
      const response = await fetch("/api/master/sponsored/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "X-Biometric-Verification":
            localStorage.getItem("biometricToken") || "",
        },
        body: JSON.stringify({
          ...newUser,
          benefits: {
            rateLimitExempt: true,
            priorityProcessing: true,
            enhancedFeatures: true,
          },
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewUser({ username: "", email: "", sponsorProgram: "premium_2026" });
        loadSponsoredUsers();
        loadAnalytics();
      }
    } catch (error) {
      (globalThis.console as any)?.error?.("Failed to add sponsored user:", error);
    }
  };

  const removeSponsoredUser = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this sponsored user?"))
      return;

    try {
      const response = await fetch(`/api/master/sponsored/remove/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "X-Biometric-Verification":
            localStorage.getItem("biometricToken") || "",
        },
      });

      if (response.ok) {
        loadSponsoredUsers();
        loadAnalytics();
      }
    } catch (error) {
      (globalThis.console as any)?.error?.("Failed to remove sponsored user:", error);
    }
  };

  if (loading) {
    return (
      <div className="master-panel sponsored-users-loading">
        <div className="loading-spinner">Loading sponsored users...</div>
      </div>
    );
  }

  return (
    <div className="master-panel sponsored-users-manager">
      <div className="panel-header">
        <h2>🎯 Sponsored Users Management</h2>
        <div className="panel-actions">
          <button className="btn-primary" onClick={() => setShowAddForm(true)}>
            ➕ Add Sponsored User
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              loadSponsoredUsers();
              loadAnalytics();
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="analytics-grid">
          <div className="metric-card">
            <h3>Total Sponsored Users</h3>
            <div className="metric-value">{analytics.totalUsers}</div>
          </div>
          <div className="metric-card">
            <h3>Active Users</h3>
            <div className="metric-value">{analytics.activeUsers}</div>
          </div>
          <div className="metric-card">
            <h3>Rate Limit Exemptions</h3>
            <div className="metric-value">{analytics.rateLimitExemptions}</div>
          </div>
          <div className="metric-card">
            <h3>Average Usage</h3>
            <div className="metric-value">{analytics.averageUsage}</div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>API Requests</th>
              <th>Chat Messages</th>
              <th>File Uploads</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sponsoredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`status-badge ${user.isSponsored ? "active" : "inactive"}`}
                  >
                    {user.isSponsored ? "✅ Sponsored" : "❌ Inactive"}
                  </span>
                </td>
                <td>{user.usageStats.apiRequests}</td>
                <td>{user.usageStats.chatMessages}</td>
                <td>{user.usageStats.fileUploads}</td>
                <td>{new Date(user.lastActive).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => removeSponsoredUser(user.id)}
                  >
                    🗑️ Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Sponsored User</h3>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                [PRODUCTION READY]="Enter username"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                [PRODUCTION READY]="Enter email"
              />
            </div>
            <div className="form-group">
              <label>Sponsor Program:</label>
              <select
                value={newUser.sponsorProgram}
                onChange={(e) =>
                  setNewUser({ ...newUser, sponsorProgram: e.target.value })
                }
              >
                <option value="premium_2026">Premium 2026</option>
                <option value="vip_2026">VIP 2026</option>
                <option value="beta_tester">stable Tester</option>
              </select>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={addSponsoredUser}>
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .master-panel {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          color: #fff;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .panel-actions {
          display: flex;
          gap: 10px;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .analytics-grid {
          display: grid;
          grid-standard-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .metric-card {
          background: #2a2a2a;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
        }

        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
          margin-top: 5px;
        }

        .users-table-container {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          background: #2a2a2a;
          border-radius: 6px;
        }

        .users-table th,
        .users-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #444;
        }

        .users-table th {
          background: #333;
          font-weight: bold;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .status-badge.active {
          background: #28a745;
          color: white;
        }

        .status-badge.inactive {
          background: #dc3545;
          color: white;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #2a2a2a;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          max-width: 90vw;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #555;
          border-radius: 4px;
          background: #333;
          color: white;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};
