from pathlib import Path
import tempfile
import shutil
import json


def test_autoupdater_dry_run_creates_plan():
    tmp = Path(tempfile.mkdtemp(prefix='qmoi-test-'))
    try:
        # create a small all_links.json sample
        sample = {
            'generated_at': '2025-01-01T00:00:00Z',
            'total_files': 1,
            'total_links': 2,
            'index': {
                'README.md': ['https://example.com', 'https://nonexistent.local']
            }
        }
        source = tmp / 'all_links.json'
        with open(source, 'w', encoding='utf-8') as f:
            json.dump(sample, f)

        from scripts.link_autoupdater import run_autoupdater

        plan_path = run_autoupdater(source=source, out_dir=tmp, apply=False, max_links=10, allow_network=False)
        assert plan_path.exists()
        with open(plan_path, 'r', encoding='utf-8') as f:
            plan = json.load(f)
        assert plan['dry_run'] is True
        assert plan['entries_count'] == 2
        # sample entries should be present
        assert 'sample' in plan
    finally:
        shutil.rmtree(tmp)

import json
import os
import tempfile
from pathlib import Path


def test_build_plan_creates_plan():
    # create a small temp repo with a md file containing placeholders
    # load the link_autoupdater module directly from the scripts file so tests don't rely on sys.path
    import importlib.util
    script_path = Path(__file__).resolve().parents[1] / 'scripts' / 'link_autoupdater.py'
    spec = importlib.util.spec_from_file_location('la', str(script_path))
    la = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(la)
    with tempfile.TemporaryDirectory() as td:
        d = Path(td)
        md = d / "TEST.md"
        md.write_text("This is a link: REPLACE_ME_URL and another: https://example.com/ABC_DEF")

        # override find_files to only yield our file
        def _find_files(root, exts=None):
            yield str(md)

        la.find_files = _find_files
        plan = la.build_plan(str(d), exts={".md"})
        assert "files" in plan
        assert len(plan["files"]) == 1
        f = plan["files"][0]
        assert any(r["TBD"] for r in f["replacements"]) 
