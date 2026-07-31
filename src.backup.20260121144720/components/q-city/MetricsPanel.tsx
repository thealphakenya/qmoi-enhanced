import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /home/runner/work/qmoi-enhanced/qmoi-enhanced/backups/src.backup.20260121144720/components/q-city/MetricsPanel.tsx -->
import React, { useEffect, useState } from "react";

export default function MetricsPanel() {
  type Metrics = {
    hostname?: string;
    platform?: string;
    arch?: string;
    uptime?: number;
    cpus?: unknown[];
    load?: number[];
    totalMem?: number;
    freeMem?: number;
  };
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    setLoading(true);
    fetch("/api/qcity/metrics", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((r) => r.json())
      .then((data: unknown) => setMetrics(data as Metrics))
      .catch((_e: unknown) => {
        const msg =
          _e && typeof _e === "object" && "message" in _e
            ? String((_e as { message?: unknown }).message)
            : String(_e);
        console.warn(msg);
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">System Metrics</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        metrics && (
          <div className="text-xs text-gray-300">
            <div>Hostname: {metrics.hostname ?? ""}</div>
            <div>
              Platform: {metrics.platform ?? ""} ({metrics.arch ?? ""})
            </div>
            <div>
              Uptime: {metrics.uptime ? Math.round(metrics.uptime / 60) : 0} min
            </div>
            <div>CPU Cores: {metrics.cpus ? metrics.cpus.length : 0}</div>
            <div>Load Avg: {metrics.load ? metrics.load.join(", ") : ""}</div>
            <div>
              Total Mem:{" "}
              {metrics.totalMem ? (metrics.totalMem / 1e9).toFixed(2) : "0.00"}{" "}
              GB
            </div>
            <div>
              Free Mem:{" "}
              {metrics.freeMem ? (metrics.freeMem / 1e9).toFixed(2) : "0.00"} GB
            </div>
          </div>
        )
      )}
    </div>
  );
}
