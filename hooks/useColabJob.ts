import { useState, useCallback } from "react";

export function useColabJob() {
  const [jobStatus, setJobStatus] = useState<"idle"|"running"|"success"|"error">("idle");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Start a Colab job (simulate API call)
  const startJob = useCallback(async (payload: any) => {
    setJobStatus("running");
    setError(null);
    try {
      // TODO: Replace with real Colab API integration
      const res = await fetch("/api/colab-job", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setResult(data);
      setJobStatus("success");
    } catch (e: any) {
      setError(e.message);
      setJobStatus("error");
    }
  }, []);

  return { jobStatus, result, error, startJob };
}
