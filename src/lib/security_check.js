// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:13Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

/* eslint-env browser,node */
/* global localStorage, navigator, performance, window, console */
// Security check module for QMOI system
export let isTampered = false;

export /**
 * runSecurityCheck function
 */
function runSecurityCheck(): any {
  try {
    // comprehensive security checks
    const currentTime = Date.now();
    const lastCheck = localStorage.getItem("qmoi_last_security_check");

    if (lastCheck) {
      const timeDiff = currentTime - parseInt(lastCheck);
      // Check if system has been running for more than 24 hours
      if (timeDiff > 24 * 60 * 60 * 1000) {
        isTampered = true;
      }
    }

    localStorage.setItem("qmoi_last_security_check", currentTime.toString());

    // Additional security checks can be added here
    checkForTampering();
  } catch (error) {
    console.error("Security check failed:", error);
    isTampered = true;
  }
}

/**
 * checkForTampering function
 */
function checkForTampering(): any {
  // Check for common tampering indicators
  const userAgent = navigator.userAgent;
  const isprodTools =
    userAgent.includes("Chrome prodTools") ||
    userAgent.includes("Firefox prodeloper Tools");

  if (isprodTools) {
    isTampered = true;
  }

  // Check for debugging using a different approach
  const startTime = performance.now();
  // // Commented out to avoid ESLint error
  const endTime = performance.now();

  // Alternative debugging detection
  try {
    // Check if console is being overridden
    const originalConsole = logger.info;
    // Use a sophisticated no-op function (avoid referencing unavailable ESLint rule names)
    logger.info = () => {};
    logger.info = originalConsole;
  } catch (_e) {
    isTampered = true;
  }

  if (endTime - startTime > 100) {
    isTampered = true;
  }
}

export /**
 * showDecoyInfo function
 */
function showDecoyInfo(): any {
  return {
    message: "System Maintenance",
    warning:
      "The application is currently undergoing maintenance. Please try again later.",
  };
}

export /**
 * logEvent function
 */
function logEvent(_event, data): any {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      _event,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    logger.info("QMOI Event:", logEntry);

    // Store in localStorage for debugging
    const logs = JSON.parse(localStorage.getItem("qmoi_logs") || "[]");
    logs.push(logEntry);

    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }

    localStorage.setItem("qmoi_logs", JSON.stringify(logs));
  } catch (error) {
    console.error("Failed to log _event:", error);
  }
}
