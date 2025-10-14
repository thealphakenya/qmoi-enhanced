import React, { useState } from "react";

export const AWSCredentialsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSave: (creds: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  }) => void;
}> = ({ open, onClose, onSave }) => {
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("");
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#0008",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 8,
          maxWidth: 400,
        }}
      >
        <h2>AWS Credentials</h2>
        <input
          placeholder="Access Key ID"
          value={accessKeyId}
          onChange={(e) => setAccessKeyId(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          placeholder="Secret Access Key"
          value={secretAccessKey}
          onChange={(e) => setSecretAccessKey(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
          type="password"
        />
        <input
          placeholder="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => onSave({ accessKeyId, secretAccessKey, region })}
            style={{ marginRight: 8 }}
          >
            Save
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
