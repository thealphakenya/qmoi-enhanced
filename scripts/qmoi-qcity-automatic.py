#!/usr/bin/env python3
"""
QMOI QCity Automatic System
Comprehensive automation with GitLab CI/CD, real-time monitoring, and self-healing
"""

import asyncio
import json
import logging
import os
import subprocess
import sys
import time
import threading
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
        logging.FileHandler('logs/qmoi-qcity-automatic.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QMOIQCityAutomatic:
    def __init__(self):
        self.running = False
        self.automation_stats = {
            'total_runs': 0,
            'successful_deployments': 0,
            'failed_deployments': 0,
            'gitlab_ci_triggers': 0,
            'github_syncs': 0,
            'vercel_deployments': 0,
            'gitpod_integrations': 0,
            'auto_evolutions': 0,
            'health_checks': 0,
            'last_run': None,
            'current_status': 'idle',
            'platform_status': {
                'gitlab': 'unknown',
                'github': 'unknown',
                'vercel': 'unknown',
                'gitpod': 'unknown'
            }
        }
        self.setup_file_watcher()
        self.setup_scheduled_tasks()
        
    def setup_file_watcher(self):
        """Setup file system watcher for automatic triggers"""
        class QMOIFileHandler(FileSystemEventHandler):
            def __init__(self, automation):
                self.automation = automation
                
            def on_modified(self, event):
                if not event.is_directory:
                    if event.src_path.endswith(('.py', '.js', '.ts', '.tsx', '.json', '.md')):
                        logger.info(f"File modified: {event.src_path}")
                        self.automation.auto_trigger_qcity()
                        
        self.file_handler = QMOIFileHandler(self)
        self.observer = Observer()
        self.observer.schedule(self.file_handler, '.', recursive=True)
        self.observer.start()
        
    def setup_scheduled_tasks(self):
        """Setup scheduled automation tasks"""
        # Run comprehensive automation every 10 minutes
        schedule.every(10).minutes.do(self.run_comprehensive_qcity)
        
        # GitLab CI trigger every 5 minutes
        schedule.every(5).minutes.do(self.trigger_gitlab_ci)
        
        # Health check every 3 minutes
        schedule.every(3).minutes.do(self.run_health_check)
        
        # Platform sync every 15 minutes
        schedule.every(15).minutes.do(self.sync_all_platforms)
        
        # Auto-evolution every 30 minutes
        schedule.every(30).minutes.do(self.run_auto_evolution)
        
        # Dashboard update every 2 minutes
        schedule.every(2).minutes.do(self.update_dashboard)
        
        def run_scheduler():
            while self.running:
                schedule.run_pending()
                time.sleep(1)
                
        self.scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
        
    def auto_trigger_qcity(self):
        """Automatically trigger QCity automation when files change"""
        try:
            logger.info("🔄 Auto-triggering QCity automation due to file changes")
            self.run_comprehensive_qcity()
        except Exception as e:
            logger.error(f"❌ Error in auto-trigger: {e}")
            
    def run_comprehensive_qcity(self):
        """Run comprehensive QMOI QCity automation"""
        try:
            # Always run from repo root
            repo_root = os.path.abspath(os.path.dirname(__file__)).split('scripts')[0]
            os.chdir(repo_root)
            # Auto-pull before automation
            try:
                logger.info('Scheduled git pull/merge before automation...')
                subprocess.run('git pull --rebase', shell=True, check=True)
                logger.info('Git pull/merge completed.')
            except Exception as e:
                logger.error(f'Git pull/merge failed: {e}')
            self.automation_stats['current_status'] = 'running'
            self.automation_stats['total_runs'] += 1
            self.automation_stats['last_run'] = datetime.now().isoformat()
            logger.info("\U0001F680 Starting comprehensive QMOI QCity automation")
            # Run all QCity automation steps with retry logic
            qcity_steps = [
                ('npm run qmoi:setup', 'QMOI Setup'),
                ('npm run qmoi:test', 'QMOI Tests'),
                ('npm run qmoi:build', 'QMOI Build'),
                ('npm run qmoi:deploy', 'QMOI Deploy'),
                ('npm run gitlab:full-pipeline', 'GitLab Pipeline'),
                ('npm run qmoi:gitpod', 'Gitpod Integration'),
                ('npm run qmoi:github-fallback', 'GitHub Fallback'),
                ('npm run qmoi:platform-monitor', 'Platform Monitor'),
                ('npm run qmoi:health', 'Health Check'),
                ('npm run qmoi:notify', 'Notifications'),
                ('npm run qmoi:recovery', 'Error Recovery'),
                ('python scripts/autotest/advanced_autotest_system.py', 'QMOI Autotest')
            ]
            for command, description in qcity_steps:
                retries = 0
                max_retries = 3
                while retries < max_retries:
                    try:
                        logger.info(f"\U0001F504 Running: {description} (Attempt {retries+1})")
                        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=300)
                        if result.returncode == 0:
                            logger.info(f"\u2705 {description} completed successfully")
                            self.automation_stats['successful_deployments'] += 1
                            # Send notification for success
                            self.send_notification(f"{description} succeeded", result.stdout)
                            break
                        else:
                            logger.error(f"\u274c {description} failed: {result.stderr}")
                            self.automation_stats['failed_deployments'] += 1
                            self.send_notification(f"{description} failed", result.stderr)
                            retries += 1
                    except subprocess.TimeoutExpired:
                        logger.error(f"\u23f0 {description} timed out")
                        self.automation_stats['failed_deployments'] += 1
                        self.send_notification(f"{description} timed out", "Timeout")
                        retries += 1
                    except Exception as e:
                        logger.error(f"\u274c Error running {description}: {e}")
                        self.automation_stats['failed_deployments'] += 1
                        self.send_notification(f"{description} error", str(e))
                        retries += 1
            # Update status
            self.automation_stats['current_status'] = 'completed'
            logger.info("\u2705 Comprehensive QMOI QCity automation completed")
        except Exception as e:
            logger.error(f"\u274c Error in comprehensive QCity automation: {e}")
            self.automation_stats['current_status'] = 'failed'
            self.send_notification("QMOI QCity automation failed", str(e))

    def send_notification(self, subject, message):
        try:
            # Use the notification manager if available
            subprocess.run(f'python scripts/qmoi_notification_manager.py "{subject}" "{message}"', shell=True)
        except Exception as e:
            logger.error(f"Failed to send notification: {e}")
            
    def trigger_gitlab_ci(self):
        """Trigger GitLab CI/CD pipeline"""
        try:
            logger.info("🚀 Triggering GitLab CI/CD pipeline")
            
            gitlab_commands = [
                ('npm run gitlab:push', 'Push to GitLab'),
                ('npm run gitlab:deploy', 'Deploy to GitLab'),
                ('npm run gitlab:notify', 'GitLab Notifications')
            ]
            
            for command, description in gitlab_commands:
                try:
                    result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=300)
                    
                    if result.returncode == 0:
                        logger.info(f"✅ {description} completed")
                        self.automation_stats['gitlab_ci_triggers'] += 1
                    else:
                        logger.error(f"❌ {description} failed: {result.stderr}")
                        
                except Exception as e:
                    logger.error(f"❌ Error in {description}: {e}")
                    
        except Exception as e:
            logger.error(f"Error triggering GitLab CI: {e}")
            
    def run_health_check(self):
        """Run comprehensive health check"""
        try:
            logger.info("🏥 Running health check")
            
            health_commands = [
                ('npm run qmoi:health', 'QMOI Health'),
                ('npm run gitlab:health', 'GitLab Health'),
                ('npm run github:monitor', 'GitHub Monitor'),
                ('npm run gitpod:monitor', 'Gitpod Monitor')
            ]
            
            for command, description in health_commands:
                try:
                    result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=60)
                    
                    if result.returncode == 0:
                        logger.info(f"✅ {description} passed")
                        self.automation_stats['health_checks'] += 1
                    else:
                        logger.warning(f"⚠️ {description} failed: {result.stderr}")
                        
                except Exception as e:
                    logger.error(f"❌ Error in {description}: {e}")
                    
        except Exception as e:
            logger.error(f"Error in health check: {e}")
            
    def sync_all_platforms(self):
        """Sync across all platforms"""
        try:
            logger.info("🔄 Syncing all platforms")
            
            sync_commands = [
                ('npm run github:sync-to', 'Sync to GitHub'),
                ('npm run github:sync-from', 'Sync from GitHub'),
                ('npm run gitlab:push', 'Push to GitLab'),
                ('npm run qmoi:platform-monitor', 'Monitor platforms')
            ]
            
            for command, description in sync_commands:
                try:
                    result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=300)
                    
                    if result.returncode == 0:
                        logger.info(f"✅ {description} completed")
                        self.automation_stats['github_syncs'] += 1
                    else:
                        logger.error(f"❌ {description} failed: {result.stderr}")
                        
                except Exception as e:
                    logger.error(f"❌ Error in {description}: {e}")
                    
        except Exception as e:
            logger.error(f"Error in platform sync: {e}")
            
    def run_auto_evolution(self):
        """Run auto-evolution for continuous improvement"""
        try:
            logger.info("🧬 Running auto-evolution")
            
            evolution_commands = [
                ('python scripts/qmoi-auto-evolution.py', 'Auto-evolution'),
                ('python scripts/qmoi-quick-test.py', 'Quick test'),
                ('npm run qmoi:json-fix', 'JSON fix')
            ]
            
            for command, description in evolution_commands:
                try:
                    result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=300)
                    
                    if result.returncode == 0:
                        logger.info(f"✅ {description} completed")
                        self.automation_stats['auto_evolutions'] += 1
                    else:
                        logger.error(f"❌ {description} failed: {result.stderr}")
                        
                except Exception as e:
                    logger.error(f"❌ Error in {description}: {e}")
                    
        except Exception as e:
            logger.error(f"Error in auto-evolution: {e}")
            
    def update_dashboard(self):
        """Update dashboard with current stats"""
        try:
            # Save stats to file for dashboard access
            stats_file = 'logs/qcity-automatic-stats.json'
            os.makedirs('logs', exist_ok=True)
            
            with open(stats_file, 'w') as f:
                json.dump(self.automation_stats, f, indent=2, default=str)
                
            # Update platform status
            self.update_platform_status()
            
        except Exception as e:
            logger.error(f"Error updating dashboard: {e}")
            
    def update_platform_status(self):
        """Update platform status"""
        try:
            # Check GitLab status
            result = subprocess.run('git remote -v', shell=True, capture_output=True, text=True)
            if 'gitlab' in result.stdout.lower():
                self.automation_stats['platform_status']['gitlab'] = 'connected'
            else:
                self.automation_stats['platform_status']['gitlab'] = 'disconnected'
                
            # Check GitHub status
            if 'github' in result.stdout.lower():
                self.automation_stats['platform_status']['github'] = 'connected'
            else:
                self.automation_stats['platform_status']['github'] = 'disconnected'
                
            # Check Vercel status
            vercel_result = subprocess.run('vercel --version', shell=True, capture_output=True, text=True)
            if vercel_result.returncode == 0:
                self.automation_stats['platform_status']['vercel'] = 'connected'
            else:
                self.automation_stats['platform_status']['vercel'] = 'disconnected'
                
            # Check Gitpod status
            gitpod_result = subprocess.run('gp --version', shell=True, capture_output=True, text=True)
            if gitpod_result.returncode == 0:
                self.automation_stats['platform_status']['gitpod'] = 'connected'
            else:
                self.automation_stats['platform_status']['gitpod'] = 'disconnected'
                
        except Exception as e:
            logger.error(f"Error updating platform status: {e}")
            
    def start_dashboard(self):
        """Start the dashboard in background"""
        try:
            logger.info("📊 Starting QMOI dashboard")
            subprocess.Popen(['python', 'scripts/qmoi-dashboard-enhance.py'], 
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            time.sleep(5)  # Wait for dashboard to start
            logger.info("✅ Dashboard started successfully")
        except Exception as e:
            logger.error(f"Error starting dashboard: {e}")
            
    def start_gitlab_ci_automation(self):
        """Start GitLab CI automation in background"""
        try:
            logger.info("🚀 Starting GitLab CI automation")
            subprocess.Popen(['python', 'scripts/qmoi-gitlab-ci-automation.py'], 
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            time.sleep(3)  # Wait for automation to start
            logger.info("✅ GitLab CI automation started successfully")
        except Exception as e:
            logger.error(f"Error starting GitLab CI automation: {e}")
            
    def save_stats(self):
        """Save automation stats to file"""
        try:
            stats_file = 'logs/qcity-automatic-stats.json'
            os.makedirs('logs', exist_ok=True)
            
            with open(stats_file, 'w') as f:
                json.dump(self.automation_stats, f, indent=2, default=str)
                
        except Exception as e:
            logger.error(f"Error saving stats: {e}")
            
    def start(self):
        """Start the QMOI QCity automatic system"""
        try:
            # Create logs directory
            os.makedirs('logs', exist_ok=True)
            
            # Start scheduler
            self.running = True
            self.scheduler_thread.start()
            
            logger.info("🚀 QMOI QCity Automatic System started")
            logger.info("📊 Dashboard and monitoring active")
            logger.info("🔄 Auto-triggering enabled")
            logger.info("⏰ Scheduled tasks running")
            logger.info("🔧 GitLab CI/CD automation active")
            logger.info("🌐 Platform integration active")
            logger.info("🧬 Auto-evolution enabled")
            logger.info("🏥 Health monitoring active")
            
            # Start dashboard
            self.start_dashboard()
            
            # Start GitLab CI automation
            self.start_gitlab_ci_automation()
            
            # Save initial stats
            self.save_stats()
            
            # Main monitoring loop
            while self.running:
                try:
                    # Update dashboard
                    self.update_dashboard()
                    
                    # Save stats every minute
                    self.save_stats()
                    
                    # Sleep for 1 minute
                    time.sleep(60)
                    
                except KeyboardInterrupt:
                    logger.info("🛑 Stopping QMOI QCity automatic system")
                    break
                except Exception as e:
                    logger.error(f"Error in main loop: {e}")
                    time.sleep(60)
                    
        except Exception as e:
            logger.error(f"Error starting QMOI QCity automatic system: {e}")
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
            
            logger.info("🧹 QMOI QCity automatic system cleanup completed")
            
        except Exception as e:
            logger.error(f"Error in cleanup: {e}")

def run_doc_verifier():
    try:
        print("[QMOI] Running documentation verifier...")
        subprocess.run(["node", "scripts/qmoi_doc_verifier.js", "verify"], check=True)
    except Exception as e:
        print(f"[QMOI] Documentation verifier failed: {e}")

def main():
    """Main function to start QMOI QCity automatic system"""
    try:
        automation = QMOIQCityAutomatic()
        automation.start()
        run_doc_verifier()
    except KeyboardInterrupt:
        logger.info("QMOI QCity automatic system stopped by user")
    except Exception as e:
        logger.error(f"Error in main: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 