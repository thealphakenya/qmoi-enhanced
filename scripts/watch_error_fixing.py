import sys
import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
from pathlib import Path


class ErrorFixingTestHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_run = 0
        self.cooldown = 2  # Minimum seconds between test runs
        self.project_root = Path(__file__).parent.parent

        # Files and directories to watch
        self.watch_patterns = [
            "scripts/error/**/*.py",
            "scripts/services/auto_fix_service.ts",
            "scripts/error_handler.py",
            "components/QCityErrorManager.tsx",
            "tests/unit/test_error_fixing.py",
            "tests/integration/test_error_fixing_integration.py",
        ]

    def on_modified(self, event):
        if event.is_directory:
            return

        # Check if the modified file matches our patterns
        file_path = Path(event.src_path).relative_to(self.project_root)
        should_run = any(file_path.match(pattern) for pattern in self.watch_patterns)

        if should_run:
            current_time = time.time()
            if current_time - self.last_run > self.cooldown:
                self.last_run = current_time
                self.run_tests()

    def run_tests(self):
        """Run the error fixing test suite"""
        print("\n=== Change detected! Running Error Fixing Tests... ===")

        try:
            # Run the test suite
            result = subprocess.run(
                [sys.executable, "scripts/test_error_fixing_suite.py"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
            )

            # Print output
            if result.stdout:
                print(result.stdout)
            if result.stderr:
                print("Errors:", result.stderr)

            # Notify based on test results
            if result.returncode == 0:
                self.notify("✅ Error Fixing Tests Passed")
            else:
                self.notify("❌ Error Fixing Tests Failed")

        except Exception as e:
            print(f"Error running tests: {e}")
            self.notify(f"⚠️ Error running tests: {e}")

    def notify(self, message):
        """Send desktop notification"""
        try:
            # Windows notification
            if os.name == "nt":
                from win10toast import ToastNotifier

                toaster = ToastNotifier()
                toaster.show_toast("Error Fixing Tests", message, duration=5)

            # macOS notification
            elif sys.platform == "darwin":
                os.system(
                    f"""
                    osascript -e 'display notification "{message}" with title "Error Fixing Tests"'
                """
                )

            # Linux notification
            else:
                os.system(f'notify-send "Error Fixing Tests" "{message}"')

        except Exception as e:
            print(f"Could not send notification: {e}")


def main():
    path = Path(__file__).parent.parent
    event_handler = ErrorFixingTestHandler()
    observer = Observer()

    # Watch the entire project directory
    observer.schedule(event_handler, str(path), recursive=True)
    observer.start()

    print("=== Error Fixing Test Watcher Started ===")
    print("Watching for changes in:")
    for pattern in event_handler.watch_patterns:
        print(f"  - {pattern}")
    print("\nPress Ctrl+C to stop...")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\nTest watcher stopped.")

    observer.join()


if __name__ == "__main__":
    main()
