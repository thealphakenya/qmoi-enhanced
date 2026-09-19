import React, { useEffect } from "react";

export function Analytics() {
  useEffect(() => {
    // Minimal analytics stub: log pageview for local dev/tests
    try {
      console.info("Analytics: pageview");
    } catch (e) {
      void e;
    }
  }, []);
  return null;
}
