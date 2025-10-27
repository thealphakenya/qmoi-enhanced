from pathlib import Path
from scripts import release_helper


def test_release_helper_dry_run():
    # Ensure dry-run mode doesn't raise and returns expected path when variation provided
    out = release_helper.package_variation(variation="lion-core", version="0.0.0", output_dir=Path("dist"), create_docker=False, dry_run=True)
    # dry_run returns None when dry-run; ensure no exception and None result
    assert out is None
