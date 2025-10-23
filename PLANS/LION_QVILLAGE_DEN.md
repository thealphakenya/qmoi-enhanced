# Plan: Lion / QVillage / Den Enhancements (prioritized)

Goal: Make Lion portable, self-healing, and integrated with QVillage and Den so that it can bootstrap, inspect, and enhance any repository it runs in. Provide a clear path to production-grade features while keeping all changes conservative and opt-in.

Short-term (now)
- Ensure Lion creates `.den`, `den`, and `lion` directories in cwd and home (done).
- Provide `scripts/lion-bootstrap.cjs` and `scripts/lion-ensure-dirs.cjs` to allow running Lion without installation (done).
- Add `scripts/den-enhance.cjs` to maintain den caches and runtime files (done).
- Add conservative autofix (`scripts/lion-autofix-extended.cjs`) and QVillage checklist generator (`scripts/qvillage-ensure-features.cjs`) (done).
- Add CI workflow to run these checks in PRs (scaffolded).

Medium-term (weeks)
- Implement a safe "repo-inspector" that reads `package.json`, `tsconfig.json`, GitHub workflows, and generates a list of conservative improvements (formatting, missing fields, sensible defaults). Provide an "apply --dry" and "apply --autofix" mode. Always back up files before modifying.
- Implement QVillage service stubs under `qvillage/services/` for model registry, model serving (mock), and billing/quota management. Add automated tests and a basic UI README documenting endpoints.
- Provide a portable runner distribution (single-file via `ncc` or `pkg`) for devices without Node. Host on a release channel or allow `lion-bootstrap` to download at first-run.
- Add a `den` local API server (optional) to expose cache and runtime metrics and allow remote triggers for autofix (secured by token) — requires secrets for production.

Long-term (months)
- Integrate secrets management (HashiCorp Vault, AWS KMS) for production key handling and enable secure adapters (payments, DNS, model hosting).
- Expand QVillage into a model hub with proper auth, model cards, hosting, and billing, and integrate QMOI free-tier capabilities.
- Provide platform-specific packaging for mobile/desktop and automated signing pipelines.

Safety & non-goals
- Never modify files without creating a `.bak` copy and providing a clear audit log.
- All auto-modifications must be opt-in (flags or CI approval).
- Avoid running destructive commands by default (e.g., no network downloads unless explicitly permitted).

Next immediate tasks (I will perform if you confirm):
1. Implement the repo-inspector autoupdate script that scans `package.json` and `tsconfig.json` and produces a safe `suggestions.json` and an optional `apply --autofix` mode (backup first).
2. Add `qvillage/services/` skeletons and tests for the top 5 features from `HUGGINGFACEPAYED.md`.
3. Build a small `lion` single-file binary via `ncc` for portable runs (requires adding `devDependencies` and a build step).

If you want me to continue now, say which of the three immediate tasks (1-3) to start with or let me run them in sequence (1 then 2 then 3).