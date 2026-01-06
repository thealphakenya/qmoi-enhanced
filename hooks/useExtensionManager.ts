import { useState } from "react";

export function useExtensionManager() {
  const [extensions, setExtensions] = useState<any[]>([]);
  const [status, setStatus] = useState<
    "idle" | "installing" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  // Simulate install (replace with Colab/real API)
  const installExtension = async (repoUrl: string) => {
    setStatus("installing");
    setError(null);
    try {
      const res = await fetch("/api/extensions/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data._error || data.details || "Install failed");
        setStatus("error");
        return;
      }

      // On success, record installed extension
      setExtensions((prev) => [...prev, repoUrl]);
      setStatus("success");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      setStatus("error");
    }
  };

  return { extensions, status, error, installExtension };
}
