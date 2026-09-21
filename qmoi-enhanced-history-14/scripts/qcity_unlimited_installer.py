#!/usr/bin/env python3
"""
QCity Unlimited Installer
Specialized installer for unlimited QCity with advanced dependency management
"""

import os
import sys
import subprocess
import json
import logging
import time
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import requests
import zipfile
import tarfile

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qcity_unlimited_installer.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QCityUnlimitedInstaller:
    """Specialized installer for unlimited QCity"""
    
    def __init__(self):
        self.install_path = Path("qcity_unlimited")
        self.backup_path = Path("qcity_backups")
        self.install_log = []
        self.error_log = []
        self.success_log = []
        self.master_config = self.load_master_config()
        
    def load_master_config(self) -> Dict:
        """Load master configuration for unlimited QCity"""
        config_path = Path("config/qcity_unlimited_config.json")
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return {
            "auto_backup": True,
            "clean_install": True,
            "install_dependencies": True,
            "setup_database": True,
            "configure_services": True,
            "master_only_install": True,
            "unlimited_features": True,
            "auto_optimization": True
        }
    
    def backup_existing_installation(self) -> bool:
        """Backup existing QCity installation"""
        if not self.master_config['auto_backup']:
            return True
        
        if not self.install_path.exists():
            return True
        
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_name = f"qcity_backup_{timestamp}"
            backup_dir = self.backup_path / backup_name
            
            self.backup_path.mkdir(exist_ok=True)
            
            # Create backup
            shutil.copytree(self.install_path, backup_dir)
            
            self.success_log.append(f"Backup created: {backup_name}")
            logger.info(f"Backup created: {backup_name}")
            return True
            
        except Exception as e:
            self.error_log.append(f"Backup failed: {e}")
            logger.error(f"Backup failed: {e}")
            return False
    
    def clean_installation_directory(self) -> bool:
        """Clean installation directory"""
        if not self.master_config['clean_install']:
            return True
        
        try:
            if self.install_path.exists():
                shutil.rmtree(self.install_path)
            
            self.install_path.mkdir(parents=True, exist_ok=True)
            
            self.success_log.append("Installation directory cleaned")
            logger.info("Installation directory cleaned")
            return True
            
        except Exception as e:
            self.error_log.append(f"Clean failed: {e}")
            logger.error(f"Clean failed: {e}")
            return False
    
    def download_qcity_unlimited(self) -> bool:
        """Download QCity unlimited from repository"""
        try:
            # Create download directory
            download_dir = self.install_path / "downloads"
            download_dir.mkdir(parents=True, exist_ok=True)
            
            # Download from multiple sources for redundancy
            sources = [
                "https://github.com/q-city/qcity-unlimited/archive/main.zip",
                "https://gitlab.com/q-city/qcity-unlimited/-/archive/main/qcity-unlimited-main.tar.gz"
            ]
            
            for source in sources:
                try:
                    logger.info(f"Downloading from {source}")
                    response = requests.get(source, stream=True, timeout=300)
                    response.raise_for_status()
                    
                    filename = source.split('/')[-1]
                    file_path = download_dir / filename
                    
                    with open(file_path, 'wb') as f:
                        for chunk in response.iter_content(chunk_size=8192):
                            f.write(chunk)
                    
                    self.success_log.append(f"Downloaded: {filename}")
                    return self.extract_download(file_path)
                    
                except Exception as e:
                    logger.warning(f"Download from {source} failed: {e}")
                    continue
            
            # If all downloads fail, create a basic structure
            return self.create_basic_structure()
            
        except Exception as e:
            self.error_log.append(f"Download failed: {e}")
            logger.error(f"Download failed: {e}")
            return self.create_basic_structure()
    
    def extract_download(self, file_path: Path) -> bool:
        """Extract downloaded file"""
        try:
            extract_dir = self.install_path / "extracted"
            extract_dir.mkdir(exist_ok=True)
            
            if file_path.suffix == '.zip':
                with zipfile.ZipFile(file_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_dir)
            elif file_path.suffix == '.tar.gz':
                with tarfile.open(file_path, 'r:gz') as tar_ref:
                    tar_ref.extractall(extract_dir)
            
            # Move contents to main directory
            extracted_contents = list(extract_dir.iterdir())
            if extracted_contents:
                main_content = extracted_contents[0]
                for item in main_content.iterdir():
                    shutil.move(str(item), str(self.install_path / item.name))
            
            self.success_log.append("Download extracted successfully")
            logger.info("Download extracted successfully")
            return True
            
        except Exception as e:
            self.error_log.append(f"Extraction failed: {e}")
            logger.error(f"Extraction failed: {e}")
            return False
    
    def create_basic_structure(self) -> bool:
        """Create basic QCity unlimited structure"""
        try:
            # Create directory structure
            directories = [
                "src",
                "config",
                "data",
                "models",
                "logs",
                "tests",
                "docs",
                "scripts",
                "api",
                "web",
                "mobile",
                "cloud",
                "ai",
                "ml",
                "analytics",
                "security",
                "monitoring"
            ]
            
            for directory in directories:
                (self.install_path / directory).mkdir(exist_ok=True)
            
            # Create basic files
            files = {
                "README.md": "# QCity Unlimited\n\nAdvanced AI-powered city management system",
                "requirements.txt": self.generate_requirements(),
                "setup.py": self.generate_setup_py(),
                "config/config.json": self.generate_config(),
                "src/__init__.py": "",
                "api/__init__.py": "",
                "web/__init__.py": "",
                "mobile/__init__.py": "",
                "cloud/__init__.py": "",
                "ai/__init__.py": "",
                "ml/__init__.py": "",
                "analytics/__init__.py": "",
                "security/__init__.py": "",
                "monitoring/__init__.py": ""
            }
            
            for file_path, content in files.items():
                full_path = self.install_path / file_path
                full_path.parent.mkdir(parents=True, exist_ok=True)
                with open(full_path, 'w') as f:
                    f.write(content)
            
            self.success_log.append("Basic structure created")
            logger.info("Basic structure created")
            return True
            
        except Exception as e:
            self.error_log.append(f"Structure creation failed: {e}")
            logger.error(f"Structure creation failed: {e}")
            return False
    
    def generate_requirements(self) -> str:
        """Generate requirements.txt for unlimited QCity"""
        return """# QCity Unlimited Requirements

# Core dependencies
requests>=2.25.0
psutil>=5.8.0
numpy>=1.21.0
pandas>=1.3.0
matplotlib>=3.4.0
seaborn>=0.11.0

# AI/ML dependencies
scikit-learn>=1.0.0
tensorflow>=2.8.0
torch>=1.10.0
transformers>=4.15.0
datasets>=1.17.0
accelerate>=0.5.0
optuna>=2.10.0
mlflow>=1.20.0
wandb>=0.12.0

# Web framework
fastapi>=0.70.0
uvicorn>=0.15.0
streamlit>=1.10.0
gradio>=3.0.0

# Database
sqlalchemy>=1.4.0
alembic>=1.7.0
redis>=4.0.0

# Task queue
celery>=5.2.0
flower>=1.0.0

# Monitoring
prometheus-client>=0.12.0
grafana-api>=1.0.0

# Logging
elasticsearch>=7.17.0
kibana>=7.17.0
logstash>=7.17.0

# Security
cryptography>=3.4.0
bcrypt>=3.2.0
passlib>=1.7.0

# Testing
pytest>=6.2.0
pytest-cov>=2.12.0
pytest-asyncio>=0.15.0

# Development
black>=21.0.0
flake8>=3.9.0
mypy>=0.910
"""
    
    def generate_setup_py(self) -> str:
        """Generate setup.py for unlimited QCity"""
        return """#!/usr/bin/env python3
from setuptools import setup, find_packages

setup(
    name="qcity-unlimited",
    version="1.0.0",
    description="Advanced AI-powered city management system",
    author="QCity Team",
    author_email="team@qcity.ai",
    packages=find_packages(),
    install_requires=[
        "requests>=2.25.0",
        "psutil>=5.8.0",
        "numpy>=1.21.0",
        "pandas>=1.3.0",
        "fastapi>=0.70.0",
        "uvicorn>=0.15.0",
        "sqlalchemy>=1.4.0",
        "redis>=4.0.0",
        "celery>=5.2.0",
        "tensorflow>=2.8.0",
        "torch>=1.10.0",
        "transformers>=4.15.0",
    ],
    extras_require={
        "dev": [
            "pytest>=6.2.0",
            "black>=21.0.0",
            "flake8>=3.9.0",
            "mypy>=0.910",
        ],
        "ai": [
            "scikit-learn>=1.0.0",
            "optuna>=2.10.0",
            "mlflow>=1.20.0",
            "wandb>=0.12.0",
        ],
        "monitoring": [
            "prometheus-client>=0.12.0",
            "elasticsearch>=7.17.0",
        ],
    },
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
)
"""
    
    def generate_config(self) -> str:
        """Generate configuration file"""
        config = {
            "version": "1.0.0",
            "unlimited_mode": True,
            "auto_optimization": True,
            "master_only": True,
            "features": {
                "ai_management": True,
                "ml_analytics": True,
                "cloud_integration": True,
                "mobile_support": True,
                "security_monitoring": True,
                "performance_optimization": True,
                "auto_evolution": True,
                "self_healing": True
            },
            "database": {
                "type": "postgresql",
                "host": "localhost",
                "port": 5432,
                "name": "qcity_unlimited",
                "user": "qcity_user",
                "password": "secure_password"
            },
            "redis": {
                "host": "localhost",
                "port": 6379,
                "db": 0
            },
            "celery": {
                "broker": "redis://localhost:6379/0",
                "backend": "redis://localhost:6379/0"
            },
            "api": {
                "host": "0.0.0.0",
                "port": 8000,
                "workers": 4
            },
            "web": {
                "host": "0.0.0.0",
                "port": 3000
            },
            "monitoring": {
                "enabled": True,
                "prometheus_port": 9090,
                "grafana_port": 3001
            }
        }
        
        return json.dumps(config, indent=2)
    
    def install_dependencies(self) -> Dict:
        """Install all dependencies for unlimited QCity"""
        if not self.master_config['install_dependencies']:
            return {'status': 'skipped', 'message': 'Dependency installation disabled'}
        
        logger.info("Installing unlimited QCity dependencies")
        
        requirements_file = self.install_path / "requirements.txt"
        if not requirements_file.exists():
            self.error_log.append("Requirements file not found")
            return {'status': 'failed', 'message': 'Requirements file not found'}
        
        try:
            # Install with pip
            result = subprocess.run(
                [sys.executable, '-m', 'pip', 'install', '-r', str(requirements_file)],
                capture_output=True, text=True, timeout=600
            )
            
            if result.returncode == 0:
                self.success_log.append("Dependencies installed successfully")
                logger.info("Dependencies installed successfully")
                return {'status': 'success', 'message': 'Dependencies installed'}
            else:
                error_msg = f"Dependency installation failed: {result.stderr}"
                self.error_log.append(error_msg)
                logger.error(error_msg)
                return {'status': 'failed', 'message': error_msg}
                
        except subprocess.TimeoutExpired:
            error_msg = "Dependency installation timed out"
            self.error_log.append(error_msg)
            logger.error(error_msg)
            return {'status': 'failed', 'message': error_msg}
        except Exception as e:
            error_msg = f"Dependency installation error: {e}"
            self.error_log.append(error_msg)
            logger.error(error_msg)
            return {'status': 'failed', 'message': error_msg}
    
    def setup_database(self) -> Dict:
        """Setup database for unlimited QCity"""
        if not self.master_config['setup_database']:
            return {'status': 'skipped', 'message': 'Database setup disabled'}
        
        logger.info("Setting up database")
        
        try:
            # Create database setup script
            setup_script = self.install_path / "scripts" / "setup_database.py"
            setup_script.parent.mkdir(exist_ok=True)
            
            script_content = '''#!/usr/bin/env python3
import sqlalchemy
from sqlalchemy import create_engine, text
import json

def setup_database():
    # Load config
    with open("config/config.json", "r") as f:
        config = json.load(f)
    
    db_config = config["database"]
    connection_string = f"postgresql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['name']}"
    
    # Create engine
    engine = create_engine(connection_string)
    
    # Test connection
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("Database connection successful")
    
    # Create tables (basic structure)
    tables_sql = [
        "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(100), email VARCHAR(100))",
        "CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, name VARCHAR(100), description TEXT)",
        "CREATE TABLE IF NOT EXISTS analytics (id SERIAL PRIMARY KEY, metric VARCHAR(100), value FLOAT, timestamp TIMESTAMP)"
    ]
    
    with engine.connect() as conn:
        for sql in tables_sql:
            conn.execute(text(sql))
        conn.commit()
    
    print("Database setup completed")

if __name__ == "__main__":
    setup_database()
'''
            
            with open(setup_script, 'w') as f:
                f.write(script_content)
            
            # Make executable
            os.chmod(setup_script, 0o755)
            
            self.success_log.append("Database setup script created")
            logger.info("Database setup script created")
            return {'status': 'success', 'message': 'Database setup script created'}
            
        except Exception as e:
            error_msg = f"Database setup failed: {e}"
            self.error_log.append(error_msg)
            logger.error(error_msg)
            return {'status': 'failed', 'message': error_msg}
    
    def configure_services(self) -> Dict:
        """Configure services for unlimited QCity"""
        if not self.master_config['configure_services']:
            return {'status': 'skipped', 'message': 'Service configuration disabled'}
        
        logger.info("Configuring services")
        
        try:
            # Create service configuration scripts
            services_dir = self.install_path / "scripts" / "services"
            services_dir.mkdir(parents=True, exist_ok=True)
            
            # API service
            api_service = services_dir / "start_api.py"
            api_content = '''#!/usr/bin/env python3
import uvicorn
from fastapi import FastAPI

app = FastAPI(title="QCity Unlimited API", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "QCity Unlimited API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''
            
            with open(api_service, 'w') as f:
                f.write(api_content)
            
            # Web service
            web_service = services_dir / "start_web.py"
            web_content = '''#!/usr/bin/env python3
