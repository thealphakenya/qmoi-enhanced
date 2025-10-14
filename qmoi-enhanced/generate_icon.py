from PIL import Image, ImageDraw, ImageFont
import os, json
from datetime import datetime

ICON_DIR = "icons"
BASE_NAME = "icon"
VARIANTS = ["light", "dark"]
PACKAGE_JSON = "package.json"


def ensure_dir(path):
    os.makedirs(path, exist_ok=True)


def get_version():
    if os.path.exists(PACKAGE_JSON):
        with open(PACKAGE_JSON) as f:
            return json.load(f).get("version", "1.0.0")
    return "1.0.0"


def get_timestamp():
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")


def generate_icon(theme, version):
    bg = (255, 255, 255, 255) if theme == "light" else (30, 30, 30, 255)
    fg = (90, 150, 255, 255)
    text = (0, 0, 0, 255) if theme == "light" else (255, 255, 255, 255)
    img = Image.new("RGBA", (256, 256), bg)
    draw = ImageDraw.Draw(img)
    draw.ellipse((20, 20, 236, 236), fill=fg, outline=(0, 0, 0), width=4)
    try:
        font = ImageFont.truetype("arial.ttf", 140)
        subfont = ImageFont.truetype("arial.ttf", 18)
    except:
        font = ImageFont.load_default()
        subfont = ImageFont.load_default()
    draw.text((90, 60), "Q", font=font, fill=text)
    draw.text((10, 225), f"v{version}", font=subfont, fill=text)
    draw.text((120, 225), get_timestamp(), font=subfont, fill=text)
    return img


def save_icons(theme, version):
    ensure_dir(ICON_DIR)
    img = generate_icon(theme, version)
    suffix = f"-{theme}" if theme != "light" else ""
    img.save(f"{ICON_DIR}/{BASE_NAME}{suffix}.ico", format="ICO")
    img.save(f"{ICON_DIR}/{BASE_NAME}{suffix}.icns", format="ICNS")
    img.save(f"{ICON_DIR}/{BASE_NAME}{suffix}.png", format="PNG")
    print(f"✅ Generated {theme} icons.")


if __name__ == "__main__":
    version = get_version()
    for variant in VARIANTS:
        save_icons(variant, version)
