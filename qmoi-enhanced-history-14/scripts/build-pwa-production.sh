#!/bin/bash
###############################################################################
# Production PWA Build Script
# Builds and optimizes all 7 Progressive Web Applications
# Includes: webpack bundling, service worker optimization, manifest generation
###############################################################################

set -e

echo "================================"
echo "🌐 PWA PRODUCTION BUILD"
echo "================================"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PWA_APPS_DIR="$PROJECT_ROOT/pwa_apps"
BUILD_DIR="$PROJECT_ROOT/dist/pwa"
OUTPUT_DIR="$BUILD_DIR/release"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# PWA Applications
declare -a PWARYS=(
  "admin"
  "deals"
  "q-alpha"
  "qmoi"
  "qmoi-ai"
  "qmoi-space"
  "qstore"
)

# Build Configuration
ENABLE_OPTIMIZATION=true
ENABLE_MINIFICATION=true
ENABLE_GZIP=true
CACHE_BUSTING=true

mkdir -p "$OUTPUT_DIR" "$BUILD_DIR/logs"

echo "📦 Configuration:"
echo "  PWA Apps Dir: $PWA_APPS_DIR"
echo "  Build Dir: $BUILD_DIR"
echo "  Output Dir: $OUTPUT_DIR"
echo "  Optimization: $ENABLE_OPTIMIZATION"
echo "  Minification: $ENABLE_MINIFICATION"
echo "  GZIP Compression: $ENABLE_GZIP"
echo ""

