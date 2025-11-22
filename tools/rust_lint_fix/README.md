<!-- QMOI_OWNER_START -->
owner: unknown
role: unknown
updated_at: 2025-11-22T13:51:59Z
<!-- QMOI_OWNER_END -->

# rust_lint_fix (scaffold)

This folder contains a minimal Rust-based linter/fixer scaffold. It is intentionally a dry-run scaffold that collects a list of files and writes a proposal JSON into `.qmoi_validation/`.

How to run (developer machine with Rust toolchain):

```bash
cd tools/rust_lint_fix
cargo run --release
# or for explicit dry-run flags in future: cargo run -- --dry-run
```

What it does:
- Scans the repository (skips node_modules and .git)
- Writes a JSON proposal in `.qmoi_validation/rust_lint_proposal_<ts>.json`

Next steps:
- Implement specific lint/fix logic using `rust-analyzer` crates or custom AST transforms
- Emit patch hunks in the `patches` array in the proposal JSON so they can be reviewed and applied conservatively
