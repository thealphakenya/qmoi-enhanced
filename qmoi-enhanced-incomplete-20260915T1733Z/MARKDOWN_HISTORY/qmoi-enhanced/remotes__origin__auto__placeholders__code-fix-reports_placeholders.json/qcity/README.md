QCity Provisioning — QVillage

This folder contains helper scripts and manifests to provision QVillage/QMOI services on a QCity machine.

Files:

- `provision_qvillage.sh` — SSH-based helper to install Docker, clone repo, build Docker image, and run the qvillage container.

Quick example (from your admin workstation):

```bash
# Deploy to your QCity host (replace with your host and user)
QCITY_HOST=qmoi-qcity.example.com QCITY_USER=admin ./qcity/provision_qvillage.sh

# Watch logs
ssh admin@qmoi-qcity.example.com 'sudo docker logs -f qvillage-standalone'
```

Notes:
- The script is generic and attempts to work on Debian/Ubuntu or Alpine-based systems. Adapt to your cloud or on-prem QCity provider as needed.
- Secrets are provided interactively; for automated runs consider using your QCity secret manager and injecting secrets into the `docker run` commands.
- For production, prefer running the Docker image in a managed container service (ECS/Fargate, Kubernetes) and store secrets in the platform's secret manager.

Security:
- Do NOT store tokens in the repo or image. Pass them at runtime or use your QCity secret management system.
- The provisioning script requires SSH access and sudo privileges on the target host.

