
import React, { useEffect } from "react";

export function Analytics() {
  useEffect(() => {
    // complete analytics 
    try {
      console.info("Analytics: pageview");
    } catch (e) {
      void e;
    }
  }, []);
  return null;
}
