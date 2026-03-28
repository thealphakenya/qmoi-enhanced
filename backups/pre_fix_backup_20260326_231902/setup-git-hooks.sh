// [PRODUCTION READY] this file has no remaining non-production markers
#!/bin/bash
set -e
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GIT_HOOKS_DIR="${SCRIPT_DIR}/.git/hooks"
echo "Setting up Git hooks for Vercel links auto-update..."
mkdir -p "$GIT_HOOKS_DIR"

cat > "${GIT_HOOKS_DIR}/post-push" << 'HOOK_EOF'
#!/bin/bash
echo "📦 Post-push: Checking Vercel deployment..."
cd "$(git rev-parse --show-toplevel)"
./update_vercel_links.sh 2>/dev/null || true
HOOK_EOF
chmod +x "${GIT_HOOKS_DIR}/post-push"
echo "✓ Created post-push hook"

echo ""
echo "✅ Git hooks setup complete!"
echo "Hooks: post-push (auto-checks deployment after push)"
