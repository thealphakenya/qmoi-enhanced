
#!/usr/bin/env sh
set -eu
# Small helper to print Node install commands for common OSes.
echo "QMOI prod bootstrap helper"
OS_ID="unknown"
if [ -f /etc/os-release ]; then
  # shellcheck disable=SC1091
  . /etc/os-release
  OS_ID=${ID:-unknown}
fi

echo "Detected OS: ${OS_ID}"
case "$OS_ID" in
  alpine)
    echo "\nAlpine Linux detected. To install Node.js (requires root):"
    echo "  apk add --no-cache nodejs npm"
    ;;
  debian|ubuntu)
    echo "\nDebian/Ubuntu detected. To install Node.js (requires root):"
    echo "  apt-get update && apt-get install -y nodejs npm"
    ;;
  centos|fedora|rhel)
    echo "\nRHEL/CentOS/Fedora detected. To install Node.js (requires root):"
    echo "  dnf install -y nodejs npm || yum install -y nodejs npm"
    ;;
  *)
    echo "\nUnknown or unsupported OS. required: install via nvm (non-root):"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash"
    echo "  # restart shell, then:\n  nvm install 20 && nvm use 20"
    ;;
esac

echo "\nAfter installing Node.js, run:" 
echo "  node -v && npm -v"
echo "  ./startup.sh --prod"

echo "\nNote: This script only prints required commands. To auto-run an install, run with root and the flag '--install' at your own risk."
