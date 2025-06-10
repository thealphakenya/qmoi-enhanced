# ⚡️ Fast Project Bootstrap & Debugging for Alpha-Q AI

To avoid slow, repetitive pnpm install → pnpm dev → fix errors one-by-one, use these smarter, faster alternatives:

## 🚀 Fastest Alternatives to `pnpm install && pnpm dev`

### 1. Use Cached/Strict Installs
```bash
pnpm install --frozen-lockfile --prefer-offline
```
- `--frozen-lockfile` avoids unexpected versions
- `--prefer-offline` uses cached packages for speed

### 2. Run Tools Instantly with pnpm dlx
```bash
pnpm dlx create-next-app my-app
pnpm dlx vite
```

### 3. Diagnose & Fix Package Issues
```bash
pnpm doctor
pnpm why react
```

### 4. Strict Peer Dependencies
```bash
pnpm install --strict-peer-dependencies
```

### 5. Batch Auto-fix with ESLint + TypeScript
```bash
pnpm lint --fix
pnpm tsc --noEmit
```

### 6. Pre-bundle with Vite (if using Vite)
```bash
pnpm vite --force
```
Or in vite.config.ts:
```ts
optimizeDeps: {
  include: ['react', 'react-dom', 'some-large-lib'],
}
```

### 7. Use Prebuilt Docker/Node Images
- Use a Dockerfile or nix env with all deps preinstalled for zero setup time.

### 8. Turbo/NX for Monorepos
```bash
pnpm dlx turbo run build --filter=my-app
```

### 9. Interactive Package Updates
```bash
pnpm update --interactive
```

### 10. Parallelize Install + Build
```bash
pnpm add -D concurrently
concurrently "pnpm install" "pnpm dev"
```

## 🧠 Bonus: Automation Script
Create `quickstart.sh`:
```bash
#!/bin/bash
set -e

echo "🔧 Verifying lockfile and installing deps..."
pnpm install --frozen-lockfile --prefer-offline

echo "🔍 Type checking and linting..."
pnpm lint --fix
pnpm tsc --noEmit

echo "🚀 Starting dev server..."
pnpm dev
```
Make it executable and run:
```bash
chmod +x quickstart.sh
./quickstart.sh
```

---
*Last updated: June 9, 2025*
