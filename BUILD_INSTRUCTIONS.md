# Build & Test Instructions

## Build Environment Status

### Current Container / CI

- **Node.js:** Recommended 18.x or 20.x (CI uses Node 18 by default)
- **npm:** 9.x or later recommended
- **Python:** ✓ Available (used for local testing of dashboards)

> Note: Local Codespaces may have limited memory; heavy Next.js production builds are more reliable on a CI runner (see the included GitHub Actions workflow). If you have trouble building locally, use CI or a larger machine.

## Build Steps (Run on machine with Node.js 18+)

### Static preview (safe while production build fails locally)

If local Next.js production builds are unstable due to memory limits, you can run the lightweight static preview server:

```bash
npm run serve:static
# Open: http://localhost:3005
```

This serves `public/index.html` as a minimal preview while full build is performed in CI.

### 1. Install Dependencies

```bash
npm install
```

### 2. TypeScript Type Check (Optional but Recommended)

```bash
npx tsc --noEmit
```

### 3. Build Next.js Production Bundle

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

### 5. Test Production Bundle (Optional)

```bash
npm start
# Then open: http://localhost:3000
```

## Test Suite (if configured)

```bash
# Run Jest tests (if jest.config.js exists)
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

### Common Error 1: Missing TypeScript

```
error: Cannot find module 'typescript'
```

**Solution:**

```bash
npm install --save-dev typescript
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
# Use unoptimized images in dev/build
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

Create `.env.local` before building (see `.env.example`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENV=development
```

## CI/CD Integration

### GitHub Actions Example

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
