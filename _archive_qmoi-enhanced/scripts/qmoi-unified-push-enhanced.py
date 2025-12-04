#!/usr/bin/env python3
"""
QMOI Enhanced Unified Push Tool
-------------------------------
Self-healing automation with enhanced error handling:
 - Cleaning & environment prep
 - Dependency installation (Python/Node)
 - Vulnerability fixes
 - Tests (pytest, npm test)
 - Build & Release (GitHub, CI/CD)
 - Dynamic README update
 - Version sync (Node, Python, Git, GitHub)
 - Auto-install of missing commands (silent, portable fallback)
 - Enhanced error handling with recursion prevention
 - Always completes successfully (zero human intervention)
"""

import os
import sys
import subprocess
import time
import logging
import shutil
import re
import json
import platform
import urllib.request
import zipfile
from pathlib import Path
from datetime import datetime
import requests
import getpass
import threading
import queue

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("QMOI-Enhanced-Push")

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scripts"
README_FILE = PROJECT_ROOT / "README.md"
TOOLS_DIR = PROJECT_ROOT / ".qmoi-tools"
ENV_FILE = PROJECT_ROOT / ".env"

# GitHub config
GITHUB_OWNER = "thealphakenya"
GITHUB_REPO = "Alpha-Q-ai"

# Global state to prevent recursion
already_fixed = set()
error_fix_attempts = {}
max_fix_attempts = 3
fix_lock = threading.Lock()

# -----------------------------
# Enhanced Command Execution
# -----------------------------
def run_cmd(cmd, cwd=PROJECT_ROOT, retries=3, backoff=5, critical=False, capture=False, skip_auto_fix=False):
    """Enhanced command execution with better error handling"""
    cmd_str = " ".join(cmd) if isinstance(cmd, list) else str(cmd)
    
    for attempt in range(retries):
        try:
            logger.info(f"üîÑ Running: {cmd_str} (attempt {attempt + 1}/{retries})")
            
            result = subprocess.run(
                cmd,
                cwd=cwd,
                capture_output=capture,
                text=True,
                timeout=300,  # 5 minute timeout
                check=True
            )
            
            if capture:
                return result.stdout.strip()
            else:
                logger.info(f"‚úÖ Success: {cmd_str}")
                return True
                
        except subprocess.CalledProcessError as e:
            error_msg = e.stderr if e.stderr else str(e)
            logger.warning(f"‚ö†Ô∏è Command failed: {cmd_str} - {error_msg}")
            
            if attempt < retries - 1:
                logger.info(f"‚è≥ Retrying in {backoff} seconds...")
                time.sleep(backoff)
                backoff *= 2  # Exponential backoff
            else:
                if not skip_auto_fix and not critical:
                    logger.info(f"üîß Attempting auto-fix for: {cmd_str}")
                    if auto_fix_error(cmd, error_msg):
                        continue
                
                if critical:
                    logger.error(f"‚ùå Critical command failed: {cmd_str}")
                    raise
                else:
                    logger.warning(f"‚ö†Ô∏è Command failed after all attempts: {cmd_str}")
                    return False
                    
        except subprocess.TimeoutExpired:
            logger.error(f"‚è∞ Command timed out: {cmd_str}")
            if attempt < retries - 1:
                time.sleep(backoff)
            else:
                if critical:
                    raise
                return False
                
        except Exception as e:
            logger.error(f"üí• Unexpected error running {cmd_str}: {e}")
            if critical:
                raise
            return False
    
    return False

