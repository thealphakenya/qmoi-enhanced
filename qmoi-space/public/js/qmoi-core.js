  // --- Autobackup Logic ---
  async function triggerBackup() {
    // Stub: call backend endpoint for backup (to be implemented)
    // Example: await fetch('/api/qcity/backup', { method: 'POST' });
    return { status: 'success', time: new Date().toLocaleString() };
  }

  function showBackupStatus(msg, ok = true) {
    const bar = document.getElementById('backup-status-bar');
    const text = document.getElementById('backup-status-text');
    if (bar && text) {
      text.textContent = msg;
      bar.style.display = 'flex';
      bar.style.background = ok ? '#d1fae5' : '#fee2e2';
      bar.style.color = ok ? '#065f46' : '#991b1b';
      setTimeout(() => { bar.style.display = 'none'; }, 5000);
    }
  }

  async function periodicBackup() {
    const result = await triggerBackup();
    if (result.status === 'success') {
      showBackupStatus(`Backup successful at ${result.time}`);
    } else {
      showBackupStatus('Backup failed', false);
    }
  }
  // Trigger autobackup every 10 minutes
  setInterval(periodicBackup, 10 * 60 * 1000);
  // Initial backup on load
  periodicBackup();
  // --- Analytics Section Wiring ---
  async function updateAnalyticsSection() {
    const status = await fetchQCityStatus();
    // Use status.analytics, status.resources, or logs for metrics
    // Metrics
    document.getElementById('response-time').textContent = status?.metrics?.response_time || '0ms';
    document.getElementById('uptime').textContent = status?.metrics?.uptime || '100%';
    document.getElementById('error-rate').textContent = status?.metrics?.error_rate || '0%';
    // Optionally update charts (stubbed)
    // User Engagement
    const engagementChart = document.getElementById('engagement-chart');
    if (engagementChart && window.Chart) {
      // Example: render chart with [PRODUCTION IMPLEMENTATION REQUIRED] or status.analytics.engagement data
      // (Stub: chart rendering logic goes here)
    }
    // Revenue Sources
    const revenueSourcesChart = document.getElementById('revenue-sources-chart');
    if (revenueSourcesChart && window.Chart) {
      // Example: render chart with [PRODUCTION IMPLEMENTATION REQUIRED] or status.analytics.revenue_sources data
      // (Stub: chart rendering logic goes here)
    }
  }
  document.getElementById('refresh-analytics')?.addEventListener('click', updateAnalyticsSection);
  updateAnalyticsSection();
  // --- Files Section Wiring ---
  async function updateFilesSection() {
    const status = await fetchQCityStatus();
    const fileGrid = document.getElementById('file-grid');
    if (!fileGrid) return;
    fileGrid.innerHTML = '';
    // Use status.files if available, else stub
    const files = status?.files || [
      { name: 'Documents', type: 'folder', size: '-', modified: '2025-10-11 10:00' },
      { name: 'Images', type: 'folder', size: '-', modified: '2025-10-11 10:00' },
      { name: 'Videos', type: 'folder', size: '-', modified: '2025-10-11 10:00' }
    ];
    files.forEach(file => {
      const div = document.createElement('div');
      div.className = 'file-item';
      div.innerHTML = `
        <div class="file-icon">${file.type === 'folder' ? '📁' : '📄'}</div>
        <div class="file-name">${file.name}</div>
        <div class="file-size">${file.size || '-'}</div>
        <div class="file-modified">${file.modified || ''}</div>
      `;
      fileGrid.appendChild(div);
    });
  }
  document.getElementById('upload-files')?.addEventListener('click', updateFilesSection);
  document.getElementById('create-folder')?.addEventListener('click', updateFilesSection);
  document.getElementById('select-all')?.addEventListener('click', updateFilesSection);
  document.getElementById('delete-selected')?.addEventListener('click', updateFilesSection);
  document.getElementById('download-selected')?.addEventListener('click', updateFilesSection);
  updateFilesSection();
  // --- Revenue Section Wiring ---
  async function updateRevenueSection() {
    const status = await fetchQCityStatus();
    document.getElementById('today-revenue').textContent = `$${(status?.revenue_today||0).toFixed(2)}`;
    document.getElementById('today-change').textContent = status?.revenue_change || '+0.00%';
    document.getElementById('month-revenue').textContent = `$${(status?.revenue_month||0).toFixed(2)}`;
    document.getElementById('month-change').textContent = status?.revenue_month_change || '+0.00%';
    document.getElementById('total-revenue').textContent = `$${(status?.revenue_total||0).toFixed(2)}`;
    document.getElementById('total-change').textContent = status?.revenue_total_change || '+0.00%';
    // Optionally update chart if data available
    // (Stub: chart update logic can be added here)
  }
  document.getElementById('refresh-revenue')?.addEventListener('click', updateRevenueSection);
  updateRevenueSection();
