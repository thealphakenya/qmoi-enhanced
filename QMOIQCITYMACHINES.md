# QMOI & QCity Machines Inventory

This document lists machine classes, device types, and high-level roles used across QMOI and QCity infrastructure.

Machine classes
- qcity-orchestrator: Always-on Linux hosts running the Sync Orchestrator and control plane services.
- qcity-runner: Elastic build/test runners for cloud builds and packaging.
- qcity-edge: Edge devices (Raspberry Pi, SmartTV, Android TV boxes) running lightweight agents.
- qcity-db: Database nodes (Postgres/etcd) providing stateful storage and replication.
- qcity-storage: Object storage nodes for artifacts and release binaries.
- qcity-ai: GPU-enabled nodes for model training and inference (elastic GPU pool).

Devices
- Desktop/server: Linux/Windows/Mac build hosts.
- Mobile/embedded: Android, iOS, SmartTV images and build containers.

Operational notes
- Each machine is monitored and auto-scaled based on load and retention policies.
- Machines in `qcity-orchestrator` group are marked for priority scheduling and increased resource limits.
