#!/usr/bin/env python3
"""QMOI Orchestrator (manifest-aware)

This script is a conservative orchestrator scaffold that:
- loads a runner manifest from `.qmoi/runner_manifest.json` (if present)
- gates actions (tests, autofix, builds, ngrok startup) by declared capabilities
- schedules periodic backups and builds

Usage examples:
  python qmoi_orchestrator.py --dry-run
  python qmoi_orchestrator.py --apply --manifest-write --runner-id my-runner

By default the orchestrator runs in dry-run mode. Pass --apply to perform actions.
"""
import argparse
import json
import logging
import os
import subprocess
import threading
import time
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger('qmoi-orch')


def run_once(cmd, cwd=None, dry_run=False):
    logger.info('[run_once] %s (cwd=%s)', cmd, cwd)
    if dry_run:
        return 0
    try:
        return subprocess.call(cmd, shell=True, cwd=cwd)
    except Exception as e:
        logger.exception('run_once error: %s', e)
        return 2


def load_runner_manifest(path: str = '.qmoi/runner_manifest.json') -> dict:
    p = Path(path)
    if not p.exists():
        logger.info('Runner manifest not found at %s', path)
        return {}
    try:
        with p.open('r', encoding='utf-8') as f:
            data = json.load(f)
        # normalise capabilities to a set for quick checks
        caps = set([c.lower() for c in data.get('capabilities', [])])
        data['capabilities_set'] = caps
        logger.info('Loaded runner manifest: %s', list(caps))
        return data
    except Exception:
        logger.exception('Failed to load runner manifest')
        return {}


def has_capability(manifest: dict, capability: str) -> bool:
    if not manifest:
        return False
    caps = manifest.get('capabilities_set') or set([c.lower() for c in manifest.get('capabilities', [])])
    return capability.lower() in caps


def supervise_startup(manifest: dict, dry_run=False):
    # Decide whether to start the local services (ngrok, server)
    if has_capability(manifest, 'runner-engine') or has_capability(manifest, 'qcity') or has_capability(manifest, 'ngrok'):
        logger.info('Starting managed services (ngrok/server)')
        if dry_run:
            logger.info('Dry-run: would execute start_qmoi_ngrok.py')
            return
        try:
            # spawn start script from this repository
            cmd = 'python qmoi-enhanced/qmoi-enhanced/start_qmoi_ngrok.py'
            p = subprocess.Popen(cmd, shell=True)
            logger.info('Started orchestrated process PID=%s', p.pid)
        except Exception:
            logger.exception('Failed to start managed services')
    else:
        logger.info('Runner manifest lacks engine/ngrok capability; skipping service startup')


def periodic_tasks(manifest: dict, interval_sec=3600, dry_run=False):
    while True:
        logger.info('Orchestrator: running periodic tasks')

        # 1. Run autotests — require a test capability or runner-engine
        if any(has_capability(manifest, c) for c in ('test', 'tests', 'autotest', 'runner-engine')):
            run_once('python -m pytest -q', dry_run=dry_run)
        else:
            logger.info('Skipping autotests: runner lacks test capability')

        # 2. Run auto-fixers (lint/auto-fix) — require lint/autofix/runner-engine
        if any(has_capability(manifest, c) for c in ('lint', 'autofix', 'runner-engine')):
            run_once('python qmoi-enhanced/qmoi-enhanced/scripts/enhanced_auto_fixers.py || true', dry_run=dry_run)
        else:
            logger.info('Skipping autofixers: runner lacks lint/autofix capability')

        # 3. Run backup — allowed if runner-engine or always allowed (backups are low-risk)
        run_once('python qmoi-enhanced/qmoi-enhanced/scripts/qmoi_autosync_backup.py --push || true', dry_run=dry_run)

        # 4. Run builds — require 'build' capability
        if any(has_capability(manifest, c) for c in ('build', 'build-all-platforms', 'android-build', 'ios-build', 'electron-build')):
            run_once('python qmoi-enhanced/qmoi-enhanced/qmoi_build_all.py --dry-run', dry_run=dry_run)
        else:
            logger.info('Skipping builds: runner lacks build capabilities')

        time.sleep(interval_sec)


def ensure_manifest_written(runner_id: str = None) -> dict:
    """Try to run the repository manifest generator to create/write .qmoi/runner_manifest.json.

    This calls deploy/qcity/generate_runner_manifest.py --apply --runner-id <id>.
    Returns the loaded manifest after attempting generation (may be empty if generation failed).
    """
    gen = Path('deploy/qcity/generate_runner_manifest.py')
    if not gen.exists():
        logger.warning('Manifest generator not found at %s; cannot auto-write manifest', gen)
        return {}
    cmd = f'python {str(gen)} --apply'
    if runner_id:
        cmd += f' --runner-id {runner_id}'
    logger.info('Attempting to generate runner manifest via: %s', cmd)
    try:
        subprocess.check_call(cmd, shell=True)
    except Exception:
        logger.exception('Runner manifest generator failed')
    return load_runner_manifest()


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--dry-run', action='store_true', help='Run in dry-run mode')
    p.add_argument('--apply', action='store_true', help='Run actions (shorthand; same as --no-dry)')
    p.add_argument('--interval', type=int, default=3600, help='Periodic tasks interval in seconds')
    p.add_argument('--manifest-write', action='store_true', help='If manifest missing, attempt to generate and write it')
    p.add_argument('--runner-id', type=str, default=None, help='Runner id to pass to manifest generator when writing')
    args = p.parse_args()

    dry = args.dry_run and not args.apply
    if args.apply:
        dry = False

    logger.info('Starting QMOI Orchestrator (dry=%s)', dry)

    manifest = load_runner_manifest()
    if not manifest and args.manifest_write:
        logger.info('No manifest present; attempting to write one')
        manifest = ensure_manifest_written(runner_id=args.runner_id)

    # Start supervised services conditionally
    supervise_startup(manifest, dry_run=dry)

    # Start periodic worker thread
    t = threading.Thread(target=periodic_tasks, args=(manifest, args.interval, dry), daemon=True)
    t.start()

    logger.info('Orchestrator running. Press Ctrl-C to exit (if running interactively).')
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info('Orchestrator exiting')


if __name__ == '__main__':
    main()
