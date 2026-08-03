import React, { useState } from "react";

export interface OrchestratorStatus {
  env: "success" | "warning" | "error";
  lint: "success" | "warning" | "error";
  test: "success" | "warning" | "error";
  build: "success" | "warning" | "error";
  audit: "success" | "warning" | "error";
  fix: "success" | "warning" | "error";
  deploy: "success" | "warning" | "error";
}

const statusColor = (s: string) =>
  s === "success" ? "#4caf50" : s === "warning" ? "#ff9800" : "#f44336";

const mockAgents = [
  {
    id: "a1",
    name: "Agent Alpha",
    status: "active",
    assignedDevice: "Device 1",
  },
  {
    id: "a2",
    name: "Agent Beta",
    status: "standby",
    assignedDevice: "Device 2",
  },
  {
    id: "a3",
    name: "Agent Gamma",
    status: "failed",
    assignedDevice: "Device 3",
  },
];
const mockDevices = ["Device 1", "Device 2", "Device 3", "Device 4"];

export const OrchestratorStatusPanel: React.FC<{
  status: OrchestratorStatus;
}> = ({ status }) => {
  const [agents, setAgents] = useState(mockAgents);
  const [failoverLoading, setFailoverLoading] = useState<string | null>(null);

  function handleAssign(agentId: string, device: string) {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId ? { ...a, assignedDevice: device } : a,
      ),
    );
    // Stub: backend call
  }

  function handleFailover(agentId: string) {
    setFailoverLoading(agentId);
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentId
            ? { ...a, status: "standby", assignedDevice: "" }
            : a,
        ),
      );
      setFailoverLoading(null);
    }, 1000);
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
      }}
      aria-label="Orchestration Status Panel"
    >
      <h4>QMOI Pre-Deploy Orchestrator Status</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.entries(status).map(([k, v]) => (
          <li key={k} style={{ marginBottom: 6 }}>
            <span
              style={{
                width: 80,
                display: "inline-block",
                textTransform: "capitalize",
              }}
            >
              {k}:
            </span>
            <span style={{ color: statusColor(v) }}>{v}</span>
          </li>
        ))}
      </ul>
      <hr style={{ margin: "16px 0" }} />
      <h5>Agent/Device Orchestration</h5>
      <table
        style={{ width: "100%", fontSize: 14 }}
        aria-label="Agent Device Table"
      >
        <thead>
          <tr>
            <th>Agent</th>
            <th>Status</th>
            <th>Assigned Device</th>
            <th>Assign/Reassign</th>
            <th>Failover</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.name}</td>
              <td>
                <span
                  style={{
                    color:
                      agent.status === "active"
                        ? "#4caf50"
                        : agent.status === "standby"
                          ? "#ff9800"
                          : "#f44336",
                  }}
                >
                  {agent.status}
                </span>
              </td>
              <td>
                {agent.assignedDevice || (
                  <span style={{ color: "#aaa" }}>None</span>
                )}
              </td>
              <td>
                <select
                  value={agent.assignedDevice}
                  onChange={(e) => handleAssign(agent.id, e.target.value)}
                  aria-label={`Assign device to ${agent.name}`}
                  style={{ minWidth: 100 }}
                >
                  <option value="">-- Select Device --</option>
                  {mockDevices.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  onClick={() => handleFailover(agent.id)}
                  disabled={failoverLoading === agent.id}
                  aria-label={`Trigger failover for ${agent.name}`}
                  style={{
                    background: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                >
                  {failoverLoading === agent.id
                    ? "Failing over..."
                    : "Failover"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
