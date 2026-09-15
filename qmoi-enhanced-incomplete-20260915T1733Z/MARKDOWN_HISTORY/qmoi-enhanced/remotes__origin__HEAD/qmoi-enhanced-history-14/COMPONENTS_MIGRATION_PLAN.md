# COMPONENTS_MIGRATION_PLAN.md

- OWNER: Ollama autonomous agent
- GENERATED: Please do not manually remove; agent will own execution and updates.

## Migration Tasks

TASK: Move all contents from `components/` into `src/components/` preserving subdirectories and file timestamps.
TASK: Update import paths across the repo to reference `src/components/` instead of `components/` (TS/JS/TSX/JSX imports and absolute paths).
TASK: Update `COMPONENTS.md`, `UNIVERSALS.md`, `STYLES.md`, and `TREE.md` to reference the new `src/components/` locations.
TASK: Append detailed migration actions and completion checkpoints to `resumefromhere.txt` as JOURNEY MAP TRACKS entries; the Ollama agent will own these entries.
TASK: Refresh `API.md`, `ENDPOINTS.md`, `ROUTES.md`, and `ALLPORTS.md` to reflect any changes caused by component moves.
TASK: Produce per-directory merge reports under `MERGE_REPORTS/` for backend, frontend, scripts, and components after merging archives.
TASK: Ensure `ALLBACKEND.md` and `ALLFRONTEND.md` are rebuilt and committed after migration.
TASK: Merge implementations from backup/archive directories into canonical files where appropriate and record decisions in `MERGE_REPORTS/`.
TASK: Run repository verification and collect results; if failures occur, create a dedicated `OLLAMA_PENDING_REPORT.md` entry and pause for human review.

## Execution

- The Ollama autonomous agent will read and execute `TASK:` lines in this file; do not remove the `TASK:` prefixes.
- Use `COMMAND:` lines if you want the agent to run an explicit shell command (e.g., `COMMAND: python3 scripts/my_migration_runner.py`).
