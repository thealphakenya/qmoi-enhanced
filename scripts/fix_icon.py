from PIL import Image
import os

png_path = "public/icon-256.png"
ico_path = "icon.ico"

if not os.path.exists(png_path):
    raise FileNotFoundError(f"Missing source PNG: {png_path}")

img = Image.open(png_path)
img.save(ico_path, format='ICO', sizes=[(256, 256)])
print(f"✅ Fixed and saved valid icon to {ico_path}")
