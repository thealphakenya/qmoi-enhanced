from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED = ROOT / "scripts" / "qmoi_seed.py"
EVALUATION = ROOT / "scripts" / "qmoi_model_evaluation.py"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def test_seed_is_under_five_megabytes():
    assert SEED.stat().st_size < 5 * 1024 * 1024


def test_seed_verifies_and_expands_payload(tmp_path):
    payload = tmp_path / "payload"
    payload.mkdir()
    (payload / "hello.txt").write_text("QMOI\n", encoding="utf-8")
    archive = tmp_path / "payload.tar"
    subprocess.run(["tar", "-cf", str(archive), "-C", str(payload), "."], check=True)
    manifest = tmp_path / "manifest.json"
    manifest.write_text(json.dumps({"version": "test", "sha256": digest(archive)}), encoding="utf-8")
    destination = tmp_path / "expanded"

    result = subprocess.run(
        ["python3", str(SEED), "--payload", str(archive), "--manifest", str(manifest), "--destination", str(destination)],
        check=False,
        capture_output=True,
        text=True,
    )

    assert result.returncode == 0, result.stderr
    assert (destination / "hello.txt").read_text(encoding="utf-8") == "QMOI\n"


def test_model_evaluation_contract_passes():
    result = subprocess.run(["python3", str(EVALUATION), "--root", str(ROOT)], check=False, capture_output=True, text=True)
    assert result.returncode == 0, result.stdout + result.stderr
    assert '"status": "passed"' in result.stdout