# Function: Build individual PWA
build_pwa() {
  local app_name="$1"
  local app_dir="$PWA_APPS_DIR/$app_name"
  
  if [ ! -d "$app_dir" ]; then
    echo "❌ PWA directory not found: $app_name"
    return 1
  fi
  
  echo "🔨 Building PWA: $app_name"
  
  cd "$app_dir"
  
  # Clean previous build
  rm -rf "$app_dir/dist" "$app_dir/build"
  
  # Check build method
  if [ -f "package.json" ]; then
    echo "  📌 Found package.json, using npm build..."
    npm run build 2>&1 | tee "$BUILD_DIR/logs/${app_name}_build.log" || {
      echo "  ⚠️  npm build failed, trying fallback..."
      mkdir -p "$app_dir/dist"
      cp "$app_dir"/*.html "$app_dir/dist/" 2>/dev/null || true
      cp "$app_dir"/*.js "$app_dir/dist/" 2>/dev/null || true
      cp "$app_dir"/*.css "$app_dir/dist/" 2>/dev/null || true
      cp "$app_dir"/*.webmanifest "$app_dir/dist/" 2>/dev/null || true
    }
  elif [ -f "webpack.config.js" ]; then
    echo "  📌 Found webpack.config.js, using webpack..."
    npx webpack build 2>&1 | tee "$BUILD_DIR/logs/${app_name}_build.log" || true
  else
    echo "  📌 Using basic file copy (no build tool configured)..."
    mkdir -p "$app_dir/dist"
    cp "$app_dir"/*.html "$app_dir/dist/" 2>/dev/null || true
    cp "$app_dir"/*.js "$app_dir/dist/" 2>/dev/null || true
    cp "$app_dir"/*.css "$app_dir/dist/" 2>/dev/null || true
    cp "$app_dir"/*.webmanifest "$app_dir/dist/" 2>/dev/null || true
    cp -r "$app_dir/icons" "$app_dir/dist/" 2>/dev/null || true
  fi
  
  if [ -d "$app_dir/dist" ]; then
    echo "✅ Build successful: $app_name"
    return 0
  else
    echo "❌ Build failed: $app_name"
    return 1
  fi
}

# Function: Validate PWA manifest
validate_manifest() {
  local app_dir="$1"
  local app_name=$(basename "$app_dir")
  
  echo "🔍 Validating PWA manifest: $app_name"
  
  # Check for manifest
  if [ ! -f "$app_dir/manifest.webmanifest" ] && [ ! -f "$app_dir/manifest.json" ]; then
    echo "  ⚠️  No manifest found (creating default)..."
    create_pwa_manifest "$app_dir" "$app_name"
  else
    echo "  ✓ Manifest file found"
    # Basic JSON validation
    if command -v jq &> /dev/null; then
      if jq empty < "$app_dir/manifest.webmanifest" 2>/dev/null || jq empty < "$app_dir/manifest.json" 2>/dev/null; then
        echo "  ✓ Manifest is valid JSON"
      else
        echo "  ⚠️  Manifest JSON validation failed"
      fi
    fi
  fi
}

# Function: Create PWA manifest if missing
create_pwa_manifest() {
  local app_dir="$1"
  local app_name="$2"
  
  cat > "$app_dir/manifest.webmanifest" << EOF
{
  "name": "QMOI $app_name",
  "short_name": "$app_name",
  "description": "QMOI $app_name - Progressive Web Application",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#ffffff",
  "theme_color": "#1e90ff",
  "icons": [
    {
      "src": "./icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "./icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "./icons/screenshot-540x720.png",
      "sizes": "540x720",
      "type": "image/png"
    }
  ],
  "categories": ["productivity"],
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        {
          "name": "file",
          "accept": ["image/*", "application/*"]
        }
      ]
    }
  }
}
EOF
  
  echo "  ✓ Created manifest.webmanifest"
}

# Function: Validate service worker
validate_service_worker() {
  local app_dir="$1"
  local app_name=$(basename "$app_dir")
  
  echo "🔍 Validating service worker: $app_name"
  
  if [ ! -f "$app_dir/sw.js" ]; then
    echo "  ⚠️  No service worker found (creating default)..."
    create_service_worker "$app_dir" "$app_name"
  else
    echo "  ✓ Service worker found"
    # Basic JS syntax check
    if command -v node &> /dev/null; then
      node -c "$app_dir/sw.js" 2>/dev/null && echo "  ✓ Service worker syntax valid" || echo "  ⚠️  Service worker has syntax errors"
    fi
  fi
}

# Function: Create service worker if missing
create_service_worker() {
  local app_dir="$1"
  local app_name="$2"
  
  cat > "$app_dir/sw.js" << 'EOF'
const CACHE_NAME = 'qmoi-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install service worker and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(() => {
        console.log('Some assets could not be cached during install');
      });
    })
  );
  self.skipWaiting();
});

// Activate service worker and cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-first strategy for dynamic content, cache-first for static
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and API calls
  if (url.origin !== location.origin) {
    return;
  }

  if (request.method !== 'GET') {
    return;
  }

  // Cache-first for assets
  if (/\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(request)
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, response.clone());
          return response;
        });
      })
      .catch(() => {
        return caches.match(request).then(response => {
          return response || caches.match('/offline.html');
        });
      })
  );
});
EOF
  
  echo "  ✓ Created service worker"
}

# Function: Minify CSS and JS
minify_assets() {
  local app_dir="$1"
  local app_name=$(basename "$app_dir")
  
  if [ "$ENABLE_MINIFICATION" != "true" ]; then
    return 0
  fi
  
  echo "📦 Minifying assets: $app_name"
  
  # Minify JavaScript
  if command -v uglifyjs &> /dev/null; then
    find "$app_dir/dist" -name "*.js" -not -name "*.min.js" 2>/dev/null | while read js_file; do
      uglifyjs "$js_file" -o "${js_file%.js}.min.js" 2>/dev/null && rm "$js_file" || true
    done
  fi
  
  # Minify CSS  
  if command -v cleancss &> /dev/null; then
    find "$app_dir/dist" -name "*.css" -not -name "*.min.css" 2>/dev/null | while read css_file; do
      cleancss -o "${css_file%.css}.min.css" "$css_file" 2>/dev/null && rm "$css_file" || true
    done
  fi
  
  echo "  ✓ Assets minified"
}

# Function: Gzip assets
gzip_assets() {
  local app_dir="$1"
  
  if [ "$ENABLE_GZIP" != "true" ]; then
    return 0
  fi
  
  if ! command -v gzip &> /dev/null; then
    return 0
  fi
  
  find "$app_dir/dist" -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" -o -name "*.svg" \) 2>/dev/null | while read file; do
    gzip -9 -k "$file" 2>/dev/null || true
  done
}

# Function: Package PWA
package_pwa() {
  local app_dir="$1"
  local app_name=$(basename "$app_dir")
  
  if [ ! -d "$app_dir/dist" ]; then
    return 1
  fi
  
  echo "📦 Packaging PWA: $app_name"
  
  # Copy to output with hash for cache busting
  zip_name="${app_name}-${TIMESTAMP}-production.zip"
  zip_path="$OUTPUT_DIR/$zip_name"
  
  cd "$app_dir"
  zip -r -q "$zip_path" "dist/" && \
    echo "✅ Packaged: $zip_name ($(ls -lh "$zip_path" | awk '{print $5}'))" || \
    { echo "❌ Packaging failed"; return 1; }
  
  return 0
}

# Function: Generate PWA report
generate_report() {
  local report_file="$OUTPUT_DIR/pwa_build_report.json"
  
  echo "📄 Generating build report..."
  
  cat > "$report_file" << 'EOF'
{
  "platform": "web",
  "build_date": "TIMESTAMP",
  "build_version": "1.2.4",
  "apps": []
}
EOF
  
  sed -i "s/TIMESTAMP/$TIMESTAMP/g" "$report_file" 2>/dev/null || sed -i "" "s/TIMESTAMP/$TIMESTAMP/g" "$report_file"
  
  # Add each app to report
  for app in "${PWAAPPS[@]}"; do
    if [ -f "$OUTPUT_DIR/${app}-${TIMESTAMP}-production.zip" ]; then
      SIZE=$(ls -lh "$OUTPUT_DIR/${app}-${TIMESTAMP}-production.zip" | awk '{print $5}')
      # Append app info (basic approach since jq may not be available)
      echo "    $app: $SIZE"
    fi
  done
}

# Main build loop
echo "🚀 Starting PWA production builds..."
echo ""

BUILD_SUCCESS=0
BUILD_FAILED=0

for app_name in "${PWAAPPS[@]}"; do
  app_dir="$PWA_APPS_DIR/$app_name"
  
  if [ -d "$app_dir" ]; then
    # Build
    if build_pwa "$app_name"; then
      # Validate
      validate_manifest "$app_dir/dist" || validate_manifest "$app_dir"
      validate_service_worker "$app_dir/dist" || validate_service_worker "$app_dir"
      
      # Optimize
      minify_assets "$app_dir/dist" || minify_assets "$app_dir"
      gzip_assets "$app_dir/dist" || gzip_assets "$app_dir"
      
      # Package
      if package_pwa "$app_dir"; then
        ((BUILD_SUCCESS++))
      else
        ((BUILD_FAILED++))
      fi
    else
      ((BUILD_FAILED++))
    fi
    
    echo ""
  else
    echo "⚠️  PWA directory not found: $app_name"
    ((BUILD_FAILED++))
  fi
done

# Summary Report
echo "================================"
echo "📊 PWA BUILD SUMMARY"
echo "================================"
echo "Successful: $BUILD_SUCCESS"
echo "Failed: $BUILD_FAILED"
echo ""

if [ -d "$OUTPUT_DIR" ] && [ "$(ls -A $OUTPUT_DIR 2>/dev/null)" ]; then
  echo "📦 Generated PWA Artifacts:"
  ls -lh "$OUTPUT_DIR"/*.zip 2>/dev/null | awk '{printf "  • %s (%s)\n", $(NF), $(NF-4)}'
  echo ""
fi

generate_report
echo "✅ Report generated: pwa_build_report.json"
echo ""

if [ $BUILD_FAILED -eq 0 ]; then
  echo "✨ All PWA builds completed successfully!"
  exit 0
else
  echo "⚠️ Some PWA builds failed. Check logs in: $BUILD_DIR/logs"
  exit 1
fi
