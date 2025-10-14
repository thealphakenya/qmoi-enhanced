#!/usr/bin/env python3
"""
QMOI AI Lint Integration
Connects the automated linting system with QMOI AI for intelligent error fixing
"""

import json
import os
import sys
import asyncio
import logging
import argparse
from typing import Dict, List, Any, Optional
from datetime import datetime
from pathlib import Path
import subprocess
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("qmoi_lint_integration.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


class QMOILintIntegration:
    """QMOI AI integration for intelligent linting and error fixing"""

    def __init__(self, project_root: str = None):
        self.project_root = project_root or os.getcwd()
        self.logs_dir = os.path.join(self.project_root, "logs")
        self.reports_dir = os.path.join(self.project_root, "reports")
        self.ensure_dirs()

        # Load QMOI AI configuration
        self.qmoi_config = self.load_qmoi_config()
        self.ai_state = {
            "active": True,
            "consciousness_level": 0.9,
            "learning_enabled": True,
            "last_activity": datetime.now().isoformat(),
            "fixes_applied": 0,
            "files_processed": 0,
        }

        logger.info("QMOI AI Lint Integration initialized")

    def ensure_dirs(self):
        """Ensure required directories exist"""
        for dir_path in [self.logs_dir, self.reports_dir]:
            os.makedirs(dir_path, exist_ok=True)

    def load_qmoi_config(self) -> Dict[str, Any]:
        """Load QMOI AI configuration"""
        config_path = os.path.join(self.project_root, "config", "qmoi_config.json")
        try:
            with open(config_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"QMOI config not found at {config_path}, using defaults")
            return self.get_default_config()

    def get_default_config(self) -> Dict[str, Any]:
        """Get default QMOI AI configuration"""
        return {
            "ai_model": "qmoi-lint-v1",
            "linting_capabilities": {
                "auto_fix": True,
                "smart_analysis": True,
                "context_aware": True,
                "learning_enabled": True,
            },
            "fix_strategies": {
                "import_resolution": True,
                "variable_declaration": True,
                "type_inference": True,
                "code_optimization": True,
                "style_consistency": True,
            },
            "performance_settings": {
                "max_fixes_per_file": 50,
                "max_processing_time": 300,  # 5 minutes
                "batch_size": 10,
            },
        }

    async def analyze_lint_error(self, error_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a lint error using QMOI AI intelligence"""

        # Extract error information
        file_path = error_data.get("file", "")
        line_num = error_data.get("line", 0)
        column = error_data.get("column", 0)
        rule = error_data.get("rule", "")
        message = error_data.get("message", "")

        # QMOI AI analysis logic
        analysis = {
            "error_type": self.classify_error_type(rule, message),
            "severity": self.assess_severity(rule, message),
            "fix_strategy": self.determine_fix_strategy(rule, message, file_path),
            "confidence": self.calculate_confidence(rule, message),
            "context": self.extract_context(file_path, line_num),
            "suggested_fix": self.generate_fix_suggestion(rule, message, file_path),
            "ai_reasoning": self.generate_ai_reasoning(rule, message),
        }

        return analysis

    def classify_error_type(self, rule: str, message: str) -> str:
        """Classify the type of lint error"""
        rule_lower = rule.lower()
        message_lower = message.lower()

        if "no-undef" in rule_lower:
            if "require" in message_lower:
                return "module_import_issue"
            elif "process" in message_lower:
                return "node_global_issue"
            else:
                return "undefined_variable"

        elif "no-unused-vars" in rule_lower:
            return "unused_variable"

        elif "import/no-unresolved" in rule_lower:
            return "import_resolution"

        elif "no-console" in rule_lower:
            return "debugging_code"

        elif "prefer-const" in rule_lower:
            return "variable_declaration"

        elif "quotes" in rule_lower:
            return "style_consistency"

        else:
            return "general_linting"

    def assess_severity(self, rule: str, message: str) -> str:
        """Assess the severity of a lint error"""
        critical_rules = ["no-undef", "import/no-unresolved", "no-unused-vars"]
        high_rules = ["no-console", "no-debugger", "no-alert"]

        if any(critical in rule for critical in critical_rules):
            return "critical"
        elif any(high in rule for high in high_rules):
            return "high"
        else:
            return "medium"

    def determine_fix_strategy(self, rule: str, message: str, file_path: str) -> str:
        """Determine the best fix strategy for an error"""
        rule_lower = rule.lower()
        file_ext = Path(file_path).suffix.lower()

        if "no-undef" in rule_lower:
            if "require" in message.lower():
                return "convert_to_es6_import"
            elif "process" in message.lower():
                return "add_node_global"
            else:
                return "define_variable"

        elif "no-unused-vars" in rule_lower:
            return "remove_or_prefix_variable"

        elif "import/no-unresolved" in rule_lower:
            return "fix_import_path"

        elif "no-console" in rule_lower:
            return "remove_debug_code"

        elif "prefer-const" in rule_lower:
            return "convert_to_const"

        else:
            return "manual_review"

    def calculate_confidence(self, rule: str, message: str) -> float:
        """Calculate confidence level for automatic fixing"""
        high_confidence_rules = ["no-console", "prefer-const", "quotes", "semi"]
        medium_confidence_rules = ["no-unused-vars", "no-trailing-spaces"]

        if any(rule in rule for rule in high_confidence_rules):
            return 0.9
        elif any(rule in rule for rule in medium_confidence_rules):
            return 0.7
        else:
            return 0.5

    def extract_context(self, file_path: str, line_num: int) -> Dict[str, Any]:
        """Extract context around the error line"""
        try:
            if not file_path or not os.path.exists(file_path):
                return {}

            with open(file_path, "r", encoding="utf-8") as f:
                lines = f.readlines()

            context = {
                "current_line": (
                    lines[line_num - 1].strip() if line_num <= len(lines) else ""
                ),
                "previous_line": lines[line_num - 2].strip() if line_num > 1 else "",
                "next_line": lines[line_num].strip() if line_num < len(lines) else "",
                "file_type": Path(file_path).suffix,
                "total_lines": len(lines),
            }

            return context
        except Exception as e:
            logger.error(f"Error extracting context: {e}")
            return {}

    def generate_fix_suggestion(self, rule: str, message: str, file_path: str) -> str:
        """Generate a specific fix suggestion"""
        rule_lower = rule.lower()
        message_lower = message.lower()

        if "no-undef" in rule_lower:
            if "require" in message_lower:
                return "Convert require() to ES6 import statement"
            elif "process" in message_lower:
                return "Add 'process' to globals or use import { env } from 'process'"
            else:
                return "Define the variable or import it from the correct module"

        elif "no-unused-vars" in rule_lower:
            return "Remove unused variable or prefix with underscore (_variable)"

        elif "import/no-unresolved" in rule_lower:
            return "Check import path, install missing package, or add to module resolution"

        elif "no-console" in rule_lower:
            return "Remove console statement or add eslint-disable comment"

        elif "prefer-const" in rule_lower:
            return "Change 'let' to 'const' if variable is not reassigned"

        else:
            return "Review and fix according to ESLint rules"

    def generate_ai_reasoning(self, rule: str, message: str) -> str:
        """Generate AI reasoning for the fix"""
        rule_lower = rule.lower()

        if "no-undef" in rule_lower:
            return "Variable or module is not defined in current scope. Need to import or declare it."

        elif "no-unused-vars" in rule_lower:
            return "Variable is declared but never used. Either remove it or use it in the code."

        elif "import/no-unresolved" in rule_lower:
            return "Import path cannot be resolved. Check if the module exists and path is correct."

        elif "no-console" in rule_lower:
            return "Console statements should be removed in production code for security and performance."

        elif "prefer-const" in rule_lower:
            return (
                "Variable is not reassigned, so 'const' is more appropriate than 'let'."
            )

        else:
            return "General linting rule violation that needs attention."

    async def apply_intelligent_fix(
        self, file_path: str, error_data: Dict[str, Any], analysis: Dict[str, Any]
    ) -> bool:
        """Apply intelligent fix based on QMOI AI analysis"""

        try:
            if not os.path.exists(file_path):
                return False

            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            lines = content.split("\n")
            line_index = error_data.get("line", 1) - 1

            if line_index < 0 or line_index >= len(lines):
                return False

            original_line = lines[line_index]
            modified = False

            # Apply fixes based on analysis
            fix_strategy = analysis.get("fix_strategy", "")
            confidence = analysis.get("confidence", 0.0)

            # Only apply fixes with high confidence
            if confidence < 0.7:
                return False

            if fix_strategy == "remove_debug_code":
                if "console." in original_line:
                    lines.pop(line_index)
                    modified = True

            elif fix_strategy == "convert_to_const":
                if "let " in original_line and "=" in original_line:
                    new_line = original_line.replace("let ", "const ")
                    lines[line_index] = new_line
                    modified = True

            elif fix_strategy == "remove_or_prefix_variable":
                if re.match(r"^\s*(const|let|var)\s+\w+\s*=", original_line):
                    # Check if it's just a simple variable declaration
                    lines.pop(line_index)
                    modified = True

            if modified:
                new_content = "\n".join(lines)
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)

                self.ai_state["fixes_applied"] += 1
                self.ai_state["files_processed"] += 1
                logger.info(f"Applied fix to {file_path}: {fix_strategy}")
                return True

            return False

        except Exception as e:
            logger.error(f"Error applying fix to {file_path}: {e}")
            return False

    async def process_lint_errors(self, errors: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Process lint errors using QMOI AI intelligence"""

        results = {
            "total_errors": len(errors),
            "ai_fixes_applied": 0,
            "manual_fixes_needed": 0,
            "analysis_results": [],
            "processing_time": 0,
        }

        start_time = datetime.now()

        for error in errors:
            # Analyze error with QMOI AI
            analysis = await self.analyze_lint_error(error)

            # Apply fix if possible
            file_path = os.path.join(self.project_root, error.get("file", ""))
            fix_applied = await self.apply_intelligent_fix(file_path, error, analysis)

            if fix_applied:
                results["ai_fixes_applied"] += 1
            else:
                results["manual_fixes_needed"] += 1

            results["analysis_results"].append(
                {"error": error, "analysis": analysis, "fix_applied": fix_applied}
            )

        results["processing_time"] = (datetime.now() - start_time).total_seconds()

        return results

    async def run_lint_integration(self) -> Dict[str, Any]:
        """Run the complete QMOI AI lint integration"""

        logger.info("🚀 Starting QMOI AI Lint Integration...")

        # Run ESLint to get current errors
        try:
            result = subprocess.run(
                ["yarn", "lint"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=300,
            )

            if result.returncode == 0:
                logger.info("✅ No linting errors found!")
                return {"status": "clean", "message": "No errors found"}

            # Parse errors
            errors = self.parse_eslint_output(result.stdout + result.stderr)
            logger.info(f"Found {len(errors)} linting issues")

            # Process errors with QMOI AI
            results = await self.process_lint_errors(errors)

            # Run ESLint again to check remaining errors
            final_result = subprocess.run(
                ["yarn", "lint"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=300,
            )

            remaining_errors = self.parse_eslint_output(
                final_result.stdout + final_result.stderr
            )
            results["remaining_errors"] = len(remaining_errors)

            # Update AI state
            self.ai_state["last_activity"] = datetime.now().isoformat()

            # Save results
            self.save_results(results)

            return results

        except Exception as e:
            logger.error(f"Error in lint integration: {e}")
            return {"status": "error", "message": str(e)}

    def parse_eslint_output(self, output: str) -> List[Dict[str, Any]]:
        """Parse ESLint output into structured error data"""
        errors = []
        lines = output.split("\n")
        current_file = ""

        for line in lines:
            # Extract file path
            file_match = re.match(r"^(.+?)\s+✖", line)
            if file_match:
                current_file = file_match.group(1).strip()
                continue

            # Parse error details
            error_match = re.match(
                r"^\s*(\d+):(\d+)\s+(error|warning)\s+(.+?)\s+(.+)$", line
            )
            if error_match:
                errors.append(
                    {
                        "file": current_file,
                        "line": int(error_match.group(1)),
                        "column": int(error_match.group(2)),
                        "severity": error_match.group(3),
                        "rule": error_match.group(4),
                        "message": error_match.group(5).strip(),
                        "timestamp": datetime.now().isoformat(),
                    }
                )

        return errors

    def save_results(self, results: Dict[str, Any]):
        """Save processing results"""
        results_file = os.path.join(self.logs_dir, "qmoi_lint_results.json")
        with open(results_file, "w") as f:
            json.dump(results, f, indent=2, default=str)

        # Save AI state
        state_file = os.path.join(self.logs_dir, "qmoi_ai_state.json")
        with open(state_file, "w") as f:
            json.dump(self.ai_state, f, indent=2, default=str)

    def get_status(self) -> Dict[str, Any]:
        """Get current QMOI AI status"""
        return {
            "ai_state": self.ai_state,
            "config": self.qmoi_config,
            "timestamp": datetime.now().isoformat(),
        }


async def main():
    """Main function for QMOI AI lint integration"""
    parser = argparse.ArgumentParser(description="QMOI AI Lint Integration")
    parser.add_argument("--lint-fix", type=str, help="JSON input for lint fixing")
    parser.add_argument("--status", action="store_true", help="Get AI status")
    parser.add_argument("--project-root", type=str, help="Project root directory")

    args = parser.parse_args()

    integration = QMOILintIntegration(args.project_root)

    if args.status:
        status = integration.get_status()
        print(json.dumps(status, indent=2))
        return

    if args.lint_fix:
        try:
            input_data = json.loads(args.lint_fix)
            prompt = input_data.get("prompt", "")
            context = input_data.get("context", {})

            # Process the lint fix request
            analysis = await integration.analyze_lint_error(context)
            print(json.dumps(analysis, indent=2))
        except json.JSONDecodeError:
            print(json.dumps({"error": "Invalid JSON input"}, indent=2))
        return

    # Run full integration
    results = await integration.run_lint_integration()
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
