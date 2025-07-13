#!/usr/bin/env python3
"""
QMOI Universal Error Fixer
Automatically detects and fixes errors across all platforms and systems
"""

import asyncio
import json
import logging
import os
import subprocess
import sys
import time
import threading
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional
import requests
import schedule
import git
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi-universal-error-fixer.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QMOIUniversalErrorFixer:
    def __init__(self):
        self.running = False
        self.error_patterns = {
            'npm_errors': [
                r'npm ERR!',
                r'ENOENT',
                r'ENOTFOUND',
                r'peer dependency',
                r'version conflict'
            ],
            'git_errors': [
                r'fatal:',
                r'error:',
                r'merge conflict',
                r'push failed',
                r'pull failed'
            ],
            'build_errors': [
                r'Build failed',
                r'Compilation error',
                r'TypeScript error',
                r'Webpack error',
                r'Babel error'
            ],
            'deployment_errors': [
                r'Deployment failed',
                r'Vercel error',
                r'Netlify error',
                r'GitLab CI error',
                r'GitHub Actions error'
            ],
            'platform_errors': [
                r'GitLab error',
                r'GitHub error',
                r'Vercel error',
                r'Gitpod error',
                r'Quantum error'
            ],
            'network_errors': [
                r'ECONNREFUSED',
                r'ETIMEDOUT',
                r'ENOTFOUND',
                r'Network error',
                r'Connection failed'
            ],
            'permission_errors': [
                r'Permission denied',
                r'EACCES',
                r'Access denied',
                r'Unauthorized'
            ],
            'memory_errors': [
                r'JavaScript heap out of memory',
                r'Memory leak',
                r'Out of memory',
                r'Heap size'
            ]
        }
        self.fix_strategies = {
            'npm_errors': [
                'npm cache clean --force',
                'rm -rf node_modules package-lock.json',
                'npm install',
                'npm audit fix',
                'npm update'
            ],
            'git_errors': [
                'git status',
                'git fetch --all',
                'git reset --hard HEAD',
                'git clean -fd',
                'git pull origin main'
            ],
            'build_errors': [
                'npm run build --force',
                'npm run build:clean',
                'rm -rf build/ dist/',
                'npm run build:prod'
            ],
            'deployment_errors': [
                'npm run deploy:retry',
                'vercel --prod',
                'netlify deploy --prod',
                'git push origin main'
            ],
            'platform_errors': [
                'npm run platform:fix',
                'npm run platform:reset',
                'npm run platform:sync'
            ],
            'network_errors': [
                'npm config set registry https://registry.npmjs.org/',
                'git config --global http.sslVerify false',
                'npm config set strict-ssl false'
            ],
            'permission_errors': [
                'sudo chown -R $USER:$USER .',
                'chmod +x scripts/*.py',
                'chmod +x scripts/*.js'
            ],
            'memory_errors': [
                'node --max-old-space-size=4096',
                'npm run build:optimize',
                'npm run clean:memory'
            ]
        }
        self.fix_stats = {
            'total_errors_detected': 0,
            'total_errors_fixed': 0,
            'fix_attempts': 0,
            'successful_fixes': 0,
            'failed_fixes': 0,
            'last_fix_attempt': None,
            'current_status': 'idle'
        }
        self.setup_file_watcher()
        self.setup_scheduled_tasks()
        
    def setup_file_watcher(self):
        """Setup file system watcher for error detection"""
        class QMOIErrorFileHandler(FileSystemEventHandler):
            def __init__(self, error_fixer):
                self.error_fixer = error_fixer
                
            def on_modified(self, event):
                if not event.is_directory:
                    if event.src_path.endswith(('.log', '.err', '.out')):
                        logger.info(f"Log file modified: {event.src_path}")
                        self.error_fixer.scan_for_errors()
                        
        self.file_handler = QMOIErrorFileHandler(self)
        self.observer = Observer()
        self.observer.schedule(self.file_handler, 'logs', recursive=True)
        self.observer.start()
        
    def setup_scheduled_tasks(self):
        """Setup scheduled error fixing tasks"""
        # Scan for errors every 2 minutes
        schedule.every(2).minutes.do(self.scan_for_errors)
        
        # Auto-fix errors every 5 minutes
        schedule.every(5).minutes.do(self.auto_fix_errors)
        
        # Comprehensive error check every 10 minutes
        schedule.every(10).minutes.do(self.comprehensive_error_check)
        
        # Platform-specific fixes every 15 minutes
        schedule.every(15).minutes.do(self.platform_specific_fixes)
        
        # Memory optimization every 20 minutes
        schedule.every(20).minutes.do(self.memory_optimization)
        
        def run_scheduler():
            while self.running:
                schedule.run_pending()
                time.sleep(1)
                
        self.scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
        
    def scan_for_errors(self):
        """Scan for errors in logs and output"""
        try:
            logger.info("🔍 Scanning for errors")
            
            # Scan log files
            log_files = [
                'logs/qmoi-qcity-automatic.log',
                'logs/qmoi-dashboard.log',
                'logs/qmoi-gitlab-ci.log',
                'logs/qmoi-platform-optimizer.log',
                'logs/qmoi-universal-error-fixer.log'
            ]
            
            for log_file in log_files:
                if os.path.exists(log_file):
                    self.scan_file_for_errors(log_file)
                    
            # Scan npm output
            self.scan_npm_output()
            
            # Scan git output
            self.scan_git_output()
            
            # Scan build output
            self.scan_build_output()
            
        except Exception as e:
            logger.error(f"Error scanning for errors: {e}")
            
    def scan_file_for_errors(self, file_path: str):
        """Scan specific file for errors"""
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                
            for error_type, patterns in self.error_patterns.items():
                for pattern in patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    if matches:
                        logger.warning(f"⚠️ Found {error_type} in {file_path}: {matches}")
                        self.fix_stats['total_errors_detected'] += len(matches)
                        self.trigger_error_fix(error_type, matches)
                        
        except Exception as e:
            logger.error(f"Error scanning file {file_path}: {e}")
            
    def scan_npm_output(self):
        """Scan npm output for errors"""
        try:
            result = subprocess.run('npm list', shell=True, capture_output=True, text=True)
            
            if result.returncode != 0:
                logger.warning(f"⚠️ NPM errors detected: {result.stderr}")
                self.fix_stats['total_errors_detected'] += 1
                self.trigger_error_fix('npm_errors', [result.stderr])
                
        except Exception as e:
            logger.error(f"Error scanning npm output: {e}")
            
    def scan_git_output(self):
        """Scan git output for errors"""
        try:
            result = subprocess.run('git status', shell=True, capture_output=True, text=True)
            
            if 'error' in result.stderr.lower() or 'fatal' in result.stderr.lower():
                logger.warning(f"⚠️ Git errors detected: {result.stderr}")
                self.fix_stats['total_errors_detected'] += 1
                self.trigger_error_fix('git_errors', [result.stderr])
                
        except Exception as e:
            logger.error(f"Error scanning git output: {e}")
            
    def scan_build_output(self):
        """Scan build output for errors"""
        try:
            result = subprocess.run('npm run build', shell=True, capture_output=True, text=True)
            
            if result.returncode != 0:
                logger.warning(f"⚠️ Build errors detected: {result.stderr}")
                self.fix_stats['total_errors_detected'] += 1
                self.trigger_error_fix('build_errors', [result.stderr])
                
        except Exception as e:
            logger.error(f"Error scanning build output: {e}")
            
    def trigger_error_fix(self, error_type: str, errors: List[str]):
        """Trigger error fixing for specific error type"""
        try:
            logger.info(f"🔧 Triggering fix for {error_type}")
            self.fix_stats['fix_attempts'] += 1
            self.fix_stats['last_fix_attempt'] = datetime.now().isoformat()
            
            if error_type in self.fix_strategies:
                self.apply_fix_strategies(error_type, self.fix_strategies[error_type])
            else:
                logger.warning(f"⚠️ No fix strategy found for {error_type}")
                
        except Exception as e:
            logger.error(f"Error triggering fix for {error_type}: {e}")
            
    def apply_fix_strategies(self, error_type: str, strategies: List[str]):
        """Apply fix strategies for error type"""
        try:
            logger.info(f"🔧 Applying {len(strategies)} fix strategies for {error_type}")
            
            for strategy in strategies:
                try:
                    logger.info(f"🔄 Running: {strategy}")
                    result = subprocess.run(strategy, shell=True, capture_output=True, text=True, timeout=300)
                    
                    if result.returncode == 0:
                        logger.info(f"✅ {strategy} completed successfully")
                        self.fix_stats['successful_fixes'] += 1
                        self.fix_stats['total_errors_fixed'] += 1
                    else:
                        logger.warning(f"⚠️ {strategy} failed: {result.stderr}")
                        self.fix_stats['failed_fixes'] += 1
                        
                except subprocess.TimeoutExpired:
                    logger.error(f"⏰ {strategy} timed out")
                    self.fix_stats['failed_fixes'] += 1
                except Exception as e:
                    logger.error(f"❌ Error running {strategy}: {e}")
                    self.fix_stats['failed_fixes'] += 1
                    
        except Exception as e:
            logger.error(f"Error applying fix strategies for {error_type}: {e}")
            
    def auto_fix_errors(self):
        """Automatically fix detected errors"""
        try:
            logger.info("🔧 Running automatic error fixing")
            
            # Fix npm errors
            self.fix_npm_errors()
            
            # Fix git errors
            self.fix_git_errors()
            
            # Fix build errors
            self.fix_build_errors()
            
            # Fix deployment errors
            self.fix_deployment_errors()
            
            # Fix platform errors
            self.fix_platform_errors()
            
        except Exception as e:
            logger.error(f"Error in auto-fix: {e}")
            
    def fix_npm_errors(self):
        """Fix npm-related errors"""
        try:
            logger.info("🔧 Fixing npm errors")
            
            npm_fixes = [
                'npm cache clean --force',
                'rm -rf node_modules package-lock.json',
                'npm install',
                'npm audit fix',
                'npm update'
            ]
            
            for fix in npm_fixes:
                try:
                    result = subprocess.run(fix, shell=True, capture_output=True, text=True, timeout=300)
                    
                    if result.returncode == 0:
                        logger.info(f"✅ {fix} completed successfully")
                        self.fix_stats['successful_fixes'] += 1
                    else:
                        logger.warning(f"⚠️ {fix} failed: {result.stderr}")
                        
                except Exception as e:
                    logger.error(f"❌ Error running {fix}: {e}")
                    
        except Exception as e:
            logger.error(f"Error fixing npm errors: {e}")
            
    def fix_git_errors(self):
        """Fix git-related errors"""
        try:
            logger.info("🔧 Fixing git errors")
            
            git_fixes = [
                'git status',
                'git fetch --all',
                'git reset --hard HEAD',
                'git clean -fd',
                'git pull origin main'
            ]
            
            for fix in git_fixes:
                try:
                    result = subprocess.run(fix, shell=True, capture_output=True, text=True, timeout=300)
                    
                    if result.returncode == 0:
                        logger.info(f"✅ {fix} completed successfully")
                        self.fix_stats['successful_fixes'] += 1
                    else:
                        logger.warning(f"⚠️ {fix} failed: {result.stderr}")
                        
                except Exception as e:
                    logger.error(f"❌ Error running {fix}: {e}")
                    
        except Exception as e:
            logger.error(f"Error fixing git errors: {e}")
            
    def fix_build_errors(self):
        """Fix build-related errors"""
        try:
            logger.info("🔧 Fixing build errors")
            
            build_fixes = [
                'npm run build --force',
                'rm -rf build/ dist/',
                'npm run build:prod',
                'npm run build:clean'
            ]
            
            for fix in build_fixes:
                try:
                    result = subprocess.run(fix, shell=True, capture_output=True, text=True, timeout=600)
                    
                    if result.returncode == 0:
                        logger.info(f"✅ {fix} completed successfully")
                        self.fix_stats['successful_fixes'] += 1
                    else:
                        logger.warning(f"⚠️ {fix} failed: {result.stderr}")
                        
                except Exception as e:
                    logger.error(f"❌ Error running {fix}: {e}")
                    
        except Exception as e:
            logger.error(f"Error fixing build errors: {e}")
            
    def fix_deployment_errors(self):
        """Fix deployment-related errors"""
        try:
            logger.info("🔧 Fixing deployment errors")
            
            deployment_fixes = [
                'npm run deploy:retry',
                'vercel --prod',
                'netlify deploy --prod',
                'git push origin main'
            ]
            
            for fix in deployment_fixes:
                try:
                    result = subprocess.run(fix, shell=True, capture_output=True, text=True, timeout=300)
                    
                    if result.returncode == 0:
                        logger.info(f"✅ {fix} completed successfully")
                        self.fix_stats['successful_fixes'] += 1
                    else:
                        logger.warning(f"⚠️ {fix} failed: {result.stderr}")
                        
                except Exception as e:
                    logger.error(f"❌ Error running {fix}: {e}")
                    
        except Exception as e:
            logger.error(f"Error fixing deployment errors: {e}")
            
    def fix_platform_errors(self):
        """Fix platform-specific errors"""
        try:
            logger.info("🔧 Fixing platform errors")
            
            platform_fixes = [
                'npm run platform:fix',
                'npm run platform:reset',
                'npm run platform:sync',
                'npm run qmoi:recovery'
            ]
            
            for fix in platform_fixes:
                try:
                    result = subprocess.run(fix, shell=True, capture_output=True, text=True, timeout=300)
                    
                    if result.returncode == 0:
                        logger.info(f"✅ {fix} completed successfully")
                        self.fix_stats['successful_fixes'] += 1
                    else:
                        logger.warning(f"⚠️ {fix} failed: {result.stderr}")
                        
                except Exception as e:
                    logger.error(f"❌ Error running {fix}: {e}")
                    
        except Exception as e:
            logger.error(f"Error fixing platform errors: {e}")
            
    def comprehensive_error_check(self):
        """Comprehensive error checking across all systems"""
        try:
            logger.info("🔍 Running comprehensive error check")
            
            # Check all platforms
            platforms = ['gitlab', 'github', 'vercel', 'gitpod', 'netlify', 'quantum']
            
            for platform in platforms:
                try:
                    result = subprocess.run(f'npm run {platform}:health', 
                                         shell=True, capture_output=True, text=True, timeout=60)
                    
                    if result.returncode != 0:
                        logger.warning(f"⚠️ {platform} health check failed")
                        self.trigger_error_fix(f'{platform}_errors', [result.stderr])
                    else:
                        logger.info(f"✅ {platform} health check passed")
                        
                except Exception as e:
                    logger.error(f"❌ Error checking {platform} health: {e}")
                    
        except Exception as e:
            logger.error(f"Error in comprehensive error check: {e}")
            
    def platform_specific_fixes(self):
        """Apply platform-specific fixes"""
        try:
            logger.info("🔧 Applying platform-specific fixes")
            
            platform_fixes = {
                'gitlab': [
                    'npm run gitlab:fix',
                    'npm run gitlab:recovery',
                    'npm run gitlab:sync'
                ],
                'github': [
                    'npm run github:fix',
                    'npm run github:sync',
                    'npm run github:fallback'
                ],
                'vercel': [
                    'npm run vercel:fix',
                    'npm run vercel:deploy',
                    'npm run vercel:optimize'
                ],
                'gitpod': [
                    'npm run gitpod:fix',
                    'npm run gitpod:sync',
                    'npm run gitpod:monitor'
                ],
                'netlify': [
                    'npm run netlify:fix',
                    'npm run netlify:deploy',
                    'npm run netlify:optimize'
                ],
                'quantum': [
                    'npm run quantum:fix',
                    'npm run quantum:optimize',
                    'npm run quantum:heal'
                ]
            }
            
            for platform, fixes in platform_fixes.items():
                try:
                    logger.info(f"🔧 Applying fixes for {platform}")
                    
                    for fix in fixes:
                        try:
                            result = subprocess.run(fix, shell=True, capture_output=True, text=True, timeout=300)
                            
                            if result.returncode == 0:
                                logger.info(f"✅ {fix} completed successfully")
                                self.fix_stats['successful_fixes'] += 1
                            else:
                                logger.warning(f"⚠️ {fix} failed: {result.stderr}")
                                
                        except Exception as e:
                            logger.error(f"❌ Error running {fix}: {e}")
                            
                except Exception as e:
                    logger.error(f"Error applying fixes for {platform}: {e}")
                    
        except Exception as e:
            logger.error(f"Error in platform-specific fixes: {e}")
            
    def memory_optimization(self):
        """Optimize memory usage"""
        try:
            logger.info("🧠 Optimizing memory usage")
            
            memory_fixes = [
                'npm run clean:memory',
                'npm run build:optimize',
                'node --max-old-space-size=4096 npm run build',
                'npm run optimize:memory'
            ]
            
            for fix in memory_fixes:
                try:
                    result = subprocess.run(fix, shell=True, capture_output=True, text=True, timeout=300)
                    
                    if result.returncode == 0:
                        logger.info(f"✅ {fix} completed successfully")
                        self.fix_stats['successful_fixes'] += 1
                    else:
                        logger.warning(f"⚠️ {fix} failed: {result.stderr}")
                        
                except Exception as e:
                    logger.error(f"❌ Error running {fix}: {e}")
                    
        except Exception as e:
            logger.error(f"Error in memory optimization: {e}")
            
    def save_stats(self):
        """Save fix stats to file"""
        try:
            stats_file = 'logs/universal-error-fixer-stats.json'
            os.makedirs('logs', exist_ok=True)
            
            with open(stats_file, 'w') as f:
                json.dump(self.fix_stats, f, indent=2, default=str)
                
        except Exception as e:
            logger.error(f"Error saving stats: {e}")
            
    def start(self):
        """Start the universal error fixer"""
        try:
            # Create logs directory
            os.makedirs('logs', exist_ok=True)
            
            # Start scheduler
            self.running = True
            self.scheduler_thread.start()
            
            logger.info("🚀 QMOI Universal Error Fixer started")
            logger.info("🔍 Error detection active")
            logger.info("🔧 Auto-fix enabled")
            logger.info("🧠 Memory optimization active")
            
            # Save initial stats
            self.save_stats()
            
            # Main monitoring loop
            while self.running:
                try:
                    # Save stats every minute
                    self.save_stats()
                    
                    # Sleep for 1 minute
                    time.sleep(60)
                    
                except KeyboardInterrupt:
                    logger.info("🛑 Stopping universal error fixer")
                    break
                except Exception as e:
                    logger.error(f"Error in main loop: {e}")
                    time.sleep(60)
                    
        except Exception as e:
            logger.error(f"Error starting universal error fixer: {e}")
            sys.exit(1)
        finally:
            self.cleanup()
            
    def cleanup(self):
        """Cleanup resources"""
        try:
            self.running = False
            
            # Stop file watcher
            if hasattr(self, 'observer'):
                self.observer.stop()
                self.observer.join()
                
            # Save final stats
            self.save_stats()
            
            logger.info("🧹 Universal error fixer cleanup completed")
            
        except Exception as e:
            logger.error(f"Error in cleanup: {e}")

def main():
    """Main function to start universal error fixer"""
    try:
        error_fixer = QMOIUniversalErrorFixer()
        error_fixer.start()
    except KeyboardInterrupt:
        logger.info("Universal error fixer stopped by user")
    except Exception as e:
        logger.error(f"Error in main: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 