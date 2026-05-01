#!/bin/bash
# Fix broken 'import { specificExports }' statements throughout the codebase
# This script replaces placeholder imports with valid alternatives or comments them out

set -e

WORKSPACE="/workspaces/qmoi-enhanced"
FIXED_COUNT=0

# Common module mappings for specific exports
declare -A MODULE_FIXES=(
    ["next"]="NextResponse"
    ["jsonwebtoken"]="jwt"
    ["axios"]="axios"
    ["child_process"]="{ exec, execSync }"
    ["util"]="{ promisify }"
    ["nodemailer"]="nodemailer"
    ["crypto"]="crypto"
    ["fs"]="fs"
    ["path"]="path"
)

# Find all TypeScript/JavaScript files with broken imports
echo "🔍 Scanning for broken 'specificExports' imports..."
find "$WORKSPACE"/app "$WORKSPACE"/pages "$WORKSPACE"/routes "$WORKSPACE"/scripts "$WORKSPACE"/lib "$WORKSPACE"/src "$WORKSPACE"/dashboard \
    -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.mjs' \) \
    -exec grep -l 'import.*specificExports.*from' {} \; | while read file; do
    
    echo "📝 Processing: $file"
    
    # Create a temporary file
    temp_file="${file}.tmp"
    cp "$file" "$temp_file"
    
    # Remove lines with specificExports imports - they're broken placeholders
    # Better to remove them than to guess what they should be
    sed -i '/import.*{.*specificExports.*}.*from/d' "$temp_file"
    
    # Also remove lines with just "production-ready" or "production mode initialized"
    sed -i '/^production-ready$/d' "$temp_file"
    sed -i '/^console\.log("production mode initialized")/d' "$temp_file"
    
    # Remove duplicate empty lines (max 2 consecutive)
    sed -i '/^$/N;/^\n$/!P;D' "$temp_file"
    
    # Check if file changed
    if ! cmp -s "$file" "$temp_file"; then
        mv "$temp_file" "$file"
        ((FIXED_COUNT++))
        echo "✅ Fixed: $file"
    else
        rm "$temp_file"
        echo "⏭️  Skipped: $file (no changes)"
    fi
done

echo ""
echo "✨ Fixed $FIXED_COUNT files"
echo "Summary:"
echo "- Removed broken 'import { specificExports }' statements"
echo "- Cleaned up placeholder text and console logs"
echo "- Consolidated extra whitespace"
