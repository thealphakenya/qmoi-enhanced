#!/usr/bin/env python3
"""
Ensure signed CI artifacts exist for releases, replace release assets when CI produces signed artifacts,
and publish verification metadata to QMOI memory.

Usage:
  ensure_signed_artifacts.py [--repo owner/repo] [--tag TAG] [--dry-run]

This script is designed to be run from CI or locally. It requires a GitHub PAT with `repo` and `workflow`
scopes available in the environment as `GH_PAT` or `GITHUB_TOKEN` for operations that modify releases or
dispatch workflows. If not provided, the script runs in dry-run mode and prints planned actions.
"""

import argparse
import hashlib
import json
import os
import sys
import time
from datetime import datetime
import tempfile
import zipfile
import shutil

try:
    import requests
except Exception:
    requests = None


GITHUB_API = "https://api.github.com"


def load_manifest(path="release_assets_manifest.json"):
    if not os.path.exists(path):
        return {}
    with open(path, "r") as f:
        return json.load(f)


def sha256_of_file(path, chunk_size=8192):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            h.update(chunk)
    return h.hexdigest()


def gh_headers(token):
    return {"Authorization": f"token {token}", "Accept": "application/vnd.github+json"}


def get_release(owner_repo, tag, token):
    owner, repo = owner_repo.split("/")
    url = f"{GITHUB_API}/repos/{owner}/{repo}/releases/tags/{tag}"
    r = requests.get(url, headers=gh_headers(token))
    if r.status_code == 200:
        return r.json()
    return None


def delete_asset(owner_repo, asset_id, token):
    owner, repo = owner_repo.split("/")
    url = f"{GITHUB_API}/repos/{owner}/{repo}/releases/assets/{asset_id}"
    r = requests.delete(url, headers=gh_headers(token))
    return r.status_code in (204,)


def upload_asset_by_upload_url(upload_url, path, token, content_type="application/octet-stream"):
    # upload_url contains {?name,label}
    upload_url = upload_url.split("{")[0]
    name = os.path.basename(path)
    params = {"name": name}
    headers = {"Authorization": f"token {token}", "Content-Type": content_type}
    with open(path, "rb") as f:
        r = requests.post(upload_url, params=params, headers=headers, data=f)
    return r


def list_workflow_runs(owner_repo, workflow_id, token, branch=None):
    owner, repo = owner_repo.split("/")
    url = f"{GITHUB_API}/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
    params = {"per_page": 50}
    if branch:
        params["branch"] = branch
    r = requests.get(url, headers=gh_headers(token), params=params)
    if r.status_code == 200:
        return r.json().get("workflow_runs", [])
    return []


