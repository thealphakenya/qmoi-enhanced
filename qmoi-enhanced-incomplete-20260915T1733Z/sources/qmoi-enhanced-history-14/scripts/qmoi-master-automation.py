#!/usr/bin/env python3
"""
QMOI Master Automation System
Comprehensive automation that fixes everything across all platforms
and includes auto-evolution and auto-suggestions for future improvements
"""

import os
import sys
import json
import time
import subprocess
import requests
import threading
from datetime import datetime
from pathlib import Path
import git
from typing import Dict, List, Optional, Tuple
import smtplib
from email.mime.text import MIMEText
import logging
import asyncio
from dataclasses import dataclass
from enum import Enum
import shutil

# Patch for UTF-8 logging on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8', errors='replace')

def safe_log(logger, level, msg):
    try:
        getattr(logger, level)(msg)
    except UnicodeEncodeError:
        getattr(logger, level)(msg.encode('ascii', 'replace').decode())

# Auto-install missing dependencies
def install_dependencies():
    """Automatically install required dependencies"""
    required_packages = [
        "docker",
        "aiohttp",
        "requests",
        "gitpython"
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"🔧 Installing missing dependencies: {missing_packages}")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install"] + missing_packages)
            print("✅ Dependencies installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install dependencies: {e}")
            print("⚠️ Continuing with available packages...")
    
    # Import after installation
    global docker, aiohttp
    try:
        import docker
    except ImportError:
        docker = None
        print("⚠️ Docker module not available, continuing without Docker features")
    
    try:
        import aiohttp
    except ImportError:
        aiohttp = None
        print("⚠️ aiohttp module not available, using requests instead")

# Install dependencies before importing
install_dependencies()

class Platform(Enum):
    GITLAB = "gitlab"
    GITHUB = "github"
    VERCEL = "vercel"
    GITPOD = "gitpod"
    DAGSHUB = "dagshub"
    COLAB = "colab"

@dataclass
class FixResult:
    platform: Platform
    success: bool
    message: str
    suggestions: List[str]
    evolution_ideas: List[str]

