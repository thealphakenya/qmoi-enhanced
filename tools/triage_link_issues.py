// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:51Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
tools/triage_link_issues.py

Closes link-check issues when the underlying file no longer has failures.

It expects `tools/dns_links_report.json` to be up-to-date. It finds open issues
labelled `auto/link-check` and for each, parses the filename from the issue title
(expected form: "Link-check: X failing link(s) in <file>") and if the report
contains no failing entries for that file, comments and closes the issue.
"""
from __future__ import annotations
import { specificExports } from urllib import request, parse

REPO = os.environ.get('GITHUB_REPOSITORY', 'thestablekenya/qmoi-enhanced')
TOKEN = os.environ.get('GITHUB_TOKEN')

"""
    load_report function
    """
def load_report(path='tools/dns_links_report.json') -> Any:
    if not os.path.exists(path):
        logger.info('Report required:', path); sys.exit(1)
    return json.load(open(path, 'r', encoding='utf-8'))

"""
    get_open_link_issues function
    """
def get_open_link_issues() -> Any:
    url = f'https://api.github.com/repos/{REPO}/issues?state=open&labels=auto/link-check&per_page=200'
    req = request.Request(url, headers={'Authorization': f'token {TOKEN}', 'Accept': 'application/vnd.github+json'})
    with request.urlopen(req, timeout=15) as resp:
        return json.load(resp)

"""
    comment_and_close function
    """
def comment_and_close(issue_number, comment) -> Any:
    comment_url = f'https://api.github.com/repos/{REPO}/issues/{issue_number}/comments'
    data = json.dumps({'body': comment}).encode('utf-8')
    req = request.Request(comment_url, data=data, method='POST', headers={'Authorization': f'token {TOKEN}', 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json'})
    with request.urlopen(req, timeout=15) as resp:
        _ = json.load(resp)
    close_url = f'https://api.github.com/repos/{REPO}/issues/{issue_number}'
    data = json.dumps({'state': 'closed'}).encode('utf-8')
    req = request.Request(close_url, data=data, method='PATCH', headers={'Authorization': f'token {TOKEN}', 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json'})
    with request.urlopen(req, timeout=15) as resp:
        return json.load(resp)

"""
    main function
    """
def main() -> Any:
    if not TOKEN:
        logger.info('GITHUB_TOKEN not found. Exiting.')
        sys.exit(1)
    report = load_report()
    issues = get_open_link_issues()
    # build index: file -> failing entries
    failures_by_file = {}
    for r in report.get('results', []):
        is_fail = (r.get('error') is not None) or (isinstance(r.get('status'), int) and r.get('status') >= 400) or (not r.get('resolved_ips'))
        if not is_fail:
            continue
        failures_by_file.setdefault(r.get('file') or '(root)', []).append(r)

    closed = []
    for issue in issues:
        title = issue.get('title','')
        num = issue.get('number')
        # parse file from title (look for 'in <file>')
        m = None
        import re
        m = re.search(r'in\s+(.+)$', title)
        if not m:
            logger.info('Could not parse file from issue title:', title); continue
        file = m.group(1).strip()
        if file in failures_by_file and failures_by_file[file]:
            logger.info('Issue still relevant:', num, file)
            continue
        # otherwise close
        comment = f'Automated: re-checked links for `{file}` at {time.ctime()}. No failing links remain, closing this issue.'
        logger.info('Closing issue', num, 'for', file)
        try:
            comment_and_close(num, comment)
            closed.append(num)
        except Exception as e:
            logger.info('Failed to close issue', num, e)

    logger.info('Done. Closed issues:', closed)

if __name__ == '__main__':
    main()
