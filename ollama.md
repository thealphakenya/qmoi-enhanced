# ollama.md

This document describes the Ollama autonomous agent capabilities, production expectations, and current orchestration behavior.

## Purpose
- Document the autonomous Ollama agent's feature set and the exact repository automation it performs.
- Record how the agent resumes work, merges archives, updates docs, and validates the repository.
- Serve as both a user-facing agent spec and a machine-generated verification artifact.

## Core capabilities
- Resume execution from the last run using .ollama_agent_state.json and processed item history.
- Detect changes to resumefromhere.txt and refresh the execution plan automatically.
- Maintain resumefromhere.txt as the authoritative source of truth for pending work, progress, and journey map tracks.
- Scan archive/backup directories for missing or unmerged files and merge them into the working tree.
- Scan download/app/build/release documentation for referenced .py scripts and ensure those scripts are present, updated, or noted.
- Generate and synchronize manifest files for APIs, endpoints, routes, merge operations, documentation inventory, production readiness, and error tracking.
- Create or refresh tests for discovered Python modules and update ALLTESTSAUOTOTESTS.md accordingly.
- Create or refresh hooks/webhooks documentation and record workflow token gaps in ALLHOOKSWEBHOOKS.md.
- Normalize local development ports to production port equivalents in repository files.
- Start a local helper server and optional production helper server for verification endpoints.
- Run safe repository verification with pytest and Python compile checks when requested.
- Persist audit logs, live notifications, and completion reports for every autonomous run.

## Execution behavior
- On each run, the agent loads state, checks resumefromhere.txt, merges archives, gathers pending work, and updates the plan.
- It writes JOURNEY MAP TRACKS at the top of resumefromhere.txt with counters for pending_before, pending_after, merged_archives, and verification status.
- It updates resumefromhere.txt with progress counts, a progress ledger, repository inventory, and explicit agent instructions.
- If AUTO_CONTINUE=1 is enabled, the agent loops until no pending items remain or iteration limits are reached.
- If RUN_FULL_TESTS=1 is set, the agent starts a production helper server and performs verification even if pending work remains.
- It avoids infinite loops by tracking processed items and stopping when no new progress is made.

## Required artifacts
- API.md, ENDPOINTS.md, ROUTES.md, MERGE.md, DOCS.md, production.md, productionenhanced.md, ALLERRORS.md, ALLBACKEND.md, ALLFRONTEND.md, ALLUI.md, ALLPORTS.md, UNIVERSALS.md, STYLES.md, resumefromhere.txt, OLLAMA_ACTIVITY_FEED.md.
- These artifacts are verified as present and non-empty on each run.

## Reporting
- OLLAMA_ACTIVITY_FEED.md is updated with the latest status and branch metadata.
- OLLAMA_PENDING_REPORT.md and OLLAMA_COMPLETION_REPORT.md are generated for pending work and completion summaries.
- The agent writes .ollama_agent_audit.jsonl and .ollama_agent_state.json for runtime traceability.

## Change control
- The agent creates backups for files it modifies when feasible, using .ollama.bak and audit markers.
- It refrains from destructive replacements and preserves audit trails for every automated change.

## Notes
- This file is regenerated automatically by the agent on each run.
- Treat this document as the current capabilities contract for the Ollama autonomous agent.
