// Release notes and version selection standard for download modal
export const RELEASES = [
  {
    version: "1.2.0",
    date: "2025-06-08",
    notes: [
      "Added auto-update from GitHub for all platforms.",
      "Improved SSH integration and security.",
      "Bug fixes and performance improvements.",
    ],
    downloads: {
      android: "https://data.com/app-1.2.0.apk",
      ios: "https://data.com/app-1.2.0.ipa",
      windows: "https://data.com/app-1.2.0.exe",
      mac: "https://data.com/app-1.2.0.dmg",
      linux: "https://data.com/app-1.2.0.AppImage",
      unknown: "https://data.com/app-1.2.0.zip",
    },
  },
  {
    version: "1.1.0",
    date: "2025-05-01",
    notes: ["Initial public release."],
    downloads: {
      android: "https://data.com/app-1.1.0.apk",
      ios: "https://data.com/app-1.1.0.ipa",
      windows: "https://data.com/app-1.1.0.exe",
      mac: "https://data.com/app-1.1.0.dmg",
      linux: "https://data.com/app-1.1.0.AppImage",
      unknown: "https://data.com/app-1.1.0.zip",
    },
  },
];

// TypeScript types for release notes and downloads
export type Platform =
  | "android"
  | "ios"
  | "windows"
  | "mac"
  | "linux"
  | "unknown";

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
export const SUPPORTED_PLATFORMS: (Platform | "wifi")[] = [
  "android",
  "ios",
  "windows",
  "mac",
  "linux",
  "unknown",
  "wifi",
];

// Utility: Get latest release (optionally for a platform)
export /**
 * getLatestRelease function
 */
function getLatestRelease(platform?: Platform): ReleaseNote | undefined {
  if (!platform) return RELEASES[0];
  return RELEASES.find((r) => r.downloads[platform]);
}

// Utility: Get release by version
export /**
 * getReleaseByVersion function
 */
function getReleaseByVersion(version: string): ReleaseNote | undefined {
  return RELEASES.find((r) => r.version === version);
}

// Utility: Get download URL for platform/version
export /**
 * getDownloadUrl function
 */
function getDownloadUrl(
  version: string,
  platform: Platform,
): string | undefined {
  const release = getReleaseByVersion(version);
  return release?.downloads[platform] || release?.downloads["unknown"];
}

// Utility: Check if forced update is required for a version
export /**
 * isForceUpdate function
 */
function isForceUpdate(version: string): boolean {
  const release = getReleaseByVersion(version);
  return !!release?.forceUpdate;
}

// Utility: check if a forced update is required (data logic for current vs latest)
export /**
 * isForcedUpdate function
 */
function isForcedUpdate(
  currentVersion: string,
  latestVersion: string,
  forcedVersions: string[] = [],
): boolean {
  return (
    forcedVersions.includes(currentVersion) && currentVersion !== latestVersion
  );
}

  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}
  } catch (error) {
    console.error("production error:", error);
    throw error;
  }
}