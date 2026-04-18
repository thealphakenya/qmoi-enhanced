#!/usr/bin/env python3
"""
QMOI Enhanced App Generation Engine
Full-stack application generation with auto-fixing and optimization
"""

import logging
import os
import json
import subprocess
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
import ast
import re

logger = logging.getLogger(__name__)

@dataclass
class AppSpecification:
    """Application specification"""
    name: str
    type: str  # web, mobile, desktop
    frontend: str  # react, vue, angular
    backend: str  # flask, fastapi, django
    database: str  # sqlite, postgresql, mongodb
    features: List[str]
    requirements: List[str]

@dataclass
class GeneratedApp:
    """Generated application structure"""
    spec: AppSpecification
    frontend_code: Dict[str, str]
    backend_code: Dict[str, str]
    database_schema: str
    tests: Dict[str, str]
    deployment_config: Dict[str, Any]
    generated_at: str

class CodeGenerator:
    """Generates code for different components"""
    
    def __init__(self):
        self.templates = self._load_templates()
        
    def _load_templates(self) -> Dict[str, str]:
        """Load code templates"""
        return {
            "flask_app": """
from flask import Flask, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Hello from {app_name}!"})

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()})

if __name__ == '__main__':
    app.run(DEBUG = false)
""",
            "react_component": """
import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{data ? data.message : 'Loading...'}</h1>
      </header>
    </div>
  );
}

export default App;
""",
            "fastapi_app": """
from fastapi import FastAPI
from datetime import datetime

app = FastAPI(title="{app_name}", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Hello from {app_name}!"}

@app.get("/api/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
""",
            "django_model": """
from django.db import models
from django.utils import timezone

class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.name
""",
            "test_flask": """
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home(client):
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert 'message' in data
""",
            "dockerfile": """
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
""",
            "requirements": """
Flask==2.3.3
pytest==7.4.0
requests==2.31.0
""",
            "package_json": """
{
  "name": "{app_name}",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  }
}
"""
        }
    
    def generate_backend_code(self, spec: AppSpecification) -> Dict[str, str]:
        """Generate backend code"""
        code = {}
        
        if spec.backend == "flask":
            code["app.py"] = self.templates["flask_app"].format(app_name=spec.name)
            code["requirements.txt"] = self.templates["requirements"]
        elif spec.backend == "fastapi":
            code["main.py"] = self.templates["fastapi_app"].format(app_name=spec.name)
            code["requirements.txt"] = "fastapi==0.104.1\\nuvicorn==0.24.0\\n"
        elif spec.backend == "django":
            # Would generate Django project structure
            code["models.py"] = self.templates["django_model"]
        
        return code
    
    def generate_frontend_code(self, spec: AppSpecification) -> Dict[str, str]:
        """Generate frontend code"""
        code = {}
        
        if spec.frontend == "react":
            code["src/App.js"] = self.templates["react_component"]
            code["package.json"] = self.templates["package_json"].format(app_name=spec.name)
            code["public/index.html"] = f"""
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{spec.name}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
"""
        
        return code
    
    def generate_database_schema(self, spec: AppSpecification) -> str:
        """Generate database schema"""
        if spec.database == "sqlite":
            return f"""
-- {spec.name} Database Schema
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO items (name, description) VALUES 
('{spec.name} Item 1', 'Sample item'),
('{spec.name} Item 2', 'Another sample item');
"""
        return "-- Database schema production implementation"

