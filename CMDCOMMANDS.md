# QMOI Command Reference (CMDCOMMANDS.md)

This file lists all essential commands for running, testing, self-healing, and monitoring QMOI across all platforms. Use these in PowerShell, Bash, or your preferred shell (see notes for syntax differences).

---

## PowerShell Command Sequence (Recommended for Windows)

```
npm run qmoi:autodev:full; npm run qmoi:always-fix-all; python scripts/run_all_tests.py; python scripts/qmoi_health_monitor.py
```

- **Note:** If you want to stop on error, run each command one by one and check output before proceeding.

## Bash/Linux/Mac Command Sequence

```
npm run qmoi:autodev:full && npm run qmoi:always-fix-all && python scripts/run_all_tests.py && python scripts/qmoi_health_monitor.py
```

---

## Individual Commands

- `npm run qmoi:autodev:full` — Run full QMOI automation, self-healing, and deployment cycle.
- `npm run qmoi:always-fix-all` — Aggressively fix all errors in parallel, retrying up to 3 times.
- `python scripts/run_all_tests.py` — Run all Python-based tests (unit, integration, E2E, performance).
- `python scripts/qmoi_health_monitor.py` — Run full system health check and report.

---

## Troubleshooting

- To see available npm scripts:
  ```
  npm run
  ```
- If a script is missing (e.g., `qmoi:autodev:full`), check your `package.json` and add the script if needed.
- For PowerShell, use `;` to separate commands. For Bash, use `&&`.
- If you see `{ was unexpected at this time.`, you may be using CMD instead of PowerShell. Use PowerShell or run commands one by one in CMD.

---

## Adding Missing Scripts

If you see `Missing script: "qmoi:autodev:full"`, add the following to your `package.json` under `"scripts"`:

```
"qmoi:autodev:full": "node scripts/services/qmoi_autodev_daemon.ts",
"qmoi:always-fix-all": "node scripts/enhanced-error-fix.js"
```

Adjust the command as needed for your project structure.

---

## UI Health Check & Self-Healing

### Hugging Face Space UI Health Check
```
python scripts/test_hf_space_ui.py --space-url https://huggingface.co/spaces/alphaqmoi/qmoi-ai-system
```

### Local Dashboard UI Health Check (Playwright/Cypress example)
```
npm run test:ui
```

### Trigger UI Self-Healing
```
npm run qmoi:always-fix-all
```

- If a UI test fails, QMOI will auto-fix and retry. Persistent failures are escalated to master with logs and screenshots.

---

*For more details, see README.md, MASTERGUIDE.md, QMOICLONEGITLAB.md, and ALLMDFILESREFS.md.* 