#!/bin/bash
# QMOI: Fetch open-source starter projects for all major platforms
set -e
mkdir -p frontend/qcity-pwa frontend/smarttv-app mobile/android-app mobile/ios-app desktop/electron-app web/web-app pi/pi-app

# PWA (React)
git clone --depth 1 https://github.com/facebook/create-react-app.git frontend/qcity-pwa || true
cd frontend/qcity-pwa && npm install && cd ../..

# SmartTV (Tizen Web App)
git clone --depth 1 https://github.com/SamsungDForum/Samsung-Tizen-Web-Application.git frontend/smarttv-app || true

# Android (Sunflower)
git clone --depth 1 https://github.com/android/sunflower.git mobile/android-app || true

# iOS (SwiftUI Example)
git clone --depth 1 https://github.com/ra1028/SwiftUI-Example.git mobile/ios-app || true

# Electron (Quick Start)
git clone --depth 1 https://github.com/electron/electron-quick-start.git desktop/electron-app || true
cd desktop/electron-app && npm install && cd ../..

# Web (React PWA)
git clone --depth 1 https://github.com/pwa-builder/pwa-starter.git web/web-app || true
cd web/web-app && npm install && cd ../..

# Raspberry Pi (Python Example)
git clone --depth 1 https://github.com/raspberrypi/pico-examples.git pi/pi-app || true

# Print summary
echo "\nQMOI: Starter projects fetched for all major platforms."
