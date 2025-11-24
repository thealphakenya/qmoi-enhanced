#!/bin/bash
# Production Android Build Script with Signing
# This script builds signed APKs for production release

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ANDROID_DIR="$PROJECT_ROOT/mobile/android"
APP_DIR="$ANDROID_DIR/app"

echo "=========================================="
echo "QMOI Production Android Build Script"
echo "=========================================="
echo "Project Root: $PROJECT_ROOT"
echo "Android Dir: $ANDROID_DIR"
echo

# Check if signing credentials are available
if [[ -z "${KEYSTORE_FILE_PATH:-}" ]]; then
    echo "⚠️  KEYSTORE_FILE_PATH not set. Building without production signing."
    SIGNING_ARGS=""
else
    echo "✅ Signing credentials detected. Building with production signing."
    
    # Validate keystore file exists
    if [[ ! -f "$KEYSTORE_FILE_PATH" ]]; then
        echo "❌ Error: Keystore file not found at $KEYSTORE_FILE_PATH"
        exit 1
    fi
    
    # Build signing arguments
    SIGNING_ARGS="-PKEYSTORE_FILE=$KEYSTORE_FILE_PATH"
    SIGNING_ARGS="$SIGNING_ARGS -PKEYSTORE_PASSWORD='${KEYSTORE_PASSWORD}'"
    SIGNING_ARGS="$SIGNING_ARGS -PKEY_ALIAS='${KEY_ALIAS}'"
    SIGNING_ARGS="$SIGNING_ARGS -PKEY_PASSWORD='${KEY_PASSWORD}'"
    
    echo "Keystore: $(basename "$KEYSTORE_FILE_PATH")"
    echo "Key Alias: $KEY_ALIAS"
    echo
fi

# Navigate to Android directory
cd "$ANDROID_DIR"

# Clean previous builds
echo "Cleaning previous builds..."
./gradlew clean

# Build release APK with or without signing
echo
echo "Building Release APK..."
if [[ -n "$SIGNING_ARGS" ]]; then
    ./gradlew assembleRelease $SIGNING_ARGS --no-daemon -q
    BUILD_TYPE="production-signed"
else
    ./gradlew assembleRelease --no-daemon -q
    BUILD_TYPE="unsigned-debug"
fi

echo "✅ Build complete ($BUILD_TYPE)"
echo

# Find and report output APK
APK_PATH=$(find "$APP_DIR/build/outputs/apk/release" -name "*.apk" -type f | head -1)
if [[ -f "$APK_PATH" ]]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo "📦 APK Location: $APK_PATH"
    echo "📊 APK Size: $APK_SIZE"
    
    # If signed, verify signature
    if [[ "$BUILD_TYPE" == "production-signed" ]]; then
        echo
        echo "Verifying APK signature..."
        jarsigner -verify -verbose -certs "$APK_PATH" 2>&1 | tail -5
        echo "✅ Signature verified"
    fi
else
    echo "❌ Error: No APK found after build"
    exit 1
fi

echo
echo "=========================================="
echo "Build Complete"
echo "=========================================="
