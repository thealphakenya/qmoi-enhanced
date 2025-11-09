#!/usr/bin/env python3
"""Test suite for links_audit_and_fix.py script.

Creates a temporary test directory with markdown files containing various link types:
- relative links (both existing and non-existing)
- download-like links (should be replaced)
- http(s) links (for deep check verification)

Then runs the script and verifies:
1. Backup files are created only when needed
2. Download links are replaced correctly
3. JSON report contains expected entries
4. Deep checks work when enabled
"""
import json
import os
import shutil
import tempfile
import unittest
from pathlib import Path

import links_audit_and_fix as laf


class TestLinksAudit(unittest.TestCase):
    def setUp(self):
        # Create a temporary test directory
        self.test_dir = Path(tempfile.mkdtemp())
        self.docs_dir = self.test_dir / "docs"
        self.docs_dir.mkdir()

        # Create a real file that our relative links can point to
        self.existing_file = self.docs_dir / "exists.txt"
        self.existing_file.write_text("I exist!")

        # Create test markdown files
        self.md1 = self.docs_dir / "test1.md"
        self.md1.write_text("""
# Test Document 1

- [Exists](exists.txt)
- [Missing](does-not-exist.txt)
- [Download Me](downloads/file.zip)
- [HTTP](http://example.com)
- [HTTPS](https://example.com)
""")

        self.md2 = self.docs_dir / "test2.md"
        self.md2.write_text("""
# Test Document 2 (no modifications needed)

- [Exists](exists.txt)
- [Also Exists](./exists.txt)
- [External](https://example.org)
""")

        # Point ROOT to our test directory instead of the real repo root
        self._original_root = laf.ROOT
        laf.ROOT = self.test_dir
        
        # Recreate report dir under our test root
        laf.REPORT_DIR = self.test_dir / ".qmoi_validation"
        laf.REPORT_DIR.mkdir()
        laf.TXT_REPORT = laf.REPORT_DIR / "link_validation_report.txt"
        laf.JSON_REPORT = laf.REPORT_DIR / "link_validation_report.json"
        laf.DEEP_JSON = laf.REPORT_DIR / "link_validation_deep_report.json"

    def tearDown(self):
        # Restore original ROOT
        laf.ROOT = self._original_root
        # Clean up temp directory
        shutil.rmtree(self.test_dir)

    def test_find_md_files(self):
        """Test that find_md_files finds our test markdown files."""
        files = set(str(p.relative_to(self.test_dir)) for p in laf.find_md_files())
        self.assertEqual(files, {"docs/test1.md", "docs/test2.md"})

    def test_is_download_like(self):
        """Test download link detection patterns."""
        self.assertTrue(laf.is_download_like("downloads/file.zip"))
        self.assertTrue(laf.is_download_like("download/file.zip"))
        self.assertTrue(laf.is_download_like("DOWNLOAD/file.zip"))
        self.assertFalse(laf.is_download_like("exists.txt"))
        self.assertFalse(laf.is_download_like("http://example.com/download"))

    def test_process_file_basic(self):
        """Test processing a file without --deep mode."""
        fr = laf.process_file(self.md1, deep=False, url_tasks=[])

        # Check that backup was created (only for md1 which needed changes)
        self.assertTrue((self.md1.parent / "test1.md.linkfix.bak").exists())
        self.assertFalse((self.md2.parent / "test2.md.linkfix.bak").exists())

        # Verify download link was replaced
        modified_text = self.md1.read_text()
        self.assertIn("[Download Me](TODO_REPLACE_DOWNLOAD_LINK)", modified_text)

        # Check report contents
        print("\nFound links:", [(l["label"], l["target"]) for l in fr["links"]])
        self.assertEqual(len(fr["links"]), 5, "Should have 5 links: Exists, Missing, Download Me, HTTP, and HTTPS")
        self.assertEqual(len(fr["replacements"]), 1, "Should have 1 replacement (download link)")

        # Verify link existence checks
        exists_links = [l for l in fr["links"] if "exists" in l]
        self.assertTrue(any(l["exists"] for l in exists_links))  # exists.txt
        self.assertTrue(any(not l["exists"] for l in exists_links))  # does-not-exist.txt

    def test_process_file_deep(self):
        """Test processing a file with --deep mode enabled."""
        url_tasks = []
        fr = laf.process_file(self.md1, deep=True, url_tasks=url_tasks)

        # Should collect 2 URLs for deep checking
        self.assertEqual(len(url_tasks), 2)
        urls = {u for _, u in url_tasks}
        self.assertEqual(urls, {"http://example.com", "https://example.com"})

    def test_deep_checks(self):
        """Test that deep checks work and produce expected results."""
        urls = [
            ("docs/test1.md", "https://example.com"),
            ("docs/test2.md", "https://example.org"),
        ]
        results = laf.run_deep_checks(urls, max_workers=2)
        
        # Should have results for both URLs
        self.assertEqual(len(results), 2)
        
        # Each result should have 'result' and 'seen_in' keys
        for url_result in results.values():
            self.assertIn("result", url_result)
            self.assertIn("seen_in", url_result)
            
            # Result should have basic fields
            r = url_result["result"]
            self.assertIn("ok", r)
            if not r["ok"]:
                self.assertIn("error", r)

    def test_full_run(self):
        """Test a complete run of the script with both modes."""
        # Test without deep checks
        laf.main(["--max-files", "5"])  # Limit just in case
        
        # Verify reports exist
        self.assertTrue(laf.TXT_REPORT.exists())
        self.assertTrue(laf.JSON_REPORT.exists())
        self.assertFalse(laf.DEEP_JSON.exists())  # Shouldn't exist without --deep

        # Load and check JSON report
        report = json.loads(laf.JSON_REPORT.read_text())
        self.assertEqual(len(report["files"]), 2)  # Should have both test files
        self.assertEqual(len(report["modified_files"]), 1)  # Only test1.md needed changes

        # Test with deep checks
        laf.main(["--deep", "--max-files", "5"])
        self.assertTrue(laf.DEEP_JSON.exists())  # Should exist now

        # Load and check deep results
        deep = json.loads(laf.DEEP_JSON.read_text())
        self.assertIn("results", deep)
        self.assertTrue(len(deep["results"]) > 0)  # Should have some results


if __name__ == '__main__':
    unittest.main()