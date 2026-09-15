---
title: "LION Operating System (LION OS)"
qmoi_validation_frontmatter: true
---

# LION Operating System (LION OS)

This document describes the LION operating system: the orchestration, permissions,
runtime agents, validation hooks, and revenue orchestration patterns used across
projects (QMOI, QVillage, Quantum, QStore, WhatsApp integrations, etc.).

Overview
--------

LION is an orchestrator design pattern that operates as a lightweight runtime and
policy engine. It is intentionally conservative and follows a "scan -> propose -> apply"
workflow by default. LION's responsibilities include:

- Orchestrating CI/CD and build pipelines for cross-platform artifacts.
- Validating documentation and artifact availability (links, checksums).
- Running revenue audits and monitoring expected payouts vs. actuals.
- Managing wallet integrations and payment reconciliation.
- Automating deal workflows (offers, escrow, acceptance rules).
- Ensuring biometric flows and login pages meet security standards.
- Self-healing of agents and processes, and rolling updates.

Principles
----------

- Principle of least privilege: LION only requests the minimal permissions required.
- Dry-run by default: actions are proposed and backed up before apply.
- Auditable: every action has an audit trail and optional human approval gate.
- Test-first: LION verifies operations in sandbox/testnet before production.

Key Components
--------------

- lion-agent: local process that executes checks and reports heartbeats.
- lion-orchestrator: coordinates jobs, CI triggers, and release publishing.
- lion-secrets: integration with secure vault (HashiCorp Vault, AWS Secrets Manager).
- lion-audit-log: append-only audit log for deals, payments, and publishing events.
- lion-validators: small scripts used for docs, links, builds, and revenue scans.

Integration Points
------------------

- QVillage: autodev flows trigger model retraining jobs, publish model artifacts to QStore, and create PRs for website updates.
- Quantum: sync compute manifests and ensure reproducible environments for experiments.
- QStore: dataset indexing and shard health checks—LION schedules reindex jobs and snapshot backups.
- WhatsApp: webhook verification, signature checks, and message flow tests.
- Wallets & Payments: sandbox drivers for testnets, reconciliation jobs, and escrow automation for deals.

Revenue Orchestration
---------------------

LION maintains a `REVENUE_SPEC` that maps documented revenue sources and expected amounts to validation jobs. Typical steps:

1. Extract revenue claims from MD files.
2. Map claims to monitoring checks (e.g., daily sales metric, active subscriptions).
3. Run reconciliation jobs that compare expected vs. actual and raise alerts.

Security & Permissions
----------------------

- Keep signing keys in a vault; never in repo or plain environment variables.
- CI publishes only from a dedicated publish job with manual approval.
- Payment gateways use sandbox credentials for tests; production keys are rotated.

Validation Hooks
----------------

- `scripts/run_validations.py` — orchestrator for docs/artifact checks.
- `scripts/generate_revenue_spec.py` — generate `docs/REVENUE_SPEC.md` from repository docs.
- `scripts/check_github_releases.py` — verify release assets exist for expected artifacts.

Operational Runbooks
--------------------

See `tools/lionctl` for recommended dry-run commands. For any apply operations, require:

1. Create a PR with suggested changes.
2. Run CI tests and security scans.
3. Require one or two human approvals for publishing/signing.

Appendix
--------

Add per-project details below (QVillage, Quantum, QStore, WhatsApp integrations, SLL biometric pages) as the implementation progresses.
# LION Operating System — Overview

Purpose
-------
LION is the orchestrator and lightweight runtime that ensures QMOI can validate its own state, execute automated development tasks, manage revenue workflows, perform deals/contract automation, and self-heal when components drift. This document describes the recommended architecture, permissions, runtime agents, and validation hooks that projects should adopt.

Core responsibilities
---------------------
- Orchestration: run validations, builds, and release publishing pipelines.
- Revenue orchestration: collect telemetry about monetized products, reconcile payments, and trigger payouts.
- Deals automation: prepare offer templates, execute negotiation workflows, and manage escrowed funds.
- Self-heal: detect anomalies (service down, corrupted docs, missing artifacts) and either remediate automatically or create PRs for human review.
- Security: store secrets securely, restrict permissions, and provide audit trails for all sensitive actions.

Key components
--------------
- lionctl: a lightweight CLI for local interactions and scripted orchestration (dry-run by default).
- LION agent: a small daemon (optional) that runs on orchestrator hosts and can accept signed jobs.
- Validation orchestrator: Python scripts under `scripts/` (e.g., `run_validations.py`) that coordinate link checks, artifact verification, and PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) scanning.
- Payment adapters: adapters that implement a common interface to interact with wallets, payment gateways, and testnets. Implementations should live under `services/payments/` and support sandbox/testnet drivers.
- Deal service: workflows and templates under `services/deals/` to create, negotiate, and settle agreements. Use escrow patterns where real funds are involved.