def download_artifact(owner_repo, artifact_id, dest_path, token):
    owner, repo = owner_repo.split("/")
    url = f"{GITHUB_API}/repos/{owner}/{repo}/actions/artifacts/{artifact_id}/zip"
    r = requests.get(url, headers=gh_headers(token), stream=True)
    if r.status_code == 200:
        with open(dest_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        return True
    return False


def publish_to_qmoi_memory(qmoi_url, token, payload):
    if not qmoi_url:
        print("No QMOI memory URL configured; skipping publish")
        return False
    try:
        r = requests.post(f"{qmoi_url}/api/v1/release-artifact", json=payload, headers={"Authorization": f"Bearer {token}"} if token else {})
        return r.status_code in (200, 201)
    except Exception as e:
        print("Publish to QMOI memory failed:", e)
        return False


def download_from_base(base_url, name, dest_path, token=None):
    if not base_url:
        return False
    url = base_url.rstrip('/') + '/' + name
    print(f"Attempting download from base URL: {url}")
    headers = {}
    if token:
        headers['Authorization'] = f"Bearer {token}"
    try:
        r = requests.get(url, headers=headers, stream=True, timeout=30)
    except Exception as e:
        print("Download failed:", e)
        return False
    if r.status_code != 200:
        print("Download returned status", r.status_code)
        return False
    try:
        with open(dest_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        return True
    except Exception as e:
        print("Failed writing downloaded file:", e)
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default="thealphakenya/qmoi-enhanced")
    parser.add_argument("--tag", default="v1.2.5")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--download-artifacts", action="store_true", help="download workflow artifacts into a temp dir and use them as local artifacts")
    parser.add_argument("--max-wait", type=int, default=1800, help="max wait seconds for CI runs")
    parser.add_argument("--workflows", nargs="*", help="workflow ids or filenames to dispatch/list")
    args = parser.parse_args()

    # Early status print to aid debugging and visibility when run in terminals
    print("ensure_signed_artifacts: starting", {
        "repo": args.repo,
        "tag": args.tag,
        "dry_run": args.dry_run,
        "download_artifacts": args.download_artifacts,
        "workflows": args.workflows,
    })

    token = os.environ.get("GH_PAT") or os.environ.get("GITHUB_TOKEN")
    qmoi_memory_url = os.environ.get("QMOI_MEMORY_URL")
    qmoi_memory_token = os.environ.get("QMOI_MEMORY_TOKEN")
    download_base = os.environ.get("DOWNLOAD_BASE_URL", "https://downloads.qmoi.app")
    download_base = os.environ.get("DOWNLOAD_BASE_URL")

    manifest = load_manifest()

    if requests is None:
        print("requests library not available in current environment. Activate .venv or install requests.")
        sys.exit(1)

    print(f"Checking release {args.tag} in {args.repo}")
    release = None
    if token:
        release = get_release(args.repo, args.tag, token)
        if not release:
            print(f"Release {args.tag} not found or unreachable via API")
    else:
        print("No GH PAT provided — running in dry-run planning mode")

    expected = manifest.get("assets", {})

    # Build plan: identify missing or mismatched assets for the given tag
    missing = []
    mismatched = []
    remote_assets = {a["name"]: a for a in (release.get("assets", []) if release else [])}

    for asset_entry in release.get("assets", []) if release else []:
        name = asset_entry["name"]
        # manifest may use 'name' or 'path'/'abs_path' fields — normalize
        manifest_infos = []
        for x in manifest.get("assets", []):
            expected_name = x.get("name") or os.path.basename(x.get("path") or x.get("abs_path") or "")
            if expected_name == name:
                manifest_infos.append(x)
        if not manifest_infos:
            continue
        m = manifest_infos[0]
        expected_sha = m.get("sha256")
        # if sizes differ mark mismatch
        if asset_entry.get("size") != m.get("size"):
            mismatched.append({"name": name, "remote_size": asset_entry.get("size"), "expected_size": m.get("size")})

    # Check for expected missing assets (based on manifest)
    for m in manifest.get("assets", []):
        expected_name = m.get("name") or os.path.basename(m.get("path") or m.get("abs_path") or "")
        if expected_name and expected_name not in remote_assets:
            missing.append(expected_name)

    print(f"Missing assets: {len(missing)}, mismatched: {len(mismatched)}")

    if args.dry_run or not token:
        print("DRY-RUN: plan below")
        if missing:
            print("Need to build and upload:")
            for n in missing:
                print(" -", n)
        if mismatched:
            print("Need to replace mismatched assets:")
            for mm in mismatched:
                print(mm)
        print("Ensure CI workflows build signed artifacts and upload signature files (.sha256/.asc) as artifacts or release assets.")
        return

    # At this point we have a token and will attempt to dispatch/list workflows and retrieve artifacts.
    # This script assumes the project's CI publishes artifacts with names that match release asset names.
    # For simplicity: look for workflow runs for provided workflow IDs and inspect artifacts for signed outputs.

    # If workflows provided, poll for latest run and download/extract artifacts
    tmp_artifacts_dir = None
    for wf in args.workflows or []:
        print(f"Checking workflow {wf}")
        runs = list_workflow_runs(args.repo, wf, token)
        if not runs:
            print(f"No runs found for {wf}")
            continue
        latest = runs[0]
        run_id = latest.get("id")
        # list artifacts for run
        owner, repo = args.repo.split("/")
        art_url = f"{GITHUB_API}/repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
        ar = requests.get(art_url, headers=gh_headers(token))
        if ar.status_code != 200:
            print("Failed to list artifacts for run", run_id)
            continue
        artifacts = ar.json().get("artifacts", [])
        if not artifacts:
            print("No artifacts found for run", run_id)
            continue
        # if user requested download, create a temp dir to extract into
        if args.download_artifacts:
            if tmp_artifacts_dir is None:
                tmp_artifacts_dir = tempfile.mkdtemp(prefix="qmoi_artifacts_")
                print("Downloading artifacts into", tmp_artifacts_dir)
        for a in artifacts:
            print("Found artifact", a.get("name"), "id", a.get("id"))
            dest = os.path.join(tempfile.gettempdir(), f"artifact_{a.get('id')}.zip")
            ok = download_artifact(args.repo, a.get("id"), dest, token)
            if ok:
                print("Downloaded", dest)
                if args.download_artifacts and tmp_artifacts_dir:
                    try:
                        with zipfile.ZipFile(dest, 'r') as zf:
                            zf.extractall(tmp_artifacts_dir)
                        print("Extracted artifact", a.get('name'), "to", tmp_artifacts_dir)
                    except Exception as e:
                        print("Failed to extract artifact zip", dest, e)
            else:
                print("Failed to download artifact", a.get("id"))

    # If we couldn't download workflow artifacts, try pulling from DOWNLOAD_BASE_URL
    if (not args.download_artifacts or not tmp_artifacts_dir) and download_base:
        # create artifacts dir if not present
        tmp = os.environ.get('CI_ARTIFACTS_DIR') or './artifacts'
        if not os.path.exists(tmp):
            os.makedirs(tmp, exist_ok=True)
        print(f"Attempting fallback downloads from {download_base} into {tmp}")
        for m in manifest.get("assets", []):
            name = m.get('name') or os.path.basename(m.get('path') or m.get('abs_path') or '')
            if not name:
                continue
            local_path = os.path.join(tmp, name)
            if os.path.exists(local_path):
                continue
            # try a few candidate URLs
            candidates = [
                f"{download_base}/{name}",
                f"{download_base}/downloads/{name}",
                f"{download_base}/releases/{args.tag}/{name}",
            ]
            for url in candidates:
                try:
                    print("Trying", url)
                    r = requests.get(url, stream=True, timeout=20)
                    if r.status_code == 200:
                        with open(local_path, 'wb') as f:
                            for chunk in r.iter_content(8192):
                                if chunk:
                                    f.write(chunk)
                        print("Downloaded fallback artifact", local_path)
                        break
                except Exception as e:
                    print("Fallback download failed for", url, e)
        # if we downloaded anything, set artifacts_dir to tmp
        tmp_artifacts_dir = tmp

            # If we still have missing assets, try to fetch from DOWNLOAD_BASE_URL (fallback)
            if download_base:
                print("Attempting fallback downloads from DOWNLOAD_BASE_URL:", download_base)
                candidates = [
                    "windows/latest", "mac/latest", "android", "ios", "linux/latest",
                    "chromebook", "qcity", "smarttv", "raspberrypi", "downloads"
                ]
                still_missing = []
                for name in missing:
                    found = False
                    for c in candidates:
                        url = f"{download_base}/{c}/{name}"
                        tmpf = os.path.join(tempfile.gettempdir(), f"download_{name}")
                        try:
                            r = requests.get(url, stream=True)
                            if r.status_code == 200:
                                with open(tmpf, 'wb') as fh:
                                    for chunk in r.iter_content(8192):
                                        if chunk:
                                            fh.write(chunk)
                                print("Downloaded fallback", name, "from", url)
                                # verify against manifest sha if available
                                manifest_info = [m for m in manifest.get('assets', []) if m.get('name') == name]
                                if manifest_info and manifest_info[0].get('sha256'):
                                    have = sha256_of_file(tmpf)
                                    want = manifest_info[0].get('sha256')
                                    if have != want:
                                        print(f"Fallback download sha mismatch for {name}: {have} != {want}")
                                        os.remove(tmpf)
                                        continue
                                # place into artifacts dir for upload
                                artifacts_dir = os.environ.get('CI_ARTIFACTS_DIR') or './artifacts'
                                os.makedirs(artifacts_dir, exist_ok=True)
                                dest = os.path.join(artifacts_dir, name)
                                shutil.move(tmpf, dest)
                                print("Placed fallback artifact at", dest)
                                found = True
                                break
                        except Exception as e:
                            continue
                    if not found:
                        still_missing.append(name)
                missing = still_missing

    # Replacement phase: for mismatched assets attempt to find local artifact file in a configured artifacts dir
    artifacts_dir = os.environ.get("CI_ARTIFACTS_DIR")
    if not artifacts_dir or artifacts_dir.lower() in ("none", "null"):
        artifacts_dir = "./artifacts"
    # if we downloaded artifacts above, prefer the temp dir
    if args.download_artifacts and tmp_artifacts_dir:
        artifacts_dir = tmp_artifacts_dir
    # ensure artifacts_dir is a string and exists
    artifacts_dir = str(artifacts_dir)
    if not os.path.exists(artifacts_dir):
        try:
            os.makedirs(artifacts_dir, exist_ok=True)
        except Exception:
            pass
    upload_count = 0
    for m in manifest.get("assets", []):
        expected_name = m.get("name") or os.path.basename(m.get("path") or m.get("abs_path") or "")
        # prefer absolute path if provided and exists
        local_path = None
        if m.get("abs_path") and os.path.exists(m.get("abs_path")):
            local_path = m.get("abs_path")
        else:
            local_path = os.path.join(artifacts_dir, expected_name)
            # If local artifact doesn't exist, try downloading from DOWNLOAD_BASE_URL if configured
            if not os.path.exists(local_path):
                download_base = os.environ.get('DOWNLOAD_BASE_URL')
                if download_base:
                    print(f"Local artifact {local_path} not found; attempting download from {download_base}")
                    ok = download_from_base(download_base, expected_name, local_path, token=None)
                    if not ok and os.path.exists(local_path):
                        # failed cleanup
                        try:
                            os.remove(local_path)
                        except Exception:
                            pass
        if expected_name and os.path.exists(local_path):
            sha = sha256_of_file(local_path)
            if m.get("sha256") and sha != m.get("sha256"):
                print(f"Local artifact {expected_name} sha mismatch: {sha} vs expected {m.get('sha256')}")
            # replace remote asset if exists
            if expected_name in remote_assets:
                asset_id = remote_assets[expected_name]["id"]
                print(f"Deleting remote asset {expected_name} ({asset_id})")
                if delete_asset(args.repo, asset_id, token):
                    print("Deleted")
                else:
                    print("Failed to delete, skipping upload")
                    continue
            # perform upload using release upload_url
            upload_url = release.get("upload_url")
            print(f"Uploading {local_path} to release")
            r = upload_asset_by_upload_url(upload_url, local_path, token)
            if r.status_code in (200, 201):
                print("Uploaded", expected_name)
                upload_count += 1
                # publish verification to qmoi memory
                payload = {"tag": args.tag, "name": expected_name, "sha256": sha, "verified_at": datetime.utcnow().isoformat() + "Z"}
                publish_to_qmoi_memory(qmoi_memory_url, qmoi_memory_token, payload)
                # Replace local placeholders: search repo for files named like expected_name
                for root, dirs, files in os.walk('.'):
                    for f in files:
                        if f == expected_name:
                            fp = os.path.join(root, f)
                            try:
                                with open(fp, 'rb') as fh:
                                    hdr = fh.read(128)
                                if b'QMOI placeholder' in hdr or os.path.getsize(fp) < 1024:
                                    print(f"Replacing local placeholder {fp} with {local_path}")
                                    shutil.copy2(local_path, fp)
                            except Exception:
                                continue
            else:
                print("Upload failed", r.status_code, r.text)

    print(f"Uploaded {upload_count} assets")


if __name__ == "__main__":
    main()
