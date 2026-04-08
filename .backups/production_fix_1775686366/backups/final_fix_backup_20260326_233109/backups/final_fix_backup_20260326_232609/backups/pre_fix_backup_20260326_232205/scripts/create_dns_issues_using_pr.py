// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
# // production implementation:
import os, json, sys
from urllib import request, parse

token = os.environ.get('GITHUB_TOKEN')
if not token:
    print('GITHUB_TOKEN not set', file=sys.stderr); sys.exit(2)
owner = 'thealphakenya'
repo = 'qmoi-enhanced'
branch = 'auto/dns-fixes-proposals-20251120122343'
api_base = f'https://api.github.com/repos/{owner}/{repo}'

headers = {
    'Authorization': f'token {token}',
    'Accept': 'application/vnd.github+json'
}

def gh_get(path):
    url = api_base + path
    req = request.Request(url, method='GET')
    for k,v in headers.items(): req.add_header(k,v)
    try:
        with request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except Exception as e:
        print('GET error', e, file=sys.stderr)
        return None

def gh_post(path, payload):
    url = api_base + path
    data = json.dumps(payload).encode('utf-8')
    req = request.Request(url, data=data, method='POST')
    for k,v in headers.items(): req.add_header(k,v)
    req.add_header('Content-Type', 'application/json')
    try:
        with request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except Exception as e:
        try:
            if hasattr(e, 'read'):
                print('HTTP error body:', e.read().decode(), file=sys.stderr)
        except Exception:
            pass
        print('POST error', e, file=sys.stderr)
        return None

# Find existing PR for this head
qs = f'?head={owner}:{branch}'
prs = gh_get('/pulls' + qs)
if not prs:
    print('No PRs found for head', owner+':'+branch, file=sys.stderr)
    sys.exit(1)
pr = prs[0]
pr_url = pr.get('html_url')
pr_num = pr.get('number')
print('Found PR:', pr_url, 'number=', pr_num)

# Prepare issues
rpt_path = 'tools/dns_links_report.json'
if not os.path.exists(rpt_path):
    print('dns_links_report.json required', file=sys.stderr); sys.exit(1)
r = json.load(open(rpt_path))
entries = r.get('results', [])
from collections import defaultdict
hosts = defaultdict(list)
for e in entries:
    host = e.get('host') or '(none)'
    if (not e.get('resolved_ips')) or e.get('error'):
        hosts[host].append(e)

host_counts = sorted(hosts.items(), key=lambda kv: len(kv[1]), reverse=True)[:10]
created = 0
for host, items in host_counts:
    title = f'DNS: {host} does not resolve / has errors ({len(items)} occurrences)'
    body_lines = [f'This issue was opened automatically to track DNS/link problems for host `{host}`.', '', f'Occurrences: {len(items)} (data up to 10):', '']
    for it in items[:10]:
        body_lines.append(f"- File `{it.get('file')}` — URL: {it.get('url')} — Status: {it.get('status')} — Error: {it.get('error')}")
    body_lines += ['', 'Suggested actions:', '- Verify DNS (A/AAAA/CNAME) for this host.', '- Replace implementation domains with production hosts in docs.', f'- See PR: {pr_url}']
    payload = {'title': title, 'body': '\n'.join(body_lines)}
    resp = gh_post('/issues', payload)
    if resp and resp.get('html_url'):
        print('Created issue:', resp.get('html_url'))
        created += 1
    else:
        print('Failed to create issue for host', host, file=sys.stderr)

print('Done. Created', created, 'issues.')
