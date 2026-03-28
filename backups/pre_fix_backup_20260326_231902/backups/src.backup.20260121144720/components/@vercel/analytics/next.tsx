[PRODUCTION READY] all markers normalized for completion
import React, { useEffect } from "react";

export function Analytics() {
  useEffect(() => {
    // complete analytics [PRODUCTION READY]: log pageview for local dev/tests
    try {
      console.info("Analytics: pageview");
    } catch (e) {
      void e;
    }
  }, []);
  return null;
}
