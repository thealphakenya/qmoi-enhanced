#!/usr/bin/env python3
import os, re, json
from pathlib import Path

# Domains to verify
entries = [
    'qmoi.com', 'api.qmoi.com', 'auth.qmoi.com', 'cdn.qmoi.com',
    'qcity.io', 'qvillage.org', 'qglobal.ai', 'qparallel.prod'
]

# UI feature required by domain (approx).
required_features = {
    'qmoi.com': ['QMOIDashboard', 'QMOIChat', 'QMOIHeader'],
    'api.qmoi.com': ['APIExplorer', 'APIKeyManager'],
    'auth.qmoi.com': ['Login', 'Signup', '2FA'],
    'cdn.qmoi.com': ['ResourceCache', 'CDNManager'],
    'qcity.io': ['QCityDashboard', 'QCityThemeProvider'],
    'qvillage.org': ['QVillageSpace', 'QVillageModels'],
    'qglobal.ai': ['QGlobalAnalytics', 'GeoRouting'],
    'qparallel.prod': ['QParallelOps', 'AutoScaling']
}

base = Path('/workspaces/qmoi-enhanced')
text_files = []
for root, dirs, files in os.walk(base):
    for f in files:
        if f.endswith(('.ts','.tsx','.js','.jsx','.md','.py','.json')):
            p = Path(root) / f
            text_files.append(p)

# Search per domain
report = {}
for domain in entries:
    report[domain] = {'found': False, 'files': [], 'features': {}}
    regex = re.compile(re.escape(domain), re.IGNORECASE)
    for p in text_files:
        try:
            text = p.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        if regex.search(text):
            report[domain]['found'] = True
            report[domain]['files'].append(str(p.relative_to(base)))
    required = required_features.get(domain, [])
    for feature in required:
        feature_regex = re.compile(re.escape(feature), re.IGNORECASE)
        report[domain]['features'][feature] = any(feature_regex.search(Path(p).read_text(encoding='utf-8', errors='ignore')) for p in report[domain]['files'])

# Also check feature files globally for missing features not in domain files
for domain in entries:
    for feature in required_features[domain]:
        if not report[domain]['features'][feature]:
            # search entire codebase as backup
            report[domain]['features'][feature] = any(re.search(re.escape(feature), Path(p).read_text(encoding='utf-8', errors='ignore'), re.IGNORECASE) for p in text_files)

with open('logs/domain_ui_feature_report.json','w') as f:
    json.dump(report, f, indent=2)
print('Domain UI feature report generated at logs/domain_ui_feature_report.json')
