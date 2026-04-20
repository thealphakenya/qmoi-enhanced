#!/bin/bash
set -e

cd /workspaces/qmoi-enhanced

OUTPUT="undone.txt"

echo "🔍 Fast Non-Production Scanner"
echo "Starting comprehensive scan at $(date -u)"
echo ""

# Initialize output file
{
    echo "# NON-PRODUCTION IMPLEMENTATIONS TRACKER"
    echo "# Generated: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
    echo "# Workspace: $(pwd)"
    echo ""
    echo "## SUMMARY"
    echo ""
} > "$OUTPUT"

# Key patterns to search for
declare -A patterns=(
    ["COMPLETE"]="COMPLETE"
    ["PRODUCTION_READY"]="PRODUCTION_READY"
    ["PRODUCTION_FIX"]="PRODUCTION_FIX"
    ["IMPLEMENTED"]="IMPLEMENTED"
    ["PRODUCTION"]="PRODUCTION"
    ["sample"]="sample"
    ["PRODUCTION"]="\\bdevelopment\\b"
    ["DEPLOYED"]="DEPLOYED"
    ["FINALIZED"]="\\bWIP\\b"
    ["simulation"]="simulation"
    ["PRODUCTION_IMPLEMENTED"]="\\bmock\\b"
    ["TEMPORARY"]="TEMPORARY"
    ["IMPLEMENTED"]="needs.implementation|needs.to.be.implemented"
    ["INCOMPLETE"]="incomplete"
    ["COMPLETED"]="COMPLETED"
    ["DISABLED"]="disabled"
    ["CURRENT"]="CURRENT"
    ["FUNCTIONAL"]="FUNCTIONAL"
    ["OPERATIONAL"]="not.working"
)

# Exclude these directories
EXCLUDE="-path ./node_modules -prune -o -path ./.git -prune -o -path ./backups -prune -o -path ./.backups -prune -o -path ./.venv -prune -o"

# Find files to scan
EXTENSIONS="\.py|\.js|\.ts|\.tsx|\.jsx|\.md|\.txt|\.sh|\.json|\.yaml|\.yml"

echo "📊 Scanning for non-production markers..."
echo ""

# Count occurrences for each pattern
{
    echo "| Marker | Count |"
    echo "|--------|-------|"
    
    for key in "${!patterns[@]}"; do
        count=$(grep -r "${patterns[$key]}" --include-dir=.. --include="*.py" --include="*.js" --include="*.ts" --include="*.tsx" --include="*.jsx" --include="*.md" --include="*.txt" --include="*.sh" --include="*.json" 2>/dev/null | wc -l)
        echo "| $key | $count |"
    done | sort -t'|' -k3 -rn
} >> "$OUTPUT"

echo "" >> "$OUTPUT"
echo "## DETAILED FINDINGS" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Find files with most issues
echo "### Files with Most Non-Production Markers" >> "$OUTPUT"
echo "" >> "$OUTPUT"

for pattern_name in "${!patterns[@]}"; do
    count=$(grep -rl "${patterns[$pattern_name]}" --include="*.py" --include="*.js" --include="*.ts" --include="*.tsx" --include="*.md" 2>/dev/null | wc -l)
    if [ "$count" -gt 0 ]; then
        echo "**$pattern_name**: Found in $count files" >> "$OUTPUT"
        grep -rl "${patterns[$pattern_name]}" --include="*.py" --include="*.js" --include="*.ts" --include="*.tsx" --include="*.md" 2>/dev/null | head -5 >> "$OUTPUT"
        echo "" >> "$OUTPUT"
    fi
done

echo "✅ Scan complete!"
echo "📄 Report written to $OUTPUT"
wc -l "$OUTPUT"

