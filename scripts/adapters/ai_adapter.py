import os
import json
from pathlib import Path
from typing import Dict, Optional

AUDIT_DIR = Path('.qmoi_validation') / 'adapters'
AUDIT_DIR.mkdir(parents=True, exist_ok=True)
AI_LOG = AUDIT_DIR / 'ai.log'


def _audit(entry: Dict):
    try:
        logs = []
        if AI_LOG.exists():
            logs = json.loads(AI_LOG.read_text())
        logs.append(entry)
        AI_LOG.write_text(json.dumps(logs, indent=2))
    except Exception:
        pass


def call_model(prompt: str, metadata: Optional[Dict] = None) -> Dict:
    metadata = metadata or {}
    entry = {
        'time': __import__('datetime').datetime.utcnow().isoformat(),
        'prompt_snippet': prompt[:200],
        'metadata': metadata,
    }

    ai_enabled = os.environ.get('AI_ENABLED', 'false').lower() == 'true'
    production_confirmed = os.environ.get('PRODUCTION_CONFIRMED', 'false').lower() == 'true'
    allow_network = os.environ.get('QMOI_ALLOW_NETWORK', 'false').lower() == 'true'
    ai_endpoint = os.environ.get('QMOI_AI_ENDPOINT')

    if ai_enabled and production_confirmed and allow_network and ai_endpoint:
        entry['path'] = 'provider-attempt'
        entry['note'] = 'AI provider configured. Adapter placeholder for remote call.'
        _audit(entry)
        return {'status': 'queued', 'dry_run': False, 'note': 'Provider-configured: adapter placeholder'}

    entry['path'] = 'dry-run'
    entry['note'] = 'AI adapter dry-run; returning canned response.'
    entry['response'] = {'text': 'This is a dry-run response. Replace with real model output when enabled.'}
    _audit(entry)
    return {'status': 'dry-run', 'dry_run': True, 'response': entry['response'], 'note': 'Logged to .qmoi_validation/adapters/ai.log'}
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
