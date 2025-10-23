# QMOI Preview Report

Generated: 2025-10-23T17:17:06.140Z

## package.json scripts

- autofix: `node scripts/qmoi-enhanced-auto-fix.js`
- avatar: `node scripts/qmoi-enhanced-avatar-system.js`
- build: `react-scripts build`
- build:apps-docs: `node scripts/generate-builds-doc.cjs`
- ci:local: `bash scripts/ci-fix-and-test.sh`
- dev: `node --experimental-modules scripts/qmoi-ai-server.js`
- fix:all: `npx eslint . --fix || true`
- github: `node scripts/qmoi-github-integration.js`
- lint: `eslint .`
- lint:fix: `eslint . --fix`
- lint:mpesa: `npx eslint "src/integrations/mpesa/**" --fix || true`
- migrate:paymentstore: `node scripts/migrate-paymentstore-to-v2.js`
- music: `node scripts/qmoi-music-production-system.js`
- notify: `node scripts/qmoi-notification-system.js`
- qcity: `node --experimental-modules scripts/qcity-ui-server.js`
- scan:md:releases: `node scripts/scan-md-for-releases.cjs`
- setup: `node scripts/qmoi-environment-setup.js`
- start: `node scripts/qmoi-master-system.js`
- test: `node scripts/test-qmoi-system.js`
- test:all: `npx jest --config ./jest.config.cjs --runInBand`
- test:unit: `npx jest src/integrations/mpesa --config ./jest.config.cjs --runInBand`
- validate:env: `node scripts/validate-env.cjs`
- vuln-scan: `node scripts/qmoi-vulnerability-scanner.js`
