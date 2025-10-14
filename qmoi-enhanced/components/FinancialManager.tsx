import React, { useState, useEffect } from "react";
import { useAuth } from "../src/hooks/useAuth";

export function FinancialManager() {
  const { user } = useAuth();
  const [status, setStatus] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/financial/audit")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs);
      });
    fetch("/api/financial/transactions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTransactions(data.transactions);
      });
  }, []);

  const verify = async (service: string) => {
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/financial/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, account: user?.email }),
    });
    const data = await res.json();
    setStatus(data.success ? data.result : data.error);
    setLoading(false);
    // Refresh logs
    fetch("/api/financial/audit")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs);
      });
  };

  const handleTransaction = async (
    id: string,
    action: "approve" | "reject",
  ) => {
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/financial/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    const data = await res.json();
    setStatus(data.message);
    setLoading(false);
    // Refresh logs and transactions
    fetch("/api/financial/audit")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs);
      });
    fetch("/api/financial/transactions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTransactions(data.transactions);
      });
  };

  if (!user || user.role !== "master") return null;

  return (
    <div>
      <h2>Financial Manager (Master Only)</h2>
      <section>
        <h3>Account Status</h3>
        <div>
          Airtel Money: <span>Not Connected</span>
        </div>
        <div>
          Mpesa: <span>Not Connected</span>
        </div>
        <button disabled={loading} onClick={() => verify("airtel")}>
          Verify Airtel Money
        </button>
        <button disabled={loading} onClick={() => verify("mpesa")}>
          Verify Mpesa
        </button>
        <div>Status: {status}</div>
      </section>
      <section>
        <h3>Transactions</h3>
        <table
          style={{ width: "100%", background: "#fafafa", marginBottom: 8 }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.id}</td>
                <td>{txn.type}</td>
                <td>{txn.amount}</td>
                <td>{txn.status}</td>
                <td>
                  {txn.status === "pending" && (
                    <>
                      <button
                        disabled={loading}
                        onClick={() => handleTransaction(txn.id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        disabled={loading}
                        onClick={() => handleTransaction(txn.id, "reject")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3>Audit Log</h3>
        <div
          style={{
            maxHeight: 120,
            overflow: "auto",
            background: "#f5f5f5",
            padding: 8,
          }}
        >
          {logs.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
