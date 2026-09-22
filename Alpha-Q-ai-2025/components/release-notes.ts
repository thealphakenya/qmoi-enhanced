// Release notes and version selection template for download modal
export const RELEASES = [
  {
    version: "1.2.0",
    date: "2025-06-08",
    notes: [
      "Added auto-update from GitHub for all platforms.",
      "Improved SSH integration and security.",
      "Bug fixes and performance improvements."
    ],
    downloads: {
      android: "https://example.com/app-1.2.0.apk",
      ios: "https://example.com/app-1.2.0.ipa",
      windows: "https://example.com/app-1.2.0.exe",
      mac: "https://example.com/app-1.2.0.dmg",
      linux: "https://example.com/app-1.2.0.AppImage",
      unknown: "https://example.com/app-1.2.0.zip"
    }
  },
  {
    version: "1.1.0",
    date: "2025-05-01",
    notes: [
      "Initial public release."
    ],
    downloads: {
      android: "https://example.com/app-1.1.0.apk",
      ios: "https://example.com/app-1.1.0.ipa",
      windows: "https://example.com/app-1.1.0.exe",
      mac: "https://example.com/app-1.1.0.dmg",
      linux: "https://example.com/app-1.1.0.AppImage",
      unknown: "https://example.com/app-1.1.0.zip"
    }
  }
]

// TypeScript types for release notes and downloads
export type Platform = 'android' | 'ios' | 'windows' | 'mac' | 'linux' | 'unknown';

export interface ReleaseDownload {
  android: string;
  ios: string;
  windows: string;
  mac: string;
  linux: string;
  unknown: string;
}

export interface ReleaseNote {
  version: string;
  date: string;
  notes: string[];
  downloads: ReleaseDownload;
  forceUpdate?: boolean; // Optional property for forced updates
}

// Supported platforms (for UI, etc)
// Add Wi-Fi to supported platforms for UI (for Wi-Fi management panel)
export const SUPPORTED_PLATFORMS: (Platform | 'wifi')[] = [
  'android', 'ios', 'windows', 'mac', 'linux', 'unknown', 'wifi'
];

// Utility: Get latest release (optionally for a platform)
export function getLatestRelease(platform?: Platform): ReleaseNote | undefined {
  if (!platform) return RELEASES[0];
  return RELEASES.find(r => r.downloads[platform]);
}

// Utility: Get release by version
export function getReleaseByVersion(version: string): ReleaseNote | undefined {
  return RELEASES.find(r => r.version === version);
}

// Utility: Get download URL for platform/version
export function getDownloadUrl(version: string, platform: Platform): string | undefined {
  const release = getReleaseByVersion(version);
  return release?.downloads[platform] || release?.downloads['unknown'];
}

// Utility: Check if forced update is required for a version
export function isForceUpdate(version: string): boolean {
  const release = getReleaseByVersion(version);
  return !!release?.forceUpdate;
}

// Utility: check if a forced update is required (example logic for current vs latest)
export function isForcedUpdate(currentVersion: string, latestVersion: string, forcedVersions: string[] = []): boolean {
  return forcedVersions.includes(currentVersion) && currentVersion !== latestVersion;
}
