**Placeholder Replacement Actions (conservative) — 2025-11-20**

- **What I changed (low-risk, auto-applied):**
  - Added `public/favicon.svg` and `qmoi-space-pwa/icons/favicon.svg` (small SVG icons).
  - Added SVG fallback link tags in `public/index.html`, `public/qcity/index.html`, `app/layout.js`, and `qmoi-space-pwa/index.html` so browsers find a valid icon even when `favicon.ico` is missing.

- **Proposals (no auto-apply):**
  - Replace `https://downloads.qmoi.app` links in docs with `https://github.com/thealphakenya/qmoi-enhanced/releases` (safe doc fallback). Suggested file: `GITHUB_RELEASES_QUICK_REFERENCE.md`, `QMOIDOWNLOADS.md`.
  - Do NOT change runtime configuration endpoints (e.g., `qmoigateway.*`) without an authoritative mapping from the project owner.

- **Next steps (recommended):**
  1. Create branch `auto/placeholder-proposals-20251120-01` and commit `tools/placeholder_proposals.json` and `tools/placeholder_actions.md` (I can do this and push if you want). 
  2. Open a PR describing: added SVG icon fallbacks; propose replacing `downloads.qmoi.app` links in docs with GitHub Releases; list ambiguous runtime tokens that require owner mapping.
  3. If you approve, I will apply the safe doc replacements (only) and open a follow-up PR with changes. For runtime replacements, provide a mapping file or approve manual edits.

- **Files I touched automatically:**
  - `public/favicon.svg` (added)
  - `qmoi-space-pwa/icons/favicon.svg` (added)
  - `public/index.html` (SVG link added)
  - `public/qcity/index.html` (SVG link added)
  - `app/layout.js` (SVG link added)
  - `qmoi-space-pwa/index.html` (SVG icon link added)

If this looks good I will create the proposals branch and push these changes, then open a PR (conservative: docs + assets only). Reply "proceed" to continue, or "adjust" with specifics you want changed.
