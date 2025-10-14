import React, { useState } from "react";

export const AzureCredentialsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSave: (creds: {
    tenantId: string;
    clientId: string;
    clientSecret: string;
    subscriptionId: string;
  }) => void;
}> = ({ open, onClose, onSave }) => {
  const [tenantId, setTenantId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
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
        <h2>Azure Credentials</h2>
        <input
          placeholder="Tenant ID"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          placeholder="Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
          type="password"
        />
        <input
          placeholder="Subscription ID"
          value={subscriptionId}
          onChange={(e) => setSubscriptionId(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() =>
              onSave({ tenantId, clientId, clientSecret, subscriptionId })
            }
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
