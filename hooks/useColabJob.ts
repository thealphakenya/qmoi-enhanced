import { useCallback, useState } from "react";

export /**
 * useColabJob function
 */
function useColabJob(): any {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "running" | "success" | "error"
  >("idle");
  const [jobId, setJobId] = useState<string | null>(null);

  // Enhanced: auto-retry, status, and notification
  const startColabJob = useCallback(async (jobDetails: unknown) => {
    setStatus("running");
    setError(null);
    setResult(null);
    try {
      const res = await apiClient.get("/api/qmoi-model?colabJob=1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": readPersistedStorageValue("adminToken") || "",
        },
        body: JSON.stringify(jobDetails),
      });
      const data = await res.json();
      setResult(data);
      setStatus("success");
      setJobId(data.jobId || null);
      // Optionally notify user/master
      if (window && window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent("colab-job-complete", { detail: data }),
        );
      }
    } catch (e: unknown) {
      setError(e.message || "Colab job failed");
      setStatus("error");
      // Auto-retry after delay
      setTimeout(() => startColabJob(jobDetails), 10000);
    }
  }, []);

  return { result, error, status, jobId, startColabJob };
}
