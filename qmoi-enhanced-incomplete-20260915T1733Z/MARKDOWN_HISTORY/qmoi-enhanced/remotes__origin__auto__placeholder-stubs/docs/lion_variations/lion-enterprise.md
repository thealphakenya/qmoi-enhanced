# lion-enterprise

Description
- A hardened, support-focused distribution for customers requiring SLA-backed deployments, extended metrics, and centralized management.

Key features
- Built-in Prometheus metrics and health endpoints
- Centralized configuration and RBAC integration
- Optional commercial telemetry and usage reporting (opt-in)

Release & packaging
- Packaged as an OCI image with Helm chart and optional operator for Kubernetes.
# LION-Enterprise (On-Prem / Air-gapped)

Purpose
- A hardened LION distribution tailored for enterprise customers needing on-prem or air-gapped deployments.

Key features
- Support for offline package mirrors, signed update bundles, integration with enterprise AD/LDAP, advanced RBAC and audit export.

Target platforms
- VMware, OpenStack, bare-metal, and private k8s clusters.

Packaging
- OVA/VM images, Helm charts for private clusters, offline tarballs with signed manifests.

Release artifacts
- `lion-enterprise-vX.Y.Z.ova`, `lion-enterprise-vX.Y.Z.tar.gz` (signed).

Auto-update strategy
- Signed offline patch bundles distributed through secure channels; customers can opt into push or pull update models.

Monetization
- Per-seat/per-node licensing, enterprise support contracts, long-term maintenance subscriptions.

Integration with QMOI
- Enterprise telemetry opt-in with strong privacy and export controls; enterprise-managed QVS instances.
