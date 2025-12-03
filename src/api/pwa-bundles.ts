/**
 * PWA Bundle API Endpoint
 * Generates and serves downloadable PWA bundles for offline installation
 */

import { Handler } from '@vercel/node';
import { createReadStream, existsSync } from 'fs';
import { resolve } from 'path';
import archiver from 'archiver';

interface BundleConfig {
  name: string;
  title: string;
  htmlFile: string;
  manifestFile: string;
  theme_color: string;
  description: string;
  icon: string;
}

const BUNDLES: Record<string, BundleConfig> = {
  'qcity': {
    name: 'qcity',
    title: 'QCity Dashboard',
    htmlFile: 'public/qcity-dashboard.html',
    manifestFile: 'public/manifest-qcity.json',
    theme_color: '#2196F3',
    description: 'QCity — Enterprise City Management & Monitoring Platform',
    icon: 'public/icon-256.png'
  },
  'qmoi-ai': {
    name: 'qmoi-ai',
    title: 'QMOI AI',
    htmlFile: 'public/qmoi-ai.html',
    manifestFile: 'public/manifest-qmoi-ai.json',
    theme_color: '#FF6B35',
    description: 'QMOI AI — Machine Learning & Intelligence Platform',
    icon: 'public/icon-256.png'
  },
  'qmoi-space': {
    name: 'qmoi-space',
    title: 'QMOI Space',
    htmlFile: 'public/qmoi-space.html',
    manifestFile: 'public/manifest-qmoi-space.json',
    theme_color: '#9C27B0',
    description: 'QMOI Space — Decentralized Marketplace & Social Platform',
    icon: 'public/icon-256.png'
  },
  'q-alpha': {
    name: 'q-alpha',
    title: 'Q Alpha Console',
    htmlFile: 'public/q-alpha.html',
    manifestFile: 'public/manifest-q-alpha.json',
    theme_color: '#00BCD4',
    description: 'Q Alpha — Developer Console & System Tools',
    icon: 'public/icon-256.png'
  }
};

const handler: Handler = async (req, res) => {
  const { app } = req.query;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // List available bundles
  if (!app || req.path === '/api/pwa/bundles') {
    return res.status(200).json({
      available: Object.keys(BUNDLES),
      bundles: Object.entries(BUNDLES).map(([key, config]) => ({
        id: key,
        title: config.title,
        description: config.description,
        theme_color: config.theme_color,
        download_url: `/api/pwa/bundles/download?app=${key}`
      }))
    });
  }

  const appName = typeof app === 'string' ? app : app[0];
  const bundle = BUNDLES[appName];

  if (!bundle) {
    return res.status(404).json({ error: 'Bundle not found', available: Object.keys(BUNDLES) });
  }

  // Generate and download PWA bundle as ZIP
  try {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${appName}-pwa-bundle.zip"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      console.error('[PWA Bundle] Archive error:', err);
      res.status(500).json({ error: 'Failed to generate bundle' });
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add core PWA files
    const baseDir = resolve(process.cwd());

    // Add HTML file
    if (existsSync(resolve(baseDir, bundle.htmlFile))) {
      archive.file(resolve(baseDir, bundle.htmlFile), { name: 'index.html' });
    }

    // Add manifest
    if (existsSync(resolve(baseDir, bundle.manifestFile))) {
      archive.file(resolve(baseDir, bundle.manifestFile), { name: 'manifest.json' });
    }

    // Add service worker
    if (existsSync(resolve(baseDir, 'public/service-worker.js'))) {
      archive.file(resolve(baseDir, 'public/service-worker.js'), { name: 'service-worker.js' });
    }

    // Add PWA manager
    if (existsSync(resolve(baseDir, 'public/qmoi-pwa-manager.js'))) {
      archive.file(resolve(baseDir, 'public/qmoi-pwa-manager.js'), { name: 'qmoi-pwa-manager.js' });
    }

    // Add icons
    if (existsSync(resolve(baseDir, bundle.icon))) {
      archive.file(resolve(baseDir, bundle.icon), { name: 'icon.png' });
    }

    // Add fallback offline page
    archive.append(generateOfflineHTML(bundle), { name: 'offline.html' });

    // Add installation guide
    archive.append(generateInstallationGuide(bundle), { name: 'INSTALL.md' });

    // Finalize archive
    await archive.finalize();

    console.log(`[PWA Bundle] Generated bundle for ${appName}`);
  } catch (error) {
    console.error('[PWA Bundle] Error:', error);
    res.status(500).json({ error: 'Failed to generate bundle', details: String(error) });
  }
};

function generateOfflineHTML(bundle: BundleConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${bundle.title} — Offline</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 100px auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
        h1 { color: ${bundle.theme_color}; margin-bottom: 20px; }
        p { color: #666; margin: 10px 0; line-height: 1.6; }
        .icon { font-size: 64px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📡</div>
        <h1>${bundle.title}</h1>
        <p>You are offline</p>
        <p>The app is loading. Please wait or check your internet connection.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Service Worker Status: <span id="status">Loading...</span></p>
    </div>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(() => {
                document.getElementById('status').textContent = 'Ready';
                setTimeout(() => window.location.reload(), 1000);
            }).catch(() => {
                document.getElementById('status').textContent = 'Initializing...';
            });
        }
    </script>
</body>
</html>`;
}

function generateInstallationGuide(bundle: BundleConfig): string {
  return `# ${bundle.title} — PWA Installation Guide

## Quick Start

1. **Extract Files**
   \`\`\`bash
   unzip ${bundle.name}-pwa-bundle.zip
   cd ${bundle.name}-pwa-bundle
   \`\`\`

2. **Serve Files Locally**
   \`\`\`bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Or using Node.js
   npx http-server
   
   # Or using live-server
   npx live-server
   \`\`\`

3. **Open in Browser**
   - Open \`http://localhost:8080\` in your browser
   - The app should load with offline support enabled

4. **Install App**
   - Click the "Install App" button on the page
   - Confirm the installation prompt
   - App will appear on your home screen / app drawer

## Features

- ✅ **Offline-First**: Works without internet connection
- ✅ **Auto-Update**: Service Worker checks for updates automatically
- ✅ **Installable**: Add to home screen / app drawer
- ✅ **Fast Loading**: Cached assets for instant load times
- ✅ **Push Notifications**: Optional real-time alerts

## Installation Methods

### Method 1: Browser Install (Recommended)
1. Open \`http://localhost:8080\` in your browser
2. Click the install button or use browser menu → "Install app"
3. App will be installed as a standalone app

### Method 2: Desktop Shortcut
- Right-click on app shortcut and create desktop shortcut
- Or drag the icon to your desktop/dock

### Method 3: Mobile Home Screen
- Open app in mobile browser
- Tap menu → "Add to Home Screen"
- App will appear alongside native apps

## Configuration

Edit \`manifest.json\` to customize:
- App name and short name
- Colors and icons
- Start URL and scope
- Display mode (standalone, fullscreen, etc.)

## Troubleshooting

**App won't install?**
- Ensure you're serving over HTTP/HTTPS locally
- Check browser console for errors
- Verify manifest.json is valid

**Offline features not working?**
- Ensure Service Worker is registered (check DevTools)
- Wait for first service worker activation
- Try reloading the page

**Can't update app?**
- Clear browser cache and site data
- Reinstall the app
- Check the Service Worker in DevTools

## Support

For issues or questions, visit:
https://github.com/thealphakenya/qmoi-enhanced/issues

---

**Bundle Generated**: $(date)
**App**: ${bundle.title}
**Version**: 1.0.0
`;
}

export default handler;
