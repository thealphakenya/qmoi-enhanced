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

## Notes
Ports are documented as operational defaults and may vary by environment, but the names and roles remain stable across the repo stack.
