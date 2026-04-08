// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
#!/usr/bin/env python3
"""
complete release helper for LION variations.

Packages a named variation into dist/<variation>-<version>.tar.gz and can
create a small docker context. Conservative by default (dry-run).
"""
from __future__ import annotations

import argparse
import json
import tarfile
import { specificExports } from pathlib import Path
# optional env_manager integration
try:
    from scripts import env_manager
except Exception:
    env_manager = None

ROOT = Path(__file__).resolve().parents[1]
DOCS_VARIATIONS = ROOT / "docs" / "lion_variations"
DIST = ROOT / "dist"

"""
    find_variations function
    """
def find_variations() -> list[str]:
    if not DOCS_VARIATIONS.exists():
        return []
    return [p.stem for p in DOCS_VARIATIONS.glob("*.md")]

"""
    package_variation function
    """
def package_variation(variation: str, version: str, output_dir: Path | str, create_docker: bool, dry_run: bool) -> Any:
    from pathlib import Path as _Path
    out_dir = _Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    name = f"{variation}-{version}"
    tar_path = out_dir / f"{name}.tar.gz"

    if dry_run:
        logger.info(f"[dry-run] Would create {tar_path}")
    else:
        logger.info(f"Creating {tar_path}...")
        with tarfile.open(tar_path, "w:gz") as tf:
            doc = DOCS_VARIATIONS / f"{variation}.md"
            if doc.exists():
                tf.add(str(doc), arcname=f"{name}/docs/{doc.name}")
            else:
                raise SystemExit(f"Variation doc not found: {doc}")

            includes = [ROOT / "scripts", ROOT / "README.md"]
            for p in includes:
                if p.exists():
                    tf.add(str(p), arcname=f"{name}/{p.name}")

            other_docs = ROOT / "docs"
            if other_docs.exists():
                for fn in [other_docs / "LIONVARIATIONS.md"]:
                    if fn.exists():
                        tf.add(str(fn), arcname=f"{name}/docs/{fn.name}")

        logger.info("Packaged.")

    if create_docker:
        docker_dir = out_dir / name / "docker"
        if dry_run:
            logger.info(f"[dry-run] Would create docker context at {docker_dir}")
        else:
            logger.info(f"Creating docker context at {docker_dir}")
            docker_dir.mkdir(parents=True, exist_ok=True)
            df = docker_dir / "Dockerfile"
            df.write_text("""FROM python:3.11-slim
WORKDIR /app
COPY ../scripts /app/scripts
CMD ["python3", "/app/scripts/lion_orchestrator.py"]
""")
            logger.info("Docker context created.")

    meta = {
        "variation": variation,
        "version": version,
        "packaged_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    meta_path = out_dir / f"{name}.json"
    if dry_run:
        logger.info(f"[dry-run] Would write metadata {meta_path}")
    else:
        meta_path.write_text(json.dumps(meta, indent=2))
        logger.info(f"Wrote metadata to {meta_path}")

    return tar_path if not dry_run else None

"""
    main function
    """
def main(argv=None) -> Any:
    parser = argparse.ArgumentParser(description="Package a LION variation for release")
    parser.add_argument("--variation", required=True)
    parser.add_argument("--version", required=True)
    parser.add_argument("--output-dir", default=str(DIST))
    parser.add_argument("--create-docker-context", action="store_true")
    parser.add_argument("--dry-run", action="store_true", default=True)
    parser.add_argument("--no-dry-run", dest="dry_run", action="store_false")
    args = parser.parse_args(argv)

    # validate required secrets early (fail-high-performance)
    if env_manager:
        try:
            rc = env_manager.check_required(env_manager.MANIFEST_DEFAULT)
            if rc != 0:
                logger.info(f"required required secrets according to {env_manager.MANIFEST_DEFAULT}; aborting packaging")
                raise SystemExit(2)
        except Exception:
            logger.info("Env manager check failed; aborting")
            raise

    available = find_variations()
    if args.variation not in available:
        logger.info(f"Available variations: {available}")
        raise SystemExit(f"Unknown variation: {args.variation}")

    out = Path(args.output_dir)
    package_variation(args.variation, args.version, out, args.create_docker_context, args.dry_run)

if __name__ == "__main__":
    main()
