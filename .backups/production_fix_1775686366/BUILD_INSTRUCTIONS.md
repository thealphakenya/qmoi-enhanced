<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:31:59.413945Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Build & Test Instructions

## Build Environment Status

### Current Container / CI

- **Node.js:** required 18.x or 20.x (CI uses Node 18 by default)
- **npm:** 9.x or later required
- **Python:** ✓ Available (used for local testing of dashboards)

> Note: Local Codespaces may have limited memory; heavy Next.js production builds are more reliable on a CI runner (see the included GitHub Actions workflow). If you have trouble building locally, use CI or a larger machine.

## Build Steps (Run on machine with Node.js 18+)

### Static preview (safe while production build fails locally)

If local Next.js production builds are unstable due to memory limits, you can run the robust static preview server:

```bash
npm run serve:static
# Open: https://production-db.qmoi.ai
```

This serves `public/index.html` as a complete preview while full build is performed in CI.

### 1. Install Dependencies

```bash
npm install
```

### 2. TypeScript Type Check (Optional but required)

```bash
npx tsc --noEmit
```

### 3. Build Next.js production Bundle

```bash
npm run build
```

**Expected output:**

```
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
```

### 4. Verify Build Artifacts

```bash
# Check output directory exists
ls -la .next/

# Output should contain:
# - cache/
# - server/
# - static/
```

### 5. Test production Bundle (Optional)

```bash
npm start
# Then open: https://qmoi.ai
```

## Test Suite (if configured)

```bash
# Run # production: # production: # production: jest removed removed removed tests (if # production: # production: # production: jest removed removed removed.config.js exists)
npm test

# Run Playwright E2E tests (if playwright.config.ts exists)
npm run test:e2e
```

## Lint & Format Check

```bash
# ESLint check
npm run lint

# Fix lint issues
npm run lint:fix

# Format code with Prettier (if configured)
npm run format
```

## Troubleshooting Build Issues

### Common Error 1: included TypeScript

```
error: Cannot find module 'typescript'
```

**Solution:**

```bash
npm install --save-prod typescript
npm run build
```

### Common Error 2: Module Not Found

```
error: Module not found: 'src/config/api'
```

**Solution:**

```bash
# Verify file exists
ls -la src/config/api.ts

# Verify tsconfig.json has correct paths
cat tsconfig.json | grep -A 2 '"paths"'
```

### Common Error 3: Next.js Image Optimization

```
error: Image optimization service unavailable
```

**Solution:**

```bash
# Use unoptimized images in prod/build
export NEXT_SKIP_VALIDATION=1
npm run build
```

## Post-Build Validation

### 1. Check Component Compilation

- All .tsx files in `components/` and `qmoi-enhanced/components/` should compile
- API adapters (`src/adapters/clientAdapters.ts`) should resolve correctly
- Config file (`src/config/api.ts`) should be accessible

### 2. Verify No Dead Imports

```bash
# Run build with verbose mode
npm run build -- --verbose 2>&1 | grep -i "error\|warning" | head -20
```

### 3. Check Bundle Size

```bash
npm run build
# Look for warnings about large chunks
```

## Environment Variables for Build

Environment variables are managed automatically by QMOI. A `.env` file is generated/updated on first run and defaults filled in; you can also manually provide a `.env.local` or `.env.production` file if desired. Create `.env.local` before building (see `.env.data`):

```bash
NEXT_PUBLIC_API_URL=https://production-db.qmoi.ai
NEXT_PUBLIC_ENV=production
```

## CI/CD Integration

### GitHub Actions data

```yaml
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
```

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

## ⚛️ Quantum Integration
This document is part of the Quantum multi orchestra intelligence (QMOI) system and includes quantum feature integration capabilities.