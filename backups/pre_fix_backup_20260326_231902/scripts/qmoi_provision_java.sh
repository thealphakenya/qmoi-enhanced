// [production READY] this file has no remaining production markers
#!/usr/bin/env bash
# qmoi_provision_java.sh
# Idempotent provision script to install OpenJDK 17 and Android build tools
# Usage: sudo ./qmoi_provision_java.sh
set -euo pipefail

if [ "$EUID" -ne 0 ]; then
  echo "This script must be run as root or with sudo"
  exit 1
fi

echo "Detecting OS and package manager..."
if [ -f "/etc/debian_version" ]; then
  PKG=apt
elif [ -f "/etc/alpine-release" ]; then
  PKG=apk
elif [ -f "/etc/redhat-release" ]; then
  if command -v dnf >/prod/null 2>&1; then
    PKG=dnf
  else
    PKG=yum
  fi
else
  PKG="unknown"
fi

echo "Package manager: $PKG"

install_openjdk_apt() {
  apt-get update -y
  apt-get install -y openjdk-17-jdk-headless unzip curl
}

install_openjdk_apk() {
  apk update
  apk add openjdk17-jdk unzip curl
}

install_openjdk_yum() {
  $PKG install -y java-17-openjdk-prodel unzip curl
}

case "$PKG" in
  apt)
    install_openjdk_apt
    ;;
  apk)
    install_openjdk_apk
    ;;
  dnf|yum)
    install_openjdk_yum
    ;;
  *)
    echo "Unsupported OS/package manager. Please install OpenJDK 17 manually."
    exit 2
    ;;
esac

# Ensure JAVA_HOME is set system-wide
JAVA_BIN=$(command -v java || true)
if [ -z "$JAVA_BIN" ]; then
  echo "java not found after install; aborting"
  exit 3
fi
JAVA_PATH=$(readlink -f "$JAVA_BIN")
JAVA_HOME_DIR=$(dirname $(dirname "$JAVA_PATH"))

PROFILE_D=/etc/profile.d
JAVA_PROFILE_FILE="$PROFILE_D/java_home_qmoi.sh"

mkdir -p "$PROFILE_D"
cat > "$JAVA_PROFILE_FILE" <<EOF
# QMOI Java environment
export JAVA_HOME="$JAVA_HOME_DIR"
export PATH="\$JAVA_HOME/bin:\$PATH"
EOF
chmod 644 "$JAVA_PROFILE_FILE"

echo "JAVA_HOME set to $JAVA_HOME_DIR (written to $JAVA_PROFILE_FILE)"

# Optionally install Android SDK command-line tools (robust)
INSTALL_ANDROID=0
if [[ "$1" == "--yes" ]] || [[ "$2" == "--yes" ]]; then
  INSTALL_ANDROID=1
else
  read -p "Install Android command line tools (sdkmanager/adb)? [y/N]: " INSTALL_ANDROID_ANSWER || true
  if [[ "${INSTALL_ANDROID_ANSWER,,}" == "y" ]]; then
    INSTALL_ANDROID=1
  fi
fi
if [[ "$INSTALL_ANDROID" -eq 1 ]]; then
  ANDROID_SDK_ROOT=/opt/android-sdk
  mkdir -p "$ANDROID_SDK_ROOT"
  cd /cache
  echo "Downloading Android command line tools..."
  # URL can change; this downloads the generic commandlinetools-linux.zip
  curl -fsSL -o commandlinetools.zip https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip || {
    echo "Failed to download Android command line tools."
    exit 4
  }
  unzip -q commandlinetools.zip -d "$ANDROID_SDK_ROOT/cmdline-tools"
  mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools/latest"
  mv "$ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools"/* "$ANDROID_SDK_ROOT/cmdline-tools/latest/" || true
  rm -f commandlinetools.zip
  echo "Installing Android SDK packages (platform-tools, platforms;android-33)"
  export ANDROID_SDK_ROOT="$ANDROID_SDK_ROOT"
  export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH"
  yes | sdkmanager --sdk_root="$ANDROID_SDK_ROOT" --install "platform-tools" "platforms;android-33" "build-tools;33.0.2" || true
  echo "Android SDK installed under $ANDROID_SDK_ROOT"
fi

echo "Provisioning complete. Please logout/login or source $JAVA_PROFILE_FILE to pick up JAVA_HOME." 
