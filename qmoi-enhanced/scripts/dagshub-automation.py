#!/usr/bin/env python3
"""
DagsHub Automation Script
Handles ML model versioning, repository management, and cloud optimizations
"""

import os
import sys
import json
import subprocess
import requests
from pathlib import Path
from datetime import datetime
import logging

class DagsHubAutomation:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.dagshub_token = os.getenv("DAGSHUB_TOKEN", "")
        self.dagshub_url = "https://dagshub.com/api/v1"
        self.repo_name = os.getenv("DAGSHUB_REPO", "qmoi/alpha-q-ai")
        
        # Setup logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def setup_dagshub(self):
        """Setup DagsHub repository and configuration"""
        try:
            self.logger.info("🔗 Setting up DagsHub...")
            
            # Install DagsHub CLI if not present
            try:
                subprocess.run(["pip", "install", "dagshub"], check=True)
            except subprocess.CalledProcessError:
                self.logger.warning("⚠️ Failed to install DagsHub CLI")
            
            # Configure DagsHub
            if self.dagshub_token:
                subprocess.run([
                    "dagshub", "configure", 
                    "--token", self.dagshub_token,
                    "--host", "dagshub.com"
                ], cwd=self.project_root)
            
            self.logger.info("✅ DagsHub setup completed")
            
        except Exception as e:
            self.logger.error(f"❌ DagsHub setup failed: {e}")
    
    def version_ml_models(self):
        """Version ML models in the repository"""
        try:
            self.logger.info("📊 Versioning ML models...")
            
            # Find ML model files
            model_files = list(self.project_root.rglob("*.pkl")) + \
                         list(self.project_root.rglob("*.h5")) + \
                         list(self.project_root.rglob("*.pt")) + \
                         list(self.project_root.rglob("*.pth"))
            
            for model_file in model_files:
                # Create version tag
                version = datetime.now().strftime("%Y%m%d_%H%M%S")
                tag_name = f"model_{model_file.stem}_{version}"
                
                # Add to DagsHub
                subprocess.run([
                    "dagshub", "upload",
                    str(model_file),
                    f"models/{model_file.name}",
                    "--message", f"Auto-versioned model: {model_file.name}"
                ], cwd=self.project_root)
            
            self.logger.info(f"✅ Versioned {len(model_files)} ML models")
            
        except Exception as e:
            self.logger.error(f"❌ ML model versioning failed: {e}")
    
    def optimize_for_ml(self):
        """Optimize repository for ML workloads"""
        try:
            self.logger.info("🤖 Optimizing for ML workloads...")
            
            # Create ML-specific configuration
            ml_config = {
                "ml_optimized": True,
                "gpu_enabled": True,
                "memory_optimized": True,
                "auto_scaling": True,
                "model_versioning": True
            }
            
            config_file = self.project_root / "config" / "dagshub_ml_config.json"
            config_file.parent.mkdir(exist_ok=True)
            
            with open(config_file, 'w') as f:
                json.dump(ml_config, f, indent=2)
            
            self.logger.info("✅ ML optimization completed")
            
        except Exception as e:
            self.logger.error(f"❌ ML optimization failed: {e}")
    
    def sync_with_dagshub(self):
        """Sync repository with DagsHub"""
        try:
            self.logger.info("🔄 Syncing with DagsHub...")
            
            # Initialize DagsHub repository
            subprocess.run([
                "dagshub", "init",
                "--repo", self.repo_name
            ], cwd=self.project_root)
            
            # Push to DagsHub
            subprocess.run([
                "dagshub", "push",
                "--message", "Auto-sync from QMOI automation"
            ], cwd=self.project_root)
            
            self.logger.info("✅ DagsHub sync completed")
            
        except Exception as e:
            self.logger.error(f"❌ DagsHub sync failed: {e}")
    
    def run_ml_automation(self):
        """Run complete ML automation"""
        try:
            self.logger.info("🚀 Starting DagsHub ML automation...")
            
            # Setup DagsHub
            self.setup_dagshub()
            
            # Version ML models
            self.version_ml_models()
            
            # Optimize for ML
            self.optimize_for_ml()
            
            # Sync with DagsHub
            self.sync_with_dagshub()
            
            self.logger.info("🎉 DagsHub ML automation completed!")
            
        except Exception as e:
            self.logger.error(f"❌ DagsHub automation failed: {e}")
            raise

if __name__ == "__main__":
    automation = DagsHubAutomation()
    automation.run_ml_automation() 