#!/usr/bin/env python3
"""
QMOI Link Report Generator
Scans all .md, .py, .js, .ts files for HTTP(S) links and generates a comprehensive report.
Categorizes links and suggests offline caching strategy.
"""

import re
import os
import json
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse
from datetime import datetime

# URL pattern matching
URL_PATTERN = re.compile(r'https?://[^\s\)\]\'\"]+')

# Categories for links
LINK_CATEGORIES = {
    'external_download': r'^https?://(downloads\.qmoi\.app|github\.com/.*releases)',
    'external_api': r'^https?://(api\.|.*\.api\.)',
    'external_docs': r'^https?://(docs\.|.*\.docs\.|github\.com/.*wiki)',
    'external_service': r'^https?://(huggingface\.co|github\.com|gitlab\.com)',
    'localhost': r'^http://localhost',
    'ngrok_tunnel': r'^https?://.*\.ngrok',
    'example': r'^https?://example\.com',
    'other_external': r'^https?://'
}

def categorize_link(url):
    """Categorize a link based on pattern matching."""
    for category, pattern in LINK_CATEGORIES.items():
        if re.match(pattern, url):
            return category
    return 'other'

def scan_file_for_links(file_path):
    """Extract all URLs from a file."""
    links = []
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            matches = URL_PATTERN.findall(content)
            for match in matches:
                # Remove trailing punctuation that's not part of the URL
                url = re.sub(r'[),\.\]\'"]+$', '', match)
                links.append(url)
    except Exception as e:
        print(f"Warning: Could not read {file_path}: {e}")
    return links

def estimate_asset_size(url):
    """Estimate asset size category based on URL pattern."""
    if any(x in url for x in ['.apk', '.ipa', '.dmg', '.exe', '.appimage', '.deb']):
        return 'large_binary'
    elif any(x in url for x in ['.jpg', '.png', '.gif', '.svg', '.webp']):
        return 'image'
    elif any(x in url for x in ['.md', '.html', '.txt', 'docs', 'wiki']):
        return 'small_doc'
    elif 'github.com' in url or 'gitlab.com' in url:
        return 'vcs'
    else:
        return 'unknown'

def generate_caching_strategy(url, category):
    """Generate a caching/offline strategy for a link."""
    strategies = {
        'external_download': '📦 Cache binary with manifest (enable via config)',
        'external_api': '⚠️ Requires live connection; add mock endpoint for offline',
        'external_docs': '📄 Cache HTML/markdown snapshot',
        'external_service': '🔗 Reference only; add fallback docs locally',
        'localhost': '🖥️ Requires local service; add mock or stub endpoint',
        'ngrok_tunnel': '❌ Ephemeral; replace with reproducible local tunnel script',
        'example': '❓ Example/TBD; verify if needed in production',
        'other_external': '🌐 Cache if possible; add local fallback'
    }
    return strategies.get(category, '❓ Unknown')

def main():
    """Main function to scan and report on all links."""
    workspace_root = Path('/workspaces/qmoi-enhanced')
    
    # File patterns to scan
    scan_patterns = ['**/*.md', '**/*.py', '**/*.js', '**/*.ts']
    
    # Exclude paths
    exclude_dirs = {
        'node_modules', '.git', '.qmoi_validation', '__pycache__',
        '.venv', 'venv', 'dist', 'build', '.next', 'qmoi-enhanced'
    }
    
    link_inventory = defaultdict(list)
    file_links = {}
    total_links = 0
    unique_links = set()
    
    print("🔍 Scanning for links in repository...\n")
    
    # Scan all files
    for pattern in scan_patterns:
        for file_path in workspace_root.glob(pattern):
            # Skip excluded directories
            if any(excl in file_path.parts for excl in exclude_dirs):
                continue
            
            relative_path = file_path.relative_to(workspace_root)
            links = scan_file_for_links(file_path)
            
            if links:
                file_links[str(relative_path)] = links
                for link in links:
                    category = categorize_link(link)
                    link_inventory[category].append({
                        'url': link,
                        'file': str(relative_path),
                        'asset_size': estimate_asset_size(link),
                        'caching_strategy': generate_caching_strategy(link, category)
                    })
                    unique_links.add(link)
                    total_links += 1
    
    # Generate report
    report = {
        'timestamp': datetime.now().isoformat(),
        'total_links_found': total_links,
        'unique_links': len(unique_links),
        'by_category': {},
        'links_by_file': file_links
    }
    
    # Summary by category
    for category in sorted(link_inventory.keys()):
        links = link_inventory[category]
        unique_in_cat = len(set(l['url'] for l in links))
        report['by_category'][category] = {
            'count': len(links),
            'unique': unique_in_cat,
            'links': sorted(set(l['url'] for l in links)),
            'example': links[0] if links else None
        }
    
    # Write JSON report
    report_file = workspace_root / 'tools' / 'link_report.json'
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"✅ Report saved to: {report_file}\n")
    
    # Print summary
    print(f"📊 LINK REPORT SUMMARY")
    print(f"{'='*60}")
    print(f"Total links found: {total_links}")
    print(f"Unique links: {len(unique_links)}\n")
    
    print(f"📁 BY CATEGORY:")
    for category, data in sorted(report['by_category'].items()):
        print(f"\n  {category}:")
        print(f"    Total: {data['count']} | Unique: {data['unique']}")
        if data['example']:
            print(f"    Example: {data['example']['url'][:70]}")
            print(f"    Strategy: {data['example'].get('caching_strategy', 'N/A')}")
    
    # Caching recommendations
    print(f"\n\n💾 CACHING RECOMMENDATIONS:")
    print(f"{'='*60}")
    
    for category in ['external_download', 'external_docs', 'external_service']:
        if category in report['by_category']:
            data = report['by_category'][category]
            print(f"\n{category.upper()}: {data['unique']} unique links")
            for url in sorted(data['links'])[:3]:
                print(f"  • {url[:70]}")
            if len(data['links']) > 3:
                print(f"  ... and {len(data['links']) - 3} more")
    
    # Generate caching manifest
    manifest = {
        'version': '1.0.0',
        'generated': datetime.now().isoformat(),
        'external_assets': {
            'downloads': sorted(set(
                l['url'] for l in link_inventory.get('external_download', [])
            ))[:10],  # Top 10 downloads
            'docs': sorted(set(
                l['url'] for l in link_inventory.get('external_docs', [])
            ))[:10]
        },
        'local_services': sorted(set(
            l['url'] for l in link_inventory.get('localhost', [])
        )),
        'ephemeral': sorted(set(
            l['url'] for l in link_inventory.get('ngrok_tunnel', [])
        ))
    }
    
    manifest_file = workspace_root / 'docs_site' / 'cache_manifest.json'
    manifest_file.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest_file, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"\n✅ Manifest saved to: {manifest_file}")
    print(f"\n✨ Next steps:")
    print(f"  1. Review {report_file}")
    print(f"  2. Run: tools/cache_links.py --manifest docs_site/cache_manifest.json")
    print(f"  3. Build offline site: docs_site/build_offline.sh")

if __name__ == '__main__':
    main()
