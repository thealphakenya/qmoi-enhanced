# Developer Setup & Production Build

Follow these steps to set up the QMOI Enhanced repo locally, run dev, test and build for production.

Prerequisites
- Node.js 18.x (recommend using nvm)
- npm 8.x or higher

Local setup (Unix/macOS)
1. Install Node 18 using nvm if it isn't installed: `nvm install 18 && nvm use 18`.
2. Install dependencies: `npm ci`
3. Initialize environment and config defaults: `npm run env-setup`
4. Run unit tests (Jest): `npm test`
5. Run a placeholder quick scan: `npm run type-check:quick`
6. Start the dev server: `npm run dev`

Production build
1. Install dependencies on your deployment environment (or use CI): `npm ci --production`
2. Build static parts (Next.js): `npm run build`
3. Start production server: `npm run start:prod`

Notes
- The repo uses `type: module` for ESM. For CI, the project runs on Node 18 to ensure native ESM support.
- To regenerate default configs and placeholder approvals, use the `env-setup` script.
- Many scripts will write to `config/` and `logs/` directories — ensure those are present (the provided env setup script creates them).
