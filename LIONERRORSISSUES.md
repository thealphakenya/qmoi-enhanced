# Lion Errors & Issues Catalog

This file catalogs common Lion-specific errors, root causes, and recommended fixes.

1. SyntaxError: Unknown step keyword
- Symptom: runner reports unknown step.
- Cause: misspelled keyword or unsupported extension.
- Fix: use supported keywords (`print:`, `run:`, `calc:`) or update runner to support custom step.

2. AdapterError: Missing credentials
- Symptom: Adapter fails due to missing env vars.
- Cause: required credentials not set in `.env` or CI secrets.
- Fix: run `node scripts/ensure-env.cjs --force` to populate defaults in dev; in CI set secrets or use `--emit-ga` to populate env during workflow. For production, provision credentials via secret manager.

3. SecurityError: Untrusted command execution
- Symptom: `run:` step tried to run an untrusted command.
- Cause: Plan from untrusted source executed without sandbox.
- Fix: Never run untrusted plans in a production runner. Use sandboxed Den and a vetted adapter interface.

4. PackagingError: Missing metadata
- Symptom: `.lion` bundle missing required fields.
- Cause: packager not provided required metadata (id, version, platform targets).
- Fix: ensure `pack.json` is included and pass metadata to packager.

5. CoursebookSyncError: IO write failed
- Symptom: `scripts/coursebook-sync.cjs` fails to write `.txt` mirror.
- Cause: File permissions or missing folder.
- Fix: ensure docs folder exists and file system permissions permit write.

6. EncryptionError: Decryption failed
- Symptom: decrypt helper returns invalid output
- Cause: incorrect key or corrupted ciphertext
- Fix: verify key rotation and use correct KMS/vault key.

7. AutotestError: Platform runner not found
- Symptom: `lion-autotest` reports missing runner for platform.
- Cause: required runtime (node, den) not installed.
- Fix: install den or node runner via `scripts/install-lion.cjs` or package manager.

For each error include telemetry and reproduction steps in production. Use `LIONERRORSISSUES.md` as the canonical guide when triaging Lion failures.
# Lion Errors & Issues

This file lists common Lion-specific errors, their cause, and recommended fixes. Use this as a first-run troubleshooting guide.

1) Error: "Unknown step keyword: foo"
- Cause: The plan contains a step keyword not supported by the runner.
- Fix: Use supported keywords (print, run, calc) or extend the runner with an adapter for the new keyword.

2) Error: "Command failed: ..." (from run: shell(...))
- Cause: The underlying shell command returned non-zero.
- Fix: Inspect command output, ensure required tools are installed in the `den`, escape arguments properly. For production, prefer adapter calls instead of raw shell commands.

3) Error: "calc: ERR (eval)"
- Cause: The arithmetic expression failed to parse or used unsupported functions.
- Fix: Use simple JS arithmetic or extend the runner to safely parse math expressions rather than using eval.

4) Error: "Permission denied" when running a plan
- Cause: File or binary permissions in the `den` or runner are incorrect.
- Fix: Ensure `lion-runner.cjs` is executable and the `den` user has rights; run `chmod +x scripts/lion-runner.cjs` and place it in den/bin.

5) Error: "Missing adapter: mpesa"
- Cause: A plan expects an adapter the runtime doesn't provide.
- Fix: Implement the adapter module under `/src/integrations` and register it with Lion runtime (future runtime feature).

6) Error: "Secrets not found"
- Cause: Plan relies on secrets (API keys) not present in environment or secrets store.
- Fix: Use `ensure-env` to populate defaults for dev or configure secret store for production. Do not store production secrets in repo.

7) Error: "Coursebook sync failed"
- Cause: `scripts/coursebook-sync.cjs` was run without write permissions or in a read-only CI stage.
- Fix: Ensure the job has write permissions to the docs folder or run the script in a separate artifact generation step.

Security-specific issues

- Lion plans execute host commands via `run: shell()` in v0.1 — running untrusted plans is unsafe. The runtime must be sandboxed or use adapters with strict argument validation.

If you encounter an error not listed here, create an issue and include:
- Runner logs
- Plan (`.li` file)
- Environment manifest (.env)
