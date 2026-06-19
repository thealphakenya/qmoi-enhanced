"use client";

import { useState } from "react";
import { usePrivacyMask } from "@/app/hooks/usePrivacyMask";

export default function PrivacyMaskSettings() {
  const { status, getPrivacyMaskStatus, enablePrivacyMask, disablePrivacyMask, loading, error } = usePrivacyMask();
  const [level, setLevel] = useState<"basic" | "full">("basic");

  return (
    <section className="rounded-lg border border-slate-300 p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold">Privacy Mask Settings</h2>
      <p className="mt-2 text-sm text-slate-600">Control how your data is anonymized during active sessions.</p>

      <div className="mt-4 grid gap-3">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Privacy Level</span>
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value as "basic" | "full")}
            className="rounded border px-3 py-2"
          >
            <option value="basic">Basic (Name / Email masked)</option>
            <option value="full">Full (All PII anonymized)</option>
          </select>
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => enablePrivacyMask(level)}
            disabled={loading}
            className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            Enable Privacy Mask
          </button>
          <button
            onClick={disablePrivacyMask}
            disabled={loading}
            className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-50 disabled:opacity-50"
          >
            Disable Privacy Mask
          </button>
          <button
            onClick={getPrivacyMaskStatus}
            disabled={loading}
            className="rounded border border-slate-300 px-4 py-2 hover:bg-slate-50 disabled:opacity-50"
          >
            Refresh Status
          </button>
        </div>

        {status ? (
          <div className="rounded border border-slate-200 bg-slate-50 p-4">
            <p className="font-medium">Current Status</p>
            <p>{status.enabled ? `Enabled (${status.level})` : "Disabled"}</p>
            <p>{status.message}</p>
          </div>
        ) : null}

        {error ? <div className="rounded border border-red-200 bg-red-50 p-3 text-red-800">{error}</div> : null}
      </div>
    </section>
  );
}
