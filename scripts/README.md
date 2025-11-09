# Markdown Link Auditor

A conservative tool for auditing and fixing Markdown links in a repository.

## Features

- Scans all `.md` and `.markdown` files (including README.* files)
- Replaces download-like targets with a placeholder (creates backups)
- Validates relative link existence
- Optional deep HTTP link checking
- Produces detailed reports in `.qmoi_validation/`

## Usage

Basic scan (fast, no network checks):
```bash
python3 scripts/links_audit_and_fix.py
```

With HTTP link validation:
```bash
python3 scripts/links_audit_and_fix.py --deep
```

Options:
- `--deep`: Enable HTTP link validation (slower)
- `--workers N`: Number of concurrent HTTP checkers (default: 8)
- `--max-files N`: Limit number of files to scan (0=all)

## Safety Features

- Only modifies `.md` files
- Creates `.linkfix.bak` backup before any modifications
- Skips large/system directories (.git, node_modules, etc.)
- Short timeouts on HTTP checks
- Conservative link replacement (only download-like targets)

## Reports

Three report files are generated in `.qmoi_validation/`:

1. `link_validation_report.txt`: Human-readable summary
2. `link_validation_report.json`: Detailed scan results
3. `link_validation_deep_report.json`: HTTP check results (if --deep)

## CI Integration

Add to your CI workflow:

```yaml
- name: Audit Markdown Links
  run: python3 scripts/links_audit_and_fix.py
  
- name: Check for Modified Files
  run: |
    if [[ -n $(git status -s) ]]; then
      echo "::error::Some markdown files contain download links that need review"
      exit 1
    fi
```

## Development

Run tests:
```bash
PYTHONPATH=/workspaces/qmoi-enhanced/scripts python3 -m unittest /workspaces/qmoi-enhanced/scripts/test_links_audit_and_fix.py -v
```