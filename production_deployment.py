#!/usr/bin/env python3
"""Production deployment helper for QMOI."""
import argparse
import logging
import shutil
import subprocess
import sys
from pathlib import Path

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')


class ProductionDeployment:
    def __init__(self, deploy_dir: Path = Path('deploy')):
        self.deploy_dir = deploy_dir
        self.deploy_dir.mkdir(parents=True, exist_ok=True)

    def package(self, source_dir: Path) -> Path:
        archive_path = self.deploy_dir / f'{source_dir.name}.tar.gz'
        shutil.make_archive(str(archive_path.with_suffix('')), 'gztar', root_dir=source_dir)
        logger.info('Packaged deployment archive: %s', archive_path)
        return archive_path

    def deploy(self, archive_path: Path, target_dir: Path) -> None:
        target_dir.mkdir(parents=True, exist_ok=True)
        subprocess.run(['tar', '-xzf', str(archive_path), '-C', str(target_dir)], check=True)
        logger.info('Deployed archive %s to %s', archive_path, target_dir)


def main() -> int:
    parser = argparse.ArgumentParser(description='QMOI production deployment helper')
    parser.add_argument('--package', help='Source directory to package')
    parser.add_argument('--deploy', help='Archive file to deploy')
    parser.add_argument('--target', default='deployed', help='Deployment target directory')
    args = parser.parse_args()

    deployment = ProductionDeployment()
    if args.package:
        deployment.package(Path(args.package))
    if args.deploy:
        deployment.deploy(Path(args.deploy), Path(args.target))
    if not args.package and not args.deploy:
        parser.print_help()
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as exc:
        logger.exception('Production deployment failed: %s', exc)
        sys.exit(1)
