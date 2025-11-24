import { useEffect } from 'react';

export function useGithubRepoManager() {
  useEffect(() => {
    // Poll backend for GitHub repo tasks (clone, view, modify, fix)
    const interval = setInterval(async () => {
      const res = await fetch('/api/qmoi-model?githubTasks=1', {
        headers: { 'x-admin-token': localStorage.getItem('adminToken') || '' },
      });
      const data = await res.json();
      if (data.repos && data.repos.length) {
        for (const repo of data.repos) {
          await fetch('/api/qmoi-model?manageRepo=1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': localStorage.getItem('adminToken') || '' },
            body: JSON.stringify({ repo }),
          });
        }
      }
    }, 120000);
    return () => clearInterval(interval);
  }, []);
}
