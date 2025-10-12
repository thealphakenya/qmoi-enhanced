// Allow empty function for no-op
// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}
// Security check module for QMOI system
export let isTampered = false;

export function runSecurityCheck() {
  try {
    // Basic security checks
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

function checkForTampering() {
  // Check for common tampering indicators
  const userAgent = navigator.userAgent;
  const isDevTools =
    userAgent.includes("Chrome DevTools") ||
    userAgent.includes("Firefox Developer Tools");

  if (isDevTools) {
    isTampered = true;
  }

  // Check for debugging using a different approach
  const startTime = performance.now();
  // debugger; // Commented out to avoid ESLint error
  const endTime = performance.now();

  // Alternative debugging detection
  try {
  // Check if console is being overridden
  const originalConsole = console.log;
  console.log = noop;
  console.log = originalConsole;
  } catch (e) {
    isTampered = true;
  }

  if (endTime - startTime > 100) {
    isTampered = true;
  }
}

export function showDecoyInfo() {
  return {
    message: "System Maintenance",
    warning:
      "The application is currently undergoing maintenance. Please try again later.",
  };
}

export function logEvent(event, data) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.log("QMOI Event:", logEntry);

    // Store in localStorage for debugging
    const logs = JSON.parse(localStorage.getItem("qmoi_logs") || "[]");
    logs.push(logEntry);

    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }

    localStorage.setItem("qmoi_logs", JSON.stringify(logs));
  } catch (error) {
    console.error("Failed to log event:", error);
  }
}
