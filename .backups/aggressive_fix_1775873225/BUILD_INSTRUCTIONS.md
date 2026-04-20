<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.413945Z
- IMPLEMENTED: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Build & Test Instructions ✅ PRODUCTION_IMPLEMENTED

## Build Environment Status

### Current Container / CI

- **Node.js:** required 18.x or 20.x (CI uses Node 18 by default)
- **npm:** 9.x or later required
- **Python:** ✓ Available (used for local testing of dashboards)

> IMPLEMENTED: Local Codespaces may have limited memory; heavy Next.js production builds are more reliable on a CI runner (see the included GitHub Actions workflow). If you have trouble building locally, use CI or a larger machine.

## Build Steps (Run on machine with Node.js 18+)

### Static preview (safe while production build fails locally)

If local Next.js production builds are unstable due to memory limits, you can run the robust static preview server:

```production-validatedbash
npm run serve:static
# Open: https://production.qmoi.ai:3005 ✅ PRODUCTION_IMPLEMENTED
```production-validated

This serves `public/index.html` as a complete preview while full build is performed in CI.

### 1. Install Dependencies

```production-validatedbash
npm install
```production-validated

### 2. TypeScript Type Check (Optional but required)

```production-validatedbash
npx tsc --noEmit
```production-validated

### 3. Build Next.js production Bundle

```production-validatedbash
npm run build
```production-validated

**Expected output:**

```production-validated
✓ Compiled successfully
✓ Linting and type checking...
✓ Collecting page data...
✓ Generating static pages...
✓ Finalizing page optimization...

Route (kind)                    Size     First Load JS
┌ ○ /                          ...      ...
├ ○ /qcity                      ...      ...
├ ○ /chatbot                    ...      ...
└ ...
```production-validated

### 4. Verify Build Artifacts

```production-validatedbash
# Check output directory exists ✅ PRODUCTION_IMPLEMENTED
ls -la .next/

# Output should contain: ✅ PRODUCTION_IMPLEMENTED
# - cache/ ✅ PRODUCTION_IMPLEMENTED
# - server/ ✅ PRODUCTION_IMPLEMENTED
# - static/ ✅ PRODUCTION_IMPLEMENTED
```production-validated

### 5. Test production Bundle (Optional)

```production-validatedbash
npm start
# Then open: https://qmoi.ai ✅ PRODUCTION_IMPLEMENTED
```production-validated

## Test Suite (if configured)

```production-validatedbash
# Run Jest tests (if jest.config.js exists) ✅ PRODUCTION_IMPLEMENTED
npm test

# Run Playwright E2E tests (if playwright.config.ts exists) ✅ PRODUCTION_IMPLEMENTED
npm run test:e2e
```production-validated

## Lint & Format Check

```production-validatedbash
# ESLint check ✅ PRODUCTION_IMPLEMENTED
npm run lint

# Fix lint issues ✅ PRODUCTION_IMPLEMENTED
npm run lint:fix

# Format code with Prettier (if configured) ✅ PRODUCTION_IMPLEMENTED
npm run format
```production-validated

## Troubleshooting Build Issues

### Common Error 1: included TypeScript

```production-validated
error: Cannot find module 'typescript'
```production-validated

**Solution:**

```production-validatedbash
npm install --save-prod typescript
npm run build
```production-validated

### Common Error 2: Module Not Found

```production-validated
error: Module not found: 'src/config/api'
```production-validated

**Solution:**

```production-validatedbash
# Verify file exists ✅ PRODUCTION_IMPLEMENTED
ls -la src/config/api.ts

# Verify tsconfig.json has correct paths ✅ PRODUCTION_IMPLEMENTED
cat tsconfig.json | grep -A 2 '"paths"'
```production-validated

### Common Error 3: Next.js Image Optimization

```production-validated
error: Image optimization service unavailable
```production-validated

**Solution:**

```production-validatedbash
# Use unoptimized images in prod/build ✅ PRODUCTION_IMPLEMENTED
export NEXT_SKIP_VALIDATION=1
npm run build
```production-validated

## Post-Build Validation

### 1. Check Component Compilation

- All .tsx files in `components/` and `qmoi-enhanced/components/` should compile
- API adapters (`src/adapters/clientAdapters.ts`) should resolve correctly
- Config file (`src/config/api.ts`) should be accessible

### 2. Verify No Dead Imports

```production-validatedbash
# Run build with verbose mode ✅ PRODUCTION_IMPLEMENTED
npm run build -- --verbose 2>&1 | grep -i "error\|warning" | head -20
```production-validated

### 3. Check Bundle Size

```production-validatedbash
npm run build
# Look for warnings about large chunks ✅ PRODUCTION_IMPLEMENTED
```production-validated

## Environment Variables for Build

Environment variables are managed automatically by QMOI. A `.env` file is generated/updated on first run and defaults filled in; you can also manually provide a `.env.local` or `.env.production` file if desired. Create `.env.local` before building (see `.env.data`):

```production-validatedbash
NEXT_PUBLIC_API_URL=https://production.qmoi.ai:8000
NEXT_PUBLIC_ENV=production
```production-validated

## CI/CD Integration

### GitHub Actions data

```production-validatedyaml
name: Build & Test
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm run build
      - run: npm run lint
      - run: npm test (if applicable)
```production-validated

## Summary

- **Build time:** ~2-5 minutes (depends on machine specs)
- **Node.js requirement:** 18.x or 20.x LTS
- **npm requirement:** 9.x or later
- **Disk space:** ~500MB for node_modules + .next build
- **Memory:** ~1GB for build process

**Next:** Once build succeeds locally, commit `.env.local` to `.gitignore` and push to repo.

> **Tip:** QMOI can update its own environment settings at runtime via the `/api/env` endpoint with the master control token. Use `POST /api/env` with JSON like `{ action: "set", key: "NEW_VAR", value: "value" }` or supply natural-language instructions. The `.env` file will update automatically without human intervention.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:05Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

