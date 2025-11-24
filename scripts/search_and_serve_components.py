import os
import re
import time

COMPONENT_DIRS = ["components", "app", "src", "dashboard/src", "public", "templates", "pages"]
UI_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".html", ".css"]
LOG_FILE = "qmoi-enhanced/SERVINGERRORSISSUES.md"

used_components = set()
unused_components = set()

# Search for all components
for comp_dir in COMPONENT_DIRS:
    if os.path.exists(comp_dir):
        for root, _, files in os.walk(comp_dir):
            for file in files:
                if file.endswith(('.js', '.ts', '.jsx', '.tsx', '.py')) or file.endswith(tuple(UI_EXTENSIONS)):
                    comp_path = os.path.join(root, file)
                    used = False
                    with open(comp_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                        # Check for export or class/function definition
                        if re.search(r'(export|class|def)\s+\w+', content):
                            # Check usage in other files
                            for check_dir in COMPONENT_DIRS:
                                for check_root, _, check_files in os.walk(check_dir):
                                    for check_file in check_files:
                                        if check_file != file and check_file.endswith(('.js', '.ts', '.jsx', '.tsx', '.py')):
                                            check_path = os.path.join(check_root, check_file)
                                            with open(check_path, "r", encoding="utf-8", errors="ignore") as cf:
                                                check_content = cf.read()
                                                if file.split('.')[0] in check_content:
                                                    used = True
                    if used:
                        used_components.add(comp_path)
                    else:
                        unused_components.add(comp_path)
                # Check for unused UI features/files
                elif file.endswith(tuple(UI_EXTENSIONS)):
                    used_ui = False
                    with open(comp_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                        # Check if referenced in any other file
                        for check_dir in COMPONENT_DIRS:
                            for check_root, _, check_files in os.walk(check_dir):
                                for check_file in check_files:
                                    if check_file != file and check_file.endswith(tuple(UI_EXTENSIONS)):
                                        check_path = os.path.join(check_root, check_file)
                                        with open(check_path, "r", encoding="utf-8", errors="ignore") as cf:
                                            check_content = cf.read()
                                            if file.split('.')[0] in check_content:
                                                used_ui = True
                    if not used_ui:
                        with open(LOG_FILE, "a") as log:
                            log.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] [UI] [UNUSED] {comp_path} - Not used, consider serving or integrating.\n")

# Log unused components
with open(LOG_FILE, "a") as log:
    for comp in unused_components:
        log.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] [COMPONENT] [UNUSED] {comp} - Not used, consider serving or integrating.\n")