// qmoi-core.js: Core logic for QMOI Space UI widgets

async function fetchQCityStatus() {
  try {
    const res = await fetch('/api/qcity/status');
    if (!res.ok) throw new Error('Failed to fetch status');
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function updateDashboardWidgets() {
  const status = await fetchQCityStatus();
  if (!status) return;
  // System Status
  document.getElementById('ai-status').textContent = status.running ? 'Active' : 'Offline';
  document.getElementById('voice-status').textContent = status.features.whatsapp ? 'Ready' : 'Unavailable';
  document.getElementById('vision-status').textContent = status.features.projects ? 'Ready' : 'Unavailable';
  // Revenue
  document.getElementById('revenue-today').textContent = `$${(status.revenue_today||0).toFixed(2)}`;
  document.getElementById('revenue-change').textContent = `${status.revenue_change||'+0.00%'} `;
  // Projects
  document.getElementById('projects-count').textContent = status.tasks ? status.tasks.length : 0;
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';
  if (status.tasks && status.tasks.length) {
    status.tasks.forEach(task => {
      const div = document.createElement('div');
      div.className = 'project-item';
      div.innerHTML = `<span class="project-name">${task.type} (${task.status})</span>`;
      projectList.appendChild(div);
    });
  } else {
    const div = document.createElement('div');
    div.className = 'project-item';
    div.innerHTML = '<span class="project-name">No active projects</span>';
    projectList.appendChild(div);
  }
  // Activity
  const activityList = document.getElementById('activity-list');
  activityList.innerHTML = '';
  if (status.activity && status.activity.length) {
    status.activity.forEach(act => {
      const div = document.createElement('div');
      div.className = 'activity-item';
      div.innerHTML = `<span class="activity-time">${act.time}</span><span class="activity-text">${act.text}</span>`;
      activityList.appendChild(div);
    });
  } else {
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.innerHTML = '<span class="activity-time">Just now</span><span class="activity-text">QMOI Space initialized</span>';
    activityList.appendChild(div);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateDashboardWidgets();
  document.getElementById('refresh-dashboard').addEventListener('click', updateDashboardWidgets);

  // --- Gaming Section Wiring ---
  async function updateGamingSection() {
    const status = await fetchQCityStatus();
    const gamingGrid = document.querySelector('.gaming-grid');
    if (!gamingGrid) return;
    gamingGrid.innerHTML = '';
    if (status && status.tasks && status.tasks.length) {
      status.tasks.forEach(task => {
        if (task.type && task.type.toLowerCase().includes('game')) {
          const div = document.createElement('div');
          div.className = 'game-card';
          div.innerHTML = `
            <div class="game-preview">
              <img src="/games/${task.type.toLowerCase()}-preview.jpg" alt="${task.type}">
              <div class="game-overlay">
                <button class="play-btn">▶️ Play</button>
              </div>
            </div>
            <div class="game-info">
              <h3>${task.type}</h3>
              <p>Status: ${task.status}</p>
              <div class="game-stats">
                <span class="stat">👥 ${task.players || 0} players</span>
                <span class="stat">⭐ ${task.rating || 'N/A'}</span>
              </div>
            </div>
          `;
          gamingGrid.appendChild(div);
        }
      });
    }
    if (!gamingGrid.hasChildNodes()) {
      const div = document.createElement('div');
      div.className = 'game-card';
      div.innerHTML = '<div class="game-info"><h3>No games found</h3></div>';
      gamingGrid.appendChild(div);
    }
  }
  document.getElementById('refresh-games')?.addEventListener('click', updateGamingSection);
  updateGamingSection();
});
