"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
const mockUser = {
  id: "master-1",
  username: "masteruser",
  role: "master",
};
export default function WhatsAppBusinessPanel(): JSX.Element | null {
  const [status, setStatus] = useState("Not connected");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function loadAudit() {
      try {
        const response = await fetch("/api/whatsapp/audit");
        const data = await response.json();
        setLogs(data.logs || []);
      } catch (err) {
        setError("Unable to load WhatsApp audit logs.");
      }
    }
    loadAudit();
  }, []);
  const verify = async () => {
    setLoading(true);
    setStatus("Verifying account...");
    setError(null);
    try {
      const response = await fetch("/api/whatsapp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setStatus(data.success ? data.result : data.error || "Verification failed.");
      if (!data.success) {
        setError(data.error || "Verification failed.");
      }
      const auditResponse = await fetch("/api/whatsapp/audit");
      const auditData = await auditResponse.json();
      setLogs(auditData.logs || []);
    } catch (err) {
      setError("WhatsApp verification request failed.");
      setStatus("Verification failed.");
    } finally {
      setLoading(false);
    }
  };
  if (!mockUser || mockUser.role !== "master") {
    return null;
  }
  return (
    <Card className="space-y-4 p-6">
      <CardHeader>
        <CardTitle>WhatsApp Business Automation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <section className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Connection Status</h3>
              <p className="text-sm text-slate-600">Verify your WhatsApp Business integration and check connectivity.</p>
            </div>
            <Button onClick={verify} disabled={loading}>
              {loading ? "Verifying..." : "Verify Account"}
            </Button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <div className="font-medium">Status</div>
            <div>{status}</div>
          </div>
        </section>
        <section className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-base font-semibold text-slate-900">Business Controls</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button type="button">Manage Ads</Button>
            <Button type="button">Update Status</Button>
            <Button type="button">Configure Auto-Reply</Button>
          </div>
        </section>
        <section className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-base font-semibold text-slate-900">Audit Log</h3>
          <div className="max-h-44 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            {logs.length > 0 ? (
              logs.map((line, index) => <div key={index}>{line}</div>)
            ) : (
              <div className="text-slate-500">No audit log entries available.</div>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
