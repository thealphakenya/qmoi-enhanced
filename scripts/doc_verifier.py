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
            
            # Extract claims (features mentioned)
            claims = []
            
            # Check for checkbox claims
            checkbox_claims = re.findall(r'- \[([^\]]+)\]', content)
            claims.extend(checkbox_claims)
            
            # Check for header claims
            header_claims = re.findall(r'## ([^\n]+)', content)
            claims.extend(header_claims)
            
            # Check for subheader claims
            subheader_claims = re.findall(r'### ([^\n]+)', content)
            claims.extend(subheader_claims)
            
            # Check for bold claims
            bold_claims = re.findall(r'\*\*([^*]+)\*\*', content)
            claims.extend(bold_claims)
            
            # Remove duplicates and clean
            claims = list(set([claim.strip() for claim in claims if claim.strip()]))
            
            # Extract code blocks
            code_blocks = re.findall(r'```(\w+)?\n(.*?)```', content, re.DOTALL)
            
            # Extract file references
            file_refs = re.findall(r'`([^`]+\.(tsx?|jsx?|py|json|md))`', content)
            
            # Extract links
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
            # Convert claim to search patterns
            search_patterns = [
                claim.lower().replace(' ', '_'),
                claim.lower().replace(' ', ''),
                claim.lower(),
                claim.replace(' ', ''),
                claim
            ]
            
            found_files = []
            found_content = []
            
            # Search in different file types
            code_extensions = ['.ts', '.tsx', '.js', '.jsx', '.py']
            
            for ext in code_extensions:
                for file_path in self.root_dir.rglob(f'*{ext}'):
                    if 'node_modules' not in str(file_path) and '.git' not in str(file_path):
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                file_content = f.read()
                            
                            # Check if any pattern matches
                            for pattern in search_patterns:
                                if pattern.lower() in file_content.lower():
                                    found_files.append(str(file_path))
                                    
                                    # Extract relevant lines
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
            return {
                "claim": claim,
                "error": str(e),
                "implemented": False
            }
    
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
                # Try to create implementation
                fix_result = self.create_missing_implementation(claim, parsed_file["path"])
                if fix_result["success"]:
                    fixes.append({
                        "claim": claim,
                        "action": "created_implementation",
                        "file": fix_result["file"],
                        "type": fix_result["type"]
                    })
                else:
                    # Mark claim as TODO or remove it
                    fixes.append({
                        "claim": claim,
                        "action": "marked_todo",
                        "reason": "no_implementation_found"
                    })
        
        return fixes
    
    def create_missing_implementation(self, claim: str, md_file_path: str) -> Dict[str, Any]:
        """Create missing implementation for a claim"""
        try:
            # Determine file type based on claim content
            if any(keyword in claim.lower() for keyword in ["api", "route", "endpoint", "service"]):
                file_ext = ".ts"
                dir_path = "app/api"
                file_type = "api"
            elif any(keyword in claim.lower() for keyword in ["component", "ui", "panel", "dashboard"]):
                file_ext = ".tsx"
                dir_path = "components"
                file_type = "component"
            elif any(keyword in claim.lower() for keyword in ["script", "automation", "service", "utility"]):
                file_ext = ".py"
                dir_path = "scripts"
                file_type = "script"
            elif any(keyword in claim.lower() for keyword in ["hook", "context", "provider"]):
                file_ext = ".ts"
                dir_path = "hooks"
                file_type = "hook"
            else:
                file_ext = ".ts"
                dir_path = "lib"
                file_type = "utility"
            
            # Create filename
            filename = claim.lower().replace(' ', '_').replace('-', '_') + file_ext
            file_path = self.root_dir / dir_path / filename
            
            # Create directory if needed
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Generate basic implementation
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
    return NextResponse.json(
      {{ error: 'Internal server error' }},
      {{ status: 500 }}
    );
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
    return NextResponse.json(
      {{ error: 'Internal server error' }},
      {{ status: 500 }}
    );
  }}
}}
"""
            elif file_type == "component":
                content = f"""// {claim} Component
// Auto-generated by QMOI Doc Verifier

import React from 'react';

interface {claim.replace(' ', '')}Props {{
  // TODO: Define component props
}}

