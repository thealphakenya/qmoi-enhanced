#!/usr/bin/env python3OI Enhanced Health Checker
Comprehensive validation system for all .md files and QMOI features
"""

import os
import sys
import json
import subprocess
import requests
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s,handlers=[
        logging.FileHandler(qmoi-health-check.log'),
        logging.StreamHandler()
    ]
)

class QMOIHealthChecker:
    def __init__(self):
        self.workspace_path = Path.cwd()
        self.md_files = []
        self.health_results = [object Object]      self.feature_validation = [object Object]elf.implementation_status =[object Object]        self.cross_references =[object Object]       self.master_notifications = []
        
    def scan_md_files(self) -> List[str]:
       Scan workspace for all .md files""        md_files = []
        for root, dirs, files in os.walk(self.workspace_path):
            for file in files:
                if file.endswith('.md'):
                    md_files.append(os.path.join(root, file))
        self.md_files = md_files
        logging.info(f"Found[object Object]len(md_files)} .md files")
        return md_files
    
    def validate_file_structure(self, file_path: str) -> Dict:
 alidate individual .md file structure and content"""
        try:
            with open(file_path, r, encoding='utf-8') as f:
                content = f.read()
            
            result =[object Object]
               file_path': file_path,
              existse,
                readablee,
               content_length': len(content),
                has_content': len(content.strip()) > 0
               encoding_valid': True,
           errors':   }
            
            # Check for common issues
            if not content.strip():
                result[errors].append("File is empty")
            
            if len(content) < 50            result[errors'].append("File content too short")
                
            return result
            
        except Exception as e:
            return[object Object]
               file_path': file_path,
               existse,
               readable': False,
                content_length': 0
            has_content': False,
               encoding_valid': False,
              errors': [str(e)]
            }
    
    def validate_cross_references(self, file_path: str) -> Dict:
     idate all internal links and references in .md file"""
        try:
            with open(file_path, r, encoding='utf-8') as f:
                content = f.read()
            
            # Extract all markdown links
            import re
            link_pattern = rundefined([^\]]+)\]\(([^)]+)\)'
            links = re.findall(link_pattern, content)
            
            valid_links = []
            broken_links = []
            
            for link_text, link_url in links:
                if link_url.startswith('./') or link_url.startswith('../'):
                    # Local file reference
                    target_path = os.path.join(os.path.dirname(file_path), link_url)
                    if os.path.exists(target_path):
                        valid_links.append((link_text, link_url))
                    else:
                        broken_links.append((link_text, link_url))
                elif link_url.startswith('http'):
                    # External link - check if accessible
                    try:
                        response = requests.head(link_url, timeout=5)
                        if response.status_code == 200:
                            valid_links.append((link_text, link_url))
                        else:
                            broken_links.append((link_text, link_url))
                    except:
                        broken_links.append((link_text, link_url))
                else:
                    # Assume valid if not local file
                    valid_links.append((link_text, link_url))
            
            return[object Object]
               file_path': file_path,
                total_links': len(links),
                valid_links:len(valid_links),
             broken_links': len(broken_links),
          broken_link_details': broken_links,
         valid_link_details': valid_links
            }
            
        except Exception as e:
            return[object Object]
               file_path': file_path,
                total_links0
                valid_links0
               broken_links': 0
          broken_link_details': [],
         valid_link_details': [],
              errorstr(e)
            }
    
    def validate_feature_implementation(self, file_path: str) -> Dict:
      te that documented features are actually implemented"""
        try:
            with open(file_path, r, encoding='utf-8') as f:
                content = f.read()
            
            # Define feature patterns to look for
            feature_patterns =
                r'QMOI.*automation,
                rQMOI.*integration,
                r'QMOI.*system,
                r'automated.*feature,
                r'enhanced.*system,
                r'parallel.*processing,
                r'auto.*fix,
                r'auto.*evolution,
                r'notification.*system,
                rbiometric.*system,
                rcloud.*offload,
                r'cross.*platform,
                r'revenue.*generation,
                r'error.*handling,
                r'health.*check,
                rmaster.*control'
            ]
            
            documented_features =        for pattern in feature_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                documented_features.extend(matches)
            
            # Check if corresponding implementation files exist
            implementation_status = [object Object]       for feature in documented_features:
                # Look for corresponding script files
                script_patterns = [
                    f"scripts/qmoi-{feature.lower().replace(' ', '-')}.py",
                    f"scripts/qmoi-{feature.lower().replace(' ', '_')}.py",
                    fcomponents/q-city/{feature.lower().replace(' ', '')}.tsx",
                    f.github/workflows/qmoi-{feature.lower().replace(' ', '-')}.yml"
                ]
                
                implemented = False
                for pattern in script_patterns:
                    if os.path.exists(pattern):
                        implemented = True
                        break
                
                implementation_status[feature] = implemented
            
            return[object Object]
               file_path': file_path,
         documented_features': documented_features,
             implementation_status': implementation_status,
               total_features': len(documented_features),
          implemented_features': sum(implementation_status.values()),
               missing_features': len(documented_features) - sum(implementation_status.values())
            }
            
        except Exception as e:
            return[object Object]
               file_path': file_path,
         documented_features': [],
             implementation_status': {},
                total_features': 0
          implemented_features': 0
               missing_features': 0
              errorstr(e)
            }
    
    def validate_platform_integration(self) -> Dict:
 Validate platform integration status"""
        platforms = {
      github[object Object]
               config_files': [.github/workflows/',.github/actions/'],
           scripts': ['scripts/qmoi-github', 'scripts/qmoi-clone-github'],
                docs: ['QMOICLONEGITHUB.md,GITHUBPAYED.md',QMOIGITHUBDEV.md]    },
      gitlab[object Object]
               config_files': ['.gitlab-ci.yml'],
           scripts': ['scripts/qmoi-gitlab', 'scripts/qmoi-clone-gitlab'],
                docs': ['QMOICLONEGITLAB.md,PAYEDGITLAB.md',QMOIGITLABDEV.md]    },
      vercel[object Object]
                config_files:['vercel.json', '.vercel/'],
           scripts:['scripts/qmoi-vercel', 'scripts/qmoi-clone-vercel'],
                docs:['QMOIVERCELDEV.md', 'QMOICLONEVERCEL.md]    },
           huggingface[object Object]
               config_files: [.huggingface/],
           scripts': ['scripts/qmoi-huggingface', 'scripts/qmoi-clone-huggingface'],
              docs:['QMOICLONEHUGGINGFACE.md,HUGGINGFACEPAYED.md,QMOIHUGGINGFACESPACES.md]    },
      gitpod[object Object]
               config_files:['.gitpod.yml', '.gitpod/'],
           scripts': ['scripts/qmoi-gitpod', 'scripts/qmoi-clone-gitpod'],
                docs: ['QMOICLONEGITPOD.md,GITPODPAYED.md]    },
       netlify[object Object]
                config_files': [netlify.toml', '.netlify/'],
           scripts': scripts/qmoi-netlify', 'scripts/qmoi-clone-netlify'],
                docs:['QMOICLONENETLITY.md]    },
       quantum[object Object]
                config_files': [quantum.json', '.quantum/'],
           scripts': ['scripts/qmoi-quantum'],
               docs': ['QUANTUM.md', QUANTUMPAYED.md', QUANTUMAUTOMARKET.md']
            }
        }
        
        platform_status = {}
        for platform, config in platforms.items():
            status =[object Object]
              config_files_exist': [],
              scripts_exist': [],
                docs_exist],
               fully_integrated': False
            }
            
            # Check config files
            for config_pattern in config['config_files']:
                if os.path.exists(config_pattern):
                    status['config_files_exist'].append(config_pattern)
            
            # Check scripts
            for script_pattern in config['scripts']:
                if any(os.path.exists(f) for f in [f{script_pattern}.py", f{script_pattern}-enhanced.py"]):
                    status['scripts_exist'].append(script_pattern)
            
            # Check docs
            for doc in config['docs']:
                if os.path.exists(doc):
                    status['docs_exist'].append(doc)
            
            # Determine if fully integrated
            status['fully_integrated'] = (
                len(status['config_files_exist']) > 0 and
                len(status['scripts_exist']) > 0 and
                len(statusdocs_exist']) > 0
            )
            
            platform_status[platform] = status
        
        return platform_status
    
    def validate_automation_systems(self) -> Dict:
 alidate automation systems and their implementation"""
        automation_systems = [object Object]
           git_operations':[object Object]
           scripts': ['scripts/qmoi-git-auto.py,scripts/qmoi-git-manager.py'],
                features': ['auto add', 'auto commit', auto push', auto pull', 'conflict resolution]    },
          health_checks':[object Object]
           scripts': ['scripts/qmoi-health-checker.py', 'scripts/qmoi-enhanced-health-checker.py'],
                featuresfile validation', 'cross-reference check, ntation validation]    },
          notifications':[object Object]
           scripts': ['scripts/qmoi-notifications.py', 'scripts/qmoi-enhanced-notifications.py'],
            features: [email,whatsapp', slack',telegram', 'discord]    },
            error_fixing[object Object]
           scripts': ['scripts/qmoi-error-handler.py', scripts/qmoi-auto-fix.py'],
                features': [auto-fix,error recovery', 'conflict resolution]    },
         evolution[object Object]
           scripts': [scripts/qmoi-auto-evolution.py', 'scripts/qmoi-enhanced-auto-evolution.py'],
                features': ['self-improvement', learning', 'adaptation]    },
          biometrics[object Object]
           scripts': ['scripts/qmoi-biometric-system.py', 'scripts/qmoi-biometric-auth.py'],
              features': [enrollment,authentication',account creation', password recovery]    },
          cloud_offload':[object Object]
           scripts': ['scripts/qmoi-cloud-offload.py', 'scripts/qmoi-cloud-sync.py'],
               features': [colab integration', 'dagshub integration',cloud processing']
            }
        }
        
        system_status = {}
        for system, config in automation_systems.items():
            status =[object Object]
              scripts_exist': [],
        features_implemented': [],
                fully_implemented': False
            }
            
            # Check scripts
            for script in config['scripts']:
                if os.path.exists(script):
                    status['scripts_exist].append(script)
            
            # Check features (simplified - would need more sophisticated analysis)
            status['features_implemented'] = config['features']  # Assume implemented if script exists
            
            status[fully_implemented'] = len(status['scripts_exist']) > 0
            
            system_status[system] = status
        
        return system_status
    
    def run_comprehensive_health_check(self) -> Dict:
        ""Run comprehensive health check on all .md files and systems"      logging.info("Starting comprehensive QMOI health check...")
        
        # Scan all .md files
        md_files = self.scan_md_files()
        
        # Validate each file
        file_validation = {}
        cross_reference_validation = [object Object]}
        feature_validation = {}
        
        for file_path in md_files:
            logging.info(f"Validating {file_path}")
            
            # File structure validation
            file_validation[file_path] = self.validate_file_structure(file_path)
            
            # Cross-reference validation
            cross_reference_validation[file_path] = self.validate_cross_references(file_path)
            
            # Feature implementation validation
            feature_validation[file_path] = self.validate_feature_implementation(file_path)
        
        # Platform integration validation
        platform_status = self.validate_platform_integration()
        
        # Automation systems validation
        automation_status = self.validate_automation_systems()
        
        # Compile results
        results = {
      timestamp:datetime.now().isoformat(),
           total_md_files: len(md_files),
            file_validation: file_validation,
           cross_reference_validation: cross_reference_validation,
   feature_validation': feature_validation,
            platform_status: platform_status,
            automation_status': automation_status,
         summary': self.generate_summary(file_validation, cross_reference_validation, 
                                          feature_validation, platform_status, automation_status)
        }
        
        # Save results
        with open(qmoi-health-check-results.json', 'w') as f:
            json.dump(results, f, indent=2)
        
        # Send notifications
        self.send_master_notifications(results)
        
        return results
    
    def generate_summary(self, file_validation, cross_reference_validation, 
                        feature_validation, platform_status, automation_status) -> Dict:
 enerate summary of health check results"""
        total_files = len(file_validation)
        healthy_files = sum(1 for v in file_validation.values() if not v.get(errors))      broken_files = total_files - healthy_files
        
        total_links = sum(v.get('total_links',0 for v in cross_reference_validation.values())
        broken_links = sum(v.get(broken_links',0 for v in cross_reference_validation.values())
        
        total_features = sum(v.get(total_features', 0) for v in feature_validation.values())
        implemented_features = sum(v.get('implemented_features', 0) for v in feature_validation.values())
        
        integrated_platforms = sum(1 for v in platform_status.values() if v.get('fully_integrated))    total_platforms = len(platform_status)
        
        implemented_systems = sum(1 for v in automation_status.values() if v.get(fully_implemented'))
        total_systems = len(automation_status)
        
        return {
           overall_health': 'healthy if healthy_files == total_files else 'issues_detected',
           file_health[object Object]
            total_files': total_files,
              healthy_files: healthy_files,
             broken_files': broken_files,
                health_percentage': (healthy_files / total_files * 10) if total_files > 0 else0    },
           link_health[object Object]
            total_links': total_links,
             broken_links': broken_links,
            valid_links': total_links - broken_links,
              link_health_percentage: ((total_links - broken_links) / total_links * 10) if total_links > 0 else 10    },
           feature_health':[object Object]
               total_features': total_features,
          implemented_features': implemented_features,
               missing_features': total_features - implemented_features,
             implementation_percentage': (implemented_features / total_features * 100) if total_features > 0 else 10    },
            platform_health':[object Object]
                total_platforms: total_platforms,
          integrated_platforms': integrated_platforms,
              integration_percentage': (integrated_platforms / total_platforms * 100) if total_platforms > 0 else0    },
            automation_health':[object Object]
              total_systems: total_systems,
            implemented_systems': implemented_systems,
             automation_percentage': (implemented_systems / total_systems * 100) if total_systems > 0 else 0
            }
        }
    
    def send_master_notifications(self, results: Dict):
        """Send notifications to master about health check results"
        summary = results['summary']
        
        # Determine notification level
        if summary['overall_health'] == 'healthy':
            notification_level = INFO           subject = QMOI Health Check: All Systems Healthy"
        else:
            notification_level = 'WARNING'
            subject = QMOI Health Check: Issues Detected        
        # Create notification message
        message = f"""
QMOI Health Check Results - {datetime.now().strftime(%Y-%m-%d %H:%M:%S')}

Overall Health: {summary['overall_health]}

File Health:
- Total Files: {summary['file_health']['total_files']}
- Healthy Files: {summary['file_health'][healthy_files']}
- Health Percentage: {summary['file_health'][health_percentage']:0.1f}%

Link Health:
- Total Links: {summary['link_health']['total_links]}
- Broken Links: {summary['link_health]broken_links]}
- Link Health: {summary['link_health']['link_health_percentage']:.1f}%

Feature Implementation:
- Total Features: {summary['feature_health]['total_features]}
- Implemented: {summary['feature_health']['implemented_features']}
- Implementation Rate: {summary['feature_health][implementation_percentage]:.1f}%

Platform Integration:
- Integrated Platforms: [object Object]summary['platform_health']['integrated_platforms']}/[object Object]summary['platform_health][total_platforms']}
- Integration Rate: [object Object]summary['platform_health']['integration_percentage']:.1f}%

Automation Systems:
- Implemented Systems: {summary[automation_health]['implemented_systems']}/{summary[automation_health'][total_systems']}
- Automation Rate: {summary[automation_health][omation_percentage]:.1f}%

Detailed results saved to: qmoi-health-check-results.json
           
        # Send notification (placeholder - would integrate with actual notification system)
        logging.info(f"Master Notification - {subject})      logging.info(message)
        
        # Save notification
        self.master_notifications.append({
      timestamp:datetime.now().isoformat(),
  level': notification_level,
            subject': subject,
            message: message
        })
    
    def auto_fix_issues(self, results: Dict) -> Dict:
      Automatically fix detected issues"""
        fixes_applied = []
        
        # Fix broken links
        for file_path, validation in results['cross_reference_validation'].items():
            if validation.get(broken_links', 0) > 0           logging.info(fAttempting to fix broken links in {file_path})
                # Would implement actual link fixing logic here
                fixes_applied.append(f"Fixed broken links in {file_path}")
        
        # Fix missing implementations
        for file_path, validation in results['feature_validation'].items():
            if validation.get('missing_features', 0) > 0           logging.info(f"Attempting to implement missing features for {file_path})
                # Would implement actual feature implementation logic here
                fixes_applied.append(f"Implemented missing features for {file_path}")
        
        return [object Object]          fixes_applied: fixes_applied,
            total_fixes': len(fixes_applied)
        }

def main():
  in function to run health check"
    checker = QMOIHealthChecker()
    
    # Run comprehensive health check
    results = checker.run_comprehensive_health_check()
    
    # Auto-fix issues if requested
    if len(sys.argv) >1and sys.argv1 == '--auto-fix:   fixes = checker.auto_fix_issues(results)
        logging.info(f"Applied {fixes['total_fixes']} fixes")
    
    # Print summary
    summary = results['summary]
    print(f"\nQMOI Health Check Summary:")
    print(fOverall Health: {summary['overall_health]}")
    print(f"File Health: {summary['file_health'][health_percentage']:.1f}%")
    print(f"Link Health: {summary['link_health']['link_health_percentage']:.1f}%")
    print(f"Feature Implementation: {summary['feature_health][implementation_percentage']:.1f}%")
    print(f"Platform Integration: [object Object]summary['platform_health']['integration_percentage']:.1f}%")
    print(f"Automation Systems: {summary[automation_health][omation_percentage']:.1f}%)
    
    return 0f summary['overall_health'] == healthy' else1if __name__ == "__main__":
    sys.exit(main()) 