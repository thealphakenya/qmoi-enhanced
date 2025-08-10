// scripts/platform-ui-adapter.js

import fs from 'fs';
import path from 'path';

const TARGET_FILES = ["app/layout.tsx", "app/layout.js"];

const PLATFORM_LAYOUTS = {
  windows: {
    theme: "dark",
    nav: "sidebar",
    tray: true
  },
  linux: {
    theme: "system",
    nav: "floating",
    panelTransparency: true
  },
  mac: {
    theme: "light",
    nav: "unified",
    useMacStyleButtons: true
  },
  android: {
    theme: "dark",
    nav: "bottom",
    gestures: true
  },
  ios: {
    theme: "light",
    nav: "swipe",
    haptics: true
  },
  desktop: {
    theme: "dark",
    nav: "sidebar",
    startPage: "dashboard"
  }
};

function normalizePlatform(platform) {
  return platform.toLowerCase().replace(/[^a-z0-9]/gi, "");
}

function injectPlatformFeatures(filePath, platformKey, features) {
  const absPath = path.resolve(filePath);

  if (!fs.existsSync(absPath)) {
    console.warn(`⚠️ File not found: ${filePath}. Creating basic layout...`);
    fs.writeFileSync(
      absPath,
      `export default function RootLayout({ children }) {\n  return <>{children}</>\n}`
    );
  }

  let content = fs.readFileSync(absPath, "utf-8");

  const markerStart = `/* === QMOI ${platformKey} layout start === */`;
  const markerEnd = `/* === QMOI ${platformKey} layout end === */`;

  const featureBlock = `${markerStart}\n// Platform: ${platformKey}\n// Layout features: ${JSON.stringify(
    features,
    null,
    2
  )}\n${markerEnd}`;

  const regex = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`, "gm");
  if (regex.test(content)) {
    content = content.replace(regex, featureBlock);
  } else {
    content = content.replace(
      /(<\/ThemeProvider>|<\/body>|<\/html>|\{children\})/,
      `${featureBlock}\n$1`
    );
  }

  fs.writeFileSync(absPath, content);
  console.log(`📐 Applied ${platformKey} layout UI into ${filePath}`);
}

function applyUILayout(platformArg) {
  const platformKey = normalizePlatform(platformArg);
  const features = PLATFORM_LAYOUTS[platformKey];

  if (!features) {
    console.error(`❌ Unknown platform: "${platformArg}"`);
    process.exit(1);
  }

  for (const file of TARGET_FILES) {
    injectPlatformFeatures(file, platformKey, features);
  }
}

// CLI usage
if (require.main === module) {
  const arg = process.argv.find((a) => a.startsWith("--platform="));
  if (!arg) {
    console.error("❌ Usage: node scripts/platform-ui-adapter.js --platform=windows");
    process.exit(1);
  }
  const platform = arg.split("=")[1];
  applyUILayout(platform);
}

module.exports = {
  applyUILayout
};
