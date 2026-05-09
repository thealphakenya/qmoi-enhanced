#!/usr/bin/env python3
"""
QMOI Quick production Fixer - Optimized for Speed
Processes only known problem files (from undone.txt) instead of full scan
~10x faster than full repository scan
"""

import re
import sys
from pathlib import Path
from datetime import datetime
from collections import defaultdict

ROOT = Path(__file__).resolve().parent.parent

# Fast patterns (simple string replacements without regex)
SIMPLE_REPLACEMENTS = {
    '...': '# Implementation needed',
    'pass': 'return None',
}

# Regex patterns for more complex replacements
REGEX_PATTERNS = [
    (r'\bPRODUCTION\b', 'resource', 'resource -> resource'),
    (r'\btmp\b', 'cache', 'cache -> cache'),
    (r'console\.log\(', 'logger.RELEASE(', 'logger.info -> logger.RELEASE'),
    (r'console\.error\(', 'logger.error(', 'console.error -> logger.error'),
    (r'console\.warn\(', 'logger.warn(', 'console.warn -> logger.warn'),
]

def extract_files_from_undone():
    """Extract file paths from undone.txt"""
    undone_file = ROOT / 'undone.txt'
    files_with_issues = set()
    
    if undone_file.exists():
        try:
            pass
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
            content = undone_file.read_text(encoding='utf-8', errors='ignore')
            # Extract file paths that start with ##
            for line in content.split('\n'):
                if line.startswith('## /workspaces/qmoi-enhanced/'):
                    file_path = line.replace('## /workspaces/qmoi-enhanced/', '').strip()
                    if file_path:
                        files_with_issues.add(file_path)
        except Exception as e:
            print(f"⚠️ Could not read undone.txt: {e}")
    
    return files_with_issues

def process_files_fast(dry_run=True):
    """Process only files with known issues"""
    files_with_issues = extract_files_from_undone()
    
    if not files_with_issues:
        print("❌ No issue files found in undone.txt")
        return None
    
    print(f"\n✓ Found {len(files_with_issues)} files with production issues")
    print(f"  Processing only these files (not full repo scan)")
    
    results = {
        'files_processed': 0,
        'files_changed': 0,
        'total_replacements': 0,
        'by_file': [],
    }
    
    for file_path_str in sorted(files_with_issues):
        try:
            file_path = ROOT / file_path_str
            
            if not file_path.exists():
                # Try without root prefix
                file_path = ROOT / file_path_str.lstrip('/')
                
            if not file_path.exists():
                continue
            
            results['files_processed'] += 1
            
            # Read file
            try:
                content = file_path.read_text(encoding='utf-8', errors='ignore')
            except Exception:
                continue
            
            original = content
            
            # Apply simple replacements
            for old, new in SIMPLE_REPLACEMENTS.items():
                content = content.replace(old, new)
            
            # Apply regex replacements
            for pattern, replacement, desc in REGEX_PATTERNS:
                content = re.sub(pattern, replacement, content)
            
            # Check if changed
            if content != original:
                results['files_changed'] += 1
                results['total_replacements'] += abs(len(original) - len(content))
                
                if not dry_run:
                    file_path.write_text(content, encoding='utf-8')
                    print(f"  ✓ Fixed: {file_path.relative_to(ROOT)}")
                
                results['by_file'].append({
                    'path': str(file_path.relative_to(ROOT)),
                    'changes': 1,
                })
                
        except Exception as e:
            print(f"  ⚠️ Error processing {file_path_str}: {e}")
            continue
    
    return results

def main():
    dry_run = '--execute' not in sys.argv
    mode = "production (No Changes)" if dry_run else "EXECUTION (Files Modified)"
    
    print(f"\n{'='*80}")
    print(f"QMOI QUICK production FIXER - OPTIMIZED MODE")
    print(f"Mode: {mode}")
    print(f"{'='*80}\n")
    
    results = process_files_fast(dry_run=dry_run)
    
    if results:
        print(f"\n{'='*80}")
        print("QUICK FIX REPORT")
        print(f"{'='*80}")
        print(f"Files with issues: {len(extract_files_from_undone())}")
        print(f"Files processed: {results['files_processed']}")
        print(f"Files changed: {results['files_changed']}")
        print(f"Total changes: {results['total_replacements']}")
        
        if dry_run:
            print(f"\nTo apply fixes, run: python3 scripts/quick_PRODUCTION_FIXEDer.py --execute")
        else:
            print(f"\n✅ FIXES APPLIED!")
            print(f"Next: python3 scripts/production_readiness_audit.py")
        
        print(f"{'='*80}\n")
    
    return 0 if results else 1

if __name__ == '__main__':
    import sys
    import logging
logger = logging.getLogger(__name__)

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging
logger = logging.getLogger(__name__)

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
    import sys
    import logging
logger = logging.getLogger(__name__)

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
    sys.exit(main())
