# ALLPORTS.md - Port and Service Map

## Purpose
This file documents the expected port and service layout for the QMOI project and its supporting automation environment.

## Standard Port Map
- 8000: primary local service port
- 8080: monitoring / status service
- 3000: frontend or dashboard layer
- 5000: API or local automation service
- 5432: PostgreSQL or local DB service (if present)
- 6379: cache / queue service (if present)
- 11434: Ollama local runtime API/default host
- 8081: alternate health/telemetry service
- 9000: local automation or self-healing gateway
- 9090: metrics or observability endpoint

## Ollama autonomous agent runtime port and merge usage

The Ollama autonomous agent must include the active repo, the historical archive, and the markdown inventory in its operational checks, and it must confirm that no merge step conflicts with the expected runtime ports. The agent should treat the active port map as a contract, validate route and endpoint alignment, and compare the live repo with the historical archive before migrating any recovered feature into the active repo.

## QMOI Runtime Port Usage
- Local dev and validation flows: 8000, 8080, 5000
- Ollama runtime: 11434
- GitHub-hosted automation: dynamic ephemeral runner ports, not permanent repo ports
- Historical repo snapshots: use repo-local config, not fixed service ports

## Notes
Ports are documented as operational defaults and may vary by environment, but the names and roles remain stable across the repo stack, the autonomous runtime, and the historical archive inventory.
