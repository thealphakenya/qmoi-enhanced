import os
import yaml

LOG_FILE = "/workspaces/qmoi-enhanced-new-simtwov/logs/yml_validation.log"
WORKFLOW_DIR = "/workspaces/qmoi-enhanced-new-simtwov/.github/workflows"

def log_message(message):
    with open(LOG_FILE, "a") as log:
        log.write(f"{message}\n")

def validate_and_fix_yml(file_path):
    try:
        with open(file_path, 'r') as file:
            content = yaml.safe_load(file)
        # Add validation or fixes here if needed
        with open(file_path, 'w') as file:
            yaml.dump(content, file)
        log_message(f"Validated and fixed: {file_path}")
    except Exception as e:
        log_message(f"Error in {file_path}: {e}")

def main():
    if not os.path.exists(WORKFLOW_DIR):
        log_message("Workflow directory not found.")
        return

    for root, _, files in os.walk(WORKFLOW_DIR):
        for file in files:
            if file.endswith(".yml") or file.endswith(".yaml"):
                validate_and_fix_yml(os.path.join(root, file))

if __name__ == "__main__":
    main()