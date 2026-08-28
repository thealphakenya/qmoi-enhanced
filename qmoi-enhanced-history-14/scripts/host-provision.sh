#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Usage: $0 [--install-systemd] [--enable-pm2-startup] [--deploy-image IMAGE]

Options:
  --install-systemd     Copy systemd unit files (deploy/systemd) to /etc/systemd/system and enable the healthcheck timer
  --enable-pm2-startup  Run the PM2 startup command (requires sudo) to enable PM2 on boot
  --deploy-image IMAGE  Pull IMAGE (e.g. ghcr.io/owner/repo:sha) and restart pm2 process
  --help                Show this help
EOF
}

if [ $# -eq 0 ]; then
  usage
  exit 0
fi

HAS_SUDO=0
if command -v sudo >/dev/null 2>&1; then
  HAS_SUDO=1
fi

run_sudo() {
  if [ "$HAS_SUDO" -eq 1 ]; then
    sudo "$@"
  else
    echo "ERROR: sudo not available or not permitted; run this script as root or install sudo." >&2
    exit 2
  fi
}

while [ $# -gt 0 ]; do
  case "$1" in
    --install-systemd)
      echo "Installing systemd unit files..."
      run_sudo cp -v deploy/systemd/qmoi.service /etc/systemd/system/qmoi.service || true
      run_sudo cp -v deploy/systemd/qmoi-healthcheck.service /etc/systemd/system/qmoi-healthcheck.service || true
      run_sudo cp -v deploy/systemd/qmoi-healthcheck.timer /etc/systemd/system/qmoi-healthcheck.timer || true
      run_sudo systemctl daemon-reload
      run_sudo systemctl enable --now qmoi-healthcheck.timer || true
      echo "Systemd units installed and healthcheck timer enabled."
      shift
      ;;
    --enable-pm2-startup)
      echo "Enabling PM2 startup (may require sudo)":
      # Use pm2 startup command for systemd
      START_CMD=$(pm2 startup systemd -u $(whoami) --hp $(eval echo ~$USER) | sed -n 's/\(sudo .*\)/\1/p' || true)
      if [ -n "$START_CMD" ]; then
        echo "Running: $START_CMD"
        run_sudo bash -lc "$START_CMD"
        pm2 save || true
        echo "PM2 startup enabled and process list saved."
      else
        echo "Could not determine pm2 startup command; run \`pm2 startup systemd -u <user> --hp <home>\` and then run the printed sudo command."
      fi
      shift
      ;;
    --deploy-image)
      IMAGE="$2"
      if [ -z "$IMAGE" ]; then
        echo "Missing image argument for --deploy-image" >&2; usage; exit 1
      fi
      echo "Pulling image $IMAGE and restarting pm2 process..."
      docker pull "$IMAGE"
      pm2 stop qmoi-next || true
      pm2 delete qmoi-next || true
      # Attempt to start using the existing ecosystem config
      pm2 start ecosystem.config.cjs --only qmoi-next --env production || true
      pm2 save || true
      echo "Deployed image $IMAGE and restarted pm2 process (if present)."
      shift 2
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2; usage; exit 1
      ;;
  esac
done

exit 0
