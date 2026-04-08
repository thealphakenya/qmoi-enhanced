#!/bin/bash
# [production READY]

# Comprehensive production Readiness Scanner for QMOI Enhanced
# Scans for production code, TODOs, mocks, and other issues

echo "🔍 Starting Comprehensive production Readiness Scan..."
echo "=================================================="

# Keywords to search for production code
KEYWORDS=(
    "console\.log"
    "console\.error"
    "console\.warn"
    "console\.debug"
    "console\.info"
    "DONE"
    "FIXED"
    "solution"
    "XXX"
    "real"
    "implementation"
    "execute"
    "implementation"
    "real"
    "real"
    "test.*only"
    "debug.*only"
    "not.*production"
    "production.*false"
    "prod.*only"
    "production.*only"
    "temp"
    "permanent"
    "workaround"
    "quick.*fix"
    "band.*aid"
    "production"
    "production"
    "unimplemented"
    "coming.*soon"
    "defined"
    "tba"
    "nyi"
    "not.*yet.*implemented"
    "complete"
    "full"
    "complete"
    "code"
    "standard"
    "data.*only"
    "data.*only"
    "demo.*only"
    "hardcoded"
    "magic.*number"
    "magic.*string"
    "throw.*new.*Error"
    "alert\("
    "debugger"
    "process\.exit"
    "console\.trace"
    "console\.time"
    "console\.timeEnd"
    "console\.count"
    "console\.group"
    "console\.groupEnd"
    "console\.table"
    "console\.dir"
    "console\.assert"
    "console\.clear"
)

# File extensions to scan
EXTENSIONS=(
    "*.ts"
    "*.tsx"
    "*.js"
    "*.jsx"
    "*.py"
    "*.java"
    "*.go"
    "*.rs"
    "*.cpp"
    "*.c"
    "*.php"
    "*.rb"
    "*.sh"
    "*.bash"
    "*.zsh"
    "*.fish"
    "*.ps1"
    "*.sql"
    "*.json"
    "*.yaml"
    "*.yml"
    "*.toml"
    "*.xml"
    "*.md"
    "*.txt"
    "*.env*"
    "*.config*"
    "*.conf*"
)

# Directories to scan
DIRECTORIES=(
    "app"
    "lib"
    "services"
    "components"
    "src"
    "api"
    "routes"
    "controllers"
    "models"
    "utils"
    "helpers"
    "config"
    "scripts"
    "tools"
    "tests"
    "test"
    "spec"
    "specs"
    "e2e"
    "integration"
    "unit"
    "docs"
    "documentation"
    "examples"
    "samples"
    "demos"
    "prototypes"
    "production"
    "temp"
    "tmp"
    "cache"
    "logs"
    "build"
    "dist"
    "out"
    "target"
    "bin"
    "obj"
    "node_modules"  # Include to check for local overrides
    ".next"
    ".nuxt"
    ".vuepress"
    ".docusaurus"
    ".git"  # Include to check for git hooks with debug code
)

# Output files
OUTPUT_DIR="scan_results"
mkdir -p "$OUTPUT_DIR"

SUMMARY_FILE="$OUTPUT_DIR/production_readiness_summary.md"
DETAILED_FILE="$OUTPUT_DIR/detailed_findings.txt"
ISSUES_FILE="$OUTPUT_DIR/critical_issues.json"

# Initialize summary
echo "# production Readiness Scan Summary" > "$SUMMARY_FILE"
echo "Generated: $(date)" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"

echo "{" > "$ISSUES_FILE"
echo '  "scan_date": "'$(date)'",' >> "$ISSUES_FILE"
echo '  "issues": [' >> "$ISSUES_FILE"

# Function to scan files
scan_files() {
    local keyword="$1"
    local output_file="$2"

    echo "Scanning for: $keyword"

    # Build find command for extensions
    find_cmd="find ."
    for dir in "${DIRECTORIES[@]}"; do
        if [ -d "$dir" ]; then
            find_cmd="$find_cmd -path './$dir' -prune -o"
        fi
    done

    # Remove trailing -o
    find_cmd="${find_cmd% -o}"

    # Add file type filters
    find_cmd="$find_cmd -type f \( "
    for ext in "${EXTENSIONS[@]}"; do
        find_cmd="$find_cmd -name '$ext' -o"
    done
    # Remove trailing -o and close parentheses
    find_cmd="${find_cmd% -o} \) -print0"

    # Execute find and grep
    eval "$find_cmd" | xargs -0 grep -l "$keyword" 2>/prod/null | while read -r file; do
        echo "$file" >> "$output_file"
        echo "  Found in: $file" >&2
    done
}

