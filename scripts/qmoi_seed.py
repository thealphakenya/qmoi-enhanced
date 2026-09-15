#!/usr/bin/env python3
"""Portable QMOI bootstrap seed.

The seed is intentionally small and dependency-free. It verifies a signed
manifest's SHA-256 entries before expanding a trusted payload directory or tar
archive. The seed does not contain model weights or credentials; those remain
platform-specific, downloaded through an authenticated release channel.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import tarfile
import tempfile
from pathlib import Path
from typing import Any

MAX_SEED_BYTES = 5 * 1024 * 1024


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def verify_manifest(manifest_path: Path, payload: Path) -> dict[str, Any]:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    expected = manifest.get("sha256")
    if not isinstance(expected, str) or len(expected) != 64:
        raise ValueError("manifest must contain a 64-character sha256 value")
    actual = sha256(payload)
    if actual.lower() != expected.lower():
        raise ValueError(f"payload sha256 mismatch: expected {expected}, got {actual}")
    return manifest


def safe_extract(archive: Path, destination: Path) -> int:
    extracted = 0
    with tarfile.open(archive, "r:*") as tar:
        for member in tar.getmembers():
            target = (destination / member.name).resolve()
            destination_root = destination.resolve()
            if target != destination_root and not str(target).startswith(str(destination_root) + os.sep):
                raise ValueError(f"unsafe archive path: {member.name}")
            if (member.issym() or member.islnk()) and (
                member.linkname.startswith("/") or ".." in Path(member.linkname).parts
            ):
                raise ValueError(f"unsafe archive link: {member.name}")
            tar.extract(member, destination, filter="data")
            extracted += 1
    return extracted


def expand(payload: Path, destination: Path) -> dict[str, Any]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = Path(tempfile.mkdtemp(prefix="qmoi-seed-", dir=destination.parent))
    try:
        if payload.is_dir():
            shutil.copytree(payload, temporary / "payload", dirs_exist_ok=True)
            extracted = sum(1 for item in (temporary / "payload").rglob("*") if item.is_file())
        elif payload.is_file():
            extracted = safe_extract(payload, temporary / "payload")
        else:
            raise FileNotFoundError(payload)
        if destination.exists():
            raise FileExistsError(destination)
        (temporary / "payload").rename(destination)
        return {"status": "expanded", "destination": str(destination), "entries": extracted}
    finally:
        if temporary.exists():
            shutil.rmtree(temporary, ignore_errors=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--payload", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--destination", type=Path, required=True)
    args = parser.parse_args()
    seed_size = Path(__file__).stat().st_size
    if seed_size >= MAX_SEED_BYTES:
        raise SystemExit(f"seed exceeds 5 MiB limit: {seed_size} bytes")
    manifest = verify_manifest(args.manifest, args.payload)
    result = expand(args.payload, args.destination)
    result.update({"seed_bytes": seed_size, "payload_sha256": manifest["sha256"], "version": manifest.get("version", "unknown")})
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
