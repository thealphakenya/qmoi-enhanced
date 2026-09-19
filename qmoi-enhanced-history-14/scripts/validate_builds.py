#!/usr/bin/env python3
"""
Validate discovered app builds and artifacts.

Reads `.qmoi_validation/apps_found.json` (produced by `register_app_build.py`) and
validates that expected artifact files exist (e.g., PWA build index, Android .apk, iOS .ipa, Python wheels, npm dist files).

Writes per-app reports into `.qmoi_validation/build_validation_reports/` and returns a summary.
Optionally creates remediation todos and LION task stubs.
"""
import json
import argparse
from pathlib import Path
import os
import uuid
from datetime import datetime, timezone
import subprocess

REPO_ROOT = Path(__file__).resolve().parents[1]
VALID_DIR = REPO_ROOT / '.qmoi_validation'
APP_REG = VALID_DIR / 'apps_found.json'
OUT_DIR = VALID_DIR / 'build_validation_reports'
OUT_DIR.mkdir(parents=True, exist_ok=True)
LION_TASKS = VALID_DIR / 'lion_tasks'
LION_TASKS.mkdir(parents=True, exist_ok=True)


def load_auto_env():
    # Load non-sensitive defaults from .qmoi_validation/auto_env.json if present
    fn = VALID_DIR / 'auto_env.json'
    if not fn.exists():
        return {}
    try:
        return json.loads(fn.read_text(encoding='utf-8'))
    except Exception:
        return {}


AUTO_ENV = load_auto_env()



def load_apps():
    if not APP_REG.exists():
        return []
    return json.loads(APP_REG.read_text(encoding='utf-8')).get('apps', [])


def expect_files_for_app(app):
    # heuristics: check artifact_dir for common files per type
    t = app.get('type')
    artifact = Path(REPO_ROOT / app.get('artifact_dir'))
    result = {'app': app, 'artifact_exists': artifact.exists(), 'files': []}
    if not artifact.exists():
        return result

    if t == 'pwa':
        # expect index.html in build folder
        idx = artifact / 'index.html'
        result['files'].append({'path': str(idx), 'ok': idx.exists()})
    elif t == 'npm' or t == 'artifact':
        # expect some files in artifact dir
        found = any(artifact.rglob('*'))
        result['files'].append({'path': str(artifact), 'ok': found})
    elif t == 'python':
        wheel = list(artifact.glob('*.whl'))
        sdist = list(artifact.glob('*.tar.gz'))
        result['files'].append({'path': str(artifact) + '/*.whl', 'ok': bool(wheel)})
        result['files'].append({'path': str(artifact) + '/*.tar.gz', 'ok': bool(sdist)})
    else:
        # generic: check that folder contains files
        ok = any(artifact.rglob('*'))
        result['files'].append({'path': str(artifact), 'ok': ok})

    # additional cross-platform checks: look for .apk and .ipa under ALL_APPS
    all_apps = REPO_ROOT / 'ALL_APPS'
    apks = list(all_apps.rglob('*.apk'))
    ipas = list(all_apps.rglob('*.ipa'))
    result['platform_files_present'] = {'apk_count': len(apks), 'ipa_count': len(ipas)}
    return result


def create_todo(app, reason):
    try:
        title = f"Build missing or invalid: {app.get('name')} ({app.get('path')})"
        desc = f"Reason: {reason}"
        subprocess.run(['python3', str(REPO_ROOT / 'scripts' / 'qmoi_todos.py'), 'add', title, '--desc', desc], check=False)
        # write rich LION task with metadata and recommended actions
        task = {
            'id': str(uuid.uuid4()),
            'type': 'build_remediation',
            'app': app,
            'reason': reason,
            'priority': 'high',
            'recommended_actions': [
                'inspect build output directory',
                're-run build script locally',
                'copy artifacts to ALL_APPS and re-validate'
            ],
            'qcity_hints': AUTO_ENV.get('QCITY_RESOURCES', {}),
            'created_at': datetime.now(timezone.utc).isoformat()
        }
        out = LION_TASKS / (app.get('name', 'app') + '.build_remediation.json')
        out.write_text(json.dumps(task, indent=2), encoding='utf-8')
    except Exception:
        pass


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--create-todos', action='store_true')
    args = ap.parse_args()

    apps = load_apps()
    summary = {'checked_at': datetime.now(timezone.utc).isoformat(), 'total': len(apps), 'results': []}
    for app in apps:
        res = expect_files_for_app(app)
        # determine ok flag
        ok = res.get('artifact_exists', False) and all(f['ok'] for f in res.get('files', []))
        res['ok'] = ok
        summary['results'].append(res)
        # write per-app report
        name = app.get('name', app.get('path', 'unknown')).replace('/', '__')
        out = OUT_DIR / (name + '.build.json')
        out.write_text(json.dumps(res, indent=2), encoding='utf-8')
        if not ok and args.create_todos:
            create_todo(app, 'artifact_missing_or_incomplete')

    (OUT_DIR / 'summary.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
    print(f"Validated builds for {len(apps)} apps. Reports in {OUT_DIR}/")


if __name__ == '__main__':
    main()