import streamlit as st

st.title("QCity Unlimited Dashboard")
st.write("Welcome to QCity Unlimited - Advanced AI-powered city management")

# Add dashboard components here
st.sidebar.title("Navigation")
page = st.sidebar.selectbox("Choose a page", ["Overview", "Analytics", "AI Models", "Settings"])

if page == "Overview":
    st.header("System Overview")
    st.metric("Active Users", "1,234")
    st.metric("Projects", "56")
    st.metric("AI Models", "23")
elif page == "Analytics":
    st.header("Analytics Dashboard")
    st.write("Analytics content here")
elif page == "AI Models":
    st.header("AI Models Management")
    st.write("AI models content here")
elif page == "Settings":
    st.header("Settings")
    st.write("Settings content here")
'''
            
            with open(web_service, 'w') as f:
                f.write(web_content)
            
            # Make executable
            os.chmod(api_service, 0o755)
            os.chmod(web_service, 0o755)
            
            self.success_log.append("Services configured")
            logger.info("Services configured")
            return {'status': 'success', 'message': 'Services configured'}
            
        except Exception as e:
            error_msg = f"Service configuration failed: {e}"
            self.error_log.append(error_msg)
            logger.error(error_msg)
            return {'status': 'failed', 'message': error_msg}
    
    def run_installation(self) -> Dict:
        """Run complete unlimited QCity installation"""
        logger.info("Starting unlimited QCity installation")
        
        installation_results = {
            'backup': self.backup_existing_installation(),
            'clean': self.clean_installation_directory(),
            'download': self.download_qcity_unlimited(),
            'dependencies': self.install_dependencies(),
            'database': self.setup_database(),
            'services': self.configure_services(),
            'timestamp': datetime.now().isoformat()
        }
        
        # Generate installation report
        report = {
            'installation_results': installation_results,
            'success_log': self.success_log,
            'error_log': self.error_log,
            'install_path': str(self.install_path.absolute()),
            'recommendations': self.generate_recommendations()
        }
        
        # Save report
        report_path = Path("qcity_reports/unlimited_installation_report.json")
        report_path.parent.mkdir(exist_ok=True)
        
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def generate_recommendations(self) -> List[str]:
        """Generate recommendations based on installation results"""
        recommendations = []
        
        if len(self.error_log) > 0:
            recommendations.append("Review error log and address failed installations")
        
        if not self.install_path.exists():
            recommendations.append("Installation directory not found - check permissions")
        
        recommendations.extend([
            "Configure database connection in config/config.json",
            "Set up environment variables for sensitive data",
            "Configure monitoring and logging",
            "Set up backup and recovery procedures",
            "Configure security settings and access controls"
        ])
        
        return recommendations

def main():
    """Main unlimited installer runner"""
    logger.info("Starting QCity Unlimited Installer")
    
    installer = QCityUnlimitedInstaller()
    report = installer.run_installation()
    
    # Print summary
    print("\n" + "="*50)
    print("QCity Unlimited Installation Report")
    print("="*50)
    print(f"Install Path: {report['install_path']}")
    print(f"Backup: {'✓' if report['installation_results']['backup'] else '✗'}")
    print(f"Clean: {'✓' if report['installation_results']['clean'] else '✗'}")
    print(f"Download: {'✓' if report['installation_results']['download'] else '✗'}")
    print(f"Dependencies: {report['installation_results']['dependencies']['status']}")
    print(f"Database: {report['installation_results']['database']['status']}")
    print(f"Services: {report['installation_results']['services']['status']}")
    print(f"Errors: {len(report['error_log'])}")
    print("="*50)
    
    if len(report['recommendations']) > 0:
        print("\nRecommendations:")
        for rec in report['recommendations']:
            print(f"  - {rec}")
    
    logger.info("QCity Unlimited Installation completed")

if __name__ == "__main__":
    main() 