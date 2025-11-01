#!/usr/bin/env python3
"""
AI adapter: centralises AI provider calls with safe dry-run fallbacks.

Behavior:
- If QMOI_ALLOW_NETWORK=true and QMOI_AI_ENDPOINT is set, the adapter will attempt
  to call the remote AI endpoint (POST JSON {"prompt":...}). Network calls are
  guarded and errors are logged to `.qmoi_validation/ai_adapter.log`.
- Otherwise the adapter returns deterministic local responses/artifacts (dry-run).
"""
import os
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
LOG_DIR = ROOT / '.qmoi_validation'
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_PATH = LOG_DIR / 'ai_adapter.log'


def _log(entry: dict):
    try:
        s = json.dumps(entry, default=str)
        LOG_PATH.write_text(s + "\n", encoding='utf-8', append=False)
    except Exception:
        # best-effort append without crashing
        try:
            with open(str(LOG_PATH), 'a', encoding='utf-8') as f:
                f.write(json.dumps(entry, default=str) + "\n")
        except Exception:
            pass


def generate_text_response(prompt: str) -> str:
    """Generate a text response for `prompt`.

    Returns the text reply. Network calls occur only when QMOI_ALLOW_NETWORK=true
    and QMOI_AI_ENDPOINT is present; otherwise returns a deterministic dry-run reply.
    """
    ts = datetime.utcnow().isoformat() + 'Z'
    allowed = os.environ.get('QMOI_ALLOW_NETWORK', '').lower() == 'true'
    endpoint = os.environ.get('QMOI_AI_ENDPOINT')
    entry = {'ts': ts, 'action': 'generate_text_response', 'prompt': prompt, 'allowed': allowed}
    if allowed and endpoint:
        try:
            import requests
            resp = requests.post(endpoint, json={'prompt': prompt}, timeout=15)
            if resp.status_code == 200:
                body = resp.json()
                reply = body.get('reply') or body.get('text') or str(body)
                entry.update({'status': 'ok', 'reply': reply})
                _log(entry)
                return reply
            else:
                entry.update({'status': 'error', 'http_status': resp.status_code, 'body': resp.text})
                _log(entry)
        except Exception as e:
            entry.update({'status': 'exception', 'error': str(e)})
            _log(entry)

    # Dry-run deterministic reply
    reply = f"QMOI (dry-run) reply to: {prompt}"
    entry.update({'status': 'dry_run', 'reply': reply})
    _log(entry)
    return reply


def run_image_task(kind: str, prompt: str, output_path: str) -> str:
    """Run an image-generation task.

    kind: 'stable-diffusion' | 'stylegan' | 'animatediff'
    Returns the path to the generated artifact. In dry-run mode the file is created
    locally with a small placeholder text to allow downstream tests to proceed.
    """
    ts = datetime.utcnow().isoformat() + 'Z'
    allowed = os.environ.get('QMOI_ALLOW_NETWORK', '').lower() == 'true'
    endpoint = os.environ.get('QMOI_AI_ENDPOINT')
    entry = {'ts': ts, 'action': 'run_image_task', 'kind': kind, 'prompt': prompt, 'output': output_path, 'allowed': allowed}

    if allowed and endpoint:
        try:
            import requests
            resp = requests.post(endpoint.rstrip('/') + '/image', json={'kind': kind, 'prompt': prompt}, timeout=60)
            if resp.status_code == 200:
                # assume binary content or url in json
                try:
                    data = resp.json()
                    if 'url' in data:
                        entry.update({'status': 'ok', 'url': data['url']})
                        _log(entry)
                        return data['url']
                except Exception:
                    # fallback: write raw bytes
                    with open(output_path, 'wb') as f:
                        f.write(resp.content)
                    entry.update({'status': 'ok', 'saved': output_path})
                    _log(entry)
                    return output_path
            else:
                entry.update({'status': 'error', 'http_status': resp.status_code})
                _log(entry)
        except Exception as e:
            entry.update({'status': 'exception', 'error': str(e)})
            _log(entry)

    # Dry-run: create a small placeholder file
    try:
        p = Path(output_path)
        p.parent.mkdir(parents=True, exist_ok=True)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(f"[QMOI dry-run {kind} artifact]\nPrompt: {prompt}\nGenerated at: {ts}\n")
        entry.update({'status': 'dry_run', 'saved': str(p)})
        _log(entry)
        return str(p)
    except Exception as e:
        entry.update({'status': 'error', 'error': str(e)})
        _log(entry)
        raise
