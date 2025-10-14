#!/usr/bin/env python3
"""
Resolve Dependabot Conflict Script
Simple fix for the ws dependency conflict
"""

import json
import subprocess
import os


def update_ws_dependency():
    """Update ws dependency to resolve dependabot conflict"""
    print("🔧 Updating ws dependency...")

    try:
        # Read current package.json
        with open("package.json", "r") as f:
            package_data = json.load(f)

        # Update ws dependency
        if "dependencies" in package_data:
            package_data["dependencies"]["ws"] = "8.18.3"
            print("✅ Updated ws to 8.18.3")

        # Write updated package.json
        with open("package.json", "w") as f:
            json.dump(package_data, f, indent=2)

        print("✅ Package.json updated successfully")
        return True

    except Exception as e:
        print(f"❌ Failed to update package.json: {str(e)}")
        return False


def commit_and_push():
    """Commit and push the changes"""
    print("🚀 Committing and pushing changes...")

    try:
        # Add all changes
        subprocess.run("git add .", shell=True, check=True)
        print("✅ Files staged")

        # Commit
        subprocess.run(
            'git commit -m "Fix: Update ws dependency to 8.18.3 to resolve dependabot conflict"',
            shell=True,
            check=True,
        )
        print("✅ Changes committed")

        # Push
        subprocess.run("git push origin fix-dependabot-ws", shell=True, check=True)
        print("✅ Changes pushed")

        return True

    except subprocess.CalledProcessError as e:
        print(f"❌ Git operation failed: {str(e)}")
        return False


def main():
    """Main function"""
    print("🎯 Resolving Dependabot Conflict")
    print("=" * 40)

    # Update ws dependency
    if update_ws_dependency():
        # Commit and push
        if commit_and_push():
            print("\n🎉 Dependabot conflict resolved successfully!")
            print("✅ ws dependency updated to 8.18.3")
            print("✅ Changes committed and pushed")
            print("✅ Ready to merge PR")
        else:
            print("\n❌ Failed to commit and push changes")
    else:
        print("\n❌ Failed to update ws dependency")


if __name__ == "__main__":
    main()
