#!/bin/bash
set -euo pipefail

SRC_DIR="${HOME}/.ollama/source"
BIN_DIR="${HOME}/.ollama/bin"
LOG_DIR="${HOME}/.ollama/logs"
INSTALL_LOG="$LOG_DIR/build-source.log"
mkdir -p "$SRC_DIR" "$BIN_DIR" "$LOG_DIR"
export PATH="$BIN_DIR:$PATH"

if ! command -v apk >/dev/null 2>&1; then
  echo "ERROR: Source build fallback requires Alpine Linux with apk." | tee -a "$INSTALL_LOG"
  exit 1
fi

install_packages() {
  local pkg_list="$*"
  if [ "$(id -u)" -eq 0 ]; then
    apk add --no-cache $pkg_list >> "$INSTALL_LOG" 2>&1
  elif command -v sudo >/dev/null 2>&1; then
    sudo apk add --no-cache $pkg_list >> "$INSTALL_LOG" 2>&1
  else
    echo "ERROR: Cannot install packages without root or sudo: $pkg_list" | tee -a "$INSTALL_LOG"
    exit 1
  fi
}

git_available=true
if ! command -v git >/dev/null 2>&1; then
  git_available=false
fi

go_available=true
if ! command -v go >/dev/null 2>&1; then
  go_available=false
fi

gcc_available=true
if ! command -v gcc >/dev/null 2>&1; then
  gcc_available=false
fi

if [ "$git_available" = false ] || [ "$go_available" = false ] || [ "$gcc_available" = false ]; then
  echo "INFO: Installing Alpine build dependencies: git build-base curl cmake ninja" | tee -a "$INSTALL_LOG"
  install_packages git build-base curl cmake ninja
fi

if [ "$go_available" = true ]; then
  GO_CMD="$(command -v go)"
  GO_VERSION_RAW=$($GO_CMD version | awk '{print $3}' | sed 's/^go//')
else
  GO_VERSION_RAW="0.0.0"
fi

version_ge() {
  local a=$1 b=$2
  local IFS=.
  read -r a1 a2 a3 <<< "$a"
  read -r b1 b2 b3 <<< "$b"
  a2=${a2:-0}
  a3=${a3:-0}
  b2=${b2:-0}
  b3=${b3:-0}
  if ((a1 > b1)); then
    return 0
  elif ((a1 < b1)); then
    return 1
  elif ((a2 > b2)); then
    return 0
  elif ((a2 < b2)); then
    return 1
  elif ((a3 >= b3)); then
    return 0
  else
    return 1
  fi
}

REQUIRED_GO_VERSION="1.26.0"
if ! version_ge "$GO_VERSION_RAW" "$REQUIRED_GO_VERSION"; then
  echo "INFO: Current Go version $GO_VERSION_RAW is too old; installing Go $REQUIRED_GO_VERSION" | tee -a "$INSTALL_LOG"
  GO_ARCHIVE="go${REQUIRED_GO_VERSION}.linux-amd64.tar.gz"
  TMP_GO_DIR="/tmp/go${REQUIRED_GO_VERSION}"
  if [ ! -x "$TMP_GO_DIR/bin/go" ]; then
    curl -fsSL "https://go.dev/dl/${GO_ARCHIVE}" -o "/tmp/${GO_ARCHIVE}" >> "$INSTALL_LOG" 2>&1
    rm -rf "$TMP_GO_DIR"
    tar -C /tmp -xzf "/tmp/${GO_ARCHIVE}" >> "$INSTALL_LOG" 2>&1
    mv /tmp/go "$TMP_GO_DIR"
  fi
  export PATH="$TMP_GO_DIR/bin:$PATH"
  export GOROOT="$TMP_GO_DIR"
  GO_CMD="$TMP_GO_DIR/bin/go"
  GO_VERSION_RAW=$("$GO_CMD" version | awk '{print $3}' | sed 's/^go//')
fi

echo "INFO: Using Go version $GO_VERSION_RAW" | tee -a "$INSTALL_LOG"

if [ -d "$SRC_DIR/.git" ]; then
  echo "INFO: Updating existing Ollama source checkout" | tee -a "$INSTALL_LOG"
  git -C "$SRC_DIR" fetch --all --prune >> "$INSTALL_LOG" 2>&1
  git -C "$SRC_DIR" reset --hard origin/main >> "$INSTALL_LOG" 2>&1
else
  echo "INFO: Cloning Ollama source" | tee -a "$INSTALL_LOG"
  rm -rf "$SRC_DIR"
  git clone --depth 1 https://github.com/ollama/ollama.git "$SRC_DIR" >> "$INSTALL_LOG" 2>&1
