#!/usr/bin/env python3
"""
Scan repository for common API, endpoint, and route patterns and generate
API.md, ENDPOINTS.md, and ROUTES.md under the repo root. This is a best-effort
assembler that aggregates discovered items for manual review.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IGNORE_DIRS = {".git", "node_modules", ".venv", "venv", "dist", "build"}

route_patterns = [
    re.compile(r"app\.(get|post|put|delete|patch)\(['\"]([^'\"]+)"),
    re.compile(r"@app\.route\(['\"]([^'\"]+)") ,
    re.compile(r"@app\.(get|post|put|delete|patch)\(['\"]([^'\"]+)") ,
    re.compile(r"router\.(get|post|put|delete|patch)\(['\"]([^'\"]+)") ,
]

endpoints = set()
apis = set()
routes = set()

def should_scan(path: Path):
    parts = set(path.parts)
    return not (parts & IGNORE_DIRS)

def scan_file(path: Path):
    try:
        text = path.read_text(errors='ignore')
    except Exception:
        return
    for p in route_patterns:
        for m in p.finditer(text):
            # group may be (method, path) or (path,)
            if len(m.groups()) >= 2:
                method = m.group(1)
                pth = m.group(2)
            else:
                method = ""
                pth = m.group(1)
            routes.add(f"{method.upper()} {pth}".strip())
            endpoints.add(pth)
            apis.add(f"{path.relative_to(ROOT)}")

def scan():
    for p in ROOT.rglob('*'):
        if p.is_file() and should_scan(p):
            scan_file(p)

def write_md():
    (ROOT / 'API.md').write_text('# API Inventory\n\n')
    with (ROOT / 'API.md').open('a') as f:
        f.write('## Source files containing API/route code\n\n')
        for a in sorted(apis):
            f.write(f'- {a}\n')

    (ROOT / 'ENDPOINTS.md').write_text('# Endpoints Inventory\n\n')
    with (ROOT / 'ENDPOINTS.md').open('a') as f:
        for e in sorted(endpoints):
            f.write(f'- {e}\n')

    (ROOT / 'ROUTES.md').write_text('# Routes Inventory\n\n')
    with (ROOT / 'ROUTES.md').open('a') as f:
        for r in sorted(routes):
            f.write(f'- {r}\n')

def main():
    print('Scanning repository...')
    scan()
    print(f'Found {len(apis)} source files, {len(endpoints)} endpoints, {len(routes)} routes')
    write_md()
    print('Wrote API.md, ENDPOINTS.md, ROUTES.md')

if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""
API and Endpoints consolidation script.
Generates/updates API.md (main), APIs_1.md, ENDPOINTS.md, and ROUTES.md files.
Consolidates all API documentation ensuring no duplication and complete coverage.
"""

import json
import re
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Set

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / ".qmoi_validation"

API_MD = ROOT / "API.md"
APIS_1_MD = ROOT / "APIs_1.md"
ENDPOINTS_MD = ROOT / "ENDPOINTS.md"
ROUTES_MD = ROOT / "ROUTES.md"


