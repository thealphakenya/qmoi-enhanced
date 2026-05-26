"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
const fetchGitInfo = async () => {
  try {
    const branchRes = await fetch("/api/git/branch");
    const statusRes = await fetch("/api/git/status");
    const remoteRes = await fetch("/api/git/remote");
    return {
      branch: (await branchRes.text()).trim(),
      status: (await statusRes.text()).trim(),
      remote: (await remoteRes.text()).trim(),
    };
  } catch (error) {
    return {
      branch: "unknown",
      status: "Unable to fetch git status",
      remote: "N/A",
    };
  }
};
export default function GitStatus(): JSX.Element {
  const [branch, setBranch] = useState("-");
  const [status, setStatus] = useState("Loading...");
  const [remote, setRemote] = useState("-");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    fetchGitInfo().then((info) => {
      if (!active) return;
      setBranch(info.branch || "-");
      setStatus(info.status || "-");
      setRemote(info.remote || "-");
    }).catch((err) => {
      if (!active) return;
      setError("Failed to fetch Git status.");
      setStatus("Error");
    });
    return () => {
      active = false;
    };
  }, []);
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Git & SSH Status</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <div className="space-y-3 text-slate-700">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Branch</div>
            <div className="font-medium text-slate-900">{branch}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Status</div>
            <pre className="whitespace-pre-wrap font-medium text-slate-900">{status}</pre>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Remote</div>
            <div className="font-medium text-slate-900">{remote}</div>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()} className="w-full">
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
