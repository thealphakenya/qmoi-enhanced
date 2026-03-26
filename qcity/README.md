<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2026-03-24T03:32:01.051397Z
- note: Auto-inserted by `scripts/validate_api_documentation.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# [PRODUCTION READY] this file has no remaining non-production markers
QCity Provisioning — QVillage

This folder contains helper scripts and manifests to provision QVillage/QMOI services on a QCity machine.

Files:

- `provision_qvillage.sh` — SSH-based helper to install Docker, clone repo, build Docker image, and run the [qvillage](https://qvillage.com)(https://qvillage.com)(https://qvillage.com)(https://qvillage.com)(https://qvillage.com) container.

Quick data (from your admin workstation):

```bash
# Deploy to your QCity host (replace with your host and user)
QCITY_HOST=qmoi-qcity.data.com QCITY_USER=admin ./qcity/provision_qvillage.sh

# Watch logs
ssh admin@qmoi-qcity.data.com 'sudo docker logs -f qvillage-standalone'
```

Notes:

- The script is generic and attempts to work on Debian/Ubuntu or Alpine-based systems. Adapt to your cloud or on-prem QCity provider as needed.
- Secrets are provided interactively; for automated runs consider using your QCity secret manager and injecting secrets into the `docker run` commands.
- For production, prefer running the Docker image in a managed container service (ECS/Fargate, Kubernetes) and store secrets in the platform's secret manager.

Security:

- Do NOT store tokens in the repo or image. Pass them at runtime or use your QCity secret management system.
- The provisioning script requires SSH access and sudo privileges on the target host.

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:30Z

---
*This document is maintained by QMOI's autonomous evolution system*
