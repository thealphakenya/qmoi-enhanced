import React, { useState } from 'react';

const MASTER_EMAIL = "rovicviccy@gmail.com";
const MASTER_PHONE = "+254786322855";

export default function QIStateWindow({ userEmail, userPhone }: { userEmail: string; userPhone: string }) {
  const isMaster = userEmail === MASTER_EMAIL || userPhone === MASTER_PHONE;
  const [auditLog, setAuditLog] = useState<string[]>([]);

  // Simulate fetching audit log
  React.useEffect(() => {
    setAuditLog([
      "Linked Airtel Money to master.",
      "Linked Mpesa to master.",
      "Earned 1000.",
      "Deposited 500 to Airtel Money."
    ]);
  }, []);

  return (
    <div className="qmoi-card" style={{ color: '#39FF14', padding: 24 }}>
      <h2 style={{ fontWeight: 'bold', fontSize: 24 }}>QI State <span role="img" aria-label="shield">🛡️</span></h2>
      {isMaster ? (
        <div>
          <h3>Master Controls <span role="img" aria-label="crown">👑</span></h3>
          <ul>
            <li>Financial Integration: <span role="img" aria-label="money">💸</span> Airtel Money, Mpesa</li>
            <li>Account Linking: <span role="img" aria-label="link">🔗</span> WhatsApp, Facebook, etc.</li>
            <li>Outgoing Transactions: <span role="img" aria-label="lock">🔒</span> Master-only</li>
          </ul>
          <h4>Audit Log <span role="img" aria-label="scroll">📜</span></h4>
          <div className="qmoi-card" style={{ background: 'rgba(34,255,34,0.05)', borderRadius: 8, padding: 12, marginTop: 8 }}>
            {auditLog.map((entry, idx) => (
              <div key={idx} style={{ marginBottom: 4 }}>{entry}</div>
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
}