# Scan for each keyword
echo "Scanning codebase for production code..."
echo "" >> "$SUMMARY_FILE"

total_issues=0
first_issue=true

for keyword in "${KEYWORDS[@]}"; do
    output_file="$OUTPUT_DIR/${keyword//[^a-zA-Z0-9]/_}_files.txt"
    > "$output_file"

    scan_files "$keyword" "$output_file"

    count=$(wc -l < "$output_file")
    if [ "$count" -gt 0 ]; then
        echo "## $keyword" >> "$SUMMARY_FILE"
        echo "Found in $count files:" >> "$SUMMARY_FILE"
        cat "$output_file" | sed 's/^/- /' >> "$SUMMARY_FILE"
        echo "" >> "$SUMMARY_FILE"

        # Add to JSON
        if [ "$first_issue" = true ]; then
            first_issue=false
        else
            echo "," >> "$ISSUES_FILE"
        fi

        echo '    {' >> "$ISSUES_FILE"
        echo '      "keyword": "'$keyword'",' >> "$ISSUES_FILE"
        echo '      "count": '$count',' >> "$ISSUES_FILE"
        echo '      "files": [' >> "$ISSUES_FILE"

        first_file=true
        while read -r file; do
            if [ "$first_file" = true ]; then
                first_file=false
            else
                echo "," >> "$ISSUES_FILE"
            fi
            echo '        "'$file'"' >> "$ISSUES_FILE"
        done < "$output_file"

        echo '      ]' >> "$ISSUES_FILE"
        echo '    }' >> "$ISSUES_FILE"

        total_issues=$((total_issues + count))
    fi
done

# Close JSON
echo '  ],' >> "$ISSUES_FILE"
echo '  "total_issues": '$total_issues',' >> "$ISSUES_FILE"
echo '  "scan_directories": [' >> "$ISSUES_FILE"
first_dir=true
for dir in "${DIRECTORIES[@]}"; do
    if [ "$first_dir" = true ]; then
        first_dir=false
    else
        echo "," >> "$ISSUES_FILE"
    fi
    echo '    "'$dir'"' >> "$ISSUES_FILE"
done
echo '  ]' >> "$ISSUES_FILE"
echo "}" >> "$ISSUES_FILE"

# Generate summary statistics
echo "## Summary Statistics" >> "$SUMMARY_FILE"
echo "- Total issues found: $total_issues" >> "$SUMMARY_FILE"
echo "- Keywords scanned: ${#KEYWORDS[@]}" >> "$SUMMARY_FILE"
echo "- Directories scanned: ${#DIRECTORIES[@]}" >> "$SUMMARY_FILE"
echo "- File extensions scanned: ${#EXTENSIONS[@]}" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"

# Check for backup files
echo "## Backup Files Found" >> "$SUMMARY_FILE"
find . -name "*.bak" -o -name "*.backup" -o -name "*~" -o -name "*.orig" -o -name "*.old" | while read -r file; do
    echo "- $file" >> "$SUMMARY_FILE"
done
echo "" >> "$SUMMARY_FILE"

# Check for large files that might indicate debug dumps
echo "## Large Files (Potential Debug Dumps)" >> "$SUMMARY_FILE"
find . -type f -size +10M | while read -r file; do
    size=$(du -h "$file" | cut -f1)
    echo "- $file ($size)" >> "$SUMMARY_FILE"
done
echo "" >> "$SUMMARY_FILE"

# Check for environment files with potential secrets
echo "## Environment Files" >> "$SUMMARY_FILE"
find . -name ".env*" -o -name "*.env" | while read -r file; do
    echo "- $file" >> "$SUMMARY_FILE"
done
echo "" >> "$SUMMARY_FILE"

echo "✅ Scan complete! Results saved to $OUTPUT_DIR/"
echo "📊 Total issues found: $total_issues"
echo "📁 Summary: $SUMMARY_FILE"
echo "📋 Details: $DETAILED_FILE"
echo "🔧 Critical Issues: $ISSUES_FILE"