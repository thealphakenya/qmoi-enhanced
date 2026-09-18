# QMOINETWORK.md

QMOI network automation keeps the clone/autoclone topology, routing, and platform coordination synchronized across GitHub, QVillage, Netlify, Vercel, Gitpod, Hugging Face, Quantum, and Dagshub. The network state is treated as a live operational graph rather than static docs.

## Active automation
- host, repo, and workspace coordination stay synchronized.
- clone and autoclone flows share the same orchestration contract.
- platform health checks, deployment checks, and docs remain aligned with the current runtime.
- the central orchestrator registry tracks network, VPN, security, and workflow readiness in one place.

## Orchestration-aware networking

The network layer is no longer treated as a standalone subsystem. It is an operational dependency of the wider QMOI orchestration graph.

- route health checks are part of the orchestrator health model.
- network capability checks must happen before sync, deploy, or security actions.
- VPN and mask state are coupled to route selection, not isolated from it.
- live stream and monitor outputs must reflect network state changes immediately.

## Service integration map

- QMOI orchestrator: owns the improvement backlog and health ranking.
- network layer: executes routing, tunnel, and traffic decisions.
- mask layer: protects identity while preserving operational accountability.
- QVS/security: denies unsafe or unvalidated flows.
- release and sync layers: only act once network readiness and security gates are green.

## Runtime rule

A network action is valid only when the orchestrator, route health, safety policy, and tracking state all agree that the action is safe and recoverable.

