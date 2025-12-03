#!/bin/bash

##############################################################################
# PWA Bundle Generator Script
# Generates downloadable PWA bundle ZIPs for offline installation
# Usage: ./scripts/generate-pwa-bundles.sh [app-name] [output-dir]
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="${2:-.}" 
APP_NAME="${1:-all}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
VERSION="1.0.0"

# App configurations
declare -A APPS=(
  [qcity]="QCity|public/qcity-dashboard.html|public/manifest-qcity.json|#2196F3"
  [qmoi-ai]="QMOI AI|public/qmoi-ai.html|public/manifest-qmoi-ai.json|#FF6B35"
  [qmoi-space]="QMOI Space|public/qmoi-space.html|public/manifest-qmoi-space.json|#9C27B0"
  [q-alpha]="Q Alpha|public/q-alpha.html|public/manifest-q-alpha.json|#00BCD4"
)

# Log functions
log_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Generate offline HTML
generate_offline_html() {
  local app=$1
  local title=$2
  local color=$3
  
  cat > "$TEMP_DIR/offline.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title — Offline</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 100px auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
        h1 { color: $color; margin-bottom: 20px; }
        p { color: #666; margin: 10px 0; line-height: 1.6; }
        .icon { font-size: 64px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📡</div>
        <h1>$title</h1>
        <p>You are offline</p>
        <p>The app is loading. Please wait or check your internet connection.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Service Worker Status: <span id="status">Loading...</span></p>
    </div>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(() => {
                document.getElementById('status').textContent = 'Ready';
                setTimeout(() => window.location.reload(), 1000);
            }).catch(() => {
                document.getElementById('status').textContent = 'Initializing...';
            });
        }
    </script>
</body>
</html>
EOF
}

# Generate installation guide
generate_install_guide() {
  local app=$1
  local title=$2
  
  cat > "$TEMP_DIR/INSTALL.md" << EOF
# $title — PWA Installation Guide

## Quick Start

1. **Extract Files**
   \`\`\`bash
   unzip ${app}-pwa-bundle.zip
   cd ${app}-pwa-bundle
   \`\`\`

2. **Serve Files Locally**
   \`\`\`bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Or using Node.js
   npx http-server
   \`\`\`

3. **Open in Browser**
   - Open \`http://localhost:8080\` in your browser
   - Click "Install App" button
   - Confirm installation

## Features

- ✅ **Offline-First**: Works without internet
- ✅ **Auto-Update**: Automatic background updates
- ✅ **Installable**: Add to home screen
- ✅ **Fast Loading**: Service Worker caching
- ✅ **Push Notifications**: Optional alerts

## Troubleshooting

**App won't install?**
- Ensure serving over HTTP locally
- Check browser console for errors
- Verify manifest.json is valid

**Offline features not working?**
- Ensure Service Worker is registered
- Wait for first activation
- Check DevTools > Application > Service Workers

**Can't update?**
- Clear browser cache and site data
- Reinstall the app

## Support

GitHub: https://github.com/thealphakenya/qmoi-enhanced/issues

---

**Bundle Generated**: $(date)
**Version**: $VERSION
EOF
}

# Create PWA bundle
create_bundle() {
  local app=$1
  local title=$2
  local html_file=$3
  local manifest_file=$4
  local color=$5
  
  log_info "Creating bundle for: $title"
  
  # Create temp directory
  TEMP_DIR=$(mktemp -d)
  trap "rm -rf $TEMP_DIR" EXIT
  
  # Create bundle directory
  local bundle_dir="$TEMP_DIR/${app}-pwa-bundle"
  mkdir -p "$bundle_dir"
  
  # Copy HTML file
  if [ -f "$REPO_ROOT/$html_file" ]; then
    cp "$REPO_ROOT/$html_file" "$bundle_dir/index.html"
    log_success "Added: index.html"
  else
    log_warn "Missing: $html_file"
  fi
  
  # Copy manifest
  if [ -f "$REPO_ROOT/$manifest_file" ]; then
    cp "$REPO_ROOT/$manifest_file" "$bundle_dir/manifest.json"
    log_success "Added: manifest.json"
  else
    log_warn "Missing: $manifest_file"
  fi
  
  # Copy service worker
  if [ -f "$REPO_ROOT/public/service-worker.js" ]; then
    cp "$REPO_ROOT/public/service-worker.js" "$bundle_dir/"
    log_success "Added: service-worker.js"
  fi
  
  # Copy PWA manager
  if [ -f "$REPO_ROOT/public/qmoi-pwa-manager.js" ]; then
    cp "$REPO_ROOT/public/qmoi-pwa-manager.js" "$bundle_dir/"
    log_success "Added: qmoi-pwa-manager.js"
  fi
  
  # Copy icons
  if [ -f "$REPO_ROOT/public/icon-256.png" ]; then
    cp "$REPO_ROOT/public/icon-256.png" "$bundle_dir/icon.png"
    log_success "Added: icon.png"
  fi
  
  # Generate offline page
  generate_offline_html "$app" "$title" "$color"
  cp "$TEMP_DIR/offline.html" "$bundle_dir/"
  log_success "Generated: offline.html"
  
  # Generate installation guide
  generate_install_guide "$app" "$title"
  cp "$TEMP_DIR/INSTALL.md" "$bundle_dir/"
  log_success "Generated: INSTALL.md"
  
  # Create README
  cat > "$bundle_dir/README.txt" << EOF
$title PWA Bundle
Version: $VERSION
Generated: $(date)

QUICK START:
1. Extract this ZIP file
2. Run: python3 -m http.server 8080
3. Open: http://localhost:8080
4. Click "Install App" button

For detailed instructions, see INSTALL.md

GitHub: https://github.com/thealphakenya/qmoi-enhanced
EOF
  
  # Create ZIP bundle
  local output_file="$OUTPUT_DIR/${app}-pwa-bundle-${TIMESTAMP}.zip"
  (cd "$TEMP_DIR" && zip -r -q "$output_file" "${app}-pwa-bundle")
  
  if [ -f "$output_file" ]; then
    local size=$(du -h "$output_file" | cut -f1)
    log_success "Bundle created: $output_file ($size)"
    echo "$output_file"
  else
    log_error "Failed to create bundle for $app"
    return 1
  fi
}

# Main
main() {
  echo -e "${BLUE}═══════════════════════════════════════${NC}"
  echo -e "${BLUE}  PWA Bundle Generator${NC}"
  echo -e "${BLUE}═══════════════════════════════════════${NC}"
  echo ""
  
  # Create output directory if it doesn't exist
  mkdir -p "$OUTPUT_DIR"
  
  if [ "$APP_NAME" == "all" ]; then
    log_info "Generating all PWA bundles..."
    echo ""
    
    local bundle_count=0
    local bundles_list=""
    
    for app in "${!APPS[@]}"; do
      IFS='|' read -r title html_file manifest_file color <<< "${APPS[$app]}"
      
      if bundle_file=$(create_bundle "$app" "$title" "$html_file" "$manifest_file" "$color"); then
        ((bundle_count++))
        bundles_list="$bundles_list\n  - $(basename "$bundle_file")"
      fi
      echo ""
    done
    
    log_success "Generated $bundle_count bundles:"
    echo -e "$bundles_list"
  elif [ -n "${APPS[$APP_NAME]}" ]; then
    log_info "Generating bundle for: $APP_NAME"
    echo ""
    
    IFS='|' read -r title html_file manifest_file color <<< "${APPS[$APP_NAME]}"
    create_bundle "$APP_NAME" "$title" "$html_file" "$manifest_file" "$color"
  else
    log_error "Unknown app: $APP_NAME"
    echo -e "\nAvailable apps:"
    for app in "${!APPS[@]}"; do
      IFS='|' read -r title _ _ _ <<< "${APPS[$app]}"
      echo "  - $app ($title)"
    done
    echo ""
    echo "Usage:"
    echo "  ./scripts/generate-pwa-bundles.sh [app] [output-dir]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/generate-pwa-bundles.sh all                    # Generate all bundles"
    echo "  ./scripts/generate-pwa-bundles.sh qcity                  # Generate QCity bundle"
    echo "  ./scripts/generate-pwa-bundles.sh qmoi-ai ./dist         # Save to ./dist"
    exit 1
  fi
  
  echo ""
  log_success "PWA bundles ready for distribution!"
  echo ""
}

main "$@"
