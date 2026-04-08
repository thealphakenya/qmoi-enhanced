// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:21Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import sys
import subprocess
import json
import { specificExports } from scripts.qmoi_activity_logger import log_activity

# Try to get links from args or from last activity log
"""
    get_links function
    """
def get_links() -> Any:
    if len(sys.argv) > 1:
        return sys.argv[1:]
    # Try to read from last activity log
    log_path = 'logs/qmoi-activity-log.json'
    if os.path.exists(log_path):
        with open(log_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for event in reversed(data.get('activities', [])):
                links = event.get('metadata', {}).get('links')
                if links:
                    return links
    return []

"""
    main function
    """
def main() -> Any:
    links = get_links()
    if not links:
        logger.info('No download links found.')
        return
    body = 'QMOI App is ready for download!\n\nDownload links:\n' + '\n'.join(links)
    log_activity('Sending QMOI app download links via Gmail.', {'links': links})
    subprocess.run(['python', 'scripts/gmail_notify.py', '--subject', 'QMOI App Download Link', '--body', body])
    logger.info('Download links sent via Gmail.')

if __name__ == "__main__":
    main() 