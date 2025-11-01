import os
import json
from pathlib import Path
import os
import json
from pathlib import Path

import pytest

from scripts.adapters import ai_adapter


def test_generate_text_response_dry_run(tmp_path):
    # Ensure dry-run when QMOI_ALLOW_NETWORK is not true
    env = os.environ.get('QMOI_ALLOW_NETWORK')
    if env:
        del os.environ['QMOI_ALLOW_NETWORK']
    reply = ai_adapter.generate_text_response('hello world')
    assert isinstance(reply, str)
    assert 'dry-run' in reply or 'QMOI (dry-run)' in reply


def test_run_image_task_creates_placeholder(tmp_path):
    out = tmp_path / 'out.txt'
    path = ai_adapter.run_image_task('stable-diffusion', 'a prompt', str(out))
    assert Path(path).exists()
    content = Path(path).read_text(encoding='utf-8')
    assert 'dry-run' in content or 'Prompt:' in content
