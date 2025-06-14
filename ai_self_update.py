import os
import subprocess
import threading
import time
import hashlib
import requests
from notify_on_whatsapp import notify_master_on_whatsapp, notify_sister_on_whatsapp

class AISelfUpdater:
    MASTER_WHATSAPP_NUMBER = "+254725382624"
    SISTER_WHATSAPP_NUMBER = "+61424 053 495"

    def __init__(self, check_interval=3600):
        self.check_interval = check_interval
        self.running = False

    def verify_update_signature(self, file_path, signature_url):
        """Verify the downloaded update using a signature from a trusted source."""
        try:
            with open(file_path, 'rb') as f:
                file_hash = hashlib.sha256(f.read()).hexdigest()
            signature = requests.get(signature_url).text.strip()
            return file_hash == signature
        except Exception as e:
            print(f"Signature verification failed: {e}")
            return False

    def backup_model_to_huggingface(self, model_path, repo_id, token):
        """Backup model to Hugging Face Hub."""
        try:
            from huggingface_hub import HfApi
            api = HfApi()
            api.upload_file(
                path_or_fileobj=model_path,
                path_in_repo=os.path.basename(model_path),
                repo_id=repo_id,
                token=token
            )
            print("Model backup to Hugging Face successful.")
        except ImportError:
            print("huggingface_hub is not installed. Please install it with 'pip install huggingface_hub'.")
        except Exception as e:
            print(f"Model backup failed: {e}")

    def check_for_updates(self):
        # Example: Pull latest code from git repo
        try:
            subprocess.run(['git', 'fetch'], check=True)
            local = subprocess.check_output(['git', 'rev-parse', 'HEAD']).strip()
            remote = subprocess.check_output(['git', 'rev-parse', '@{u}']).strip()
            if local != remote:
                subprocess.run(['git', 'pull'], check=True)
                print("AI system updated to latest version.")
                # After update, run diagnostics and auto-fix
                subprocess.run(['curl', '-X', 'POST', 'http://localhost:3000/api/ai-self-diagnostics?fix=1'], check=False)
        except Exception as e:
            print(f"Update check failed: {e}")

    def optimize_self(self):
        # Placeholder for self-optimization logic (meta-learning, RL, etc.)
        print("Running self-optimization...")
        # Example: backup model to Hugging Face
        model_path = 'path/to/qmoi_model.pt'
        repo_id = 'your-hf-username/qmoi-model-backup'
        token = os.getenv('HF_TOKEN')
        if token:
            self.backup_model_to_huggingface(model_path, repo_id, token)

    def after_whatsapp_qr_scan(self, master_number=None, sister_number=None):
        master_number = master_number or self.MASTER_WHATSAPP_NUMBER
        sister_number = sister_number or self.SISTER_WHATSAPP_NUMBER
        ai_status = self.get_health_status()
        projects_report = self.get_projects_report()
        planned_projects = self.get_planned_projects()
        timetable = self.get_timetable()
        ai_features = self.get_ai_features()
        project_suggestions = self.get_project_suggestions()
        instructions = self.get_sister_instructions()
        wallet_status = self.get_wallet_status()
        wallet_instructions = self.get_wallet_instructions()
        notify_master_on_whatsapp(master_number, ai_status, projects_report, planned_projects, timetable)
        notify_sister_on_whatsapp(sister_number, ai_features, project_suggestions, instructions)
        from notify_on_whatsapp import notify_leah_wallet_on_whatsapp
        notify_leah_wallet_on_whatsapp(sister_number, wallet_status, wallet_instructions)

    def get_health_status(self):
        # Placeholder: implement actual health check
        return "All systems operational."

    def get_projects_report(self):
        # Placeholder: implement actual project status
        return "- Trading Bot: Active\n- Homework Helper: Idle"

    def get_planned_projects(self):
        # Placeholder: implement actual planned projects
        return "- Dream Journal\n- Gift Planner"

    def get_timetable(self):
        # Placeholder: implement actual timetable
        return "[✓] Trading Bot\n[ ] Dream Journal"

    def get_ai_features(self):
        return "Chat, Wallet, Project Automation, Device Management, Colab Integration, and more!"

    def get_project_suggestions(self):
        return "- Personal Budget Tracker\n- Homework Helper\n- Gift Planner\n- Health & Fitness Buddy\n- Dream Journal"

    def get_sister_instructions(self):
        return "Reply with the project name or 'yes' to start. I'll guide you step by step!"

    def get_wallet_status(self):
        # Placeholder: implement actual wallet status
        return "Balance: $100.00\nRecent activity: +$20 (gift), -$5 (purchase)"

    def get_wallet_instructions(self):
        return "Go to LC Hub > Wallet to view, send, or receive money. Tap 'Add Funds' to top up."

    def enhance_device_features(self, wallpaper_path=None, appearance_settings=None, apps_to_install=None):
        try:
            if wallpaper_path:
                print(f"Setting wallpaper: {wallpaper_path}")
                # TODO: Integrate with OS/device API
            if appearance_settings:
                print(f"Applying appearance settings: {appearance_settings}")
                # TODO: Integrate with OS/device API
            if apps_to_install:
                for app in apps_to_install:
                    print(f"Installing app: {app}")
                    # TODO: Integrate with OS/device API
            print("Device features managed/enhanced.")
        except Exception as e:
            print(f"Device enhancement failed: {e}")

    def send_app_download_links(self):
        from notify_on_whatsapp import MASTER_WHATSAPP_NUMBER, SISTER_WHATSAPP_NUMBER
        app_links = {
            "Android": "https://example.com/app-latest.apk",
            "iOS": "https://example.com/app-latest.ipa",
            "Windows": "https://example.com/app-latest.exe",
            "Mac": "https://example.com/app-latest.dmg",
            "Linux": "https://example.com/app-latest.AppImage"
        }
        msg = "Download the Alpha-Q AI App for your device:\n" + "\n".join([f"{k}: {v}" for k, v in app_links.items()])
        for number in [MASTER_WHATSAPP_NUMBER, SISTER_WHATSAPP_NUMBER]:
            try:
                import requests
                requests.post("http://localhost:3000/api/whatsapp-bot?send=1", json={"to": number, "message": msg})
            except Exception as e:
                print(f"Failed to send app download link to {number}: {e}")

    def backup_projects(self):
        # Example: backup all projects to Hugging Face or cloud
        try:
            from huggingface_hub import HfApi
            import glob
            api = HfApi()
            for file in glob.glob("projects/*.zip"):
                api.upload_file(
                    path_or_fileobj=file,
                    path_in_repo=f"backups/{os.path.basename(file)}",
                    repo_id="your-hf-username/qmoi-projects-backup",
                    token=os.getenv('HF_TOKEN')
                )
            print("All projects backed up to Hugging Face.")
        except Exception as e:
            print(f"Project backup failed: {e}")

    def ai_decision_engine(self, context):
        # Example: smarter, context-aware choices
        if context.get('user') == 'master':
            return "Suggesting advanced trading and automation projects."
        elif context.get('user') == 'sister':
            return "Suggesting creative, easy-to-use projects and wallet features."
        else:
            return "Suggesting general productivity and learning projects."

    def backup_sensitive_data(self):
        # Example: backup passwords and sensitive data securely
        try:
            import shutil
            backup_path = os.path.expanduser('~/Alpha-Q/Backups/sensitive_data_backup.zip')
            os.makedirs(os.path.dirname(backup_path), exist_ok=True)
            shutil.make_archive(backup_path.replace('.zip',''), 'zip', 'secrets_folder')
            print(f"Sensitive data backed up to {backup_path}")
        except Exception as e:
            print(f"Sensitive data backup failed: {e}")

    def run(self):
        self.running = True
        while self.running:
            self.check_for_updates()
            self.optimize_self()
            # Example: manage device features each cycle
            self.enhance_device_features(
                wallpaper_path="/path/to/wallpaper.jpg",
                appearance_settings={"theme": "light", "font": "rounded"},
                apps_to_install=["com.example.wallet", "com.example.lchub"]
            )
            time.sleep(self.check_interval)

    def start_in_background(self):
        t = threading.Thread(target=self.run, daemon=True)
        t.start()

# Usage example
if __name__ == "__main__":
    updater = AISelfUpdater()
    updater.start_in_background()
    while True:
        time.sleep(60)
