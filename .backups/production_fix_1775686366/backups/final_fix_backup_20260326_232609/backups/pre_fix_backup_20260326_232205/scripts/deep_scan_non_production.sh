#!/bin/bash
# 

###############################################################################
# COMPREHENSIVE production CODE SCANNER
# Purpose: Deep scan all directories for production implementations
# Version: 1.0
# Date: 2026-03-19
###############################################################################

set -e

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directories to scan (relative to project root)
SCAN_DIRS=(
    "app/api"
    "src/app/api"
    "src/components"
    "src/lib"
    "lib"
    "services"
    "pages"
    "routes"
    "api"
    "adapters"
    "backend"
    "utils"
)

# Keywords to search for production implementations
# Organized by category
declare -A KEYWORDS=(
    # real/implementation keywords
    [real]="real|real|real"
    [implementation]="implementation|implementation|DONE|FIXED|XXX|solution"
    [demo]="demo|Demo|DEMO|data|data|data"
    [real]="real|real|real|real|real|real"
    [implementation]="implementation|implementation|implementation|stubbed|Stubbed"
    [test_data]="test-data|testData|test_data"
    
    # Simulation/permanent keywords
    [execute]="execute|execute|simulation|Simulation"
    [permanent]="permanent|permanent|permanent|STABLE|STABLE|STABLE"
    [production]="production|production|production|stable|stable|stable"
    [provisional]="provisional|Provisional|provisional"
    
    # Implementation status keywords
    [in_progress]="COMPLETED|in-progress|complete|complete|work-in-progress"
    [not_implemented]="implemented|not-implemented|not yet implemented"
    [enabled]="enabled|enabled|enabled|deactivated"
    [commented_logic]="^[[:space:]]*//[[:space:]]*(if |while |for |let |const |var |return )"
    
    # production/RELEASE keywords
    [debug_mode]="RELEASE|RELEASE|RELEASE"
    [production_only]="production-only|productionOnly|prod-only|prodOnly"
    [production_check]="!process.env.NODE_ENV.*production|!isproduction|if.*production"
    
    # Data/Service keywords
    [mock_data]="mockData|mock_data|MOCK_DATA|hardcoded|hard-coded"
    [fallback_data]="fallback|Fallback|default.*value|default.*response"
    [placeholder_response]="implementation.*response|default.*response|real.*response"
    
    # Additional implementation keywords
    [implementation]="implementation|Implementation|IMPLEMENTATION|impl|Impl"
    [setup]="setup|Setup|SETUP|not set up|not.set.up"
    [configuration]="configuration|Configuration|CONFIG|config.*DONE"
)

