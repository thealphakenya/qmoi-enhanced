import { useEffect, useState } from 'react';

export function useVSCodeProblems() {
  const [problems, setProblems] = useState([]);
  useEffect(() => {
    // Poll backend for hook diagnostics and problems
    const interval = setInterval(async () => {
      const res = await fetch('/api/qmoi-model?hookDiagnostics=1', {
        method: 'POST',
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json();
      if (data.status === 'hooks-enhanced') {
        // Optionally notify user or update UI
        if (window && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('ai-hook-enhanced', { detail: data }));
        }
      }
      setProblems(data.problems || []);
    }, 15000);
    return () => clearInterval(interval);
  }, []);
  return problems;
}
