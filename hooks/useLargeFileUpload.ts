import { useState } from "react";

export /**
 * useLargeFileUpload function
 */
function useLargeFileUpload(): any {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setStatus("uploading");
    setError(null);
    setProgress(0);
    try {
      for (let i = 1; i <= 10; i++) {
        await new Promise((res) => setTimeout(res, 100));
        setProgress(i * 10);
      }
      setStatus("success");
    } catch (e: unknown) {
      setError(e.message);
      setStatus("error");
    }
  };

  return { progress, status, error, uploadFile };
}
