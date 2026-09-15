# ALLAUTO.md - QMOI Automation Overview

## Purpose
This file lists the automation capabilities that keep the QMOI repositories self-maintaining, self-validating, and resilient.

## Automation Domains

### Repository Automation
- branch sync
- backup sync
- repository health checks
- validation on PR
- workflow monitoring
- issue and PR trigger management

### Agent Automation
- full validation suite
- platform validation
- feature validation
- auto-healing
- missing-file reconstruction
- syntax repair for Python and YAML
- checkpoint resume

### Recovery Automation
- missing file detection
- corruption detection
- YAML repair
- Python repair
- graceful degradation
- degraded-mode execution

## Governance
All automation is expected to remain self-hosted, GitHub-driven, and resilient to partial file-loss or syntax issues without requiring manual intervention.

## Complete Repository And History Coverage

Every merge or synchronization run must inventory both
`thealphakenya/qmoi-enhanced` and `thealphakenya/Alpha-Q-ai`, every reachable
local and remote branch, and the complete tracked tree. The historical ref
`origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp` is mandatory
input, not an optional backup. Its contents are also materialized in
`qmoi-enhanced-history-14/` and must be considered for missing files,
directories, implementations, and documentation.

The agent must classify every path as `QE`, `AQ`, `BOTH`, `HISTORICAL`, or
`CONFLICT`, including unused paths and every `.md` file. Missing paths are
reconciled only after dependency, ownership, security, and feature-degradation
checks. A conflict or uncertain ownership blocks automatic mutation and creates
a review record; it must never be silently discarded.

The required sequence is: discover repositories and refs, snapshot commits and
trees, inventory markdown and non-markdown paths, classify ownership, build a
merge plan, create a recoverable checkpoint, apply only authorized changes,
validate syntax/tests/links, compare the complete post-merge tree, update
`MERGE.md` and `ALLMDFILESREFS.md`, and publish telemetry. Merge success requires
evidence for both repositories and the historical source; a partial-file result
is insufficient.
