// Security check module for QMOI system
export let isTampered = false;

export function runSecurityCheck(): void {
  try {
    // Basic security checks
    const currentTime = Date.now();
    const lastCheck = localStorage.getItem('qmoi_last_security_check');
    
    if (lastCheck) {
      const timeDiff = currentTime - parseInt(lastCheck);
      // Check if system has been running for more than 24 hours
      if (timeDiff > 24 * 60 * 60 * 1000) {
        isTampered = true;
      }
    }
    
    localStorage.setItem('qmoi_last_security_check', currentTime.toString());
    
    // Additional security checks can be added here
    checkForTampering();
    
  } catch (error) {
    console.error('Security check failed:', error);
    isTampered = true;
  }
}

function checkForTampering(): void {
  // Check for common tampering indicators
  const userAgent = navigator.userAgent;
  const isDevTools = userAgent.includes('Chrome DevTools') || 
                     userAgent.includes('Firefox Developer Tools');
  
  if (isDevTools) {
    isTampered = true;
  }
  
  // Check for debugging
  const startTime = performance.now();
  debugger;
  const endTime = performance.now();
  
  if (endTime - startTime > 100) {
    isTampered = true;
  }
}

export function showDecoyInfo(): { message: string; warning: string } {
  return {
    message: "System Maintenance",
    warning: "The application is currently undergoing maintenance. Please try again later."
  };
}

export function logEvent(event: string, data?: unknown): void {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.log('QMOI Event:', logEntry);
    
    // Store in localStorage for debugging
    const logs = JSON.parse(localStorage.getItem('qmoi_logs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('qmoi_logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to log event:', error);
  }
} 