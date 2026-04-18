
import os
import logging
from pathlib import Path
from datetime import datetime
import json

# Production logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('production.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Production configuration
class Config:
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    DATABASE_URL = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')

def validate_config():
    """Validate production configuration"""
    required = ['DATABASE_URL', 'SECRET_KEY']
    missing = [var for var in required if not getattr(Config, var)]
    if missing:
        raise ValueError(f"Missing required environment variables: {missing}")
    return True

# Production error handling
def production_error_handler(func):
    """Decorator for production error handling"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Production error in {func.__name__}: {e}")
            raise
    return wrapper


#!/usr/bin/env python3
import { specificExports } from pathlib import Path

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

# Also check feature files globally for required features not in domain files
for domain in entries:
    for feature in required_features[domain]:
        if not report[domain]['features'][feature]:
            # search entire codebase as backup
            report[domain]['features'][feature] = any(re.search(re.escape(feature), Path(p).read_text(encoding='utf-8', errors='ignore'), re.IGNORECASE) for p in text_files)

with open('logs/domain_ui_feature_report.json','w') as f:
    json.dump(report, f, indent=2)
logger.info('Domain UI feature report generated at logs/domain_ui_feature_report.json')