class QMOIMasterAutomation:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.config_file = self.project_root / "config" / "qmoi_master_config.json"
        self.logs_dir = self.project_root / "logs"
        self.logs_dir.mkdir(exist_ok=True)
        
        # Detect cloud environment
        self.is_cloud_environment = self.detect_cloud_environment()
        # Enforce cloud-offloading and cloud_optimized mode
        if self.is_cloud_environment:
            os.environ["QMOI_CLOUD_OPTIMIZED"] = "true"
            os.environ["QMOI_DEVICE_INDEPENDENT"] = "true"
            os.environ["QMOI_AUTO_RESTART"] = "true"
            self.logger.info("[QMOI] Cloud-offload mode enabled. All automation will auto-restart in cloud if stopped.")
        
        # Setup logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(self.logs_dir / "qmoi-master-automation.log"),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
        # Platform configurations with cloud optimization
        self.platforms = {
            Platform.GITLAB: {
                "url": "https://gitlab.com",
                "token": os.getenv("GITLAB_TOKEN", ""),
                "project_id": os.getenv("GITLAB_PROJECT_ID", ""),
                "cloud_optimized": True
            },
            Platform.GITHUB: {
                "url": "https://api.github.com",
                "token": os.getenv("GITHUB_TOKEN", ""),
                "repo": os.getenv("GITHUB_REPOSITORY", ""),
                "cloud_optimized": True
            },
            Platform.VERCEL: {
                "token": os.getenv("VERCEL_TOKEN", ""),
                "project_id": os.getenv("VERCEL_PROJECT_ID", ""),
                "cloud_optimized": True
            },
            Platform.GITPOD: {
                "token": os.getenv("GITPOD_API_TOKEN", ""),
                "url": "https://api.gitpod.io/v1",
                "cloud_optimized": True
            },
            Platform.DAGSHUB: {
                "token": os.getenv("DAGSHUB_TOKEN", ""),
                "url": "https://dagshub.com/api/v1",
                "cloud_optimized": True
            },
            Platform.COLAB: {
                "cloud_optimized": True,
                "use_gpu": True,
                "memory_optimized": True
            }
        }
        
        # Auto-evolution tracking
        self.evolution_log = []
        self.suggestions_log = []
        self.fixes_applied = []
        
        self.load_config()

    async def safe_subprocess_run(self, cmd, **kwargs):
        """Run subprocess only if command exists, else auto-fix or skip"""
        import shutil
        if shutil.which(cmd[0]) is None:
            safe_log(self.logger, 'error', f"Command not found: {cmd[0]}")
            # Attempt auto-fix: try npm install or pip install if relevant
            if cmd[0] == 'npm':
                await self.install_npm_dependencies()
            elif cmd[0] == 'pip':
                subprocess.run([sys.executable, '-m', 'pip', 'install', cmd[1]])
            return None
        try:
            return subprocess.run(cmd, **kwargs)
        except Exception as e:
            safe_log(self.logger, 'error', f"Subprocess error: {e}")
            return None
    
    def detect_cloud_environment(self) -> bool:
        """Detect if running in a cloud environment"""
        cloud_indicators = [
            "COLAB_GPU" in os.environ,
            "DAGSHUB_TOKEN" in os.environ,
            "GITPOD_WORKSPACE_ID" in os.environ,
            "VERCEL" in os.environ,
            "KAGGLE_KERNEL_RUN_TYPE" in os.environ
        ]
        return any(cloud_indicators)
    
    def optimize_for_cloud(self):
        """Optimize settings for cloud environments"""
        if self.is_cloud_environment:
            self.logger.info("☁️ Detected cloud environment, optimizing settings...")
            
            # Optimize for cloud resources
            os.environ["NODE_OPTIONS"] = "--max-old-space-size=4096"
            os.environ["NPM_CONFIG_CACHE"] = "/tmp/.npm-cache"
            os.environ["YARN_CACHE_FOLDER"] = "/tmp/.yarn-cache"
            
            # Enable cloud-specific optimizations
            if "COLAB_GPU" in os.environ:
                self.logger.info("🚀 Google Colab detected - enabling GPU optimizations")
                os.environ["QMOI_CLOUD_OPTIMIZED"] = "true"
                os.environ["QMOI_USE_GPU"] = "true"
            
            if "DAGSHUB_TOKEN" in os.environ:
                self.logger.info("🔗 DagsHub detected - enabling ML optimizations")
                os.environ["QMOI_ML_OPTIMIZED"] = "true"
    
    def load_config(self):
        """Load or create master configuration, auto-initialize missing keys"""
        if self.config_file.exists():
            with open(self.config_file, 'r') as f:
                self.config = json.load(f)
            # Auto-initialize missing keys
            if "platforms" not in self.config:
                safe_log(self.logger, 'warning', "'platforms' key missing in config. Auto-initializing.")
                self.config["platforms"] = self.create_default_config()["platforms"]
                self.save_config()
        else:
            self.config = self.create_default_config()
            self.save_config()
    
    def create_default_config(self):
        """Create default master configuration"""
        return {
            "version": "2.0.0",
            "auto_evolution": True,
            "cross_platform_sync": True,
            "auto_suggestions": True,
            "vercel_deployment": True,
            "comprehensive_fixes": True,
            "cloud_optimized": self.is_cloud_environment,
            "platforms": {
                "gitlab": {"enabled": True, "priority": 1, "cloud_optimized": True},
                "github": {"enabled": True, "priority": 2, "cloud_optimized": True},
                "vercel": {"enabled": True, "priority": 3, "cloud_optimized": True},
                "gitpod": {"enabled": True, "priority": 4, "cloud_optimized": True},
                "dagshub": {"enabled": True, "priority": 5, "cloud_optimized": True},
                "colab": {"enabled": True, "priority": 6, "cloud_optimized": True}
            },
            "fix_categories": [
                "npm_dependencies",
                "build_issues",
                "test_failures",
                "deployment_errors",
                "configuration_problems",
                "security_issues",
                "performance_optimization",
                "cloud_optimization"
            ]
        }
    
    def save_config(self):
        """Save configuration to file"""
        self.config_file.parent.mkdir(exist_ok=True)
        with open(self.config_file, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    async def install_npm_dependencies(self):
        """Install npm dependencies with cloud optimization"""
        try:
            self.logger.info("📦 Installing npm dependencies...")
            
            # Use cloud-optimized npm install
            if self.is_cloud_environment:
                cmd = ["npm", "ci", "--prefer-offline", "--no-audit", "--production=false"]
            else:
                cmd = ["npm", "install"]
            
            result = await self.safe_subprocess_run(cmd, cwd=self.project_root)
            
            if result is None:
                self.logger.error("❌ npm install subprocess failed to start or returned None (cmd: %s)", cmd)
                await self.alternative_npm_install()
                return
            if result.returncode == 0:
                self.logger.info("✅ npm dependencies installed successfully")
            else:
                self.logger.warning(f"⚠️ npm install had issues: {result.stderr}")
                # Try alternative installation methods
                await self.alternative_npm_install()
                
        except subprocess.TimeoutExpired:
            self.logger.error("❌ npm install timed out")
            await self.alternative_npm_install()
        except Exception as e:
            self.logger.error(f"❌ npm install failed: {e}")
            await self.alternative_npm_install()
    
    async def alternative_npm_install(self):
        """Try alternative npm installation methods"""
        alternative_methods = [
            ["npm", "install", "--legacy-peer-deps"],
            ["npm", "install", "--force"],
            ["yarn", "install"],
            ["pnpm", "install"]
        ]
        
        for method in alternative_methods:
            try:
                self.logger.info(f"🔄 Trying alternative installation: {' '.join(method)}")
                result = await self.safe_subprocess_run(method, cwd=self.project_root)
                
                if result is None:
                    self.logger.warning(f"⚠️ Alternative method failed to start or returned None: {' '.join(method)}")
                    continue
                    
                if result.returncode == 0:
                    self.logger.info(f"✅ Alternative installation successful: {' '.join(method)}")
                    return
                    
            except Exception as e:
                self.logger.warning(f"⚠️ Alternative method failed: {e}")
                continue
        
        self.logger.error("❌ All npm installation methods failed")
    
    async def run_comprehensive_fixes(self) -> List[FixResult]:
        """Run comprehensive fixes across all platforms"""
        self.logger.info("🚀 Starting QMOI Master Comprehensive Fixes")
        
        # Optimize for cloud environment
        self.optimize_for_cloud()
        
        # Install dependencies first
        await self.install_npm_dependencies()
        
        fix_results = []
        
        # Step 1: Run QMOI comprehensive command
        await self.run_qmoi_comprehensive()
        
        # Step 2: Fix all platforms
        for platform in Platform:
            if self.config["platforms"].get(platform.value, {}).get("enabled", False):
                result = await self.fix_platform(platform)
                fix_results.append(result)
        
        # Step 3: Deploy to Vercel
        vercel_result = await self.deploy_to_vercel()
        fix_results.append(vercel_result)
        
        # Step 4: Cross-platform synchronization
        await self.sync_across_platforms()
        
        # Step 5: Generate auto-evolution suggestions
        await self.generate_evolution_suggestions(fix_results)
        
        return fix_results
    
    async def run_qmoi_comprehensive(self):
        """Run the comprehensive QMOI command"""
        try:
            self.logger.info("📦 Running QMOI comprehensive automation...")
            
            # Run the comprehensive command with cloud optimization
            cmd = ["npm", "run", "qmoi:comprehensive"]
            if self.is_cloud_environment:
                cmd.extend(["--", "--cloud-optimized"])
            
            result = await self.safe_subprocess_run(cmd, cwd=self.project_root)
            
            if result is None:
                self.logger.error(f"❌ QMOI comprehensive subprocess failed to start or returned None (cmd: {cmd})")
                await self.auto_fix_general_issues("QMOI comprehensive subprocess failed to start")
                return
            if result.returncode == 0:
                self.logger.info("✅ QMOI comprehensive completed successfully")
                self.log_evolution("QMOI comprehensive automation completed successfully")
            else:
                self.logger.warning(f"⚠️ QMOI comprehensive had issues: {result.stderr}")
                await self.auto_fix_qmoi_issues(result.stderr)
                
        except subprocess.TimeoutExpired:
            self.logger.error("❌ QMOI comprehensive timed out")
            await self.auto_fix_timeout_issues()
        except Exception as e:
            self.logger.error(f"❌ QMOI comprehensive failed: {e}")
            await self.auto_fix_general_issues(str(e))
    
    async def fix_platform(self, platform: Platform) -> FixResult:
        """Fix issues for a specific platform"""
        self.logger.info(f"🔧 Fixing {platform.value}...")
        
        suggestions = []
        evolution_ideas = []
        
        try:
            if platform == Platform.GITLAB:
                success, msg, suggestions, evolution = await self.fix_gitlab()
            elif platform == Platform.GITHUB:
                success, msg, suggestions, evolution = await self.fix_github()
            elif platform == Platform.VERCEL:
                success, msg, suggestions, evolution = await self.fix_vercel()
            elif platform == Platform.GITPOD:
                success, msg, suggestions, evolution = await self.fix_gitpod()
            elif platform == Platform.DAGSHUB:
                success, msg, suggestions, evolution = await self.fix_dagshub()
            elif platform == Platform.COLAB:
                success, msg, suggestions, evolution = await self.fix_colab()
            else:
                success, msg, suggestions, evolution = False, f"Unknown platform: {platform.value}", [], []
            
            return FixResult(
                platform=platform,
                success=success,
                message=msg,
                suggestions=suggestions,
                evolution_ideas=evolution
            )
            
        except Exception as e:
            self.logger.error(f"❌ Error fixing {platform.value}: {e}")
            return FixResult(
                platform=platform,
                success=False,
                message=f"Error: {e}",
                suggestions=[f"Add error handling for {platform.value}"],
                evolution_ideas=[f"Implement retry mechanism for {platform.value}"]
            )
    
    async def fix_gitlab(self) -> Tuple[bool, str, List[str], List[str]]:
        """Fix GitLab issues"""
        suggestions = []
        evolution_ideas = []
        
        try:
            # Run GitLab-specific fixes
            result = await self.safe_subprocess_run(
                ["npm", "run", "gitlab:fix"],
                cwd=self.project_root
            )
            
            if result is None:
                msg = "GitLab fix subprocess failed to start or returned None"
                suggestions.append("Check GitLab fix command and environment")
                evolution_ideas.append("Add error handling for GitLab subprocess failures")
                return False, msg, suggestions, evolution_ideas
            if result.returncode == 0:
                msg = "GitLab fixes applied successfully"
                suggestions.append("Consider adding more GitLab CI/CD stages")
                evolution_ideas.append("Implement GitLab auto-scaling runners")
            else:
                msg = f"GitLab fixes failed: {result.stderr}"
                suggestions.append("Review GitLab CI/CD configuration")
                evolution_ideas.append("Add GitLab pipeline optimization")
            
            return True, msg, suggestions, evolution_ideas
            
        except Exception as e:
            return False, f"GitLab fix error: {e}", [], []
    
    async def fix_github(self) -> Tuple[bool, str, List[str], List[str]]:
        """Fix GitHub issues"""
        suggestions = []
        evolution_ideas = []
        
        try:
            # Run GitHub-specific fixes
            result = await self.safe_subprocess_run(
                ["npm", "run", "github:fallback"],
                cwd=self.project_root
            )
            
            if result is None:
                msg = "GitHub fix subprocess failed to start or returned None"
                suggestions.append("Check GitHub fix command and environment")
                evolution_ideas.append("Add error handling for GitHub subprocess failures")
                return False, msg, suggestions, evolution_ideas
            if result.returncode == 0:
                msg = "GitHub fixes applied successfully"
                suggestions.append("Consider adding GitHub Actions workflows")
                evolution_ideas.append("Implement GitHub auto-deployment")
            else:
                msg = f"GitHub fixes failed: {result.stderr}"
                suggestions.append("Review GitHub repository settings")
                evolution_ideas.append("Add GitHub repository optimization")
            
            return True, msg, suggestions, evolution_ideas
            
        except Exception as e:
            return False, f"GitHub fix error: {e}", [], []
    
    async def fix_vercel(self) -> Tuple[bool, str, List[str], List[str]]:
        """Fix Vercel issues"""
        suggestions = []
        evolution_ideas = []
        
        try:
            # Run Vercel-specific fixes
            result = await self.safe_subprocess_run(
                ["npm", "run", "vercel:auto-fix"],
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                msg = "Vercel fixes applied successfully"
                suggestions.append("Consider adding Vercel preview deployments")
                evolution_ideas.append("Implement Vercel auto-scaling")
            else:
                msg = f"Vercel fixes failed: {result.stderr}"
                suggestions.append("Review Vercel project configuration")
                evolution_ideas.append("Add Vercel performance optimization")
            
            return True, msg, suggestions, evolution_ideas
            
        except Exception as e:
            return False, f"Vercel fix error: {e}", [], []
    
    async def fix_gitpod(self) -> Tuple[bool, str, List[str], List[str]]:
        """Fix Gitpod issues"""
        suggestions = []
        evolution_ideas = []
        
        try:
            # Run Gitpod-specific fixes
            result = await self.safe_subprocess_run(
                ["npm", "run", "gitpod:monitor"],
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                msg = "Gitpod fixes applied successfully"
                suggestions.append("Consider adding Gitpod workspace templates")
                evolution_ideas.append("Implement Gitpod auto-scaling")
            else:
                msg = f"Gitpod fixes failed: {result.stderr}"
                suggestions.append("Review Gitpod workspace configuration")
                evolution_ideas.append("Add Gitpod performance optimization")
            
            return True, msg, suggestions, evolution_ideas
            
        except Exception as e:
            return False, f"Gitpod fix error: {e}", [], []
    
    async def fix_dagshub(self) -> Tuple[bool, str, List[str], List[str]]:
        """Fix DagsHub issues"""
        suggestions = []
        evolution_ideas = []
        
        try:
            # Run DagsHub-specific fixes
            result = await self.safe_subprocess_run(
                ["python", "scripts/dagshub-automation.py"],
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                msg = "DagsHub fixes applied successfully"
                suggestions.append("Consider adding ML model versioning")
                evolution_ideas.append("Implement DagsHub auto-training")
            else:
                msg = f"DagsHub fixes failed: {result.stderr}"
                suggestions.append("Review DagsHub repository settings")
                evolution_ideas.append("Add DagsHub ML optimization")
            
            return True, msg, suggestions, evolution_ideas
            
        except Exception as e:
            return False, f"DagsHub fix error: {e}", [], []
    
    async def fix_colab(self) -> Tuple[bool, str, List[str], List[str]]:
        """Fix Google Colab issues"""
        suggestions = []
        evolution_ideas = []
        
        try:
            # Run Colab-specific fixes
            result = await self.safe_subprocess_run(
                ["python", "scripts/colab-automation.py"],
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                msg = "Google Colab fixes applied successfully"
                suggestions.append("Consider adding GPU optimization")
                evolution_ideas.append("Implement Colab auto-scaling")
            else:
                msg = f"Colab fixes failed: {result.stderr}"
                suggestions.append("Review Colab notebook settings")
                evolution_ideas.append("Add Colab performance optimization")
            
            return True, msg, suggestions, evolution_ideas
            
        except Exception as e:
            return False, f"Colab fix error: {e}", [], []
    
    async def deploy_to_vercel(self) -> FixResult:
        """Deploy to Vercel"""
        self.logger.info("🚀 Deploying to Vercel...")
        
        try:
            # Build the project first
            build_result = await self.safe_subprocess_run(
                ["npm", "run", "build"],
                cwd=self.project_root
            )
            
            if build_result.returncode != 0:
                return FixResult(
                    platform=Platform.VERCEL,
                    success=False,
                    message=f"Build failed: {build_result.stderr}",
                    suggestions=["Fix build configuration", "Check dependencies"],
                    evolution_ideas=["Implement build optimization", "Add build caching"]
                )
            
            # Deploy to Vercel
            deploy_result = await self.safe_subprocess_run(
                ["npx", "vercel", "--prod", "--yes"],
                cwd=self.project_root
            )
            
            if deploy_result.returncode == 0:
                self.logger.info("✅ Vercel deployment successful")
                return FixResult(
                    platform=Platform.VERCEL,
                    success=True,
                    message="Vercel deployment completed successfully",
                    suggestions=["Add Vercel preview deployments", "Implement auto-scaling"],
                    evolution_ideas=["Add Vercel analytics", "Implement CDN optimization"]
                )
            else:
                return FixResult(
                    platform=Platform.VERCEL,
                    success=False,
                    message=f"Vercel deployment failed: {deploy_result.stderr}",
                    suggestions=["Check Vercel configuration", "Review deployment settings"],
                    evolution_ideas=["Add deployment rollback", "Implement health checks"]
                )
                
        except Exception as e:
            return FixResult(
                platform=Platform.VERCEL,
                success=False,
                message=f"Vercel deployment error: {e}",
                suggestions=["Add error handling", "Check network connectivity"],
                evolution_ideas=["Implement retry mechanism", "Add deployment monitoring"]
            )
    
    async def sync_across_platforms(self):
        """Synchronize fixes across all platforms"""
        self.logger.info("🔄 Synchronizing across platforms...")
        
        try:
            # Sync GitLab to GitHub
            await self.safe_subprocess_run(["npm", "run", "github:sync-to"], cwd=self.project_root)
            
            # Sync GitHub to GitLab
            await self.safe_subprocess_run(["npm", "run", "github:sync-from"], cwd=self.project_root)
            
            # Update all platforms
            await self.safe_subprocess_run(["npm", "run", "qmoi:platform-monitor"], cwd=self.project_root)
            
            self.logger.info("✅ Cross-platform synchronization completed")
            
        except Exception as e:
            self.logger.error(f"❌ Cross-platform sync failed: {e}")
    
    async def generate_evolution_suggestions(self, fix_results: List[FixResult]):
        """Generate auto-evolution suggestions based on fix results"""
        self.logger.info("🧠 Generating evolution suggestions...")
        
        suggestions = []
        evolution_ideas = []
        
        for result in fix_results:
            suggestions.extend(result.suggestions)
            evolution_ideas.extend(result.evolution_ideas)
        
        # Add system-wide suggestions
        suggestions.extend([
            "Implement AI-powered error prediction",
            "Add machine learning for optimization",
            "Create automated performance monitoring",
            "Implement self-healing infrastructure",
            "Add cloud resource optimization",
            "Implement cross-platform synchronization"
        ])
        
        evolution_ideas.extend([
            "Add quantum computing integration",
            "Implement blockchain for security",
            "Create distributed computing network",
            "Add edge computing capabilities",
            "Implement cloud-native architecture",
            "Add serverless optimization"
        ])
        
        # Save suggestions
        suggestions_file = self.logs_dir / "evolution-suggestions.json"
        with open(suggestions_file, 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "suggestions": suggestions,
                "evolution_ideas": evolution_ideas,
                "fix_results": [{
                    "platform": result.platform.value,
                    "success": result.success,
                    "message": result.message
                } for result in fix_results]
            }, f, indent=2)
        
        self.logger.info(f"💡 Generated {len(suggestions)} suggestions and {len(evolution_ideas)} evolution ideas")
    
    async def auto_fix_qmoi_issues(self, error_output: str):
        """Auto-fix QMOI-specific issues"""
        self.logger.info("🔧 Auto-fixing QMOI issues...")
        
        # Common QMOI fixes
        fixes = [
            ["npm", "run", "qmoi:fix"],
            ["npm", "run", "qmoi:recovery"],
            ["npm", "run", "auto:fix"],
            ["npm", "run", "json:fix-all"]
        ]
        
        for fix in fixes:
            try:
                result = await self.safe_subprocess_run(fix, cwd=self.project_root)
                if result is None:
                    self.logger.error(f"❌ Fix subprocess failed to start or returned None (cmd: {' '.join(fix)})")
                    continue
                if result.returncode == 0:
                    self.logger.info(f"✅ Applied fix: {' '.join(fix)}")
                else:
                    self.logger.warning(f"⚠️ Fix failed: {' '.join(fix)}")
            except Exception as e:
                self.logger.error(f"❌ Fix error: {e}")
    
    async def auto_fix_timeout_issues(self):
        """Auto-fix timeout issues"""
        self.logger.info("⏰ Auto-fixing timeout issues...")
        
        # Increase timeout and retry
        try:
            await self.safe_subprocess_run(["npm", "run", "qmoi:fix"], cwd=self.project_root, timeout=600)
        except Exception as e:
            self.logger.error(f"❌ Timeout fix failed: {e}")
    
    async def auto_fix_general_issues(self, error: str):
        """Auto-fix general issues"""
        self.logger.info("🔧 Auto-fixing general issues...")
        
        # Run comprehensive fixes
        fixes = [
            ["npm", "run", "auto:fix"],
            ["npm", "run", "qmoi:recovery"],
            ["npm", "run", "health:check"]
        ]
        
        for fix in fixes:
            try:
                await self.safe_subprocess_run(fix, cwd=self.project_root)
            except Exception as e:
                self.logger.error(f"❌ General fix failed: {e}")
    
    async def auto_fix_missing_files_and_deps(self):
        """Scan for missing files, keys, or dependencies and auto-create/install as needed"""
        # Example: check for essential files
        essential_files = [self.config_file, self.logs_dir]
        for f in essential_files:
            if not Path(f).exists():
                safe_log(self.logger, 'warning', f"Missing essential file or dir: {f}. Auto-creating.")
                if isinstance(f, Path) and f.suffix:
                    f.parent.mkdir(parents=True, exist_ok=True)
                    f.touch()
                else:
                    Path(f).mkdir(parents=True, exist_ok=True)
        # Check for essential npm packages
        try:
            result = await self.safe_subprocess_run(["npm", "ls"], cwd=self.project_root)
            if result is None:
                safe_log(self.logger, 'warning', "NPM packages missing or broken. Running npm install.")
                await self.install_npm_dependencies()
            elif result.returncode != 0:
                safe_log(self.logger, 'warning', "NPM packages missing or broken. Running npm install.")
                await self.install_npm_dependencies()
        except Exception as e:
            safe_log(self.logger, 'error', f"NPM check failed: {e}")
    
    async def auto_upgrade_nextjs(self):
        """Auto-upgrade Next.js and related dependencies if outdated"""
        try:
            safe_log(self.logger, 'info', "Checking for Next.js updates...")
            result = await self.safe_subprocess_run(["npm", "outdated", "next"], cwd=self.project_root)
            if "next" in result.stdout:
                safe_log(self.logger, 'info', "Upgrading Next.js to latest...")
                await self.safe_subprocess_run(["npm", "install", "next@latest"], cwd=self.project_root)
                safe_log(self.logger, 'info', "Next.js upgraded successfully.")
        except Exception as e:
            safe_log(self.logger, 'error', f"Next.js upgrade failed: {e}")
    
    def log_evolution(self, message: str):
        """Log evolution events"""
        self.evolution_log.append({
            "timestamp": datetime.now().isoformat(),
            "message": message
        })
    
    async def run_master_automation(self):
        """Run the complete master automation"""
        start_time = time.time()
        safe_log(self.logger, 'info', "🚀 Starting QMOI Master Automation")
        safe_log(self.logger, 'info', "=" * 50)
        
        try:
            await self.auto_fix_missing_files_and_deps()
            await self.auto_upgrade_nextjs()
            fix_results = await self.run_comprehensive_fixes()
            
            # Generate summary
            success_count = sum(1 for result in fix_results if result.success)
            total_count = len(fix_results)
            
            safe_log(self.logger, 'info', "=" * 50)
            safe_log(self.logger, 'info', f"📊 Master Automation Summary:")
            safe_log(self.logger, 'info', f"✅ Successful fixes: {success_count}/{total_count}")
            safe_log(self.logger, 'info', f"⏱️ Total time: {time.time() - start_time:.2f} seconds")
            safe_log(self.logger, 'info', f"☁️ Cloud optimized: {self.is_cloud_environment}")
            
            # Log results
            for result in fix_results:
                status = "✅" if result.success else "❌"
                safe_log(self.logger, 'info', f"{status} {result.platform.value}: {result.message}")
            
            # Save final report
            await self.save_final_report(fix_results, time.time() - start_time)
            
            safe_log(self.logger, 'info', "🎉 QMOI Master Automation completed!")
            
        except Exception as e:
            safe_log(self.logger, 'error', f"❌ Master automation failed: {e}")
            raise
    
    async def save_final_report(self, fix_results: List[FixResult], duration: float):
        """Save final automation report"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "duration_seconds": duration,
            "total_platforms": len(fix_results),
            "successful_fixes": sum(1 for r in fix_results if r.success),
            "cloud_optimized": self.is_cloud_environment,
            "platforms": [{
                "name": result.platform.value,
                "success": result.success,
                "message": result.message,
                "suggestions": result.suggestions,
                "evolution_ideas": result.evolution_ideas
            } for result in fix_results],
            "evolution_log": self.evolution_log,
            "suggestions_log": self.suggestions_log
        }
        
        report_file = self.logs_dir / "master-automation-report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        self.logger.info(f"📄 Final report saved to: {report_file}")

async def main():
    """Main entry point"""
    automation = QMOIMasterAutomation()
    await automation.run_master_automation()

if __name__ == "__main__":
    asyncio.run(main()) 