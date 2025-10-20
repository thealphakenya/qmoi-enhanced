# PRODUCTION CHECKLIST

This checklist is a practical, ordered set of steps and validations to make QMOI production-ready. Treat it as a living doc and re-run checks after any change.

1. Code & Repo
   - [ ] All linting issues fixed for all languages used (Python, JS/TS, Shell, etc.).
   - [ ] Tests: unit & integration tests pass locally and in CI for core services.
   - [ ] Vulnerability scan (dependabot/Snyk) run and critical issues resolved.
   - [ ] All secrets moved to repository secrets or an external secrets store (Vault/KMS).

2. CI/CD & Releases
   - [ ] Workflows are defined and use least-privilege service accounts or `QMOI_TOKEN` secret.
   - [ ] Release automation validated (tag -> build -> publish to artifacts storage).
   - [ ] Canary and rollback strategies are implemented for deploys.

3. Infrastructure & Orchestrator
   - [ ] Orchestrator control-plane deployed to highly-available Linux hosts.
   - [ ] Agents deployed on every runner/host with auto-update enabled.
   - [ ] Persistent storage (Postgres/etcd) with cross-region replication configured.
   - [ ] Autoscaling policies verified (CPU, memory, disk, GPU pools).

4. Observability & Monitoring
   - [ ] Metrics pipelines (Prometheus, Grafana) in place for apps, orchestrator, and runners.
   - [ ] Log aggregation configured (ELK/Fluentd/Cloud Logging).
   - [ ] Alerts for service degradation and automated remediation playbooks exist.

5. Security & Access
   - [ ] Branch protection rules applied to main branches.
   - [ ] Secrets injected at runtime via repo secrets or cloud KMS.
   - [ ] GitHub App and webhooks validated; signature verification implemented.

6. Models & AI
   - [ ] Model storage and versioning verified (artifacts bucket + manifest).
   - [ ] Model inference cluster healthchecks passing and autoscaling verified.
   - [ ] Training pipelines guarded with resource quotas and monitoring.

7. Final Smoke Tests
   - [ ] Deploy a canary release and run end-to-end smoke tests.
   - [ ] Validate webhook delivery and QMOI responses.
   - [ ] Confirm automated rollback on failures.

Notes
- Use `POSTPRODUCTIONCHECKLIST.md` for daily/weekly checks after production.
- Use `ALLERRORSTYPESFILES.md` to map observed errors to fixes and tests.
