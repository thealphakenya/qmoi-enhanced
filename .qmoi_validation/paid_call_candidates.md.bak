Paid-call & provisioning candidate report
=======================================

Summary
-------
This file lists the highest-priority files and code locations that likely perform paid operations, network provisioning, or external uploads and therefore should be gated by the billing guard and/or require explicit operator approval/credentials before running in production.

Scan results (high level)
-------------------------
- Total heuristic matches found: ~200 (search for keywords like "huggingface", "hf_", "upload", "s3", "boto3", "deploy", "dns", "route53", "cloudflare", "certificate", "stripe")
- Top-priority candidates (quick review recommended):
  1. scripts/hf_model_sync.py
     - Uses huggingface_hub (HfApi, upload_file/upload_folder).
     - Reads HF_TOKEN from env and performs uploads: definitely a paid/external operation (bandwidth, storage, inference credits).
     - Action: wrap main upload call with billing_guard.require_billing or explicit check and add a --dry-run mode.

  2. scripts/hf_model_sync.py (duplicate references across manifests and docs)
     - Present in multiple docs and validation reports; ensure the generated PAYED docs reflect gating.

  3. scripts/domain_assigner.py
     - Generates domain proposals and contains explicit gating: refuses to provision unless QMOI_PROVISION_DNS set.
     - Action: keep gating; add stronger credential checks and audit log entries in billing logs when provisioning is allowed.

  4. scripts/*deploy* / scripts/deployment/* (Dockerfiles and deployment helpers)
     - Found many deployment scripts and Dockerfiles. These may call cloud provider CLIs or APIs in other scripts. Add dry-run and require credentials gating.

  5. Placeholder files & TODOs that mention uploads or provisioning
     - .qmoi_validation/placeholder_report.json and placeholder_suggestions.json contain many TODO/comments like "TODO: Upload to GDrive, S3, HuggingFace" and "Simulate server deployment".
     - Action: convert these TODOs into tracked tasks and add tests/mocks before production implementation.

  6. scripts/qmoi-app-builder.py and variants referenced in CI/backups
     - Found in CI backups (.gitlab-ci.yml backups) — these scripts can trigger deployments. Add billing/approval gating when invoked with network/deploy flags.


Recommended next steps (safe, incremental)
-----------------------------------------
1. Create a non-destructive audit PR that:
   - Adds billing checks to the top candidates (scripts/hf_model_sync.py and any upload scripts) using scripts/billing_guard.require_billing.
   - Adds a --dry-run flag to each upload/provision command that simulates the operation and writes a proposed action into .qmoi_validation/*.json.

2. Produce an automated candidate report (this file) and then a follow-up patch that:
   - Replaces direct calls to huggingface_hub.upload_* or boto3 upload with a small wrapper function (e.g., scripts/external_uploader.py) which enforces billing guard and logs to .qmoi_validation/billing_logs.json.

3. For DNS/certificate provisioning flows (domain_assigner.py):
   - Keep QMOI_PROVISION_DNS gating by default (off).
   - When enabled, require the presence of provider creds AND a signed approval file or PR label (deferred manual approval) before executing real changes.

4. Add/extend unit tests and a mock provider layer for the top integrations (Hugging Face, S3, Cloudflare, Route53) so CI can run full integration tests in dry-run mode.

5. After steps 1-4 pass in dry-run CI, we can offer an "apply" flow that runs in a controlled environment (operator sets QMOI_ENABLE_BILLING=1, QMOI_PROVISION_DNS=1 and provides credentials). All actions must be logged and reversible where possible.


Where artifacts live
--------------------
- Audit outputs and run summaries: .qmoi_validation/
- Placeholder suggestions: .qmoi_validation/placeholder_suggestions.json
- Pipeline run logs: .qmoi_validation/pipeline_runs/
- Domain proposals: .qmoi_validation/domain_assignments.json


If you'd like, I can:
- (A) Create a safe PR that implements the billing guard wrappers for the top 3-5 files (non-destructive, adds --dry-run) and tests.
- (B) Produce a more exhaustive paid-call candidates JSON for use by automated edit scripts.
- (C) Start implementing the upload wrapper (scripts/external_uploader.py) and update hf_model_sync.py to call it.

Tell me which option to proceed with (A/B/C) or ask for a different next step.

Generated: (automated scan) by the assistant
