## Suggested GitHub Issues (Manual TODOs)

Create one issue per top file. Suggested template:

- Title: "Triage manual TODOs in scripts/qmoi_master_website_automation.js"
- Body: "23 TODOs marked [PRODUCTION IMPLEMENTATION REQUIRED]. These are high risk (deploy, DNS, SSL). Suggested action: create dry-run implementations, add provider adapters (AWS, Vercel), and require manual approval in CI. See docs/validation/MANUAL_TODOS_TOP10.md and MANUAL_TODOS_ACTIONS.md for details."
- Labels: security, triage, needs-design

Repeat for each top-10 file with the suggested action from MANUAL_TODOS_ACTIONS.md.
