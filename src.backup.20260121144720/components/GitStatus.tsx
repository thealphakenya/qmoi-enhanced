"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/GitStatus.tsx -->
"use client";
import React, { useState, useEffect } from "react";
import "./GitStatus.css";

interface GitStatusInfo {
  branch: string;
  isDirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  commits: number;
  remoteStatus: "up-to-date" | "ahead" | "behind" | "diverged";
}

export function GitStatus() {
  const [status, setStatus] = useState<GitStatusInfo>({
    branch: "feature/pwa-components",
    isDirty: true,
    stagedChanges: 3,
    unstagedChanges: 2,
    commits: 45,
    remoteStatus: "ahead",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production, fetch from backend git API endpoint
    const timer = setTimeout(() => {
      // Mock fetch or real API call
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus((prev) => ({
        ...prev,
        isDirty: !prev.isDirty,
      }));
      setLoading(false);
    }, 500);
  };

  const getRemoteStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "#4CAF50";
      case "ahead":
        return "#2196F3";
      case "behind":
        return "#FF9800";
      case "diverged":
        return "#F44336";
      default:
        return "#666";
    }
  };

  return (
    <div className="git-status-container">
      <div className="git-header">
        <h2>Git Status</h2>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>
      <div className="status-panel">
        <div className="status-item">
          <span className="label">Branch:</span>
          <span className="value branch-name">{status.branch}</span>
        </div>
        <div className="status-item">
          <span className="label">Status:</span>
          <span className={`value ${status.isDirty ? "dirty" : "clean"}`}>
            {status.isDirty ? "🔴 Dirty" : "🟢 Clean"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Remote:</span>
          <span
            className="value"
            style={{ color: getRemoteStatusColor(status.remoteStatus) }}
          >
            {status.remoteStatus === "up-to-date" && "✓ Up to date"}
            {status.remoteStatus === "ahead" && `⬆ Ahead by ${status.commits}`}
            {status.remoteStatus === "behind" && "⬇ Behind"}
            {status.remoteStatus === "diverged" && "⇅ Diverged"}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Changes:</span>
          <span className="value">
            Staged: {status.stagedChanges} | Unstaged: {status.unstagedChanges}
          </span>
        </div>
      </div>
    </div>
  );
}