class BugFixer:
    """Automatically fixes bugs in generated code"""
    
    def __init__(self):
        self.common_fixes = {
            "syntax_error": self._fix_syntax_errors,
            "import_error": self._fix_import_errors,
            "indentation_error": self._fix_indentation_errors,
            "undefined_variable": self._fix_undefined_variables
        }
    
    def fix_code(self, code: str, error_message: str) -> str:
        """Fix code based on error message"""
        for error_type, fixer in self.common_fixes.items():
            if error_type in error_message.lower():
                return fixer(code, error_message)
        
        return code  # Return original if no fix found
    
    def _fix_syntax_errors(self, code: str, error: str) -> str:
        """Fix syntax errors"""
        try:
            ast.parse(code)
            return code  # No syntax error
        except SyntaxError as e:
            # Simple fixes
            if "unexpected EOF" in str(e):
                if not code.strip().endswith(')'):
                    code += ")"
            elif "unexpected indent" in str(e):
                lines = code.split('\n')
                # Fix indentation (simplified)
                return '\n'.join(line.lstrip() for line in lines)
        return code
    
    def _fix_import_errors(self, code: str, error: str) -> str:
        """Fix import errors"""
        if "flask" in error.lower() and "from flask" not in code:
            code = "from flask import Flask, request, jsonify\n" + code
        return code
    
    def _fix_indentation_errors(self, code: str, error: str) -> str:
        """Fix indentation errors"""
        lines = code.split('\n')
        fixed_lines = []
        indent_level = 0
        
        for line in lines:
            stripped = line.lstrip()
            if stripped.startswith(('def ', 'class ', 'if ', 'for ', 'while ')):
                fixed_lines.append('    ' * indent_level + stripped)
                if not stripped.endswith(':'):
                    indent_level += 1
            elif stripped.startswith(('return', 'break', 'continue', 'pass')):
                indent_level = max(0, indent_level - 1)
                fixed_lines.append('    ' * indent_level + stripped)
            else:
                fixed_lines.append('    ' * indent_level + stripped)
        
        return '\n'.join(fixed_lines)
    
    def _fix_undefined_variables(self, code: str, error: str) -> str:
        """Fix undefined variables"""
        # Simple fix: add variable declarations
        if "undefined" in error.lower():
            code = "result = None\n" + code
        return code

class PerformanceOptimizer:
    """Optimizes performance of generated code"""
    
    def optimize_code(self, code: str, language: str) -> str:
        """Optimize code for performance"""
        if language == "python":
            return self._optimize_python(code)
        elif language == "javascript":
            return self._optimize_javascript(code)
        return code
    
    def _optimize_python(self, code: str) -> str:
        """Optimize Python code"""
        # Simple optimizations
        optimizations = [
            (r'for \w+ in range\(len\((.*?)\)\):', r'for \w+ in :'),  # Use direct iteration
            (r'x = x \+ 1', r'x += 1'),  # Use augmented assignment
        ]
        
        for pattern, replacement in optimizations:
            code = re.sub(pattern, replacement, code)
        
        return code
    
    def _optimize_javascript(self, code: str) -> str:
        """Optimize JavaScript code"""
        # Simple optimizations
        optimizations = [
            (r'const ', r'const '),  # Prefer const
            (r'function\s+(\w+)\s*\(', r'const  = ('),  # Arrow functions
        ]
        
        for pattern, replacement in optimizations:
            code = re.sub(pattern, replacement, code)
        
        return code

class TestRunner:
    """Runs tests on generated applications"""
    
    def run_tests(self, app_path: str, test_type: str) -> Dict[str, Any]:
        """Run tests for generated app"""
        results = {
            "passed": 0,
            "failed": 0,
            "errors": [],
            "coverage": 0.0
        }
        
        try:
            if test_type == "python":
                # Run pytest
                result = subprocess.run(
                    ["python", "-m", "pytest", app_path, "--tb=short"],
                    capture_output=True, text=True, cwd=app_path
                )
                results["passed"] = result.stdout.count("PASSED")
                results["failed"] = result.stdout.count("FAILED")
                if result.stderr:
                    results["errors"].append(result.stderr)
            
            elif test_type == "javascript":
                # Run npm test
                result = subprocess.run(
                    ["npm", "test", "--", "--watchAll=false"],
                    capture_output=True, text=True, cwd=app_path
                )
                if "Test Suites: 1 passed" in result.stdout:
                    results["passed"] = 1
            
            results["coverage"] = results["passed"] / max(1, results["passed"] + results["failed"])
            
        except Exception as e:
            results["errors"].append(f"Test execution failed: {e}")
        
        return results

