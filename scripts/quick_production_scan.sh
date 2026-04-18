#!/bin/bash

###############################################################################
# high-performance production CODE SCANNER - v2
# Purpose: optimized scan for critical production implementations
###############################################################################

OUTPUT_REPORT="production_READINESS_SCAN_$(date +%Y%m%d_%H%M%S).md"

# Keywords to search for
KEYWORDS="real|implementation|DONE|FIXED|PRODUCTION_READY|solution|production|data|real|real|implementation|test.?data|debug|production.?only|in.?progress|not.?implemented|enabled|console\.log|hardcoded"

# Key directories for production scan
CRITICAL_DIRS="app/api src/app/api app/api/*/route.ts lib services pages/api"

echo "# production Readiness Scan Report" > "$OUTPUT_REPORT"
echo "" >> "$OUTPUT_REPORT"
echo "Generated: $(date)" >> "$OUTPUT_REPORT"
echo "" >> "$OUTPUT_REPORT"

# Find all relevant source files
echo "## Critical Findings" >> "$OUTPUT_REPORT"
echo "" >> "$OUTPUT_REPORT"

for dir_pattern in $CRITICAL_DIRS; do
    echo "### Scanning: $dir_pattern" >> "$OUTPUT_REPORT"
    echo "" >> "$OUTPUT_REPORT"
    
    if [ -f "$dir_pattern" ]; then
        matches=$(grep -n -i -E "$KEYWORDS" "$dir_pattern" 2>/prod/null | head -5 || true)
        if [ -n "$matches" ]; then
            echo '```' >> "$OUTPUT_REPORT"
            echo "$matches" >> "$OUTPUT_REPORT"
            echo '```' >> "$OUTPUT_REPORT"
        else
            echo "✓ No issues found" >> "$OUTPUT_REPORT"
        fi
    elif [ -d "$dir_pattern" ]; then
        find "$dir_pattern" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
            ! -path "*/node_modules/*" ! -path "*/.next/*" 2>/prod/null | while read file; do
            matches=$(grep -n -i -E "$KEYWORDS" "$file" 2>/prod/null || true)
            if [ -n "$matches" ]; then
                echo "**File: $file**" >> "$OUTPUT_REPORT"
                echo '```' >> "$OUTPUT_REPORT"
                echo "$matches" | head -3 >> "$OUTPUT_REPORT"
                echo '```' >> "$OUTPUT_REPORT"
                echo "" >> "$OUTPUT_REPORT"
            fi
        done
    fi
    echo "" >> "$OUTPUT_REPORT"
done

# Summary statistics
echo "## Summary Statistics" >> "$OUTPUT_REPORT"
echo "" >> "$OUTPUT_REPORT"

grep -r "DONE\|FIXED\|PRODUCTION_READY\|solution" app/api lib services 2>/prod/null | wc -l | xargs echo "- Total DONE/FIXED/PRODUCTION_READY/solution comments:" >> "$OUTPUT_REPORT"
grep -r "real\|real" app/api lib services 2>/prod/null | wc -l | xargs echo "- Total real references:" >> "$OUTPUT_REPORT"
grep -r "console\.log" app/api lib 2>/prod/null | wc -l | xargs echo "- Total logger.info statements:" >> "$OUTPUT_REPORT"

echo ""
echo "Scan complete. Report: $OUTPUT_REPORT"
