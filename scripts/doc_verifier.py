#!/usr/bin/env python3
"""
QMOI Documentation Verifier
Parses all .md files, extracts claims, checks implementation, auto-fixes docs,
and creates new .md files for new features.
"""

import os
import sys
import json
import re
import glob
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import logging
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/doc_verifier.log'),
        logging.StreamHandler()
    ]
)

class QMOIDocVerifier:
    def __init__(self):
        self.root_dir = Path.cwd()
        self.logs_dir = self.root_dir / "logs"
        self.logs_dir.mkdir(exist_ok=True)
        
        self.verification_results = {
            "timestamp": datetime.now().isoformat(),
            "status": "running",
            "md_files_processed": 0,
            "claims_extracted": 0,
            "claims_verified": 0,
            "claims_fixed": 0,
            "new_features_documented": 0,
            "broken_claims_found": 0,
            "details": []
        }
        
        self.feature_registry = {}
        self.load_feature_registry()
    
    def load_feature_registry(self):
        """Load feature registry from config"""
        try:
            registry_path = self.root_dir / "config" / "feature_registry.json"
            if registry_path.exists():
                with open(registry_path, 'r') as f:
                    self.feature_registry = json.load(f)
            else:
                # Create default registry
                self.feature_registry = {
                    "features": {},
                    "last_updated": datetime.now().isoformat()
                }
                self.save_feature_registry()
        except Exception as e:
            logging.error(f"Error loading feature registry: {e}")
    
    def save_feature_registry(self):
        """Save feature registry to config"""
        try:
            registry_path = self.root_dir / "config" / "feature_registry.json"
            registry_path.parent.mkdir(exist_ok=True)
            
            self.feature_registry["last_updated"] = datetime.now().isoformat()
            
            with open(registry_path, 'w') as f:
                json.dump(self.feature_registry, f, indent=2)
        except Exception as e:
            logging.error(f"Error saving feature registry: {e}")
    
    def scan_all_md_files(self) -> List[Path]:
        """Scan all .md files in the project"""
        md_files = []
        for pattern in ["**/*.md", "**/*.MD", "**/*.markdown"]:
            md_files.extend(self.root_dir.glob(pattern))
        return md_files
    
    def parse_md_file(self, file_path: Path) -> Dict[str, Any]:
        """Parse an .md file and extract claims, features, and structure"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            claims = []
            claims.extend(re.findall(r'- \[([^\]]+)\]', content))       # checkbox
            claims.extend(re.findall(r'## ([^\n]+)', content))          # header
            claims.extend(re.findall(r'### ([^\n]+)', content))         # subheader
            claims.extend(re.findall(r'\*\*([^*]+)\*\*', content))      # bold
            
            claims = list(set([claim.strip() for claim in claims if claim.strip()]))
            code_blocks = re.findall(r'```(\w+)?\n(.*?)```', content, re.DOTALL)
            file_refs = re.findall(r'`([^`]+\.(tsx?|jsx?|py|json|md))`', content)
            links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
            
            return {
                "path": str(file_path),
                "content": content,
                "claims": claims,
                "code_blocks": code_blocks,
                "file_refs": [ref[0] for ref in file_refs],
                "links": links,
                "last_modified": file_path.stat().st_mtime
            }
        except Exception as e:
            logging.error(f"Error parsing {file_path}: {e}")
            return {"path": str(file_path), "error": str(e)}
    
    def search_codebase_for_implementation(self, claim: str) -> Dict[str, Any]:
        """Search the codebase for implementation of a claim"""
        try:
            search_patterns = [
                claim.lower().replace(' ', '_'),
                claim.lower().replace(' ', ''),
                claim.lower(),
                claim.replace(' ', ''),
                claim
            ]
            found_files, found_content = [], []
            code_extensions = ['.ts', '.tsx', '.js', '.jsx', '.py']
            
            for ext in code_extensions:
                for file_path in self.root_dir.rglob(f'*{ext}'):
                    if 'node_modules' in str(file_path) or '.git' in str(file_path):
                        continue
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            file_content = f.read()
                        for pattern in search_patterns:
                            if pattern.lower() in file_content.lower():
                                found_files.append(str(file_path))
                                lines = file_content.split('\n')
                                for i, line in enumerate(lines):
                                    if pattern.lower() in line.lower():
                                        found_content.append({
                                            "file": str(file_path),
                                            "line": i + 1,
                                            "content": line.strip()
                                        })
                                break
                    except:
                        continue
            
            return {
                "claim": claim,
                "found_files": list(set(found_files)),
                "found_content": found_content,
                "implemented": len(found_files) > 0
            }
        except Exception as e:
            return {"claim": claim, "error": str(e), "implemented": False}
    
    def verify_claim(self, claim: str, file_path: Path) -> Dict[str, Any]:
        """Verify if a claim in an .md file is implemented"""
        implementation = self.search_codebase_for_implementation(claim)
        return {
            "claim": claim,
            "file": str(file_path),
            "implemented": implementation["implemented"],
            "found_files": implementation["found_files"],
            "found_content": implementation["found_content"]
        }
    
    def fix_broken_claims(self, parsed_file: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fix broken claims by creating implementations or updating documentation"""
        fixes = []
        for claim in parsed_file.get("claims", []):
            verification = self.verify_claim(claim, Path(parsed_file["path"]))
            if not verification["implemented"]:
                fix_result = self.create_missing_implementation(claim, parsed_file["path"])
                if fix_result["success"]:
                    fixes.append({
                        "claim": claim,
                        "action": "created_implementation",
                        "file": fix_result["file"],
                        "type": fix_result["type"]
                    })
                else:
                    fixes.append({
                        "claim": claim,
                        "action": "marked_todo",
                        "reason": "no_implementation_found"
                    })
        return fixes
    
    def create_missing_implementation(self, claim: str, md_file_path: str) -> Dict[str, Any]:
        """Create missing implementation for a claim"""
        try:
            if any(k in claim.lower() for k in ["api", "route", "endpoint", "service"]):
                file_ext, dir_path, file_type = ".ts", "app/api", "api"
            elif any(k in claim.lower() for k in ["component", "ui", "panel", "dashboard"]):
                file_ext, dir_path, file_type = ".tsx", "components", "component"
            elif any(k in claim.lower() for k in ["script", "automation", "utility"]):
                file_ext, dir_path, file_type = ".py", "scripts", "script"
            elif any(k in claim.lower() for k in ["hook", "context", "provider"]):
                file_ext, dir_path, file_type = ".ts", "hooks", "hook"
            else:
                file_ext, dir_path, file_type = ".ts", "lib", "utility"
            
            filename = claim.lower().replace(' ', '_').replace('-', '_') + file_ext
            file_path = self.root_dir / dir_path / filename
            file_path.parent.mkdir(parents=True, exist_ok=True)
            if file_type == "api":
                content = f"""// {claim} API Route
// Auto-generated by QMOI Doc Verifier

import {{ NextRequest, NextResponse }} from 'next/server';

export async function GET(request: NextRequest) {{
  try {{
    // TODO: Implement {claim} functionality
    return NextResponse.json({{
      status: 'success',
      message: '{claim} endpoint',
      data: {{}}
    }});
  }} catch (error) {{
    return NextResponse.json({{ error: 'Internal server error' }}, {{ status: 500 }});
  }}
}}

export async function POST(request: NextRequest) {{
  try {{
    const body = await request.json();
    // TODO: Implement {claim} POST functionality
    return NextResponse.json({{
      status: 'success',
      message: '{claim} created',
      data: body
    }});
  }} catch (error) {{
    return NextResponse.json({{ error: 'Internal server error' }}, {{ status: 500 }});
  }}
}}
"""
            elif file_type == "component":
                content = f"""// {claim} Component
// Auto-generated by QMOI Doc Verifier

import React from 'react';

export const {claim.replace(' ', '')}: React.FC<{claim.replace(' ', '')}Props> = () => {{
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{claim}</h3>
      <p>Auto-generated {claim} component</p>
      {{/* TODO: Implement component functionality */}}
    </div>
  );
}};
"""
            elif file_type == "script":
                content = f"""#!/usr/bin/env python3
\"\"\"
{claim} Script
Auto-generated by QMOI Doc Verifier
\"\"\"

import logging
from typing import Dict, Any

class {claim.replace(' ', '')}Service:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def initialize(self) -> None:
        self.logger.info(f"Initializing {{self.__class__.__name__}}")
    
    def execute(self) -> Dict[str, Any]:
        # TODO: Implement {claim} functionality
        return {{"status": "success", "message": "{claim} executed"}}
"""
            elif file_type == "hook":
                content = f"""// {claim} Hook
// Auto-generated by QMOI Doc Verifier

import {{ useState, useEffect }} from 'react';

export const use{claim.replace(' ', '')} = () => {{
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Implement {claim} hook functionality

  return {{
    data,
    loading,
    error,
    // TODO: Add hook methods
  }};
}};
"""
            else:
                content = f"""// {claim} Utility
// Auto-generated by QMOI Doc Verifier

export interface {claim.replace(' ', '')}Config {{
  // TODO: Define configuration interface
}}

export class {claim.replace(' ', '')}Service {{
  constructor(private config: {claim.replace(' ', '')}Config) {{}}
  
  async initialize(): Promise<void> {{
    console.log('Initializing {claim}');
  }}
  
  async execute(): Promise<any> {{
    return {{ status: 'success', message: '{claim} executed' }};
  }}
}}
"""
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            self.feature_registry["features"][claim] = {
                "file": str(file_path),
                "type": file_type,
                "created": datetime.now().isoformat(),
                "auto_generated": True
            }
            return {"success": True, "file": str(file_path), "type": file_type}
        except Exception as e:
            return {"success": False, "error": str(e)}

    # --- rest of methods (update_md_file, discover_new_features, create_feature_documentation, run_comprehensive_verification, generate_verification_report, save_verification_report, send_notification) ---
    # (they remain as in your last pasted version, unchanged)

def main():
    parser = argparse.ArgumentParser(description="QMOI Doc Verifier")
    parser.add_argument('--notify', type=str, help='Send notification if issues detected')
    args = parser.parse_args()
    verifier = QMOIDocVerifier()
    if args.notify:
        verifier.run_comprehensive_verification(notify_on_issues=True)
    else:
        verifier.run_comprehensive_verification()
    print(json.dumps(verifier.verification_results, indent=2))
    if verifier.verification_results["status"] == "completed":
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