fi

cd "$SRC_DIR"
if [ -d "cmd/ollama" ]; then
  BUILD_TARGET="./cmd/ollama"
elif [ -f "main.go" ]; then
  BUILD_TARGET="."
else
  BUILD_TARGET="./..."
fi

echo "INFO: Running go build for $BUILD_TARGET" | tee -a "$INSTALL_LOG"
GO111MODULE=on "$GO_CMD" build -o "$BIN_DIR/ollama" "$BUILD_TARGET" >> "$INSTALL_LOG" 2>&1
chmod +x "$BIN_DIR/ollama"

build_llama_server() {
  if [ -d "$SRC_DIR/llama/server" ]; then
    echo "INFO: Building llama-server runtime from source" | tee -a "$INSTALL_LOG"
    cd "$SRC_DIR/llama/server"
    cmake --preset cpu >> "$INSTALL_LOG" 2>&1
    cmake --build --preset cpu --target llama-server -j"$(nproc)" >> "$INSTALL_LOG" 2>&1

    LOCAL_BUILD_DIR="$SRC_DIR/build/llama-server-cpu"
    LOCAL_LLAMA_SERVER="$LOCAL_BUILD_DIR/bin/llama-server"
    if [ -x "$LOCAL_LLAMA_SERVER" ]; then
      cp "$LOCAL_LLAMA_SERVER" "$BIN_DIR/llama-server"
      chmod +x "$BIN_DIR/llama-server"
      if [ -d "$LOCAL_BUILD_DIR/bin" ]; then
        echo "INFO: Copying llama-server runtime libraries and backend plugins to $BIN_DIR" | tee -a "$INSTALL_LOG"
        shopt -s nullglob
        for lib in "$LOCAL_BUILD_DIR/bin"/libllama* "$LOCAL_BUILD_DIR/bin"/libggml* "$LOCAL_BUILD_DIR/bin"/libmtmd*; do
          if [ -f "$lib" ]; then
            cp -a "$lib" "$BIN_DIR"
          fi
        done
        shopt -u nullglob
      fi
      echo "INFO: llama-server runtime built and installed to $BIN_DIR/llama-server" | tee -a "$INSTALL_LOG"
      return 0
    fi

    echo "INFO: Searching for llama-server binary in build output" | tee -a "$INSTALL_LOG"
    LOCAL_LLAMA_SERVER="$(find "$LOCAL_BUILD_DIR" -maxdepth 3 -type f -name 'llama-server' -perm /111 2>/dev/null | head -n 1 || true)"
    if [ -n "$LOCAL_LLAMA_SERVER" ] && [ -x "$LOCAL_LLAMA_SERVER" ]; then
      cp "$LOCAL_LLAMA_SERVER" "$BIN_DIR/llama-server"
      chmod +x "$BIN_DIR/llama-server"
      if [ -d "$LOCAL_BUILD_DIR/bin" ]; then
        echo "INFO: Copying llama-server runtime libraries and backend plugins to $BIN_DIR" | tee -a "$INSTALL_LOG"
        shopt -s nullglob
        for lib in "$LOCAL_BUILD_DIR/bin"/libllama* "$LOCAL_BUILD_DIR/bin"/libggml* "$LOCAL_BUILD_DIR/bin"/libmtmd*; do
          if [ -f "$lib" ]; then
            cp -a "$lib" "$BIN_DIR"
          fi
        done
        shopt -u nullglob
      fi
      echo "INFO: llama-server runtime found and installed from $BIN_DIR/llama-server" | tee -a "$INSTALL_LOG"
      return 0
    fi

    echo "WARNING: llama-server build completed but binary not found in $LOCAL_BUILD_DIR" | tee -a "$INSTALL_LOG"
    find "$LOCAL_BUILD_DIR" -maxdepth 3 -type f | tee -a "$INSTALL_LOG"
    return 1
  fi
  echo "WARNING: llama/server source directory not found; skipping llama-server build" | tee -a "$INSTALL_LOG"
  return 1
}

if build_llama_server; then
  echo "INFO: Ollama build completed with runtime support" | tee -a "$INSTALL_LOG"
else
  echo "INFO: Ollama CLI built, but llama-server runtime may not be available" | tee -a "$INSTALL_LOG"
fi

if "$BIN_DIR/ollama" --version >/dev/null 2>&1; then
  echo "INFO: Ollama built successfully and is available at $BIN_DIR/ollama" | tee -a "$INSTALL_LOG"
  exit 0
fi

echo "ERROR: Ollama build succeeded but the binary did not run cleanly." | tee -a "$INSTALL_LOG"
exit 1
