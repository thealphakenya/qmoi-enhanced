import { useEffect } from "react";

interface GlobalFixResponse {
  status: string;
  time: string;
}

interface GlobalFixEventDetail extends GlobalFixResponse {
  // Add any additional properties that might be included in the event detail
}

export function useAutoFixAllProblems() {
  useEffect(() => {
    // Poll backend for all problems/errors and trigger auto-fix
    let retryCount = 0;
    const interval = setInterval(async () => {
      // Use new globalScanFix endpoint for robust global fixing
      const res = await fetch("/api/qmoi-model?globalScanFix=1", {
        method: "POST",
        headers: { "x-admin-token": localStorage.getItem("adminToken") || "" },
      });
      const data = (await res.json()) as GlobalFixResponse;
      if (data.status === "all-fixed") {
        // Optionally notify user or update UI
        if (window && window.dispatchEvent) {
          window.dispatchEvent(
            new CustomEvent("ai-global-fix", {
              detail: data as GlobalFixEventDetail,
            }),
          );
        }
        // UI notification
        if (
          window &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          new Notification("All problems auto-fixed by QMOI AI!");
        }
        // Log to console
        console.log("[QMOI] All problems auto-fixed.");
        retryCount = 0;
      } else {
        retryCount++;
        if (retryCount > 3) {
          // Retry more frequently if problems persist
          clearInterval(interval);
          setTimeout(() => {
            // Optionally, integrate WhatsApp/Slack notification here
            window.location.reload();
          }, 5000);
        }
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);
}
