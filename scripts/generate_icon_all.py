import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = Path("public")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ICON_TEXT = "Q"
SIZES = [16, 32, 48, 64, 128, 256, 512]
GRADIENT_COLORS = ((30, 30, 60), (90, 20, 120))  # Dark branding gradient


def generate_gradient(size):
    base = Image.new("RGB", (size, size), GRADIENT_COLORS[0])
    top = Image.new("RGB", (size, size), GRADIENT_COLORS[1])
    mask = Image.new("L", (size, size))
    mask_data = []
    for y in range(size):
        mask_data.extend([int(255 * (y / size))] * size)
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base.convert("RGBA")


def draw_text_on_image(img, size):
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", size // 2)
    except:
        font = ImageFont.load_default()

    # Use textbbox instead of textsize for compatibility with new Pillow
    bbox = draw.textbbox((0, 0), ICON_TEXT, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    draw.text(
        ((size - text_width) / 2, (size - text_height) / 2),
        ICON_TEXT,
        font=font,
        fill=(255, 255, 255, 255),
    )
    return img


def save_multiple_formats(images):
    base_png_path = OUTPUT_DIR / "icon-256.png"
    images[256].save(base_png_path)
    images[256].save(OUTPUT_DIR / "icon.ico", sizes=[(s, s) for s in SIZES])
    images[256].save(OUTPUT_DIR / "icon.icns", sizes=[(s, s) for s in SIZES])
    images[256].save(OUTPUT_DIR / "icon.webp", format="WEBP")

    with open(OUTPUT_DIR / "icon.svg", "w") as f:
        f.write(
            f"""<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="130" fill="white" font-family="Arial">{ICON_TEXT}</text>
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1e3c" />
      <stop offset="100%" stop-color="#5a1478" />
    </linearGradient>
  </defs>
</svg>"""
        )


def generate_all_icons():
    print("Generating QMOI branded icons in all formats and sizes...")
    images = {}
    for size in SIZES:
        img = generate_gradient(size)
        img = draw_text_on_image(img, size)
        images[size] = img

    save_multiple_formats(images)
    print("Icons saved in:")
    for f in ["icon.ico", "icon.icns", "icon.png", "icon.svg", "icon.webp"]:
        print(f"  - public/{f}")


if __name__ == "__main__":
    generate_all_icons()
