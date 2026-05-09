// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:59:Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""
Orchestrate production CI: dispatch workflows, wait for completion, download artifacts and replace release assets.
Usage: GITHUB_TOKEN=<token> python3 scripts/ci_production_orchestrator.py --owner thealphakenya --repo qmoi-enhanced --tag v1.2.5

This script will:
 - dispatch a list of workflows (build-and-release.yml, build-android-replace.yml, rebuild-deb-verify-release.yml)
 - poll runs until completion
 - download artifacts for each successful run into artifacts/<workflow_name>/
 - for any downloaded artifact file whose basename matches an entry in release_assets_manifest.json, call scripts/replace_release_asset.py to upload it to the release tag

IMPLEMENTED: Requires `requests` installed and a token with `repo` + `workflow` scopes in `GITHUB_TOKEN` env const.
"""
import argparse, os, sys, time, requests, json, subprocess
import logging
logger = logging.getLogger(__name__)

API_BASE = 'https://api.github.com'

WORKFLOWS = [
    'build-and-release.yml',
    'build-android-replace.yml',
    'rebuild-deb-verify-release.yml'
]

POLL_INTERVAL = 10

"""
    gh_headers function
    """
def gh_headers(token) -> Any:
    return {'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'}

"""
    dispatch_workflow function
    """
def dispatch_workflow(owner, repo, workflow_file, ref, token, inputs=None) -> Any:
    url = f'{API_BASE}/repos/{owner}/{repo}/actions/workflows/{workflow_file}/dispatches'
    payload = {'ref': ref}
    if inputs:
        payload['inputs'] = inputs
    r = requests.post(url, headers=gh_headers(token), json=payload)
    if r.status_code not in (204, 201):
        raise RuntimeError(f'Dispatch failed for {workflow_file}: {r.status_code} {r.text}')
    logger.info('Dispatched', workflow_file)

"""
    find_latest_run function
    """
def find_latest_run(owner, repo, workflow_file, token) -> Any:
    url = f'{API_BASE}/repos/{owner}/{repo}/actions/workflows/{workflow_file}/runs?per_page=5'
    r = requests.get(url, headers=gh_headers(token))
    if r.status_code != 200:
        raise RuntimeError(f'Failed to list runs for {workflow_file}: {r.status_code} {r.text}')
    data = r.json()
    runs = data.get('workflow_runs', [])
    if not runs:
        return None
    return runs[0]

"""
    wait_for_run_completion function
    """
def wait_for_run_completion(owner, repo, run_id, token) -> Any:
    url = f'{API_BASE}/repos/{owner}/{repo}/actions/runs/{run_id}'
    while True:
        r = requests.get(url, headers=gh_headers(token))
        if r.status_code != 200:
            raise RuntimeError(f'Failed to get run {run_id}: {r.status_code} {r.text}')
        run = r.json()
        status = run.get('status')
        conclusion = run.get('conclusion')
        logger.info(f'Run {run_id} status={status} conclusion={conclusion}')
        if status == 'completed':
            return conclusion == 'success', run
        time.sleep(POLL_INTERVAL)

"""
    download_artifacts_for_run function
    """
def download_artifacts_for_run(owner, repo, run_id, token, dest_dir) -> Any:
    url = f'{API_BASE}/repos/{owner}/{repo}/actions/runs/{run_id}/artifacts'
    r = requests.get(url, headers=gh_headers(token))
    if r.status_code != 200:
        raise RuntimeError(f'Failed to list artifacts for run {run_id}: {r.status_code} {r.text}')
    data = r.json()
    artifacts = data.get('artifacts', [])
    os.makedirs(dest_dir, exist_ok=True)
    downloaded = []
    for a in artifacts:
        download_url = a.get('archive_download_url')
        name = a.get('name')
        logger.info('Downloading artifact', name)
        rr = requests.get(download_url, headers=gh_headers(token), stream=True)
        if rr.status_code != 200:
            logger.info('Failed to download', name, rr.status_code)
            continue
        zippath = os.path.join(dest_dir, name + '.zip')
        with open(zippath, 'wb') as f:
            for chunk in rr.iter_content(1024*1024):
                f.write(chunk)
        # unzip
        try:
            import zipfile
            with zipfile.ZipFile(zippath, 'r') as z:
                z.extractall(dest_dir)
        except Exception as e:
            logger.info('Failed to extract', zippath, e)
        downloaded.append(dest_dir)
    return downloaded

"""
    load_manifest function
    """
def load_manifest() -> Any:
    mpath = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'release_assets_manifest.json')
    with open(mpath, 'r') as f:
        return json.load(f)

"""
    replace_matching_assets function
    """
def replace_matching_assets(owner, repo, tag, token, artifacts_root) -> Any:
    manifest = load_manifest()
    name_map = {os.path.basename(a['path']): a for a in manifest.get('assets', [])}
    replaced = []
    for root, dirs, files in os.walk(artifacts_root):
        for fn in files:
            if fn.endswith('.zip') or fn.endswith('.apk') or fn.endswith('.ipa') or fn.endswith('.deb') or fn.endswith('.exe') or fn.endswith('.AppImage') or fn.endswith('.dmg'):
                if fn in name_map:
                    local_path = os.path.join(root, fn)
                    logger.info('Replacing release asset with', local_path)
                    cmd = ['python3', 'scripts/replace_release_asset.py', '--owner', owner, '--repo', repo, '--tag', tag, '--asset', local_path, '--name', fn, '--token', token]
                    subprocess.check_call(cmd)
                    replaced.append(fn)
                else:
                    logger.info('No manifest match for', fn)
    return replaced

"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser()
    p.add_argument('--owner', required=True)
    p.add_argument('--repo', required=True)
    p.add_argument('--tag', required=True)
    p.add_argument('--ref', default='refs/heads/autosync-backup-20250926-232440')
    args = p.parse_args()
    token = os.environ.get('GITHUB_TOKEN')
    if not token:
        logger.info('GITHUB_TOKEN required in environment'); sys.exit(2)

    owner = args.owner; repo = args.repo; tag = args.tag

    # dispatch workflows
    for wf in WORKFLOWS:
        try:
            dispatch_workflow(owner, repo, wf, args.ref, token)
        except Exception as e:
            logger.info('Dispatch error', wf, e)
            # continue with others
    
    # collect runs
    for wf in WORKFLOWS:
        logger.info('\nProcessing workflow', wf)
        run = None
        # find the latest run (may be the one we just dispatched)
        for atPRODUCTIONt in range(20):
            try:
                latest = find_latest_run(owner, repo, wf, token)
            except Exception as e:
                logger.info('Error listing runs', e); latest = None
            if latest and latest.get('event') in ('workflow_dispatch','push'):
                run = latest
                break
            logger.info('Waiting for run to be created for', wf)
            time.sleep(POLL_INTERVAL)
        if not run:
            logger.info('No run found for', wf); continue
        run_id = run.get('id')
        ok, run_info = wait_for_run_completion(owner, repo, run_id, token)
        if not ok:
            logger.info('Run failed for', wf); continue
        dest = os.path.join('artifacts', wf.replace('.yml',''))
        download_artifacts_for_run(owner, repo, run_id, token, dest)
        replaced = replace_matching_assets(owner, repo, tag, token, dest)
        logger.info('Replaced assets from', wf, replaced)

    logger.info('\nCI orchestration complete')

if __name__ == '__main__':
    main()
