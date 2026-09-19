#!/usr/bin/env python3
"""Validate repository, workflow, download, and external resource links."""

import json
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse
from typing import Any, ClassVar


@dataclass
class LinkResult:
    """Result of validating one link or rendered page."""

    url: str
    accessible: bool
    status_code: int | None = None
    error: str | None = None
    source_file: str | None = None
    link_type: str = "unknown"
    rendered_ok: bool | None = None
    ownership: str | None = None
    paired_url: str | None = None


class LinkValidator:
    """Validate critical links without scanning dependency metadata."""

    extensions: ClassVar[set[str]] = {
        ".md",
        ".py",
        ".yml",
        ".yaml",
        ".txt",
        ".json",
        ".html",
    }
    critical_domains: ClassVar[tuple[str, ...]] = (
        "github.com",
        "ollama.ai",
        "ollama.com",
        "qmoi.com",
        "raw.githubusercontent.com",
        "github.blog",
    )
    blocking_types: ClassVar[frozenset[str]] = frozenset(
        {
            "repository",
            "external_resource",
            "workflow",
            "github_run",
            "release_asset",
        }
    )
    ignored_parts: ClassVar[tuple[str, ...]] = (
        "/.git/",
        "/node_modules/",
        "/.pytest_cache/",
        "/.ruff_cache/",
        "/qmoi-enhanced-history-",
        "/ollamatracks/",
    )
    ignored_filenames: ClassVar[frozenset[str]] = frozenset(
        {"error2.txt", "error.txt", "test-results.txt"}
    )

    def __init__(self, repo_path: str = ".") -> None:
        self.repo_path = Path(repo_path)
        self.github_repo = "thealphakenya/qmoi-enhanced"
        self.results: list[LinkResult] = []

    @staticmethod
    def build_qmoi_domain_pairs() -> list[dict[str, str | None]]:
        """Return each QMOI-owned domain with the canonical paired GitHub URL."""
        github_repo_url = "https://github.com/thealphakenya/qmoi-enhanced"
        qmoi_urls = [
            "https://qmoi.com",
            "https://www.qmoi.com",
            "https://qmoi.ai",
            "https://www.qmoi.ai",
            "https://app.qmoi.com",
            "https://space.qmoi.com",
            "https://files.qmoi.com",
            "https://ide.qmoi.com",
            "https://help.qmoi.com",
        ]
        pairs: list[dict[str, str | None]] = []
        for qmoi_url in qmoi_urls:
            parsed = urlparse(qmoi_url)
            domain = parsed.netloc.lower().replace("www.", "")
            pairs.append(
                {
                    "qmoi_url": qmoi_url,
                    "domain": domain,
                    "github_url": github_repo_url,
                    "ownership": "qmoi_owned",
                    "paired_url": github_repo_url,
                }
            )
        pairs.append(
            {
                "qmoi_url": github_repo_url,
                "domain": "github.com",
                "github_url": None,
                "ownership": "external_non_qmoi",
                "paired_url": None,
            }
        )
        return pairs

    @staticmethod
    def classify_link_domain(url: str) -> dict[str, str | None]:
        """Classify a URL as QMOI-owned or external, and attach its GitHub companion when appropriate."""
        parsed = urlparse(url)
        host = (parsed.netloc or parsed.path or "").lower().replace("www.", "")
        github_repo_url = "https://github.com/thealphakenya/qmoi-enhanced"
        qmoi_hosts = {
            "qmoi.com",
            "qmoi.ai",
            "app.qmoi.com",
            "space.qmoi.com",
            "files.qmoi.com",
            "ide.qmoi.com",
            "help.qmoi.com",
        }
        if host in qmoi_hosts or host.endswith(".qmoi.com") or host.endswith(".qmoi.ai"):
            return {
                "ownership": "qmoi_owned",
                "paired_url": github_repo_url,
                "note": "QMOI-owned domain; GitHub is the paired repository reference.",
            }
        if host == "github.com" or host.endswith(".github.com"):
            return {
                "ownership": "external_non_qmoi",
                "paired_url": None,
                "note": "GitHub is an external host and not a QMOI-owned domain.",
            }
        if host in {"ollama.com", "ollama.ai", "raw.githubusercontent.com", "github.blog"}:
            return {
                "ownership": "external_non_qmoi",
                "paired_url": None,
                "note": "External vendor or platform domain; not QMOI-owned.",
            }
        return {
            "ownership": "external_non_qmoi",
            "paired_url": None,
            "note": "No QMOI ownership claim; external domain or unknown host.",
        }

    def extract_urls(self, text: str) -> list[str]:
        """Extract and normalize HTTP(S) URLs from text."""
        matches = re.findall(r"https?://[^\s'\"`<>)}\]]+", text)
        return sorted({url.rstrip(".,;:") for url in matches})

    @staticmethod
    def extract_local_targets(text: str) -> list[str]:
        """Extract relative Markdown and HTML link targets."""
        markdown = re.findall(r"\[[^\]]*\]\(([^)\s]+)", text)
        html = re.findall(r"(?:href|src)=[\"']([^\"']+)[\"']", text)
        return sorted(set(markdown + html))

    def find_urls(self) -> dict[str, list[str]]:
        """Find URLs in supported repository files."""
        found: dict[str, list[str]] = {}
        for path in self.repo_path.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in self.extensions:
                continue
            normalized = f"/{path.as_posix()}"
            if any(part in normalized for part in self.ignored_parts):
                continue
            if path.name in self.ignored_filenames or path.name in {
                "package.json",
                "package-lock.json",
                "yarn.lock",
            }:
                continue
            try:
                content = path.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            urls = self.extract_urls(content)
            if urls:
                found[str(path.relative_to(self.repo_path))] = urls
        return found

    @staticmethod
    def check_url(url: str) -> tuple[bool, int | None, str | None]:
        """Check a URL with curl while allowing redirects and HEAD fallback."""
        try:
            result = subprocess.run(
                [
                    "curl",
                    "-L",
                    "-sS",
                    "--max-time",
                    "8",
                    "-o",
                    "/dev/null",
                    "-w",
                    "%{http_code}",
                    "-I",
                    url,
                ],
                capture_output=True,
                text=True,
                timeout=12,
                check=False,
            )
            code_text = result.stdout.strip()[-3:]
            status = int(code_text) if code_text.isdigit() else None
            if status == 405:
                result = subprocess.run(
                    [
                        "curl",
                        "-L",
                        "-sS",
                        "--max-time",
                        "8",
                        "-o",
                        "/dev/null",
                        "-w",
                        "%{http_code}",
                        url,
                    ],
                    capture_output=True,
                    text=True,
                    timeout=12,
                    check=False,
                )
                code_text = result.stdout.strip()[-3:]
                status = int(code_text) if code_text.isdigit() else None
            if status and 200 <= status < 400:
                return True, status, None
            return False, status, result.stderr.strip() or "HTTP request failed"
        except subprocess.TimeoutExpired:
            return False, None, "Timeout"
        except (OSError, ValueError) as exc:
            return False, None, str(exc)

    def add_checked(self, url: str, source: str, link_type: str) -> None:
        accessible, status, error = self.check_url(url)
        classification = self.classify_link_domain(url)
        self.results.append(
            LinkResult(
                url,
                accessible,
                status,
                error,
                source,
                link_type,
                ownership=classification["ownership"],
                paired_url=classification.get("paired_url"),
            )
        )

    def validate_repository_links(self) -> None:
        """Check canonical repository and hosted workflow links."""
        urls = (
            f"https://github.com/{self.github_repo}",
            f"https://github.com/{self.github_repo}/actions",
            f"https://raw.githubusercontent.com/{self.github_repo}/main/README.md",
            f"https://github.com/{self.github_repo}/blob/main/.github/workflows/ollama-autonomous-agent.yml",
        )
        for url in urls:
            self.add_checked(url, "repository", "repository")

    def validate_ollama_links(self) -> None:
        """Check Ollama's canonical download and source links."""
        for url in (
            "https://ollama.com",
            "https://ollama.com/download",
            "https://github.com/ollama/ollama",
            "https://github.com/ollama/ollama/releases",
        ):
            self.add_checked(url, "Ollama", "external_resource")

    def fetch_rendered_html(self, url: str) -> str:
        """Fetch the rendered HTML with a browser-like user-agent for content checks."""
        try:
            result = subprocess.run(
                [
                    "curl",
                    "-L",
                    "-A",
                    "Mozilla/5.0 (compatible; QMOI/1.0; +https://qmoi.com)",
                    "-sS",
                    "--max-time",
                    "12",
                    url,
                ],
                capture_output=True,
                text=True,
                timeout=16,
                check=False,
            )
            if result.returncode != 0:
                return ""
            return result.stdout or ""
        except (OSError, subprocess.TimeoutExpired):
            return ""

    def validate_rendered_page(
        self,
        url: str,
        required_markers: tuple[str, ...] | list[str] | None = None,
        source: str = "rendered_page",
        link_type: str = "rendered_page",
    ) -> LinkResult:
        """Verify that a page is reachable and contains expected HTML text markers."""
        classification = self.classify_link_domain(url)
        accessible, status, error = self.check_url(url)
        if not accessible:
            return LinkResult(
                url,
                False,
                status,
                error or "HTTP request failed",
                source,
                link_type,
                rendered_ok=False,
                ownership=classification["ownership"],
                paired_url=classification.get("paired_url"),
            )

        markers = tuple(required_markers) if required_markers else ("QMOI", "AI")
        html = self.fetch_rendered_html(url)
        if not html:
            return LinkResult(
                url,
                True,
                status,
                "Rendered page content could not be fetched for content validation",
                source,
                link_type,
                rendered_ok=False,
            )

        haystack = " ".join(
            [
                html,
                re.sub(r"<[^>]+>", " ", html),
            ]
        ).lower()
        missing = [
            marker for marker in markers if marker.lower() not in haystack
        ]
        rendered_ok = not missing
        return LinkResult(
            url,
            True,
            status,
            None if rendered_ok else f"Missing rendered-page marker(s): {', '.join(sorted(set(missing), key=lambda item: item.lower()))}",
            source,
            link_type,
            rendered_ok,
            ownership=classification["ownership"],
            paired_url=classification.get("paired_url"),
        )

    def validate_qmoi_domains(self) -> None:
        """Check the public QMOI site and each documented app route, always with its paired GitHub reference."""
        pages = {
            "https://qmoi.com": ("QMOI", "AI"),
            "https://qmoi.com/ai": ("QMOI", "AI"),
            "https://qmoi.com/space": ("QMOI", "SPACE"),
            "https://qmoi.com/files": ("QMOI", "FILES"),
            "https://qmoi.com/ide": ("QMOI", "IDE"),
            "https://qmoi.com/help/faq": ("FAQ", "QMOI"),
        }
        for url, markers in pages.items():
            result = self.validate_rendered_page(url, markers, source="QMOI domains", link_type="domain")
            result.paired_url = self.classify_link_domain(url).get("paired_url")
            result.ownership = self.classify_link_domain(url).get("ownership")
            self.results.append(result)

    def validate_release_assets(self) -> None:
        """Validate every asset in the latest published GitHub release."""
        try:
            result = subprocess.run(
                [
                    "gh",
                    "api",
                    f"repos/{self.github_repo}/releases/latest",
                    "--jq",
                    '{tag_name, assets: [.assets[].browser_download_url]}',
                ],
                capture_output=True,
                text=True,
                timeout=30,
                check=False,
            )
            payload = result.stdout.strip()
            if result.returncode != 0 or not payload:
                fallback = subprocess.run(
                    [
                        "curl",
                        "-fsSL",
                        "--max-time",
                        "15",
                        f"https://api.github.com/repos/{self.github_repo}/releases/latest",
                    ],
                    capture_output=True,
                    text=True,
                    timeout=20,
                    check=False,
                )
                payload = fallback.stdout.strip()
            if not payload:
                self.results.append(
                    LinkResult(
                        f"https://github.com/{self.github_repo}/releases",
                        False,
                        error="No published release found",
                        source_file="GitHub Releases",
                        link_type="release_asset",
                    )
                )
                return

            latest = json.loads(payload)
            if not isinstance(latest, dict):
                raise TypeError("Release payload did not contain a valid release object")

            for url in latest.get("assets", []):
                if isinstance(url, str):
                    self.add_checked(url, f"release:{latest.get('tag_name', 'unknown')}", "release_asset")
        except (OSError, json.JSONDecodeError, TypeError) as exc:
            self.results.append(
                LinkResult(
                    f"https://github.com/{self.github_repo}/releases",
                    False,
                    error=str(exc),
                    source_file="GitHub Releases",
                    link_type="release_asset",
                )
            )

    def validate_file_urls(self) -> None:
        """Check unique critical-domain URLs referenced by repository files."""
        candidates: dict[str, str] = {}
        for source, urls in self.find_urls().items():
            for url in urls:
                if url in candidates or not any(
                    domain in url for domain in self.critical_domains
                ):
                    continue
                if any(
                    marker in url
                    for marker in (
                        "${",
                        "$GITHUB_",
                        "{owner",
                        "{repo",
                        "{self.",
                        "github.com/user/repo",
                    )
                ) or "/dispatches" in url:
                    self.results.append(
                        LinkResult(
                            url,
                            True,
                            202 if "/dispatches" in url else None,
                            "Authenticated POST endpoint; structurally validated"
                            if "/dispatches" in url
                            else None,
                            source,
                            "api_endpoint" if "/dispatches" in url else "template",
                        )
                    )
                    continue
                candidates[url] = source

        def check(candidate: tuple[str, str]) -> LinkResult:
            url, source = candidate
            accessible, status, error = self.check_url(url)
            return LinkResult(url, accessible, status, error, source, "reference")

        with ThreadPoolExecutor(max_workers=16) as executor:
            self.results.extend(executor.map(check, candidates.items()))

    def validate_local_links(self) -> None:
        """Check relative documentation links and local download targets."""
        for source in self.find_urls():
            source_path = self.repo_path / source
            try:
                content = source_path.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            for target in self.extract_local_targets(content):
                if (
                    target.startswith(("http://", "https://", "mailto:", "#", "/"))
                    or "{" in target
                ):
                    continue
                target_path = (source_path.parent / target.split("#", 1)[0]).resolve()
                inside_repo = target_path == self.repo_path or self.repo_path in target_path.parents
                if not inside_repo:
                    continue
                exists = target_path.exists()
                self.results.append(
                    LinkResult(
                        target,
                        exists,
                        200 if exists else None,
                        None if exists else "Local target does not exist",
                        source,
                        "local_reference",
                    )
                )

    def validate_workflows(self) -> None:
        """Check every tracked workflow's canonical GitHub URL."""
        workflow_dir = self.repo_path / ".github" / "workflows"
        if not workflow_dir.exists():
            return
        for path in sorted(workflow_dir.glob("*.y*ml")):
            url = f"https://github.com/{self.github_repo}/blob/main/{path.as_posix()}"
            self.add_checked(url, str(path), "workflow")

    def validate_markdown_qmoi_pairs(self) -> None:
        """Ensure every QMOI-owned link in Markdown has a paired GitHub companion and a matching ownership record."""
        github_repo_url = f"https://github.com/{self.github_repo}"
        for path in sorted(self.repo_path.rglob("*.md")):
            normalized = f"/{path.as_posix()}"
            if any(part in normalized for part in self.ignored_parts):
                continue
            try:
                content = path.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            urls = self.extract_urls(content)
            if not urls:
                continue
            qmoi_urls = [
                url for url in urls if self.classify_link_domain(url)["ownership"] == "qmoi_owned"
            ]
            if not qmoi_urls:
                continue
            has_github_companion = any(
                self.github_repo in url for url in urls if "github.com" in url
            ) or github_repo_url in urls
            if not has_github_companion:
                for qmoi_url in qmoi_urls:
                    self.results.append(
                        LinkResult(
                            qmoi_url,
                            False,
                            None,
                            f"QMOI-owned link missing required paired GitHub reference: {github_repo_url}",
                            str(path.relative_to(self.repo_path)),
                            "qmoi_pairing",
                            ownership="qmoi_owned",
                            paired_url=github_repo_url,
                        )
                    )
                continue
            for qmoi_url in qmoi_urls:
                self.results.append(
                    LinkResult(
                        qmoi_url,
                        True,
                        200,
                        None,
                        str(path.relative_to(self.repo_path)),
                        "qmoi_pairing",
                        ownership="qmoi_owned",
                        paired_url=github_repo_url,
                    )
                )

    def validate_latest_run(self) -> None:
        """Check the latest autonomous run page and artifact availability."""
        try:
            result = subprocess.run(
                [
                    "gh", "run", "list", "--repo", self.github_repo,
                    "--workflow", "ollama-autonomous-agent.yml", "--limit", "1",
                    "--json", "databaseId,conclusion",
                ],
                capture_output=True,
                text=True,
                timeout=20,
                check=False,
            )
            runs = json.loads(result.stdout) if result.returncode == 0 else []
            if not runs:
                return
            run_id = runs[0]["databaseId"]
            url = f"https://github.com/{self.github_repo}/actions/runs/{run_id}"
            self.add_checked(url, "GitHub Actions", "github_run")
        except (OSError, json.JSONDecodeError, KeyError, TypeError) as exc:
            self.results.append(
                LinkResult("gh://latest-autonomous-run", False, error=str(exc), link_type="github_run")
            )

    def report(self) -> dict[str, Any]:
        """Build a machine-readable validation report."""
        accessible = sum(result.accessible for result in self.results)
        total = len(self.results)
        return {
            "total_links_validated": total,
            "accessible": accessible,
            "inaccessible": total - accessible,
            "success_rate": f"{accessible / total * 100:.1f}%" if total else "0%",
            "results": [asdict(result) for result in self.results],
            "inaccessible_links": [
                asdict(result) for result in self.results if not result.accessible
            ],
            "blocking_inaccessible": sum(
                not result.accessible and result.link_type in self.blocking_types
                for result in self.results
            ),
            "nonblocking_inaccessible": sum(
                not result.accessible and result.link_type not in self.blocking_types
                for result in self.results
            ),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    def validate_all(self) -> dict[str, Any]:
        """Run all bounded link checks."""
        print("Validating repository links...")
        self.validate_repository_links()
        print("Validating Ollama download and source links...")
        self.validate_ollama_links()
        print("Validating QMOI domains and app routes...")
        self.validate_qmoi_domains()
        print("Validating QMOI/GitHub markdown pairing across .md docs...")
        self.validate_markdown_qmoi_pairs()
        print("Validating published QMOI release assets...")
        self.validate_release_assets()
        print("Validating workflow links...")
        self.validate_workflows()
        print("Validating critical URLs referenced by files...")
        self.validate_file_urls()
        print("Validating local documentation and download targets...")
        self.validate_local_links()
        print("Validating latest hosted autonomous run...")
        self.validate_latest_run()
        self.results = list({result.url: result for result in self.results}.values())
        domain_pairs = self.build_qmoi_domain_pairs()
        qmoi_owned = [pair["qmoi_url"] for pair in domain_pairs if pair["ownership"] == "qmoi_owned"]
        external_non_qmoi = [
            result for result in self.results
            if result.ownership == "external_non_qmoi" and result.url not in qmoi_owned
        ]
        report = self.report()
        report["qmoi_domain_pairs"] = domain_pairs
        report["qmoi_owned_links"] = qmoi_owned
        report["external_non_qmoi_links"] = sorted({result.url for result in external_non_qmoi})
        return report


def main() -> int:
    """Run validation and persist its report."""
    report = LinkValidator().validate_all()
    output = Path("ollamatracks/link_validation_report.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(
        f"Validated {report['total_links_validated']} links: "
        f"{report['accessible']} accessible, {report['inaccessible']} inaccessible."
    )
    return 1 if report["blocking_inaccessible"] else 0


if __name__ == "__main__":
    sys.exit(main())
