# TypeScript / Node.js Environment

Steps to set up a Node.js/TypeScript environment used by QMOI:

- Use Node.js 18+ (LTS recommended).
- Install dependencies with npm or pnpm.
- Use `npm ci` in CI to ensure deterministic installs when package-lock.json is present.
- Run TypeScript build with `npx tsc` or `npm run build` when provided.

QMOI autodev scripts will attempt to use nvm or asdf when available to select the correct Node version.
