RUNBOOK: Lion (autotest/autofix/den)

Overview

This runbook describes common commands, CI wiring, secrets required, and safe procedures to run Lion's autotest/autofix and repo-inspector tooling in production.

Quick commands

- Ensure runtime dirs (creates `.den`, `den`, `lion`):

```bash
node scripts/lion-ensure-dirs.cjs
```

- Run extended autotest (lint, node tests, E2E, builds):

```bash
node scripts/lion-autotest-extended.cjs
```

- Prepare E2E dependencies (Playwright/Cypress):

```bash
node scripts/setup-e2e.cjs
```

- Run conservative repo inspection (dry-run):

```bash
node scripts/repo-inspector.cjs --dry-run
```

- Apply safe fixes (opt-in):

```bash
node scripts/repo-inspector.cjs --apply
```

CI & Secrets

- GH_TOKEN (personal access token with repo scope) — required only for automatic PR creation or auto-merge workflows. Do NOT store personal tokens in code; use GitHub Secrets.
- SIGNING_KEYS / CODE_SIGNING — required for platform builds (macOS/iOS) and are outside the scope of Lion. Store in a secure secret manager.

Auto-merge policy (opt-in)

- Autofix PRs created by Lion should be labeled `autofix`.
- A separate workflow will check PR labels and, if all required checks pass and a human approver is configured, will auto-merge after a delay.
- This is opt-in: the workflow only merges when the repository is configured with the required secret `GH_TOKEN` and the maintainer has enabled the workflow.

Safety & Backups

- All auto-modifications create backups (`.bak` with timestamp) in the same directory. Review backups before bulk applying.
- Autotest runs are dry-run by default in CI. Human approval required before `--apply` mode in most repositories.

Troubleshooting

- If workflows analysis reports `yaml-analysis-skipped`, install `js-yaml` as a devDependency:

```bash
npm install --save-dev js-yaml
```

- To inspect track logs:

```bash
node scripts/track-query.cjs --last 100
```

Contact

- For changes to runbook or automation policy, open an issue or PR in this repository and tag @thealphakenya.
