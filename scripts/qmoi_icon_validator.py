import os
from PIL import Image

REQUIRED_SIZES = [192, 512, 1024]
REQUIRED_FORMATS = ['png', 'svg']


def validate_icons(app_dir):
    icons_found = []
    for root, dirs, files in os.walk(app_dir):
        for file in files:
            if any(file.endswith(f'.{fmt}') for fmt in REQUIRED_FORMATS):
                path = os.path.join(root, file)
                if file.endswith('.png'):
                    try:
                        img = Image.open(path)
                        w, h = img.size
                        if w == h and w in REQUIRED_SIZES:
                            icons_found.append((file, w))
                    except Exception as e:
                        print(f"Error reading {file}: {e}")
                elif file.endswith('.svg'):
                    icons_found.append((file, 'svg'))
    for size in REQUIRED_SIZES:
        if not any(str(size) in str(icon) for icon in icons_found):
            print(f"Missing required icon size: {size}x{size} png in {app_dir}")
    if not any(icon[0].endswith('.svg') for icon in icons_found):
        print(f"Missing required SVG icon in {app_dir}")
    if icons_found:
        print(f"Found icons in {app_dir}: {icons_found}")
    else:
        print(f"No valid icons found in {app_dir}")

if __name__ == "__main__":
    # Example: validate all app icon folders
    app_folders = [
        'frontend/qcity-pwa/public',
        'frontend/smarttv-app/public',
        'mobile/android-app/app/src/main/res',
        'mobile/ios-app/Assets.xcassets',
        'desktop/electron-app/public',
        'web/web-app/public',
        'pi/pi-app/assets',
    ]
    for folder in app_folders:
        if os.path.exists(folder):
            validate_icons(folder)
        else:
            print(f"App icon folder not found: {folder}")
