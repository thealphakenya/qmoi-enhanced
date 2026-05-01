#!/bin/bash
# Comprehensive import fix script for removed broken imports
# This script adds proper imports for commonly used services across the codebase

WORKSPACE="/workspaces/qmoi-enhanced"

# Define service to import path mappings
declare -A SERVICE_IMPORTS=(
    ["NotificationService"]="import { NotificationService } from '../../../scripts/services/notification_service"
    ["QCityService"]="import { QCityService } from '../../../scripts/services/qcity_service"
    ["AutoFixService"]="import { AutoFixService } from '../../../scripts/services/auto_fix_service"
    ["VPNService"]="import { VPNService } from '../../../src/services/VPNService"
    ["UnifiedCICDService"]="import { UnifiedCICDService } from '../../../scripts/services/unified_ci_cd_service"
    ["ProjectService"]="import { ProjectService } from '../../../scripts/services/project_service"
    ["GitHubIntegrationService"]="import { GitHubIntegrationService } from '../../../scripts/services/github_integration"
    ["TradingService"]="import { TradingService } from '../../../lib/services/trading"
)

echo "🔧 Fixing missing service imports..."

for service in "${!SERVICE_IMPORTS[@]}"; do
    import_line="${SERVICE_IMPORTS[$service]}"
    echo "📍 Processing $service..."
    
    # Find files using this service but missing the import
    find "$WORKSPACE" -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \) | while read file; do
        # Check if file uses the service
        if grep -q "\b$service\b" "$file" 2>/dev/null; then
            # Check if it already has the import
            if ! grep -q "import.*$service" "$file" 2>/dev/null; then
                echo "⚡ Adding import to: $file"
                # Add import at the top of the file (after any existing imports)
                sed -i "1i\\${import_line};" "$file"
            fi
        fi
    done
done

echo "✅ Import fix completed"
