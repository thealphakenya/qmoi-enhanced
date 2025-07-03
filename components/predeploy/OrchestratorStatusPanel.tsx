import React from "react";

export interface OrchestratorStatus {
  env: 'success' | 'warning' | 'error';
  lint: 'success' | 'warning' | 'error';
  test: 'success' | 'warning' | 'error';
  build: 'success' | 'warning' | 'error';
  audit: 'success' | 'warning' | 'error';
  fix: 'success' | 'warning' | 'error';
  deploy: 'success' | 'warning' | 'error';
}

const statusColor = (s: string) => s === 'success' ? '#4caf50' : s === 'warning' ? '#ff9800' : '#f44336';

export const OrchestratorStatusPanel: React.FC<{ status: OrchestratorStatus }> = ({ status }) => (
  <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
    <h4>QMOI Pre-Deploy Orchestrator Status</h4>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {Object.entries(status).map(([k, v]) => (
        <li key={k} style={{ marginBottom: 6 }}>
          <span style={{ width: 80, display: 'inline-block', textTransform: 'capitalize' }}>{k}:</span>
          <span style={{ color: statusColor(v) }}>{v}</span>
        </li>
      ))}
    </ul>
  </div>
); 