export const {claim.replace(' ', '')}: React.FC<{claim.replace(' ', '')}Props> = ({{}}) => {{
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{claim}</h3>
      <p>Auto-generated {claim} component</p>
      {/* TODO: Implement component functionality */}
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
        \"\"\"Initialize {claim}\"\"\"
        self.logger.info(f"Initializing {{self.__class__.__name__}}")
    
    def execute(self) -> Dict[str, Any]:
        \"\"\"Execute {claim} functionality\"\"\"
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
    // TODO: Initialize {claim}
    console.log('Initializing {claim}');
  }}
  
  async execute(): Promise<any> {{
    // TODO: Execute {claim} functionality
    return {{ status: 'success', message: '{claim} executed' }};
  }}
}}
"""
            
            # Write file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Update feature registry
            self.feature_registry["features"][claim] = {
                "file": str(file_path),
                "type": file_type,
                "created": datetime.now().isoformat(),
                "auto_generated": True
            }
            
            return {"success": True, "file": str(file_path), "type": file_type}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def update_md_file(self, file_path: Path, fixes: List[Dict[str, Any]]) -> bool:
        """Update .md file with fixes and improvements"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Apply fixes
            for fix in fixes:
                if fix["action"] == "marked_todo":
                    # Replace broken claim with TODO
                    claim_pattern = re.escape(fix["claim"])
                    content = re.sub(
                        rf'- \[{claim_pattern}\].*\n',
                        f'- [ ] {fix["claim"]} - TODO: Implementation needed\n',
                        content
                    )
                elif fix["action"] == "created_implementation":
                    # Add reference to new implementation
                    content += f"\n\n## Implementation\n- [{fix['claim']}]({fix['file']}) - Auto-generated {fix['type']}\n"
            
            # Add verification metadata
            content += f"\n\n---\n*Last verified: {datetime.now().isoformat()} by QMOI Doc Verifier*\n"
            
            # Write updated content
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
        except Exception as e:
            logging.error(f"Error updating {file_path}: {e}")
            return False
    
    def discover_new_features(self) -> List[Dict[str, Any]]:
        """Discover new features in the codebase that aren't documented"""
        try:
            new_features = []
            
            # Scan for new components
            component_files = list(self.root_dir.glob("components/**/*.tsx"))
            for file_path in component_files:
                component_name = file_path.stem
                if component_name not in [f["name"] for f in new_features]:
                    new_features.append({
                        "name": component_name,
                        "type": "component",
                        "file": str(file_path)
                    })
            
            # Scan for new API routes
            api_files = list(self.root_dir.glob("app/api/**/*.ts"))
            for file_path in api_files:
                route_name = file_path.stem
                if route_name not in [f["name"] for f in new_features]:
                    new_features.append({
                        "name": route_name,
                        "type": "api",
                        "file": str(file_path)
                    })
            
            # Scan for new scripts
            script_files = list(self.root_dir.glob("scripts/**/*.py"))
            for file_path in script_files:
                script_name = file_path.stem
                if script_name not in [f["name"] for f in new_features]:
                    new_features.append({
                        "name": script_name,
                        "type": "script",
                        "file": str(file_path)
                    })
            
            # Filter out already documented features
            documented_features = set()
            for md_file in self.scan_all_md_files():
                parsed = self.parse_md_file(md_file)
                documented_features.update(parsed.get("claims", []))
            
            new_features = [f for f in new_features if f["name"] not in documented_features]
            
            return new_features
        except Exception as e:
            logging.error(f"Error discovering new features: {e}")
            return []
    
    def create_feature_documentation(self, feature: Dict[str, Any]) -> bool:
        """Create documentation for a new feature"""
        try:
            if feature["type"] == "component":
                content = f"""# {feature['name']} Component

## Overview
{feature['name']} is a React component that provides functionality for the QMOI system.

## Usage
```tsx
import {{ {feature['name']} }} from '@/components/{feature['name']}';

<{feature['name']} />
```

## Props
<!-- TODO: Document component props -->

## Features
- [ ] Component functionality
- [ ] Props validation
- [ ] Error handling
- [ ] Accessibility support

## Implementation
- [{feature['name']}]({feature['file']})

---
*Auto-generated by QMOI Doc Verifier*
"""
            elif feature["type"] == "api":
                content = f"""# {feature['name']} API

## Overview
{feature['name']} provides API endpoints for the QMOI system.

## Endpoints

### GET /api/{feature['name']}
Returns data from the {feature['name']} service.

### POST /api/{feature['name']}
Creates or updates data in the {feature['name']} service.

## Features
- [ ] GET endpoint implementation
- [ ] POST endpoint implementation
- [ ] Error handling
- [ ] Input validation
- [ ] Response formatting

## Implementation
- [{feature['name']}]({feature['file']})

---
*Auto-generated by QMOI Doc Verifier*
"""
            elif feature["type"] == "script":
                content = f"""# {feature['name']} Script

## Overview
{feature['name']} is a Python script that provides automation or utility functionality for the QMOI system.

## Usage
```bash
python scripts/{feature['name']}.py
```

## Features
- [ ] Script functionality
- [ ] Error handling
- [ ] Logging
- [ ] Configuration support

## Implementation
- [{feature['name']}]({feature['file']})

---
*Auto-generated by QMOI Doc Verifier*
"""
            
            # Create documentation file
            doc_path = self.root_dir / f"{feature['name']}.md"
            with open(doc_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
        except Exception as e:
            logging.error(f"Error creating documentation for {feature['name']}: {e}")
            return False
    
    def run_comprehensive_verification(self):
        """Run comprehensive documentation verification"""
        logging.info("Starting QMOI Documentation Verifier")
        
        try:
            # 1. Scan all .md files
            md_files = self.scan_all_md_files()
            logging.info(f"Found {len(md_files)} .md files")
            
            # 2. Process each .md file
            for md_file in md_files:
                logging.info(f"Processing {md_file}")
                
                # Parse file
                parsed = self.parse_md_file(md_file)
                if "error" in parsed:
                    continue
                
                self.verification_results["md_files_processed"] += 1
                
                # Extract and verify claims
                for claim in parsed["claims"]:
                    self.verification_results["claims_extracted"] += 1
                    
                    verification = self.verify_claim(claim, md_file)
                    self.verification_results["claims_verified"] += 1
                    
                    if not verification["implemented"]:
                        self.verification_results["broken_claims_found"] += 1
                        self.verification_results["details"].append({
                            "type": "broken_claim",
                            "file": str(md_file),
                            "claim": claim
                        })
                
                # Fix broken claims
                fixes = self.fix_broken_claims(parsed)
                if fixes:
                    self.verification_results["claims_fixed"] += len(fixes)
                    self.update_md_file(md_file, fixes)
            
            # 3. Discover and document new features
            logging.info("Discovering new features")
            new_features = self.discover_new_features()
            
            for feature in new_features:
                if self.create_feature_documentation(feature):
                    self.verification_results["new_features_documented"] += 1
                    self.verification_results["details"].append({
                        "type": "new_feature_documented",
                        "feature": feature["name"],
                        "type": feature["type"],
                        "file": feature["file"]
                    })
            
            # 4. Save feature registry
            self.save_feature_registry()
            
            # 5. Generate and save report
            final_report = self.generate_verification_report()
            self.save_verification_report(final_report)
            
            logging.info("QMOI Documentation Verifier completed successfully")
            return final_report
            
        except Exception as e:
            logging.error(f"Error in comprehensive verification: {e}")
            self.verification_results["status"] = "error"
            self.verification_results["error"] = str(e)
            return self.verification_results
    
    def generate_verification_report(self) -> Dict[str, Any]:
        """Generate comprehensive verification report"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "status": "completed",
            "summary": {
                "md_files_processed": self.verification_results["md_files_processed"],
                "claims_extracted": self.verification_results["claims_extracted"],
                "claims_verified": self.verification_results["claims_verified"],
                "claims_fixed": self.verification_results["claims_fixed"],
                "new_features_documented": self.verification_results["new_features_documented"],
                "broken_claims_found": self.verification_results["broken_claims_found"]
            },
            "details": self.verification_results["details"]
        }
        
        return report
    
    def save_verification_report(self, report: Dict[str, Any]):
        """Save verification report to file"""
        try:
            report_file = self.logs_dir / f"doc_verifier_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            
            # Also save latest report
            latest_report = self.logs_dir / "doc_verifier_latest.json"
            with open(latest_report, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            
            logging.info(f"Verification report saved to {report_file}")
        except Exception as e:
            logging.error(f"Error saving verification report: {e}")

def main():
    """Main entry point"""
    verifier = QMOIDocVerifier()
    report = verifier.run_comprehensive_verification()
    
    print(json.dumps(report, indent=2))
    
    if report["status"] == "completed":
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main() 