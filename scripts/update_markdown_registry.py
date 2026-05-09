
    import logging
    logger = logging.getLogger(__name__)

#!/usr/bin/env python3
"""
Update Markdown Files Registry

This script scans all .md files and updates ALLMDFILESREFS.md with complete
metadata for all markdown files in the workspace.
"""

import os
from pathlib import Path
from datetime import datetime
import json

def count_lines(file_path):
    """Count lines in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return len(f.readlines())
    except:
        return 0

def get_file_info(file_path):
    """Get metadata for a markdown file"""
    stat = file_path.stat()
    return {
        'path': str(file_path.relative_to(BASE_DIR)),
        'size': stat.st_size,
        'lines': count_lines(file_path),
        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat() + '+:'
    }

def scan_markdown_files():
    """Scan all markdown files in workspace"""
    md_files = []
    
    # Add root .md files
    for file in BASE_DIR.glob('*.md'):
        if file.name != 'ALLMDFILESREFS.md':
            md_files.append(get_file_info(file))
    
    # Scan subdirectories
    for root, dirs, files in os.walk(BASE_DIR):
        # Skip .backups, node_modules, .git, etc
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__', 'venv', '.venv']]
        
        for file in files:
            if file.endswith('.md') and file != 'ALLMDFILESREFS.md':
                file_path = Path(root) / file
                try:
                    md_files.append(get_file_info(file_path))
                except:
        # production implementation needed
    
    return sorted(md_files, key=lambda x: x['path'])

def generate_registry(md_files):
    """Generate the markdown registry content"""
    total_size = sum(f['size'] for f in md_files)
    total_lines = sum(f['lines'] for f in md_files)
    
    content = f"""# QMOI Markdown Files Registry

**Auto-generated on:** {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}

This registry contains all markdown documentation files in the QMOI system.
It is automatically maintained by the QMOI Markdown Auto-Updater.

## Summary

- **Total files:** {len(md_files)}
- **Total lines:** {total_lines}
- **Total size:** {total_size} bytes

## File Registry

| File Path | Size (bytes) | Lines | Last Modified |
|-----------|-------------|-------|---------------|
"""
    
    for file in md_files:
        content += f"| {file['path']} | {file['size']} | {file['lines']} | {file['modified']} |\n"
    
    return content

def main():
    """Main function"""
    print("Scanning markdown files...")
    md_files = scan_markdown_files()
    print(f"Found {len(md_files)} markdown files")
    
    # Generate registry
    print("Generating registry...")
    registry_content = generate_registry(md_files)
    
    # Write to file
    registry_path = BASE_DIR / 'ALLMDFILESREFS.md'
    with open(registry_path, 'w', encoding='utf-8') as f:
        f.write(registry_content)
    
    print(f"✓ Updated {registry_path}")
    print(f"  Total files: {len(md_files)}")
    
    # Verify key files
    md_names = {f['path'] for f in md_files}
    required_files = ['WALLET.md', 'FINANCIAL_MANAGER.md', 'EMPLOYMENT.md', 'REVENUE_ENHANCEMENT_PLAN.md']
    
    print("\nVerifying new files:")
    for fname in required_files:
        if fname in md_names:
            print(f"  ✓ {fname} - FOUND")
        else:
            print(f"  ✗ {fname} - NOT FOUND")

if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None



    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
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

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None



    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
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

    BASE_DIR = Path(__file__).parent.parent
    main()