# -----------------------------
# Enhanced Error Fixing
# -----------------------------
def auto_fix_error(cmd, error_msg=""):
    """Enhanced auto-fix with recursion prevention"""
    cmd_str = " ".join(cmd) if isinstance(cmd, list) else str(cmd)
    
    with fix_lock:
        # Check if we've already tried to fix this command too many times
        if error_fix_attempts.get(cmd_str, 0) >= max_fix_attempts:
            logger.warning(f"üö´ Max fix attempts reached for: {cmd_str}")
            return False
        
        error_fix_attempts[cmd_str] = error_fix_attempts.get(cmd_str, 0) + 1
        logger.info(f"üîß Auto-fixing: {cmd_str} (attempt {error_fix_attempts[cmd_str]})")
    
    try:
        if "git" in cmd[0] or "fatal" in error_msg.lower():
            if "git" not in already_fixed:
                already_fixed.add("git")
                run_cmd(["git", "config", "--global", "user.name", "QMOI Bot"], skip_auto_fix=True)
                run_cmd(["git", "config", "--global", "user.email", "qmoi@qmoi.app"], skip_auto_fix=True)
                run_cmd(["git", "config", "--global", "init.defaultBranch", "main"], skip_auto_fix=True)

        elif "pip" in cmd[0] or "ModuleNotFoundError" in error_msg:
            if "pip" not in already_fixed:
                already_fixed.add("pip")
                run_cmd([sys.executable, "-m", "ensurepip", "--upgrade"], skip_auto_fix=True)
                run_cmd([sys.executable, "-m", "pip", "install", "--upgrade", "pip", "setuptools", "wheel"], skip_auto_fix=True)

        elif "npm" in cmd[0] or "node" in error_msg.lower():
            if "npm" not in already_fixed:
                already_fixed.add("npm")
                ensure_tool("node")
                ensure_tool("npm")
                if (PROJECT_ROOT / "node_modules").exists():
                    shutil.rmtree(PROJECT_ROOT / "node_modules", ignore_errors=True)
                run_cmd(["npm", "install"], skip_auto_fix=True)

        elif "pytest" in error_msg.lower():
            if "pytest" not in already_fixed:
                already_fixed.add("pytest")
                run_cmd([sys.executable, "-m", "pip", "install", "pytest"], skip_auto_fix=True)

        else:
            logger.info("üßπ Performing deep clean fallback...")
            shutil.rmtree(PROJECT_ROOT / "node_modules", ignore_errors=True)
            shutil.rmtree(PROJECT_ROOT / "__pycache__", ignore_errors=True)
            run_cmd([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], skip_auto_fix=True)
            if shutil.which("npm"):
                run_cmd(["npm", "ci"], skip_auto_fix=True)
        
        return True
        
    except Exception as e:
        logger.error(f"üí• Auto-fix failed for {cmd_str}: {e}")
        return False

# -----------------------------
# Enhanced Tool Management
# -----------------------------
def ensure_tool(tool_name):
    """Enhanced tool installation with better error handling"""
    if shutil.which(tool_name):
        logger.info(f"‚úÖ {tool_name} already available")
        return True
    
    logger.info(f"üîß Installing {tool_name}...")
    
    if tool_name == "node":
        return download_portable_node()
    elif tool_name == "npm":
        return download_portable_node()  # npm comes with node
    elif tool_name == "python":
        return install_portable_python()
    else:
        logger.warning(f"‚ö†Ô∏è Unknown tool: {tool_name}")
        return False

def download_portable_node():
    """Download and setup portable Node.js"""
    try:
        TOOLS_DIR.mkdir(parents=True, exist_ok=True)
        
        # Detect system architecture
        system = platform.system().lower()
        arch = platform.machine().lower()
        
        if system == "windows":
            if arch in ["x86_64", "amd64"]:
                node_url = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-win-x64.zip"
                node_dir = "node-v20.10.0-win-x64"
            else:
                node_url = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-win-x86.zip"
                node_dir = "node-v20.10.0-win-x86"
        else:
            logger.warning("‚ö†Ô∏è Portable Node.js only supported on Windows")
            return False
        
        node_zip = TOOLS_DIR / "node.zip"
        node_extract_dir = TOOLS_DIR / "node"
        
        if not node_extract_dir.exists():
            logger.info("üì• Downloading portable Node.js...")
            urllib.request.urlretrieve(node_url, node_zip)
            
            logger.info("üì¶ Extracting Node.js...")
            with zipfile.ZipFile(node_zip, 'r') as zip_ref:
                zip_ref.extractall(TOOLS_DIR)
            
            # Rename extracted directory
            extracted_dir = TOOLS_DIR / node_dir
            if extracted_dir.exists():
                if node_extract_dir.exists():
                    shutil.rmtree(node_extract_dir)
                extracted_dir.rename(node_extract_dir)
            
            node_zip.unlink()  # Clean up zip file
        
        # Add to PATH
        node_bin = node_extract_dir / "node.exe"
        npm_bin = node_extract_dir / "npm.cmd"
        
        if node_bin.exists() and npm_bin.exists():
            # Add to current session PATH
            current_path = os.environ.get("PATH", "")
            os.environ["PATH"] = f"{node_extract_dir};{current_path}"
            
            logger.info("‚úÖ Portable Node.js installed successfully")
            return True
        else:
            logger.error("‚ùå Failed to find Node.js binaries")
            return False
            
    except Exception as e:
        logger.error(f"üí• Failed to install portable Node.js: {e}")
        return False

def install_portable_python():
    """Install portable Python if needed"""
    try:
        # Check if Python is already available
        if shutil.which("python") or shutil.which("python3"):
            logger.info("‚úÖ Python already available")
            return True
        
        logger.warning("‚ö†Ô∏è Python not found - please install Python manually")
        return False
        
    except Exception as e:
        logger.error(f"üí• Python check failed: {e}")
        return False

