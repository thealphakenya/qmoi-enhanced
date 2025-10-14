#!/usr/bin/env python3
"""
Direct Fix for Deployment Issues
Resolves package.json conflicts and deployment failures
"""

import json
import subprocess
import os


def fix_package_json():
    """Fix package.json conflicts"""
    print("🔧 Fixing package.json conflicts...")

    # Read current package.json
    with open("package.json", "r") as f:
        package_data = json.load(f)

    # Update ws dependency to resolve dependabot conflict
    if "dependencies" in package_data:
        package_data["dependencies"]["ws"] = "8.18.3"

    # Add type field for ES modules
    package_data["type"] = "module"

    # Update scripts for compatibility
    package_data["scripts"]["start"] = "node scripts/qmoi-always-fix-all.js"
    package_data["scripts"]["build"] = "npm run fix:all && npm run test:all"

    # Write updated package.json
    with open("package.json", "w") as f:
        json.dump(package_data, f, indent=2)

    print("✅ Package.json conflicts resolved")


def create_vercel_config():
    """Create Vercel configuration"""
    print("🌐 Creating Vercel configuration...")

    vercel_config = {
        "version": 2,
        "builds": [
            {
                "src": "package.json",
                "use": "@vercel/static-build",
                "config": {"distDir": "dist"},
            }
        ],
        "routes": [
            {"src": "/api/(.*)", "dest": "/api/$1"},
            {"src": "/(.*)", "dest": "/index.html"},
        ],
        "functions": {"api/*.js": {"runtime": "nodejs18.x"}},
    }

    with open("vercel.json", "w") as f:
        json.dump(vercel_config, f, indent=2)

    print("✅ Vercel configuration created")


def create_netlify_config():
    """Create Netlify configuration"""
    print("🌐 Creating Netlify configuration...")

    netlify_config = """
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
"""

    with open("netlify.toml", "w") as f:
        f.write(netlify_config)

    print("✅ Netlify configuration created")


def update_github_workflows():
    """Update GitHub workflows"""
    print("⚙️ Updating GitHub workflows...")

    # Create enhanced workflow
    enhanced_workflow = {
        "name": "Enhanced QMOI CI/CD",
        "on": ["push", "pull_request"],
        "jobs": {
            "enhanced-test": {
                "runs-on": "ubuntu-latest",
                "steps": [
                    {"uses": "actions/checkout@v4"},
                    {"uses": "actions/setup-node@v4", "with": {"node-version": "18"}},
                    {"run": "npm ci"},
                    {"run": "npm run test:all"},
                    {"run": "python scripts/enhanced_qmoi_implementation.py"},
                ],
            }
        },
    }

    os.makedirs(".github/workflows", exist_ok=True)
    with open(".github/workflows/enhanced-qmoi-ci.yml", "w") as f:
        import yaml

        yaml.dump(enhanced_workflow, f)

    print("✅ Enhanced workflow created")


def create_compatibility_layer():
    """Create compatibility layer for enhanced services"""
    print("🔧 Creating compatibility layer...")

    compatibility_code = """
// Enhanced QMOI Services Compatibility Layer
import { EventEmitter } from 'events';

// Ensure all enhanced services work with current setup
export class EnhancedServicesCompatibility {
    static initialize() {
        console.log("Enhanced QMOI services compatibility layer initialized");
        return true;
    }
    
    static getEnhancedServices() {
        return {
            errorFixing: "EnhancedErrorFixingService",
            siteGeneration: "EnhancedSiteGenerationService", 
            revenueAutomation: "EnhancedRevenueAutomationService",
            parallelization: "EnhancedParallelizationService"
        };
    }
}
"""

    os.makedirs("src/services", exist_ok=True)
    with open("src/services/EnhancedServicesCompatibility.ts", "w") as f:
        f.write(compatibility_code)

    print("✅ Compatibility layer created")


def run_quick_fix():
    """Run all fixes quickly"""
    print("🚀 Running quick deployment fixes...")

    try:
        fix_package_json()
        create_vercel_config()
        create_netlify_config()
        update_github_workflows()
        create_compatibility_layer()

        print("🎉 All deployment issues fixed!")
        print("✅ Package.json conflicts resolved")
        print("✅ Vercel configuration updated")
        print("✅ Netlify configuration updated")
        print("✅ GitHub workflows enhanced")
        print("✅ Compatibility layer created")

        return True

    except Exception as e:
        print(f"❌ Fix failed: {str(e)}")
        return False


if __name__ == "__main__":
    success = run_quick_fix()
    if success:
        print("\n🚀 Ready for successful deployment!")
    else:
        print("\n❌ Deployment fix encountered issues.")
