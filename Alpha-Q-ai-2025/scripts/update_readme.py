import os
import json
import shutil
from datetime import datetime, timezone

# 🌍 Language detection (default: English)
lang = os.getenv("QMOI_LANG", "en").lower()

# 📁 Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TEMPLATES_DIR = os.path.join(BASE_DIR, 'scripts', 'templates')
REPORT_PATH = os.path.join(BASE_DIR, 'qcity-artifacts', 'qmoi_build_report.json')
LANG_README_PATH = os.path.join(BASE_DIR, f'README.{lang}.md')
MAIN_README_PATH = os.path.join(BASE_DIR, 'README.md')

# 🧱 Platform emojis
EMOJIS = {
    'windows': '💽 Windows',
    'android': '🤖 Android',
    'mac': '🍏 macOS',
    'linux': '🐧 Linux',
    'ios': '📱 iOS',
    'chromebook': '💻 Chromebook',
    'raspberrypi': '🡧 Raspberry Pi',
    'qcity': '🏙 QCity Package',
    'smarttv': '📺 Smart TV',
}

# ✅ Auto-generate missing localized template
def ensure_localized_template(lang):
    fallback_template = os.path.join(TEMPLATES_DIR, 'README_template.en.md')
    target_template = os.path.join(TEMPLATES_DIR, f'README_template.{lang}.md')
    
    if lang == 'en':
        return fallback_template

    if not os.path.exists(target_template):
        shutil.copy2(fallback_template, target_template)
        print(f"📄 Auto-created missing localized template: {target_template}")
    
    return target_template

# 🔁 Template loader
def load_template():
    path = ensure_localized_template(lang)
    if not os.path.exists(path):
        print(f"⚠️ Template not found. Using fallback.")
        return open(os.path.join(TEMPLATES_DIR, 'README_template.en.md'), 'r', encoding='utf-8').read()
    return open(path, 'r', encoding='utf-8').read()

# 🧪 Build matrix renderer
def generate_build_matrix(report):
    lines = []
    for device, status in report.items():
        label = EMOJIS.get(device, device.capitalize())
        if status == "success":
            lines.append(f"| {label:<16} | ✅ SUCCESS   | ✅ PASS      |")
        elif status == "failed":
            lines.append(f"| {label:<16} | ❌ FAILED    | ❌ FAIL      |")
        elif status == "placeholder_used":
            lines.append(f"| {label:<16} | ⚠️ PLACEHOLDER | ❌ FAIL      |")
        elif status == "error":
            lines.append(f"| {label:<16} | ❌ ERROR     | ❌ FAIL      |")
        else:
            lines.append(f"| {label:<16} | ❓ UNKNOWN   | ❓ UNKNOWN   |")
    return "\n".join(lines)

# 🧩 Inject matrix + timestamp
def inject_into_template(template, report):
    timestamp = datetime.now(timezone.utc).isoformat() + " UTC"
    matrix = generate_build_matrix(report)
    platforms = ', '.join(EMOJIS.values())
    return template.replace("{{timestamp}}", timestamp)\
                   .replace("{{build_matrix}}", matrix)\
                   .replace("{{platforms}}", platforms)

# ✨ Main updater
def update_readme():
    if not os.path.exists(REPORT_PATH):
        print(f"❌ Build report not found: {REPORT_PATH}")
        return False

    with open(REPORT_PATH, 'r', encoding='utf-8') as f:
        report = json.load(f)

    template = load_template()
    final = inject_into_template(template, report)

    # Write localized README
    with open(LANG_README_PATH, 'w', encoding='utf-8') as f:
        f.write(final)

    # Link or copy to README.md
    try:
        if os.path.exists(MAIN_README_PATH) or os.path.islink(MAIN_README_PATH):
            os.remove(MAIN_README_PATH)
        os.symlink(LANG_README_PATH, MAIN_README_PATH)
        print(f"🔗 Symlinked {LANG_README_PATH} → README.md")
    except (OSError, NotImplementedError):
        shutil.copy2(LANG_README_PATH, MAIN_README_PATH)
        print(f"📄 Copied {LANG_README_PATH} → README.md")

    return True

# 🚀 Auto-run
if update_readme():
    os.system(f"git add README.md README.{lang}.md && git commit -m '🔄 Inject {lang.upper()} README with build matrix' && git push")
    print("✅ README auto-committed and pushed.")
else:
    print("⚠️ No README update occurred.")