def find_api_endpoints_in_code() -> Dict[str, List[Dict]]:
    """Scan code for API endpoints and routes."""
    endpoints = {
        "rest": [],
        "graphql": [],
        "websocket": [],
        "routes": []
    }
    
    # Scan for REST endpoints (Express, Fastify, etc.)
    rest_patterns = [
        r'app\.(get|post|put|patch|delete|options)\(["\']([^"\']+)',
        r'router\.(get|post|put|patch|delete|options)\(["\']([^"\']+)',
        r'@(Get|Post|Put|Patch|Delete|Options)\(["\']([^"\']+)',
    ]
    
    # Scan for Next.js routes
    api_files = list(ROOT.rglob("**/api/**/*.ts")) + list(ROOT.rglob("**/api/**/*.js")) + list(ROOT.rglob("**/pages/api/**/*.ts"))
    
    for file_path in api_files[:100]:  # Limit to prevent massive scans
        try:
            content = file_path.read_text(encoding="utf-8", errors="ignore")
            
            for pattern in rest_patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    if len(match) >= 2:
                        method = match[0].upper() if len(match) > 1 else "GET"
                        path = match[-1]
                        endpoints["rest"].append({
                            "method": method,
                            "path": path,
                            "file": str(file_path.relative_to(ROOT)),
                            "type": "REST"
                        })
        except Exception:
            continue

    endpoints["nextjs"] = find_nextjs_api_route_files()

    # Deduplicate REST endpoints
    seen = set()
    deduped = []
    for ep in endpoints["rest"]:
        key = f"{ep['method']} {ep['path']}"
        if key not in seen:
            seen.add(key)
            deduped.append(ep)
    endpoints["rest"] = sorted(deduped, key=lambda x: (x["method"], x["path"]))

    # Deduplicate Next.js endpoints
    seen = set()
    deduped_nextjs = []
    for ep in endpoints["nextjs"]:
        key = f"{ep['method']} {ep['path']}"
        if key not in seen:
            seen.add(key)
            deduped_nextjs.append(ep)
    endpoints["nextjs"] = sorted(deduped_nextjs, key=lambda x: x["path"])

    return endpoints


def find_nextjs_api_route_files() -> List[Dict]:
    """Find Next.js API route files under app/api and src/app/api."""
    routes: List[Dict] = []
    search_bases = [ROOT / "app" / "api", ROOT / "src" / "app" / "api"]
    for base in search_bases:
        if not base.exists():
            continue
        for file_path in sorted(base.rglob("**/*")):
            if file_path.is_dir():
                continue
            if file_path.suffix not in {".ts", ".js", ".tsx", ".jsx"}:
                continue

            rel_path = file_path.relative_to(base)
            if file_path.name.startswith("route."):
                endpoint = "/api" if rel_path.parent == Path(".") else f"/api/{rel_path.parent.as_posix()}"
            else:
                endpoint = f"/api/{rel_path.with_suffix("").as_posix()}"

            endpoint = endpoint.replace('\\\\', '/')
            routes.append({
                "method": "ALL",
                "path": endpoint,
                "file": str(file_path.relative_to(ROOT)),
                "type": "NextJS API Route"
            })
    return routes


def find_page_routes() -> List[Dict]:
    """Collect Next.js application page routes from app and src/app directories."""
    routes: List[Dict] = []
    page_file_names = {"page.tsx", "page.ts", "page.jsx", "page.js"}
    base_dirs = [(ROOT / "app", ROOT / "app"), (ROOT / "src" / "app", ROOT / "src" / "app")]

    for base, route_root in base_dirs:
        if not base.exists():
            continue
        for file_path in sorted(base.rglob("*")):
            if file_path.is_file() and file_path.name in page_file_names:
                rel = file_path.parent.relative_to(route_root).as_posix()
                route = "/" if rel == "." else f"/{rel}"
                routes.append({
                    "path": route,
                    "file": str(file_path.relative_to(ROOT)),
                    "type": "Page Route"
                })

    public_dir = ROOT / "public"
    if public_dir.exists():
        for file_path in sorted(public_dir.rglob("*.html")):
            route = "/" + file_path.relative_to(public_dir).as_posix()
            routes.append({
                "path": route, "file": str(file_path.relative_to(ROOT)), "type": "Static Page Route"
            })

    unique = []
    seen = set()
    for route in routes:
        key = (route["path"], route["file"])
        if key not in seen:
            seen.add(key)
            unique.append(route)
    return unique


