import React, { useState } from "react";

export const GCPCredentialsModal: React.FC<{ open: boolean; onClose: () => void; onSave: (creds: { projectId: string; keyFilename: string }) => void }> = ({ open, onClose, onSave }) => {
  const [projectId, setProjectId] = useState("");
  const [keyFilename, setKeyFilename] = useState("");
  if (!open) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0008", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", padding: 32, borderRadius: 8, maxWidth: 400 }}>
        <h2>GCP Credentials</h2>
        <input placeholder="Project ID" value={projectId} onChange={e => setProjectId(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
        <input placeholder="Key Filename" value={keyFilename} onChange={e => setKeyFilename(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
        <div style={{ marginTop: 12 }}>
          <button onClick={() => onSave({ projectId, keyFilename })} style={{ marginRight: 8 }}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}; 