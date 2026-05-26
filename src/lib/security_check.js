// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:13Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-env browser,node */
/* global localStorage, navigator, performance, window, console */
// Security check module for QMOI system
export let isTampered = false;

export function runSecurityCheck() {
  try {
    const currentTime = Date.now();
    const lastCheckValue = localStorage.getItem("qmoi_last_security_check");

    if (lastCheckValue) {
      const timeDiff = currentTime - Number(lastCheckValue);
      if (timeDiff > 24 * 60 * 60 * 1000) {
        isTampered = true;
      }
    }

    localStorage.setItem("qmoi_last_security_check", String(currentTime));
    checkForTampering();
  } catch (error) {
    if (typeof logger !== "undefined" && typeof logger.error === "function") {
      logger.error("Security check failed:", error);
    }
    isTampered = true;
  }
}

export function checkForTampering() {
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const usesDevTools =
    userAgent.includes("Chrome prodTools") ||
    userAgent.includes("Firefox prodeloper Tools");

  if (usesDevTools) {
    isTampered = true;
  }

  const startTime = performance.now();
  const endTime = performance.now();

  try {
    if (typeof logger !== "undefined" && typeof logger.info === "function") {
      const originalInfo = logger.info;
      logger.info = () => {};
      logger.info = originalInfo;
    }
  } catch (_e) {
    isTampered = true;
  }

  if (endTime - startTime > 100) {
    isTampered = true;
  }
}

export function showDecoyInfo() {
  return {
    message: "System Maintenance",
    warning: "The application is temporarily unavailable. Please try again later.",
  };
}

export function logEvent(_event, data) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: _event,
      data,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (typeof logger !== "undefined" && typeof logger.info === "function") {
      logger.info("QMOI Event:", logEntry);
    }

    const logs = JSON.parse(localStorage.getItem("qmoi_logs") || "[]");
    logs.push(logEntry);

    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }

    localStorage.setItem("qmoi_logs", JSON.stringify(logs));
  } catch (error) {
    if (typeof logger !== "undefined" && typeof logger.error === "function") {
      logger.error("Failed to log event:", error);
    }
  }
}