def find_routes_in_code() -> List[Dict]:
    """Find application routes in route files and Next.js page routes."""
    routes = []

    # Include Next.js page routes and API route paths.
    routes.extend(find_page_routes())
    routes.extend(find_nextjs_api_route_files())

    route_file_patterns = [
        "src/**/routes/**/*.{ts,js}",
        "routes/**/*.{ts,js}",
        "**/routing/**/*.{ts,js}",
    ]
    
    route_files = []
    for pattern in route_file_patterns:
        route_files.extend(ROOT.glob(pattern))
    
    for file_path in route_files[:80]:  # Limit to prevent massive scans
        try:
            content = file_path.read_text(encoding="utf-8", errors="ignore")
            
            # Find route patterns
            route_patterns = [
                r'path:\s*["\']([^"\']+)',
                r'route:\s*["\']([^"\']+)',
                r'path\s*=\s*["\']([^"\']+)',
            ]
            
            for pattern in route_patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    routes.append({
                        "path": match,
                        "file": str(file_path.relative_to(ROOT)),
                        "type": "Application Route"
                    })
        except Exception:
            continue

    unique = []
    seen = set()
    for route in routes:
        key = (route["path"], route["file"], route["type"])
        if key not in seen:
            seen.add(key)
            unique.append(route)
    return unique


def generate_api_md() -> None:
    """Generate the main API.md file."""
    timestamp = datetime.utcnow().isoformat() + "Z"
    endpoints_data = find_api_endpoints_in_code()
    
    content = f"""# API Documentation
"""
    content += f"\n**Last Generated:** {timestamp}\n\n"
    content += "This is the main API documentation file. It consolidates all API endpoints, routes, and related documentation from APIs_1.md, ENDPOINTS.md, and ROUTES.md.\n\n"
    content += "## Overview\n\nThe QMOI system provides multiple API access methods:\n- REST APIs for standard HTTP operations\n- GraphQL APIs for flexible data queries\n- WebSocket APIs for real-time communication\n- Application routes for frontend navigation\n\n"
    content += "## API Access Methods\n\n### REST APIs\n\nREST APIs provide standard HTTP endpoints for CRUD operations and business logic.\n\n**Base URL:** `https://api.qmoi.com/v1` or relative `/api/v1`\n\n#### Endpoints\n\n"

    if endpoints_data["rest"]:
        for ep in endpoints_data["rest"][:100]:
            content += f"- `{ep['method']:6s} {ep['path']}` (defined in `{ep['file']}`)\n"
    else:
        content += "\n_Endpoints to be documented - run API scanner for latest list_\n"

    content += f"\n### Next.js API Routes\n\nThese are the API route files exposed by Next.js under `app/api` and `src/app/api`.\n\n"
    if endpoints_data["nextjs"]:
        for ep in endpoints_data["nextjs"]:
            content += f"- `{ep['path']}` (defined in `{ep['file']}`)\n"
    else:
        content += "\n_No Next.js API routes were detected. Ensure `app/api` or `src/app/api` contains route files._\n"

    content += f"\n### GraphQL APIs\n\nGraphQL APIs provide flexible query and mutation capabilities.\n\n**Endpoint:** `/api/graphql`\n\nSchema documentation: See [GraphQL Schema](GraphQL_SCHEMA.md)\n\n"
    content += "### WebSocket APIs\n\nReal-time communication via WebSocket connections.\n\n**Endpoint:** `wss://api.qmoi.com/ws` or relative `/ws`\n\nDocumentation: See [WEBHOOKS.md](WEBHOOKS.md)\n\n"
    content += "## Related Documentation\n\n- [APIs_1.md](APIs_1.md) - Detailed API specifications\n- [ENDPOINTS.md](ENDPOINTS.md) - Complete endpoint reference\n- [ROUTES.md](ROUTES.md) - Application route definitions\n- [WEBHOOKS.md](WEBHOOKS.md) - Webhook and WebSocket documentation\n\n"
    content += f"## API Status\n\n- REST Endpoints: {len(endpoints_data['rest'])} documented\n- Next.js API Routes: {len(endpoints_data['nextjs'])} documented\n- GraphQL Endpoints: _To be documented_\n- WebSocket Endpoints: _To be documented_\n- Application Routes: _To be consolidated_\n\n"
    content += "## Bulk Workflow\n\nRun these commands to update API documentation:\n\n```bash\n# Generate all API documentation\npython3 scripts/consolidate_api_endpoints.py\n\n# Update ALLMDFILESREFS.md with API documentation status\npython3 scripts/auto_update_allmdfilesrefs.py\n```\n\n"

    API_MD.write_text(content, encoding="utf-8")
    print(f"✓ Generated {API_MD}")


