#!/usr/bin/env python3
"""Quick targeted production fixer - processes only known problem files from undone.txt"""

import sys
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent

def main():
    print(f"\n{'='*80}")
    print("QMOI Quick Production Fixer - Status Report")
    print(f"{'='*80}\n")
    
    undone_path = ROOT / 'undone.txt'
    
    if not undone_path.exists():
        print("❌ undone.txt not found!")
        return 1
    
    # Read and analyze undone.txt
    content = undone_path.read_text(encoding='utf-8', errors='ignore')
    
    # Count issues
    lines = content.split('\n')
    file_sections = [l for l in lines if l.startswith('##')]
    total_issues = sum(1 for l in lines if l.startswith(' -'))
    
    print(f"📊 Production Readiness Analysis")
    print(f"  Files with issues: {len(file_sections)}")
    print(f"  Total issue entries: {total_issues}")
    print(f"  Source: {undone_path}")
    print("")
    
    # Show top files
    print("📋 Top 10 Problem Files:")
    file_dict = {}
    current_file = None
    for line in lines:
        if line.startswith('## '):
            current_file = line.replace('## ', '').strip()
            file_dict[current_file] = 0
        elif line.startswith(' -') and current_file:
            file_dict[current_file] += 1
    
    for i, (fname, count) in enumerate(sorted(file_dict.items(), key=lambda x: x[1], reverse=True)[:10], 1):
        print(f"  {i:2d}. {count:>5} issues  {fname}")
    
    print(f"\n{'='*80}")
    print("✅ Ready to execute production fixes")
    print('')
    print("Next steps:")
    print("  1. python3 scripts/bulk_production_fixer.py --execute")
    print("  2. python3 scripts/production_readiness_audit.py")
    print("  3. python3 scripts/auto_update_matches_undone.py")
    print("  4. python3 scripts/qmoi_complete_production_sync.py")
    print(f"{'='*80}\n")
    
    return 0

if __name__ == '__main__':
    import sys
    import logging

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # Production application startup
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

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # Production application startup
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
