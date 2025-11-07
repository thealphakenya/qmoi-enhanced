Purpose

This document explains how to verify the pending TypeScript edits in this repository when `node`/`tsc` are not available in the devcontainer. It includes two safe verification approaches (preferred: run locally or in CI with Node installed).

Context

- Several routes were converted to use `app/lib/fileStore.ts` as a conservative persistent fallback.
- Some edits were written and saved in the repo but remain marked `applied-pending-verify` in `resumetodos.txt` because I couldn't run `tsc` in the current devcontainer (no root to install packages and the locally-downloaded Node binary is incompatible with this musl environment).
- Files pending verification (as of 2025-11-07):
  - app/api/qmoi-gitlab/pipelines/route.ts
  - app/api/qmoi-gitlab/jobs/route.ts
  - app/api/qmoi-gitlab/deployments/route.ts

Recommended verification approaches

A) Verify inside this container (requires root privileges)

1. Enter the container shell as root (or run with sudo) and install Node/npm via Alpine apk:

```bash
# in the devcontainer (requires root)
apk update
apk add --no-cache nodejs npm
npm install -g typescript
```

2. From the workspace root, run the per-file checks (these use the ambient types helper):

```bash
# run per-file TypeScript checks
npx tsc --noEmit --lib ES2015,DOM types/qmoi-ambient.d.ts app/api/qmoi-gitlab/pipelines/route.ts
npx tsc --noEmit --lib ES2015,DOM types/qmoi-ambient.d.ts app/api/qmoi-gitlab/jobs/route.ts
npx tsc --noEmit --lib ES2015,DOM types/qmoi-ambient.d.ts app/api/qmoi-gitlab/deployments/route.ts
```

3. If the checks pass, append the entries to `donerefs.txt` (the assistant will do this on your confirmation or after seeing the green tsc output).

B) Verify on a host (recommended if you cannot run root inside the devcontainer)

1. Clone this repo on a Linux/macOS machine with Node installed (Node 18+ recommended).
2. From the project root, install dependencies if desired (this repo may have a malformed `package.json`; you can still run per-file `npx tsc` without installing repository deps):

```bash
# optional, only if you want local types
npm init -y
npm install typescript --save-dev
npx tsc --init
```

3. Run the same per-file tsc commands shown in section A to validate the edited files.

C) Verify in CI (recommended for reproducibility)

- Add a GitHub Actions workflow or CI job that runs Node 20 on ubuntu-latest, checks out the repo, installs typescript, and runs the per-file `tsc` commands. This avoids needing root access in the devcontainer.

Example GitHub Actions snippet:

```yaml
name: verify-types
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g typescript
      - run: npx tsc --noEmit --lib ES2015,DOM types/qmoi-ambient.d.ts app/api/qmoi-gitlab/pipelines/route.ts
      - run: npx tsc --noEmit --lib ES2015,DOM types/qmoi-ambient.d.ts app/api/qmoi-gitlab/jobs/route.ts
      - run: npx tsc --noEmit --lib ES2015,DOM types/qmoi-ambient.d.ts app/api/qmoi-gitlab/deployments/route.ts
```

What to do after verification

- If `tsc` produces no errors, reply with "verified" and I will append the relevant entries to `donerefs.txt`, update `resumetodos.txt`, and mark the todo item(s) completed.
- If `tsc` shows errors, paste the output here (or upload the log) and I'll fix the minimal type issues and re-run verification.

Notes & safety

- I created `.bak` files before each automated edit. No original content was removed.
- High-risk files (`qmoi-database`, `qmoi-model`, `ai-self-diagnostics`) were not auto-converted — conservative proposals are in `.qmoi_validation/`.
- If you want me to attempt further automated edits (and accept applied-pending-verify state), say so and I will continue making conservative changes and record them as pending until verification is possible.