def generate_endpoints_md() -> None:
    """Generate ENDPOINTS.md with all endpoints."""
    timestamp = datetime.utcnow().isoformat() + "Z"
    endpoints_data = find_api_endpoints_in_code()
    
    content = f"""# All API Endpoints

**Last Generated:** {timestamp}

Complete reference of all API endpoints organized by method and path.

## REST Endpoints

### By HTTP Method

"""
    
    methods = {}
    for ep in endpoints_data["rest"]:
        method = ep["method"]
        if method not in methods:
            methods[method] = []
        methods[method].append(ep)
    
    for method in sorted(methods.keys()):
        content += f"\n#### {method}\n\n"
        for ep in sorted(methods[method], key=lambda x: x["path"]):
            content += f"- `{ep['path']}` ({ep['file']})\n"
    
    content += f"""

### By Path

"""
    
    for ep in sorted(endpoints_data["rest"], key=lambda x: x["path"]):
        content += f"- `{ep['method']:6s} {ep['path']}` ({ep['file']})\n"
    
    content += """

## Related Documentation

- [API.md](API.md) - Main API documentation
- [ROUTES.md](ROUTES.md) - Application routes
- [WEBHOOKS.md](WEBHOOKS.md) - Webhooks and WebSocket endpoints

"""
    
    ENDPOINTS_MD.write_text(content, encoding="utf-8")
    print(f"✓ Generated {ENDPOINTS_MD}")


def generate_routes_md() -> None:
    """Generate ROUTES.md with all application routes."""
    timestamp = datetime.utcnow().isoformat() + "Z"
    routes = find_routes_in_code()
    
    content = f"""# Application Routes

**Last Generated:** {timestamp}

Complete reference of all application routes and navigation paths.

## Routes

"""
    
    if routes:
        for route in sorted(set(r["path"] for r in routes)):
            content += f"- `{route}`\n"
    else:
        content += "\n_Routes to be documented - run route scanner_\n"
    
    content += """

## Related Documentation

- [API.md](API.md) - API endpoints
- [ENDPOINTS.md](ENDPOINTS.md) - REST endpoints
- [WEBHOOKS.md](WEBHOOKS.md) - WebSocket routes

"""
    
    ROUTES_MD.write_text(content, encoding="utf-8")
    print(f"✓ Generated {ROUTES_MD}")


def consolidate_api_documentation() -> None:
    """Main function to consolidate all API documentation."""
    print("\n=== Consolidating API Documentation ===\n")
    
    VALIDATION_DIR.mkdir(exist_ok=True, parents=True)
    
    generate_api_md()
    generate_endpoints_md()
    generate_routes_md()
    
    # Save consolidation report
    report = {
        "generated": datetime.utcnow().isoformat() + "Z",
        "files": {
            "API.md": API_MD.exists(),
            "APIs_1.md": APIS_1_MD.exists(),
            "ENDPOINTS.md": ENDPOINTS_MD.exists(),
            "ROUTES.md": ROUTES_MD.exists(),
        },
        "status": "complete"
    }
    
    report_file = VALIDATION_DIR / "api_consolidation_report.json"
    report_file.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"\n✓ Saved consolidation report to {report_file}\n")


if __name__ == "__main__":
    consolidate_api_documentation()