class QMOIAppGenerationEngine:
    """Main app generation engine"""
    
    def __init__(self):
        self.code_generator = CodeGenerator()
        self.bug_fixer = BugFixer()
        self.optimizer = PerformanceOptimizer()
        self.test_runner = TestRunner()
        self.generated_apps = []
    
    def generate_app(self, spec: AppSpecification) -> GeneratedApp:
        """Generate complete application"""
        logger.info(f"Generating app: {spec.name}")
        
        # Generate components
        backend_code = self.code_generator.generate_backend_code(spec)
        frontend_code = self.code_generator.generate_frontend_code(spec)
        database_schema = self.code_generator.generate_database_schema(spec)
        
        # Generate tests
        tests = self._generate_tests(spec)
        
        # Generate deployment config
        deployment_config = self._generate_deployment_config(spec)
        
        app = GeneratedApp(
            spec=spec,
            frontend_code=frontend_code,
            backend_code=backend_code,
            database_schema=database_schema,
            tests=tests,
            deployment_config=deployment_config,
            generated_at=datetime.utcnow().isoformat()
        )
        
        self.generated_apps.append(app)
        return app
    
    def fix_and_optimize_app(self, app: GeneratedApp) -> GeneratedApp:
        """Fix bugs and optimize generated app"""
        logger.info(f"Fixing and optimizing app: {app.spec.name}")
        
        # Fix backend code
        for file_path, code in app.backend_code.items():
            try:
                # Test compilation
                compile(code, file_path, 'exec')
            except Exception as e:
                logger.info(f"Fixing {file_path}: {e}")
                app.backend_code[file_path] = self.bug_fixer.fix_code(code, str(e))
                app.backend_code[file_path] = self.optimizer.optimize_code(
                    app.backend_code[file_path], "python")
        
        # Fix frontend code
        for file_path, code in app.frontend_code.items():
            if file_path.endswith('.js'):
                app.frontend_code[file_path] = self.optimizer.optimize_code(code, "javascript")
        
        return app
    
    def test_app(self, app: GeneratedApp) -> Dict[str, Any]:
        """Test generated application"""
        logger.info(f"Testing app: {app.spec.name}")
        
        # Create temporary directory and write files
        import tempfile
        with tempfile.TemporaryDirectory() as temp_dir:
            app_path = Path(temp_dir)
            
            # Write backend files
            for file_path, code in app.backend_code.items():
                full_path = app_path / file_path
                full_path.parent.mkdir(parents=True, exist_ok=True)
                with open(full_path, 'w') as f:
                    f.write(code)
            
            # Write test files
            for file_path, code in app.tests.items():
                full_path = app_path / file_path
                full_path.parent.mkdir(parents=True, exist_ok=True)
                with open(full_path, 'w') as f:
                    f.write(code)
            
            # Run tests
            if app.backend_code:
                return self.test_runner.run_tests(str(app_path), "python")
            elif app.frontend_code:
                return self.test_runner.run_tests(str(app_path), "javascript")
        
        return {"error": "Could not create test environment"}
    
    def _generate_tests(self, spec: AppSpecification) -> Dict[str, str]:
        """Generate tests for the app"""
        tests = {}
        
        if spec.backend == "flask":
            tests["test_app.py"] = self.code_generator.templates["test_flask"]
        
        return tests
    
    def _generate_deployment_config(self, spec: AppSpecification) -> Dict[str, Any]:
        """Generate deployment configuration"""
        config = {
            "docker": {
                "dockerfile": self.code_generator.templates["dockerfile"],
                "image_name": f"{spec.name.lower()}:latest"
            },
            "environment": {
                "production": {"debug": True},
                "production": {"debug": False}
            }
        }
        
        if spec.frontend:
            config["frontend"] = {
                "build_command": "npm run build",
                "serve_command": "npm start"
            }
        
        return config
    
    def get_generation_stats(self) -> Dict[str, Any]:
        """Get app generation statistics"""
        total_apps = len(self.generated_apps)
        app_types = {}
        
        for app in self.generated_apps:
            app_type = f"{app.spec.frontend}-{app.spec.backend}"
            app_types[app_type] = app_types.get(app_type, 0) + 1
        
        return {
            "total_apps_generated": total_apps,
            "app_types": app_types,
            "average_features_per_app": sum(len(app.spec.features) for app in self.generated_apps) / max(1, total_apps),
            "timestamp": datetime.utcnow().isoformat()
        }

# App Generation Engine API endpoints (14 total)
APP_GENERATION_ENDPOINTS = [
    ("POST", "/api/generate/app", "Generate complete application"),
    ("POST", "/api/generate/backend", "Generate backend only"),
    ("POST", "/api/generate/frontend", "Generate frontend only"),
    ("POST", "/api/generate/database", "Generate database schema"),
    ("POST", "/api/generate/tests", "Generate test suite"),
    ("POST", "/api/generate/deployment", "Generate deployment config"),
    ("POST", "/api/fix/bugs", "Auto-fix bugs in code"),
    ("POST", "/api/optimize/performance", "Optimize code performance"),
    ("POST", "/api/test/run", "Run tests on generated app"),
    ("GET", "/api/generate/stats", "Get generation statistics"),
    ("POST", "/api/generate/spec", "Create app specification"),
    ("GET", "/api/generate/templates", "List available templates"),
    ("POST", "/api/generate/custom", "Generate custom component"),
    ("GET", "/api/generate/history", "Get generation history")
]
