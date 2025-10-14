from PIL import Image
import os

sizes = [192, 512, 1024]
folders = [
    "frontend/qcity-pwa/public",
    "frontend/smarttv-app/public",
    "mobile/ios-app/Assets.xcassets/AppIcon.appiconset",
    "desktop/electron-app/public",
    "pi/pi-app/assets",
]
for folder in folders:
    os.makedirs(folder, exist_ok=True)
    for size in sizes:
        path = os.path.join(folder, f"icon_{size}.png")
        img = Image.new("RGBA", (size, size), (34, 34, 34, 255))
        img.save(path)

print("Placeholder icons generated.")
