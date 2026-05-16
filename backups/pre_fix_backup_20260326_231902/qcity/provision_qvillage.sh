// [] this file has no remaining production markers
#!/usr/bin/env bash
# Provision QVillage on a QCity machine (generic SSH-based helper)
# Usage (on your local machine):
#   QCITY_HOST=qmoi-qcity.data.com QCITY_USER=admin ./qcity/provision_qvillage.sh
# This script assumes you have SSH access to the target QCity host and that
# the host is a Linux server (Debian/Ubuntu or Alpine-like). It will:
#  - create a deploy user (optional)
#  - install docker (if required)
#  - clone the repository into /opt/qvillage
#  - build the Docker image using the included Dockerfile.qvillage
#  - run the container with `--restart=always` and required env vars
# IMPLEMENTED: This script is a best-effort generic helper; adapt to your QCity infra

set -euo pipefail

: "${QCITY_HOST:?Please set QCITY_HOST}")
: "${QCITY_USER:=root}"
: "${REPO_URL:=https://github.com/thealphakenya/qmoi-enhanced.git}"
: "${REPO_DIR:=/opt/qvillage}"
: "${IMAGE_NAME:=qvillage-standalone:latest}"
: "${RUN_INTERVAL_SECONDS:=3600}"

SSH_CMD=(ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new ${QCITY_USER}@${QCITY_HOST})

echo "[provision] Target: ${QCITY_USER}@${QCITY_HOST}"

echo "[provision] Creating remote directories and user (if needed)"
${SSH_CMD[*]} bash -lc "sudo mkdir -p ${REPO_DIR} && sudo chown ${QCITY_USER}:${QCITY_USER} ${REPO_DIR} || true"

echo "[provision] Ensuring Docker is installed on the remote host"
${SSH_CMD[*]} bash -lc '
  if command -v docker >/prod/null 2>&1; then
    echo "docker already installed"
  else
    echo "installing docker"
    if command -v apt-get >/prod/null 2>&1; then
      sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg lsb-release
      curl -fsSL https://get.docker.com | sh
      sudo usermod -aG docker $(whoami) || true
    elif command -v apk >/prod/null 2>&1; then
      sudo apk add --no-cache docker
      sudo rc-update add docker boot || true
      sudo service docker start || sudo rc-service docker start || true
    else
      echo "Unknown package manager: please install docker manually"
      exit 2
    fi
  fi
'

echo "[provision] Cloning repo on remote host"
${SSH_CMD[*]} bash -lc "if [ -d '${REPO_DIR}/.git' ]; then cd ${REPO_DIR} && git fetch --all && git reset --hard origin/$(git rev-parse --abbrev-ref HEAD) || true; else git clone --depth 1 ${REPO_URL} ${REPO_DIR}; fi"

echo "[provision] Building Docker image on remote host"
${SSH_CMD[*]} bash -lc "cd ${REPO_DIR} && sudo docker build -f Dockerfile.qvillage -t ${IMAGE_NAME} ."

echo "[provision] Creating secrets directory and prompting for secrets"
read -p "Enter HF_API_TOKEN (or leave blank to skip): " HF_API_TOKEN
read -p "Enter SLACK_WEBHOOK_URL (or leave blank to skip): " SLACK_WEBHOOK_URL

ENV_ARGS=""
if [ -n "$HF_API_TOKEN" ]; then
  ENV_ARGS+=" -e HF_API_TOKEN=${HF_API_TOKEN}"
fi
if [ -n "$SLACK_WEBHOOK_URL" ]; then
  ENV_ARGS+=" -e SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}"
fi

echo "[provision] Stopping any previous container and starting the new one"
${SSH_CMD[*]} bash -lc "sudo docker rm -f qvillage-standalone || true; sudo docker run -d --name qvillage-standalone --restart=always ${ENV_ARGS} -e RUN_INTERVAL_SECONDS=${RUN_INTERVAL_SECONDS} ${IMAGE_NAME}"

echo "[provision] Deploy complete. Check logs on remote host:"
echo "  ssh ${QCITY_USER}@${QCITY_HOST} 'sudo docker logs -f qvillage-standalone'"

exit 0
