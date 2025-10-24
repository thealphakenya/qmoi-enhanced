# RUNBOOK: Lion (qmoi)

This runbook documents how to use Lion (qmoi) developer automation and validation tooling.

Key scripts
- `scripts/lion-ensure-dirs.cjs` — ensure `.den`, `den`, `lion` directories and runtime files.
- `scripts/repo-inspector.cjs` — conservative repo inspection, suggestions, and optional `--apply` fixes.
- `scripts/lion-autotest-extended.cjs` — extended autotest orchestrator (lint, tests, E2E, builds).
- `scripts/md-validator.cjs` — validate `.md` files, mark validated ones with Lion ✅, and record results to `.den/md-validation.json`.
- `scripts/qmoi-memory.cjs` — simple JSON memory store under `.den/memory.json` used by other scripts.

How to run (local)

```bash
# ensure runtime dirs
node scripts/lion-ensure-dirs.cjs

# run extended autotest (dry-run conservative)
node scripts/lion-autotest-extended.cjs

# validate markdown files and mark them
node scripts/md-validator.cjs

# inspect repo and write suggestions (dry-run)
node scripts/repo-inspector.cjs
```

Safety and backups
- Autofix and validators create `.bak.<ts>` backups of files before writing.
- `repo-inspector.cjs --apply` will apply conservative changes and always back up originals.

CI recommendations
- Run `node scripts/lion-autotest-extended.cjs` on PRs as a required check (dry-run by default).
- Provide a manual workflow dispatch to allow creating apply-PRs from validated autofixes (requires a GitHub token secret).

Memory and audit
- `.den/memory.json` stores compact event arrays used by scripts to remember past inspections and validations.
- `.den/tracks/events.log` stores structured track entries for audit and observability.

Further work
- Auto-merge and PR policies (opt-in) — needs a policy decision and a token in CI.
- Vulnerability fixes — run `npm audit` and create PRs for non-breaking updates.
# RUNBOOK: Lion / QM OI Autodev

This runbook documents common commands, CI hooks and how to operate Lion and QM OI autotest/autofix tools.

Key scripts

- `node scripts/lion-autotest-extended.cjs` — run lint, node tests, E2E (if present), and builds when configured.
- `node scripts/lion-autotest-all.cjs` — full autotest orchestration that can create PRs (opt-in).
- `node scripts/md-validator.cjs` — validate and mark Markdown files with a Lion-validated tick.
- `node scripts/repo-inspector.cjs` — conservative suggestions and optional `--apply` mode.
- `node scripts/qmoi-memory.cjs` — read/write/query lightweight `.den/memory.json` used as QM OI memory store.

Where to find logs

- Tracks are stored in `.den/tracks/events.log` and mirrored into `den/tracks` and the user's home `.den`.
- Inspector suggestions: `.den/suggestions.json`
- Memory: `.den/memory.json`

Production considerations

- Secrets and signing keys must be stored in a secret manager or GitHub Actions secrets — this repo does not contain secrets.
- Mobile builds and iOS signing require macOS runners and access to signing keys.

How to run CI safely

1. Keep workflows dry-run by default and expose a manual dispatch to apply autofixes and open PRs.
2. Use a service account with least privilege for auto-PR creation and narrow scope for merges (if enabled).

Troubleshooting

- If `md-validator` marks too many files, review `.den/memory.json` to see past validations and their timestamps.
- If `repo-inspector` suggests fixes, run `node scripts/repo-inspector.cjs --apply` locally to apply conservative updates (backups are created).
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