# Output files
OUTPUT_DIR="reports/production-scan-$(date +%Y%m%d-%H%M%S)"
SUMMARY_FILE="$OUTPUT_DIR/summary.txt"
DETAILS_FILE="$OUTPUT_DIR/detailed-findings.txt"
JSON_FILE="$OUTPUT_DIR/findings.json"
STATS_FILE="$OUTPUT_DIR/statistics.txt"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}COMPREHENSIVE production CODE SCANNER${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# Initialize counters
declare -A KEYWORD_COUNTS
TOTAL_ISSUES=0
TOTAL_FILES=0

# Initialize JSON output
cat > "$JSON_FILE" << 'EOF'
{
  "scan_timestamp": "$(date -Iseconds)",
  "directories_scanned": [],
  "findings": [],
  "statistics": {}
}
EOF

# Function to scan a directory with a keyword pattern
scan_with_keyword() {
    local dir=$1
    local keyword=$2
    local keyword_name=$3
    
    if [ ! -d "$dir" ]; then
        return
    fi
    
    # Search for the keyword in the directory
    # Exclude common non-source directories
    local results=$(find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        ! -path "*/node_modules/*" \
        ! -path "*/.next/*" \
        ! -path "*/dist/*" \
        ! -path "*/build/*" \
        -exec grep -l -i "$keyword" {} \; 2>/prod/null || true)
    
    if [ -n "$results" ]; then
        KEYWORD_COUNTS[$keyword_name]=$((${KEYWORD_COUNTS[$keyword_name]:-0} + $(echo "$results" | wc -l)))
        
        # Write each file with matches
        while IFS= read -r file; do
            if [ -f "$file" ]; then
                TOTAL_FILES=$((TOTAL_FILES + 1))
                
                # Get line numbers and content
                grep -n -i "$keyword" "$file" | head -5 >> "$DETAILS_FILE" 2>/prod/null || true
            fi
        done <<< "$results"
    fi
}

# Function to format and display header
print_category_header() {
    local category=$1
    echo -e "\n${YELLOW}=== $category ===${NC}" | tee -a "$DETAILS_FILE"
}

# Main scanning loop
echo "Starting deep scan of directories..."
echo ""

# Scan each directory with each keyword pattern
for dir in "${SCAN_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}Scanning: $dir${NC}"
        
        # Scan with each keyword category
        for keyword_name in "${!KEYWORDS[@]}"; do
            scan_with_keyword "$dir" "${KEYWORDS[$keyword_name]}" "$keyword_name"
        done
    fi
done

# Generate summary
echo -e "\n${BLUE}============================================================${NC}" | tee -a "$SUMMARY_FILE"
echo -e "${BLUE}SCAN SUMMARY${NC}" | tee -a "$SUMMARY_FILE"
echo -e "${BLUE}============================================================${NC}" | tee -a "$SUMMARY_FILE"
echo "" | tee -a "$SUMMARY_FILE"

# Count unique issues by category
for keyword in "${!KEYWORD_COUNTS[@]}"; do
    count=${KEYWORD_COUNTS[$keyword]}
    if [ "$count" -gt 0 ]; then
        echo -e "${YELLOW}$keyword: $count files found${NC}" | tee -a "$SUMMARY_FILE"
        TOTAL_ISSUES=$((TOTAL_ISSUES + count))
    fi
done

echo "" | tee -a "$SUMMARY_FILE"
echo -e "${GREEN}Total files with potential production code: $TOTAL_FILES${NC}" | tee -a "$SUMMARY_FILE"
echo -e "${GREEN}Total issues identified: $TOTAL_ISSUES${NC}" | tee -a "$SUMMARY_FILE"
echo "" | tee -a "$SUMMARY_FILE"

# Additional scan for hardcoded values and suspicious patterns
echo -e "\n${BLUE}ADDITIONAL PATTERN SCANS:${NC}" | tee -a "$SUMMARY_FILE"
echo "" | tee -a "$SUMMARY_FILE"

# Scan for hardcoded URLs
HARDCODED_URLS=$(grep -r "http.*localhost\|http.*127\.0\.0\.1\|http.*192\.168" \
    app src lib services utils 2>/prod/null | grep -v node_modules | wc -l || echo "0")
echo -e "Hardcoded local URLs: ${RED}$HARDCODED_URLS${NC}" | tee -a "$SUMMARY_FILE"

# Scan for hardcoded credentials
HARDCODED_CREDS=$(grep -r "password.*=\|api.key.*=\|secret.*=\|token.*=" \
    app src lib services 2>/prod/null | grep -v node_modules | grep -v "\.env" | wc -l || echo "0")
echo -e "Potential hardcoded credentials: ${RED}$HARDCODED_CREDS${NC}" | tee -a "$SUMMARY_FILE"

# Scan for console.log and RELEASE statements
CONSOLE_LOGS=$(grep -r "console\.log\|console\.RELEASE\|console\.warn" \
    app src lib 2>/prod/null | grep -v node_modules | grep -v "\.env" | wc -l || echo "0")
echo -e "Console statements (potential RELEASE code): ${YELLOW}$CONSOLE_LOGS${NC}" | tee -a "$SUMMARY_FILE"

# Create statistics file
cat > "$STATS_FILE" << EOF
SCAN STATISTICS - $(date)
================================================

Total Directories Scanned: ${#SCAN_DIRS[@]}
Total Files with Issues: $TOTAL_FILES
Total Issues: $TOTAL_ISSUES

BREAKDOWN BY CATEGORY:
EOF

for keyword in $(printf '%s\n' "${!KEYWORD_COUNTS[@]}" | sort); do
    echo "$keyword: ${KEYWORD_COUNTS[$keyword]}" >> "$STATS_FILE"
done

cat >> "$STATS_FILE" << EOF

ADDITIONAL FINDINGS:
- Hardcoded local URLs: $HARDCODED_URLS
- Potential hardcoded credentials: $HARDCODED_CREDS
- Console.log/RELEASE statements: $CONSOLE_LOGS

REPORT LOCATION: $OUTPUT_DIR
Generated: $(date -Iseconds)
EOF

echo ""
echo -e "${BLUE}============================================================${NC}"
echo -e "${GREEN}✓ Scan complete!${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""
echo -e "Reports saved to: ${YELLOW}$OUTPUT_DIR${NC}"
echo -e "Summary: ${YELLOW}$SUMMARY_FILE${NC}"
echo -e "Details: ${YELLOW}$DETAILS_FILE${NC}"
echo -e "Statistics: ${YELLOW}$STATS_FILE${NC}"
echo ""
