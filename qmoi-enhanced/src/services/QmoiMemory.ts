
export class QmoiMemory {
  // Save memory and sync across all repos and .md files
  static async save(key: string, value: unknown, user?: string, project?: string) {
    const entry = {
      key,
      value,
      user: user || "",
      project: project || "",
      timestamp: new Date().toISOString(),
    };
    // Save locally
    await fetch('/api/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    // Auto-update TRACKS.md and ALLMDFILESREFS.md
    await fetch('/api/md-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'log-track', entry }),
    });

    // Sync with all listed repos (local and remote)
    const repos = [
      'thealphakenya/qmoi-enhanced',
      'thealphakenya/qmoi-enhanced-new-clean',
      'thealphakenya/Alpha-Q-ai',
      'thealphakenya/qcity-main',
      'thealphakenya/qmoi-space',
    ];
    for (const repo of repos) {
      await fetch('/api/repo-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo, entry }),
      });
    }
  }

  // List memory entries (local and optionally cross-repo)
  static async list(user?: string, crossRepo?: boolean) {
    let local = [];
    const res = await fetch(`/api/memory?user=${user || ''}`);
    if (res.ok) local = await res.json();
    if (!crossRepo) return local;
    // Fetch from synced repos
    const repos = [
      'thealphakenya/qmoi-enhanced',
      'thealphakenya/qmoi-enhanced-new-clean',
      'thealphakenya/Alpha-Q-ai',
      'thealphakenya/qcity-main',
      'thealphakenya/qmoi-space',
    ];
    let all = [...local];
    for (const repo of repos) {
      try {
        const r = await fetch(`/api/repo-memory?repo=${repo}&user=${user || ''}`);
        if (r.ok) {
          const data = await r.json();
          all = all.concat(data);
        }
      } catch {
        // Ignore repo fetch errors
      }
    }
    return all;
  }

  // Auto-add new .md files and update ALLMDFILESREFS.md everywhere
  static async addMdFile(filePath: string, description: string) {
    await fetch('/api/md-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add-md-file', filePath, description }),
    });
    // Sync to all repos
    const repos = [
      'thealphakenya/qmoi-enhanced',
      'thealphakenya/qmoi-enhanced-new-clean',
      'thealphakenya/Alpha-Q-ai',
      'thealphakenya/qcity-main',
      'thealphakenya/qmoi-space',
    ];
    for (const repo of repos) {
      await fetch('/api/repo-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo, filePath, description }),
      });
    }
  }
}
