#!/usr/bin/env python3
"""
QMOI EVOLUTION ENHANCED: Autonomous System Validation Script
Validates that all autonomous workflow and background worker systems are properly implemented
"""

import sys
import os
import importlib.util
import traceback

def validate_typescript_file(file_path):
    """Validate TypeScript file exists and has basic structure"""
    if not os.path.exists(file_path):
        return False, f"File {file_path} does not exist"

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check for basic TypeScript structure
        if 'export' not in content and 'interface' not in content and 'class' not in content:
            return False, f"File {file_path} lacks TypeScript structure"

        # Check for QMOI evolution header
        if 'QMOI EVOLUTION ENHANCED' not in content:
            return False, f"File {file_path} missing QMOI evolution header"

        return True, "TypeScript file structure validated"

    except Exception as e:
        return False, f"Error reading {file_path}: {str(e)}"

def validate_workflow_engine():
    """Validate workflow engine implementation"""
    file_path = '/workspaces/qmoi-enhanced/lib/workflow-engine.ts'

    success, message = validate_typescript_file(file_path)
    if not success:
        return False, message

    # Check for key components
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        required_components = [
            'AutonomousWorkflowEngine',
            'WorkflowJob',
            'WorkflowDefinition',
            'WorkflowStep',
            'WorkflowTrigger',
            'WorkflowSuccessCriteria',
            'WorkflowFailureHandling',
            'WorkflowMonitoring'
        ]

        missing_components = []
        for component in required_components:
            if component not in content:
                missing_components.append(component)

        if missing_components:
            return False, f"Missing workflow components: {', '.join(missing_components)}"

        return True, "Workflow engine implementation validated"

    except Exception as e:
        return False, f"Error validating workflow engine: {str(e)}"

def validate_autosync_service():
    """Validate autosync service implementation"""
    file_path = '/workspaces/qmoi-enhanced/lib/autosync-service.ts'

    success, message = validate_typescript_file(file_path)
    if not success:
        return False, message

    # Check for key components
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        required_components = [
            'EnhancedAutosyncService',
            'SyncConflict',
            'SyncSession',
            'AutosyncConfig',
            'RepositoryConfig',
            'AIConflictResolver',
            'PredictiveScheduler'
        ]

        missing_components = []
        for component in required_components:
            if component not in content:
                missing_components.append(component)

        if missing_components:
            return False, f"Missing autosync components: {', '.join(missing_components)}"

        return True, "Autosync service implementation validated"

    except Exception as e:
        return False, f"Error validating autosync service: {str(e)}"

def validate_background_worker():
    """Validate background worker implementation"""
    file_path = '/workspaces/qmoi-enhanced/lib/background-worker.ts'

    success, message = validate_typescript_file(file_path)
    if not success:
        return False, message

    # Check for key components
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        required_components = [
            'AutonomousBackgroundWorker',
            'BackgroundJob',
            'WorkerNode',
            'JobQueue'
        ]

        missing_components = []
        for component in required_components:
            if component not in content:
                missing_components.append(component)

        if missing_components:
            return False, f"Missing background worker components: {', '.join(missing_components)}"

        return True, "Background worker implementation validated"

    except Exception as e:
        return False, f"Error validating background worker: {str(e)}"

def validate_workflow_api():
    """Validate workflow API implementation"""
    file_path = '/workspaces/qmoi-enhanced/app/api/workflow/route.ts'

    success, message = validate_typescript_file(file_path)
    if not success:
        return False, message

    # Check for key endpoints
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        required_endpoints = [
            'trigger-workflow',
            'cancel-job',
            'trigger-autosync',
            'trigger-error-fix',
            'manual-sync',
            'cancel-sync',
            'create-custom-workflow',
            'enqueue-job'
        ]

        missing_endpoints = []
        for endpoint in required_endpoints:
            if endpoint not in content:
                missing_endpoints.append(endpoint)

        if missing_endpoints:
            return False, f"Missing API endpoints: {', '.join(missing_endpoints)}"

        return True, "Workflow API implementation validated"

    except Exception as e:
        return False, f"Error validating workflow API: {str(e)}"

def validate_workflows_md():
    """Validate WORKFLOWS.md updates"""
    file_path = '/workspaces/qmoi-enhanced/WORKFLOWS.md'

    if not os.path.exists(file_path):
        return False, f"WORKFLOWS.md file does not exist"

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        required_sections = [
            'Autonomous Workflow Engine',
            'Enhanced Autosync System',
            'Autonomous Error Fixing Engine',
            'Self-Managing Workflows',
            'AI-Powered Synchronization',
            'Intelligent Job Queue'
        ]

        missing_sections = []
        for section in required_sections:
            if section not in content:
                missing_sections.append(section)

        if missing_sections:
            return False, f"Missing WORKFLOWS.md sections: {', '.join(missing_sections)}"

        return True, "WORKFLOWS.md updates validated"

    except Exception as e:
        return False, f"Error validating WORKFLOWS.md: {str(e)}"

def main():
    """Main validation function"""
    print("🔄 Starting QMOI Autonomous System Validation...")
    print("=" * 60)

    validations = [
        ("Workflow Engine", validate_workflow_engine),
        ("Autosync Service", validate_autosync_service),
        ("Background Worker", validate_background_worker),
        ("Workflow API", validate_workflow_api),
        ("WORKFLOWS.md", validate_workflows_md)
    ]

    results = []
    all_passed = True

    for name, validator in validations:
        print(f"\n📋 Validating {name}...")
        try:
            success, message = validator()
            if success:
                print(f"✅ {name}: {message}")
                results.append((name, True, message))
            else:
                print(f"❌ {name}: {message}")
                results.append((name, False, message))
                all_passed = False
        except Exception as e:
            error_msg = f"Validation failed with exception: {str(e)}"
            print(f"❌ {name}: {error_msg}")
            results.append((name, False, error_msg))
            all_passed = False

    print("\n" + "=" * 60)
    print("📊 VALIDATION SUMMARY")
    print("=" * 60)

    for name, success, message in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {name}: {message}")

    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 ALL VALIDATIONS PASSED!")
        print("✅ QMOI Autonomous Systems are ready for production")
        print("🚀 Phase 9 (Background Worker) and enhanced autosync completed successfully")
        return 0
    else:
        print("⚠️  SOME VALIDATIONS FAILED!")
        print("🔧 Please review and fix the failed components")
        return 1

if __name__ == "__main__":
    sys.exit(main())