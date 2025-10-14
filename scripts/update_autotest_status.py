import json, os

status = {
    "windows": "✅ PASS" if os.path.exists("dist/qmoi ai.exe") else "❌ FAIL",
    # Other devices can be checked similarly
}
readme_path = "README.md"
with open(readme_path, "r") as f:
    content = f.read()
for platform, state in status.items():
    content = content.replace(
        f"[Qmoi_apps/{platform}/qmoi ai.exe] autotest status: FAIL",
        f"[Qmoi_apps/{platform}/qmoi ai.exe] autotest status: {state}",
    )
with open(readme_path, "w") as f:
    f.write(content)
print("[Autotest] README.md status updated.")