Permissions & security model
---------------------------
Principles:
- Least privilege: give LION only the permissions it needs for the job.
- Secret vaults: keys and tokens must be stored in a vault (HashiCorp Vault, GitHub Secrets, or cloud KMS) and never in plaintext in repo.
- Approval gates: publishing real artifacts must require manual approval in CI.

Recommended scopes:
- Read-only repo access for validation and docs checks.
- Scoped write access for publishing assets to Releases or a dedicated registry.
- Secrets access via service principal with limited lifetime tokens.

Revenue & payments
------------------
LION's role in revenues:
- Monitor monetized projects (games, apps, animations) and collect telemetry on installs, purchases, and ad revenue.
- Reconcile expected payouts declared in documentation (`docs/REVENUE_SPEC.md`) with actual ledger entries.
- Trigger payouts to configured wallets or bank accounts using sandbox/testnet drivers during testing.

Design notes:
- Use an adapter pattern: `services/payments/{stripe_adapter,paypal_adapter,chain_adapter}`.
- All payment actions must be idempotent and logged for audit.
- For on-chain operations, require a separate signer service and simulate flows on testnet before mainnet operations.

Validation & continuous checks
------------------------------
- Use `scripts/run_validations.py` to orchestrate:
  - Markdown link checks and http->https upgrades where safe
  - Artifact checksum verification against `qcity-artifacts/qmoi_build_report.json`
  - PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) scanning report
- Integrate Playwright visual regression tests for critical UI components.
- Add API route verification (OpenAPI or JSON Schema) to ensure `API.md` matches actual endpoints.

Developer workflow
------------------
1. Local: use `tools/lionctl` for dry-run commands (status, verify, permission-audit).
2. CI: run validation orchestrator on PR with `scripts/run_validations.py`; require human approval for `--apply` changes.
3. Release: builds run in CI, artifacts are published to Releases behind a manual approval gate; `scripts/check_github_releases.py` validates presence.

Onboarding checklist for a new project
-------------------------------------
 - Add `docs/REVENUE_SPEC.md` with monetization sources and expected metrics.
 - Add wallet configuration in `configs/wallets/` (do not put private keys in repo).
 - Ensure `scripts/run_validations.py` can find artifacts and docs index.
 - Add Playwright tests for main UI flows under `tests/ui-contracts/`.

Next steps and extension points
-------------------------------
- Implement `services/payments/` adapters and tests.
- Implement `tools/lionctl permission-audit --apply` to propose minimal ACL changes.
- Add a small LION agent (Go/Python) for remote job execution with signed job payloads.
- Integrate audit logging (structured events) to a centralized log store.

References
----------
- `tools/lionctl` — local CLI scaffold
- `scripts/run_validations.py` — orchestration entrypoint
- `qcity-artifacts/qmoi_build_report.json` — canonical artifact inventory
- `docs/ALLTESTSAUTOTESTS.md` — tests index (to be created)

"""End of LION operating system doc."""
<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# LION OPERATING SYSTEM (LION OS)

Goal
- Define LION as an extensible runtime/OS abstraction that can be installed on multiple platforms and integrated tightly with QMOI (Lion agent has full orchestration permissions for autodev, self-heal, builds, and documentation updates).

Core ideas
- Lightweight kernel layer: minimal runtime exposing APIs for resources, file access, networking and sandboxed execution of 'Lion apps'.
- Cross-platform installers: package for Linux (deb/rpm), Windows (MSI), macOS (pkg) and container images.
- Desktop UX: icons, folders, user settings, multi-user support, plugin system.
- Developer-first: `lionctl` CLI to manage installs, build apps, run test harnesses, and update docs.

Security & permissions
- Default least-privilege; explicit grant for orchestration features. Lion agent must request and log permission grants when acting on binaries, ngrok links, orchestrator endpoints, or builds.

Integration with QMOI
- QMOI will:
  - maintain Lion agent code and auto-update it
  - provide autodev pipelines to build Lion images and app artifacts
  - run self-heal and telemetry to ensure Lion nodes remain healthy

Files to add / next tasks
- `docs/lion_features.md` — features and APIs
- `docs/lion_installers.md` — build & release steps for all platforms
- CLI: `tools/lionctl` — scaffolding and initial commands
- Desktop: `packages/lion-desktop` — initial React/Electron UI scaffolding

Installer & builds
- Create CI pipelines that produce cross-platform packages on merge to main.
- Replace any PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) links in docs with real download locations for installers (no placeholders in final docs).

Telemetry & logging
- Standardized structured logging for Lion actions and audit trail of file/permission changes.

Notes
- This file is a starter plan — implementation will be incremental. Next step: generate concrete tasks in the todo list (done) and start by producing `lionctl` scaffolding and a minimal desktop prototype.

<!-- QMOI_VALIDATION_START -->
{
  "file": "docs/LIONOPERATINGSYSTEM.md",
  "validated_at": "2025-10-26T20:51:22.699202Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "LION Operating System (LION OS)"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
