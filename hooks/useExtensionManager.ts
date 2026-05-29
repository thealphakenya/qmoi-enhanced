import { useState } from "react";

export /**
 * useExtensionManager function
 */
function useExtensionManager(): any {
  const [extensions, setExtensions] = useState<any[]>([]);
  const [status, setStatus] = useState<
    "idle" | "installing" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const installExtension = async (ext: string) => {
    setStatus("installing");
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setExtensions((prev) => [prev, ext]);
      setStatus("success");
    } catch (e: unknown) {
      setError(e.message);
      setStatus("error");
    }
  };

  return { extensions, status, error, installExtension };
}
