
# SCRIPTS.md

This file documents all scripts in the `scripts/` directory, their usage, and integration for QCity, QMOI AI, and QMOI Space. All scripts are checked to ensure they are used and served as expected. Unused or duplicate scripts are marked for removal.

## Directory Structure

```
scripts/
├── api/
│   └── automation_api.py  # FastAPI endpoints for AI automation, serving QCity, QMOI AI, QMOI Space
├── ai_automation.py       # Core AI automation, orchestration, and optimization
├── search_and_serve_components.py  # Logs unused components/UI features for integration
├── auto_updater.py        # Automates documentation updates and system checks
├── ensure_build_files.py  # Ensures all build files are present and up-to-date
├── doit.py                # Task automation and orchestration
├── ... (many more scripts for deployment, error handling, device management, etc.)
```

## Usage & Integration
- **api/automation_api.py**: Provides REST API endpoints for automation, used by QCity, QMOI AI, and QMOI Space for orchestration and health checks.
- **ai_automation.py**: Main automation engine, runs all AI-powered tasks, error fixing, and optimization for all platforms.
- **search_and_serve_components.py**: Scans all component/UI directories, logs unused features, and ensures all are integrated and served.
- **auto_updater.py**: Keeps documentation and system files up-to-date, triggers auto-fix and health checks.
- **ensure_build_files.py**: Verifies build files for all apps/platforms, triggers rebuilds if needed.
- **doit.py**: Orchestrates tasks and automation flows for all QMOI systems.
- **Other scripts**: Cover deployment, device management, error handling, financial integration, and more. All are referenced in automation flows and serve QCity, QMOI AI, and QMOI Space.

## UI Features & Coverage
- All scripts related to UI features (e.g., enhanced_preview.py, enhanced_qmoi_implementation.py) are checked for usage in QCity, QMOI AI, and QMOI Space.
- Unused/duplicate scripts are marked for removal in SERVINGERRORSISSUES.md and will be deleted in the next cleanup.

## Automation & Health
- All scripts are referenced in `ALLMDFILESREFS.md` and are planned for further enhancement and integration.
- Automation ensures every script is used, and unused ones are logged for removal.

**Status:** All scripts are now checked for usage and integration. No unused/duplicate scripts will remain after next cleanup. All UI features and automation flows are covered for QCity, QMOI AI, and QMOI Space.