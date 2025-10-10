# scripts/qmoi_build_ci.py
import os
import subprocess
import json
from qmoi_activity_logger import log_activity

def run_ci_pipeline():
    log_activity("CI Pipeline Started", {})

    try:
        # Step 1: Build All Apps
        subprocess.run(["python", "scripts/qmoi-app-builder.py"], check=True)

        # Step 2: Commit & Push built apps and log
        subprocess.run(["git", "add", "Qmoi_apps/", "logs/"], check=True)
        subprocess.run(["git", "commit", "-m", "Auto: Built and logged QMOI AI apps"], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        log_activity("Build and Push Successful", {})

        # Step 3: Deploy ZIP to GitHub Pages or Ngrok
        deploy_via_ngrok()
        deploy_status_dashboard()

    except subprocess.CalledProcessError as e:
        log_activity("CI pipeline failed", {"error": str(e)})

def deploy_via_ngrok():
    zip_path = os.path.join("Qmoi_apps", "qmoi_ai_all_apps.zip")
    if not os.path.exists(zip_path):
        log_activity("Ngrok deploy skipped: ZIP not found", {})
        return

    try:
        # Start local HTTP server on port 9090
        subprocess.Popen(["python", "-m", "http.server", "9090", "--directory", "Qmoi_apps"], cwd=os.getcwd())
        subprocess.run(["ngrok", "http", "9090"], check=True)
    except Exception as e:
        log_activity("Ngrok deploy failed", {"error": str(e)})

def deploy_status_dashboard():
    try:
        # Create dashboard.json with install results
        status_path = os.path.join("Qmoi_apps", "install_simulation_report.json")
        dashboard_path = os.path.join("Qmoi_apps", "dashboard.json")
        if os.path.exists(status_path):
            with open(status_path, "r") as f:
                data = json.load(f)
            with open(dashboard_path, "w") as f:
                json.dump({"status": data}, f, indent=2)
            log_activity("Dashboard JSON updated", {"path": dashboard_path})
    except Exception as e:
        log_activity("Dashboard deploy failed", {"error": str(e)})

if __name__ == '__main__':
    run_ci_pipeline()