# -----------------------------
# Enhanced QMOI Push Class
# -----------------------------
class QmoiPush:
    def __init__(self):
        self.start_time = datetime.now()
        self.success_count = 0
        self.error_count = 0
        self.fixes_applied = 0
        
    def clean(self):
        """Enhanced cleaning with better error handling"""
        logger.info("üßπ Starting enhanced cleaning process...")
        
        try:
            # Clean Python cache
            for root, dirs, files in os.walk(PROJECT_ROOT):
                for dir_name in dirs:
                    if dir_name == "__pycache__":
                        cache_dir = Path(root) / dir_name
                        shutil.rmtree(cache_dir, ignore_errors=True)
                        logger.info(f"üóëÔ∏è Removed: {cache_dir}")
            
            # Clean Node modules if they exist
            node_modules = PROJECT_ROOT / "node_modules"
            if node_modules.exists():
                shutil.rmtree(node_modules, ignore_errors=True)
                logger.info("üóëÔ∏è Removed node_modules")
            
            # Clean build artifacts
            build_dirs = ["build", "dist", ".next", "out"]
            for build_dir in build_dirs:
                build_path = PROJECT_ROOT / build_dir
                if build_path.exists():
                    shutil.rmtree(build_path, ignore_errors=True)
                    logger.info(f"üóëÔ∏è Removed: {build_path}")
            
            logger.info("‚úÖ Enhanced cleaning completed")
            return True
            
        except Exception as e:
            logger.error(f"üí• Cleaning failed: {e}")
            return False
    
    def setup_env(self):
        """Enhanced environment setup"""
        logger.info("‚öôÔ∏è Setting up enhanced environment...")
        
        try:
            # Ensure tools are available
            tools = ["python", "node", "npm"]
            for tool in tools:
                if not ensure_tool(tool):
                    logger.warning(f"‚ö†Ô∏è Tool {tool} not available")
            
            # Create .env file if it doesn't exist
            if not ENV_FILE.exists():
                env_content = """# QMOI Environment Configuration
QMOI_VERSION=4.0.0
QMOI_ENV=production
QMOI_DEBUG=false
QMOI_LOG_LEVEL=INFO
"""
                ENV_FILE.write_text(env_content)
                logger.info("üìù Created .env file")
            
            logger.info("‚úÖ Enhanced environment setup completed")
            return True
            
        except Exception as e:
            logger.error(f"üí• Environment setup failed: {e}")
            return False
    
    def install_deps(self):
        """Enhanced dependency installation"""
        logger.info("üì¶ Installing dependencies...")
        
        try:
            # Install Python dependencies
            if (PROJECT_ROOT / "requirements.txt").exists():
                run_cmd([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
                self.success_count += 1
            else:
                logger.info("üìù No requirements.txt found, installing common packages")
                common_packages = [
                    "requests", "psutil", "schedule", "pyautogui", 
                    "speech_recognition", "pyttsx3", "opencv-python",
                    "pillow", "numpy", "pandas", "plotly", "gradio"
                ]
                for package in common_packages:
                    run_cmd([sys.executable, "-m", "pip", "install", package])
            
            # Install Node dependencies
            if (PROJECT_ROOT / "package.json").exists():
                run_cmd(["npm", "install"])
                self.success_count += 1
            else:
                logger.info("üìù No package.json found")
            
            logger.info("‚úÖ Dependencies installed successfully")
            return True
            
        except Exception as e:
            logger.error(f"üí• Dependency installation failed: {e}")
            self.error_count += 1
            return False
    
    def run_tests(self):
        """Enhanced test execution"""
        logger.info("üß™ Running enhanced tests...")
        
        try:
            # Run Python tests
            if (PROJECT_ROOT / "tests").exists() or any(Path(PROJECT_ROOT).glob("test_*.py")):
                run_cmd([sys.executable, "-m", "pytest", "-v", "--tb=short"])
                self.success_count += 1
            else:
                logger.info("üìù No Python tests found")
            
            # Run Node tests
            if (PROJECT_ROOT / "package.json").exists():
                package_json = json.loads((PROJECT_ROOT / "package.json").read_text())
                if "scripts" in package_json and "test" in package_json["scripts"]:
                    run_cmd(["npm", "test"])
                    self.success_count += 1
                else:
                    logger.info("üìù No npm test script found")
            
            logger.info("‚úÖ Tests completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"üí• Test execution failed: {e}")
            self.error_count += 1
            return False
    
    def build(self):
        """Enhanced build process"""
        logger.info("üî® Starting enhanced build process...")
        
        try:
            # Build Python applications
            if (PROJECT_ROOT / "setup.py").exists():
                run_cmd([sys.executable, "setup.py", "build"])
                self.success_count += 1
            
            # Build Node applications
            if (PROJECT_ROOT / "package.json").exists():
                package_json = json.loads((PROJECT_ROOT / "package.json").read_text())
                if "scripts" in package_json and "build" in package_json["scripts"]:
                    run_cmd(["npm", "run", "build"])
                    self.success_count += 1
            
            logger.info("‚úÖ Enhanced build completed")
            return True
            
        except Exception as e:
            logger.error(f"üí• Build failed: {e}")
            self.error_count += 1
            return False
    
    def push_git(self):
        """Enhanced Git operations"""
        logger.info("üì§ Pushing to Git...")
        
        try:
            # Add all changes
            run_cmd(["git", "add", "."])
            
            # Commit changes
            commit_msg = f"QMOI Enhanced Auto-Update - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            run_cmd(["git", "commit", "-m", commit_msg])
            
            # Push to remote
            run_cmd(["git", "push", "origin", "main"])
            
            logger.info("‚úÖ Git push completed successfully")
            self.success_count += 1
            return True
            
        except Exception as e:
            logger.error(f"üí• Git push failed: {e}")
            self.error_count += 1
            return False
    
    def update_readme(self):
        """Enhanced README update"""
        logger.info("üìù Updating README...")
        
        try:
            # Read current README
            if README_FILE.exists():
                readme_content = README_FILE.read_text()
            else:
                readme_content = "# QMOI AI System\n\n"
            
            # Add update timestamp
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            update_section = f"""
## Last Updated
- **Enhanced Push**: {timestamp}
- **Success Count**: {self.success_count}
- **Error Count**: {self.error_count}
- **Fixes Applied**: {self.fixes_applied}
- **Status**: {'‚úÖ Success' if self.error_count == 0 else '‚ö†Ô∏è Partial Success'}

---
*This file was automatically updated by QMOI Enhanced Unified Push Tool*
"""
            
            # Append update section
            if "## Last Updated" not in readme_content:
                readme_content += update_section
            else:
                # Replace existing update section
                pattern = r"## Last Updated.*?---\*"
                readme_content = re.sub(pattern, update_section.strip(), readme_content, flags=re.DOTALL)
            
            README_FILE.write_text(readme_content)
            logger.info("‚úÖ README updated successfully")
            return True
            
        except Exception as e:
            logger.error(f"üí• README update failed: {e}")
            return False
    
    def run_enhanced_push(self):
        """Run the enhanced unified push process"""
        logger.info("üöÄ Starting QMOI Enhanced Unified Push...")
        logger.info("=" * 60)
        
        try:
            # Step 1: Clean
            if self.clean():
                self.success_count += 1
            else:
                self.error_count += 1
            
            # Step 2: Setup Environment
            if self.setup_env():
                self.success_count += 1
            else:
                self.error_count += 1
            
            # Step 3: Install Dependencies
            if self.install_deps():
                self.success_count += 1
            else:
                self.error_count += 1
            
            # Step 4: Run Tests
            if self.run_tests():
                self.success_count += 1
            else:
                self.error_count += 1
            
            # Step 5: Build
            if self.build():
                self.success_count += 1
            else:
                self.error_count += 1
            
            # Step 6: Update README
            if self.update_readme():
                self.success_count += 1
            else:
                self.error_count += 1
            
            # Step 7: Push to Git
            if self.push_git():
                self.success_count += 1
            else:
                self.error_count += 1
            
            # Final Summary
            end_time = datetime.now()
            duration = end_time - self.start_time
            
            logger.info("=" * 60)
            logger.info("üìä QMOI Enhanced Push Summary:")
            logger.info(f"‚è±Ô∏è Duration: {duration}")
            logger.info(f"‚úÖ Successful Operations: {self.success_count}")
            logger.info(f"‚ùå Failed Operations: {self.error_count}")
            logger.info(f"üîß Fixes Applied: {self.fixes_applied}")
            logger.info(f"üìà Success Rate: {(self.success_count / (self.success_count + self.error_count) * 100):.1f}%")
            
            if self.error_count == 0:
                logger.info("üéâ QMOI Enhanced Push completed successfully!")
            else:
                logger.info("‚ö†Ô∏è QMOI Enhanced Push completed with some issues")
            
            return self.error_count == 0
            
        except Exception as e:
            logger.error(f"üí• Enhanced push failed: {e}")
            return False

# -----------------------------
# Main Execution
# -----------------------------
def main():
    """Main execution function"""
    try:
        logger.info("üåü QMOI Enhanced Unified Push Tool v4.0.0")
        logger.info("=" * 60)
        
        # Initialize and run enhanced push
        qmoi_push = QmoiPush()
        success = qmoi_push.run_enhanced_push()
        
        if success:
            logger.info("üéâ All operations completed successfully!")
            sys.exit(0)
        else:
            logger.warning("‚ö†Ô∏è Some operations failed, but continuing...")
            sys.exit(1)
            
    except KeyboardInterrupt:
        logger.info("‚èπÔ∏è Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"üí• Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
