#!/bin/bash

# Verification script to cross-check undone.txt entries with actual files

echo "🔍 VERIFICATION OF UNDONE.TXT ENTRIES"
echo "===================================="
echo ""

# Extract file samples from each marker section
# BROKEN files
echo "🔴 Checking BROKEN files (should have 'BROKEN' marker):"
broken_files=$(grep "^backups\|^docs\|^QVILLAGE" /workspaces/qmoi-enhanced/undone.txt | head -5)
for file in $broken_files; do
  if [ -f "/workspaces/qmoi-enhanced/$file" ]; then
    count=$(grep -c "BROKEN" "/workspaces/qmoi-enhanced/$file" 2>/dev/null || echo "0")
    status="❌"
    [ "$count" -gt 0 ] && status="✅"
    echo "  $status $file: $count occurrences"
  fi
done

echo ""
echo "🟠 Checking PRODUCTION files (should have 'PRODUCTION' marker):"
# Get some PRODUCTION file examples from the list
grep -A 200 "PRODUCTION.*Found in" /workspaces/qmoi-enhanced/undone.txt | grep "^[a-zA-Z]" | head -5 | while read file; do
  if [ -f "/workspaces/qmoi-enhanced/$file" ]; then
    count=$(grep -c "PRODUCTION" "/workspaces/qmoi-enhanced/$file" 2>/dev/null || echo "0")
    status="❌"
    [ "$count" -gt 0 ] && status="✅"
    echo "  $status $file: $count occurrences"
  fi
done

echo ""
echo "🟡 Checking sample files (should have 'sample' marker):"
# Check sample marker
for file in "UI_ENHANCEMENT_COMPREHENSIVE_PLAN.md" "qvillage/app.py" "components/ParallelProcessing.tsx"; do
  if [ -f "/workspaces/qmoi-enhanced/$file" ]; then
    count=$(grep -c "sample" "/workspaces/qmoi-enhanced/$file" 2>/dev/null || echo "0")
    status="❌"
    [ "$count" -gt 0 ] && status="✅"
    echo "  $status $file: $count occurrences"
  fi
done

echo ""
echo "📊 SUMMARY STATISTICS FROM UNDONE.TXT:"
echo "---"
grep "| simulation |" /workspaces/qmoi-enhanced/undone.txt
grep "| sample |" /workspaces/qmoi-enhanced/undone.txt
grep "| PRODUCTION |" /workspaces/qmoi-enhanced/undone.txt
grep "| BROKEN |" /workspaces/qmoi-enhanced/undone.txt
grep "| COMPLETE |" /workspaces/qmoi-enhanced/undone.txt

echo ""
echo "⚠️  NOTE: If SUMMARY shows 0 for all counts but DETAILED FINDINGS show file lists,"
echo "     then undone.txt header/summary may not match actual detailed section content."
