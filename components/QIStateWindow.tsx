// QMOI EVOLUTION ENHANCED: Production-ready QI state window component
import React, { useEffect, useState } from "react";

type Props = {
  userEmail?: string;
  userPhone?: string;
};

const QIStateWindow: React.FC<Props> = ({ userEmail = "", userPhone = "" }) => {
  const MASTER_EMAIL = process.env.NEXT_PUBLIC_MASTER_EMAIL || "";
  const MASTER_PHONE = process.env.NEXT_PUBLIC_MASTER_PHONE || "";

  const isMaster = userEmail === MASTER_EMAIL || userPhone === MASTER_PHONE;

  const [auditLog, setAuditLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchAuditLog = async () => {
      try {
        const res = await fetch("/api/audit");
        if (!res.ok) throw new Error(`Failed to load audit log: ${res.status}`);
        const data = await res.json();
        const entries: string[] = Array.isArray(data) ? data : data?.entries || [];
        if (mounted) setAuditLog(entries.map(String));
      } catch (err: any) {
        if (mounted) setError(String(err?.message || err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAuditLog();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      style={{
        background: "#101010",
        color: "#39FF14",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <h2 style={{ fontWeight: "bold", fontSize: 24 }}>
        QI State <span role="img" aria-label="shield">🛡️</span>
      </h2>

      {isMaster ? (
        <div>
          <h3>
            Master Controls <span role="img" aria-label="crown">👑</span>
          </h3>
          <ul>
            <li>
              Financial Integration: <span role="img" aria-label="money">💸</span> (Airtel Money,
              Mpesa)
            </li>
            <li>
              Account Linking: <span role="img" aria-label="link">🔗</span> WhatsApp, Facebook,
              etc.
            </li>
            <li>
              Outgoing Transactions: <span role="img" aria-label="lock">🔒</span> Master-only
            </li>
          </ul>

          <h4>
            Audit Log <span role="img" aria-label="scroll">📜</span>
          </h4>

          <div style={{ background: "#222", borderRadius: 8, padding: 12, marginTop: 8 }}>
            {loading && <div>Loading audit log...</div>}
            {error && <div style={{ color: "#ff6b6b" }}>Error: {error}</div>}
            {!loading && !error && auditLog.length === 0 && <div>No audit entries found.</div>}
            {!loading && auditLog.map((entry, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                {entry}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <span role="img" aria-label="lock">🔒</span> Master-only features hidden.
        </div>
      )}
    </div>
  );
};

export default QIStateWindow;
