# Features and percentages manifest

## Policy
- The Ollama autonomous agent should keep feature and percentage guidance synchronized with the code and docs so that global behavior and thresholds remain consistent.
- When a new feature, confidence threshold, or percentage-based rule is introduced, it should be documented here and in the relevant runtime manifest.

## Inventory
- percentage: 20 files mention related feature or global guidance
  - .env.example: # QMOI Enhanced - Environment Configuration Template
# Copy this file to .env.local for local development
# For production, use .env.production with actual values

# ==============
  - .eslint_report_parsing_files.txt: _archive_qmoi-enhanced/_app_archived/api/qmoi/voice-preview/route.ts
_archive_qmoi-enhanced/_app_archived/layout.js
_archive_qmoi-enhanced/components/DownloadQApp.tsx
_archive_qmoi
  - .eslintrc.json: {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "ignorePatterns": [
    "_archive_qmoi-enhanced",
    "d",
    "app",
    "components",
    "dashboard
  - .github/PULL_REQUEST_TEMPLATE/automated_fix.md: <!-- Automated PR Template -->

## Summary

This PR was created automatically by the QMOI CI helper to propose a fix for a common Android build or release issue.

## What changed


  - .github/PULL_REQUEST_TEMPLATE.md: <!-- Describe the purpose of this PR in one sentence -->

## Summary

This PR contains production-enablement changes for the local `qmoi` development server and supporting automati
  - .github/workflows/build-and-release.yml: name: Build and Release

on:
  workflow_dispatch:
  push:
    tags:
      - "v*"

jobs:
  build-android:
    name: Build Android APK
    runs-on: ubuntu-latest
    steps:
      - u
  - .github/workflows/ci-cd.yml: name: CI/CD Pipeline

on:
  push:
    branches: [main, develop, autosync-backup-20250926-232440]
    tags:
      - "v*"
  pull_request:
    branches: [main, develop]
  workflow_dis
  - .github/workflows/ci-monitor.yml: name: CI Monitor

on:
  workflow_run:
    workflows: ["CI Build & Smoke", "Docker Build & Container Smoke"]
    types:
      - completed

permissions:
  issues: write
  pull-reques
- feature: 20 files mention related feature or global guidance
  - .cspell.json: {
  "version": "0.2",
  "language": "en",
  "words": [
    "Colab",
    "alphaq",
    "Qmoi",
    "qmoi",
    "Creds",
    "creds",
    "longname",
    "Platformer",
    "Habari",

  - .devcontainer/devcontainer.json: {
  "name": "QMOI AI - Node.js + Python Dev Environment",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:18-bullseye",
  "features": {
    "ghcr.io/devcontainers/featu
  - .env.example: # QMOI Enhanced - Environment Configuration Template
# Copy this file to .env.local for local development
# For production, use .env.production with actual values

# ==============
  - .eslint_report_parsing_files.txt: _archive_qmoi-enhanced/_app_archived/api/qmoi/voice-preview/route.ts
_archive_qmoi-enhanced/_app_archived/layout.js
_archive_qmoi-enhanced/components/DownloadQApp.tsx
_archive_qmoi
  - .eslintrc.cjs: module.exports = {
  // Temporary global env settings to reduce `no-undef` noise during triage.
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  rules: {
    // T
  - .eslintrc.json: {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "ignorePatterns": [
    "_archive_qmoi-enhanced",
    "d",
    "app",
    "components",
    "dashboard
  - .github/workflows/build.yml: name: Build QMOI AI
"on":
  push:
    branches:
      - main
  schedule:
    - cron: 0 3 * * *
  workflow_dispatch: null
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      
  - .github/workflows/ci-debug.yml: name: CI Debug (test logs)

on:
  workflow_dispatch:
  pull_request:

permissions:
  contents: write
  issues: write
  actions: write

jobs:
  ci-debug:
    name: CI Debug
    runs
- percentages: 20 files contain percentage values
  - .ollama_agent_audit.jsonl: 100%
  - .qmoi_state/health_memory.json: 35%, 86.27%
  - ADVANCED_USER_IDENTIFICATION_SYSTEM.md: 100%, 40%, 70%, 75%, 85%, 90%, 95%, 98%, 99%
  - API_ENDPOINTS_COMPLETE_AUDIT.md: 99.9%, 99.99%
  - API_INTEGRATION_GUIDE.md: 100%, 5%
  - APP_BUILD_MATRIX.md: 100%, 73%, 75%, 88%, 91%
  - AUTH_SYSTEM_IMPLEMENTATION.md: 85%
  - AUTO_RECOVERY_PROCEDURES.md: 5%, 99%
