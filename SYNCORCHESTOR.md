# Sync Orchestrator Design and Operational Plan

This document describes the Sync Orchestrator for QMOI and QCity: a global orchestration layer that keeps apps, runners, engines, machines, servers, databases and resources in sync across platforms.

Goals
- Provide a single control plane that ensures every QMOI/QCity resource (apps, runners, servers, databases, machines) is in the desired state.
- Ensure the orchestrator runs on highly-available Linux machines with elastic resources.
- Provide secure, token-based operations using repository secrets tied to `thealphakenya`.

Core capabilities
- Continuous discovery and heartbeat: detect resources and maintain liveness.
- Declarative desired state: use YAML manifests to define desired app/service states.
- Reconciliation loop: continuously compare actual vs desired state and take remediating actions.
- Cross-platform sync: communicate with QMOI AI, QCity runners, and per-app agents via gRPC/HTTPS.
- Self-healing: auto-restart failed services and re-provision resources when degradation is detected.
- Secrets management: integrate with GitHub Secrets, Vault or KMS for tokens and credentials.

Architecture overview
- Control plane: a set of microservices running inside a resilient Linux host pool.
- Agents: lightweight agents on each machine (cloud VM, edge device, or QCity host) that report status and execute actions.
- Message bus: resilient queue (e.g., NATS/Redis/Cloud PubSub) for commands and telemetry.
- Storage: highly available database for state (Postgres/etcd) with cross-region replication.

Security and access
- All workflows will run using the `thealphakenya` credential (stored as a repository secret named `QMOI_TOKEN`) for operations which require GitHub access.
- The orchestrator will follow least-privilege when interacting with external services.

Policy for "always-on" Linux machines
- Machines marked `qcity-orchestrator` must run on infrastructure that supports elastic compute, storage and memory.
- Use cloud autoscaling groups or custom autoscaling controllers to ensure no resource saturation.

Operational playbook (summary)
1. Bootstrapping: deploy orchestrator into linux host pool using a bootstrap image.
2. Register: each agent registers with control plane and receives its desired-state manifests.
3. Reconcile: agent pulls manifests, applies configuration, and streams status back.
4. Failure handling: orchestrator attempts 3 remediation steps then escalates to human operators.

Notes and next steps
- Implement prototypes for agents and control-plane services.
- Create GitHub Actions workflows to deploy and update orchestrator services using `QMOI_TOKEN`.
