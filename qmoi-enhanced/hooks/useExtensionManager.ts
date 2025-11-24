import { useState } from "react";

export function useExtensionManager() {
  const [extensions, setExtensions] = useState<any[]>([]);
  const [status, setStatus] = useState<"idle"|"installing"|"success"|"error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Simulate install (replace with Colab/real API)
  const installExtension = async (ext: string) => {
    setStatus("installing");
    setError(null);
    try {
      // TODO: Integrate with Colab or backend
      await new Promise((res) => setTimeout(res, 1000));
      setExtensions((prev) => [...prev, ext]);
      setStatus("success");
    } catch (e: any) {
      setError(e.message);
      setStatus("error");
    }
  };

  return { extensions, status, error, installExtension };
}
