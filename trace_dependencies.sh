#!/bin/bash

echo "=== DEPENDENCY TREE ANALYSIS FOR QMOI ENTRY COMPONENTS ===" > DEPENDENCY_TRACE.md
echo "" >> DEPENDENCY_TRACE.md
echo "Generated: $(date)" >> DEPENDENCY_TRACE.md
echo "" >> DEPENDENCY_TRACE.md

# Function to trace imports
trace_imports() {
  local file=$1
  local indent=$2
  local visited_file=$3
  
  # Avoid circular imports
  if echo "$visited_file" | grep -q ",$file,"; then
    echo "${indent}⟳ (circular - $file)" >> DEPENDENCY_TRACE.md
    return
  fi
  
  # Get all import statements
  grep -o "from ['\"][^'\"]*['\"]" "$file" 2>/dev/null | sed "s/from ['\"]//;s/['\"]//g" | while read import_path; do
    # Resolve alias paths
    resolved_path="${import_path//@\/app/\/workspaces\/qmoi-enhanced\/app}"
    resolved_path="${resolved_path//@\/src/\/workspaces\/qmoi-enhanced\/src}"
    resolved_path="${resolved_path//@\//\/workspaces\/qmoi-enhanced\/}"
    
    # Try different extensions
    local found=0
    for ext in .ts .tsx .js .jsx; do
      if [ -f "$resolved_path$ext" ]; then
        echo "${indent}├─ $import_path" >> DEPENDENCY_TRACE.md
        trace_imports "$resolved_path$ext" "${indent}│  " "$visited_file,$file,"
        found=1
        break
      fi
    done
    
    # If not found as file, it might be a module
    if [ $found -eq 0 ]; then
      echo "${indent}├─ $import_path (module/external)" >> DEPENDENCY_TRACE.md
    fi
  done
}

# Analyze main entry components
echo "## QMOIChat Entry Component" >> DEPENDENCY_TRACE.md
echo "\`\`\`" >> DEPENDENCY_TRACE.md
echo "File: src/components/qmoi/QMOIChat.tsx" >> DEPENDENCY_TRACE.md
echo "\`\`\`" >> DEPENDENCY_TRACE.md
trace_imports "/workspaces/qmoi-enhanced/src/components/qmoi/QMOIChat.tsx" ""

echo "" >> DEPENDENCY_TRACE.md
echo "## AvatarDisplay Entry Component" >> DEPENDENCY_TRACE.md
echo "\`\`\`" >> DEPENDENCY_TRACE.md
echo "File: src/components/qmoi/AvatarDisplay.tsx" >> DEPENDENCY_TRACE.md
echo "\`\`\`" >> DEPENDENCY_TRACE.md
trace_imports "/workspaces/qmoi-enhanced/src/components/qmoi/AvatarDisplay.tsx" ""

echo "" >> DEPENDENCY_TRACE.md
echo "## QMOIDashboard Entry Component" >> DEPENDENCY_TRACE.md
echo "\`\`\`" >> DEPENDENCY_TRACE.md
echo "File: src/components/q-city/QMOIDashboard.tsx" >> DEPENDENCY_TRACE.md
echo "\`\`\`" >> DEPENDENCY_TRACE.md
trace_imports "/workspaces/qmoi-enhanced/src/components/q-city/QMOIDashboard.tsx" ""

echo "" >> DEPENDENCY_TRACE.md
echo "Analysis complete. Results in DEPENDENCY_TRACE.md"
