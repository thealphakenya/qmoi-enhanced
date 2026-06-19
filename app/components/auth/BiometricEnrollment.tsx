"use client";

import { useState } from "react";
import { useBiometric } from "@/app/hooks/useBiometric";

export default function BiometricEnrollment() {
  const { getBiometricStatus, status, verifyBiometric, deleteBiometric, loading, error } = useBiometric();
  const [method, setMethod] = useState<"fingerprint" | "facial" | "voice">("fingerprint");
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    const result = await verifyBiometric(method, template);
    if (result?.verified) {
      setMessage(`Verified with confidence ${result.confidence}`);
    } else {
      setMessage(`Verification failed: ${result?.error || "Low confidence"}`);
    }
  };

  return (
    <section className="rounded-lg border border-slate-300 p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold">Biometric Authentication</h2>
      <p className="mt-2 text-sm text-slate-600">Use biometric verification for secure access.</p>

      <div className="mt-4 grid gap-3">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Biometric Method</span>
          <select value={method} onChange={(e) => setMethod(e.target.value as any)} className="rounded border px-3 py-2">
            <option value="fingerprint">Fingerprint</option>
            <option value="facial">Facial recognition</option>
            <option value="voice">Voice</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Template Data</span>
          <textarea
            value={template}
            onChange={(event) => setTemplate(event.target.value)}
            className="min-h-[120px] rounded border px-3 py-2"
            placeholder="Paste biometric data or template here"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button onClick={handleVerify} disabled={loading} className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50">
            Verify Biometric
          </button>
          <button onClick={getBiometricStatus} disabled={loading} className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-50 disabled:opacity-50">
            Refresh Status
          </button>
        </div>

        {status ? (
          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="font-medium">Enrollment Status</p>
            <p>{status.enrolled ? "Enrolled" : "Not enrolled"}</p>
            {status.methods.map((methodInfo) => (
              <div key={methodInfo.method} className="mt-2 rounded border border-slate-200 bg-white p-3">
                <p className="font-semibold">{methodInfo.method}</p>
                <p>Status: {methodInfo.enrolled ? "Active" : "Inactive"}</p>
                <p>Enrolled: {new Date(methodInfo.enrolledAt).toLocaleString()}</p>
                {methodInfo.lastVerifiedAt && <p>Last Verified: {new Date(methodInfo.lastVerifiedAt).toLocaleString()}</p>}
              </div>
            ))}
          </div>
        ) : null}

        {message ? <div className="rounded border border-indigo-200 bg-indigo-50 p-3 text-indigo-800">{message}</div> : null}
        {error ? <div className="rounded border border-red-200 bg-red-50 p-3 text-red-800">{error}</div> : null}
      </div>
    </section>
  );
}
