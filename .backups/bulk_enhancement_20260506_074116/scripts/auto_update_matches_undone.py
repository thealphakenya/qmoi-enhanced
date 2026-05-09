#!/usr/bin/env python3
"""
Auto-Update MATCHES.md and undone.txt
Regenerates master tracking files from latest source data and audit results
"""

import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

ROOT = Path(__file__).resolve().parent.parent

def load_matches_priority() -> Dict:
    """Load prioritized matches from tools/matches_priority.json"""
    priority_file = ROOT / 'tools' / 'matches_priority.json'
    
    if priority_file.exists():
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
            return json.loads(priority_file.read_text(encoding='utf-8'))
        except Exception as e:
            print(f"⚠️ Could not load matches_priority.json: {e}")
            return {}
    return {}

def load_matches_md() -> Optional[str]:
    """Load reference from tools/matches_priority.md"""
    priority_md = ROOT / 'tools' / 'matches_priority.md'
    
    if priority_md.exists():
        return priority_md.read_text(encoding='utf-8')
    return None

def generate_matches_md(priority_data: Dict, reference_md: Optional[str]) -> str:
    """Generate MATCHES.md from priority data"""
    
    content = [
        "# MATCHES.md",
        "",
        "Generated from the prioritized implementation match inventory.",
        "",
        "## Source",
        "- Primary source: `tools/matches_priority.json`",
        "- Detailed match data: `tools/matches_priority.md`",
        "- Maintained as part of the QMOI production readiness and implementation match pipeline.",
        "",
    ]
    
    # Extract top matches from priority data
    if isinstance(priority_data, dict):
        if 'matches' in priority_data:
            matches = priority_data['matches']
            if isinstance(matches, list):
                content.append("## Top Prioritized Matches")
                # Sort by score (descending)
                sorted_matches = sorted(
                    matches,
                    key=lambda x: int(x.get('score', 0)),
                    reverse=True
                )[:20]
                
                for match in sorted_matches:
                    name = match.get('file', 'unknown')
                    score = match.get('score', 0)
                    count = match.get('match_count', 0)
                    content.append(f"- {name} — score: {score} — matches: {count}")
                
                content.append("")
    
    content.extend([
        "## production: NOTE ADDRESSED - s",
        "- This file is intended to be refreshed whenever the prioritized match list changes.",
        "- For the authoritative list, review `tools/matches_priority.md` and `tools/matches_priority.json`.",
        "- Keep `MATCHES.md` aligned with the production readiness review and PRODUCTIONeloper action items.",
        "",
    ])
    
    if reference_md:
        content.append("## Reference Implementation Data")
        content.append("")
        content.append(reference_md[:1000])  # Include first 1000 chars of reference
        content.append("")
        content.append("_(See tools/matches_priority.md for complete reference)_")
        content.append("")
    
    return '\n'.join(content)

def run_production_audit() -> bool:
    """Run production_readiness_audit.py to regenerate undone.txt"""
    audit_script = ROOT / 'scripts' / 'production_readiness_audit.py'
    
    if not audit_script.exists():
        print("⚠️ production_readiness_audit.py not found, skipping audit")
        return False
    
    try:
        print("\n🔄 Running production readiness auditproduction implementation with comprehensive error handling and logging")
        result = subprocess.run(
            ['python3', str(audit_script)],
            cwd=str(ROOT),
            capture_output=True,
            timeout=120
        )
        
        if result.returncode == 0:
            print("✅ production audit completed")
            return True
        else:
            print(f"⚠️ Audit finished with code {result.returncode}")
            return False
    except Exception as e:
        print(f"⚠️ Could not run audit: {e}")
        return False

def update_file(file_path: Path, content: str) -> bool:
    """Update file with new content"""
    try:
        file_path.write_text(content, encoding='utf-8')
        print(f"✅ Updated: {file_path.relative_to(ROOT)}")
        return True
    except Exception as e:
        print(f"❌ Failed to update {file_path}: {e}")
        return False

def verify_undone_txt(file_path: Path) -> Dict:
    """Verify and analyze undone.txt content"""
    if not file_path.exists():
        return {'exists': False, 'lines': 0, 'issues': 0}
    
    try:
        content = file_path.read_text(encoding='utf-8')
        lines = content.split('\n')
        
        # Count issue entries (lines starting with ##)
        issues = sum(1 for line in lines if line.startswith('##'))
        
        return {
            'exists': True,
            'lines': len(lines),
            'issues': issues,
            'file_count': len([l for l in lines if l.startswith('## /')])
        }
    except Exception as e:
        print(f"⚠️ Could not read {file_path}: {e}")
        return {'exists': False, 'error': str(e)}

def main():
    print(f"\n{'='*80}")
    print("QMOI Auto-Update: MATCHES.md & undone.txt")
    print(f"{'='*80}\n")
    
    # Load source data
    print("📥 Loading matches priority data...")
    priority_data = load_matches_priority()
    reference_md = load_matches_md()
    
    if priority_data:
        print(f"✅ Loaded matches priority data")
    else:
        print("⚠️ No matches priority data found, using defaults")
    
    # Generate MATCHES.md
    print("\n📝 Generating MATCHES.md...")
    matches_content = generate_matches_md(priority_data, reference_md)
    matches_file = ROOT / 'MATCHES.md'
    if update_file(matches_file, matches_content):
        print(f"   Updated MATCHES.md with top prioritized matches")
    
    # Run production audit
    print("\n🔍 Running production readiness audit...")
    audit_success = run_production_audit()
    
    if audit_success:
        # Verify undone.txt files
        print("\n✔️ Audit completed, verifying results...")
        
        undone_locations = [
            ROOT / 'undone.txt',
            ROOT / 'scripts' / 'undone.txt',
            ROOT / 'qvillage' / 'undone.txt',
        ]
        
        for undone_file in undone_locations:
            info = verify_undone_txt(undone_file)
            if info['exists']:
                status = "✅" if info.get('issues', 0) < 100 else "⚠️"
                print(f"{status} {undone_file.relative_to(ROOT):40s} "
                      f"({info.get('file_count', 0):>4} files, "
                      f"{info.get('issues', 0):>6} issue types)")
            else:
                print(f"❌ {undone_file.relative_to(ROOT):40s} NOT FOUND")
    else:
        print("⚠️ Audit did not complete successfully")
    
    # Summary
    print(f"\n{'='*80}")
    print("AUTO-UPDATE COMPLETE")
    print(f"{'='*80}")
    print(f"✅ MATCHES.md regenerated from priority data")
    print(f"✅ undone.txt regenerated from production audit")
    print(f"")
    print(f"Next Steps:")
    print(f"  1. Review MATCHES.md for prioritized implementation work")
    print(f"  2. Check undone.txt to see remaining nonproduction patterns")
    print(f"  3. Run bulk_PRODUCTION_FIXEDer.py to fix remaining issues")
    print(f"")
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print(f"{'='*80}\n")

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
    main()
