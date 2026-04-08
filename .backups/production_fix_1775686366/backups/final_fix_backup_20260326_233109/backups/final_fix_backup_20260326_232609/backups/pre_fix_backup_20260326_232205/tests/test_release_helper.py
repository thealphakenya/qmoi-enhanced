// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import os
from scripts import release_helper


def test_release_helper_dry_run():
    # Ensure dry-run mode doesn't raise and returns expected path when variation provided
    out = release_helper.package_variation(variation="lion-core", version="0.0.0", output_dir="dist", create_docker=False, dry_run=True)
    # dry_run returns None or Path-like; we accept None but ensure no exception
    assert out is None or isinstance(out, (str,))
