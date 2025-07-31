import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = Path("public")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SIZES = [16, 32, 48, 64, 128, 256, 512]
ICON_TEXT = "Q"
ICON_OVERLAY = "A"
GRADIENT_COLORS = ((20, 20, 60), (90, 20, 120))  # Brand gradient: deep violet
FONT_COLOR = (255, 255, 255, 255)
SHADOW_COLOR = (0, 0, 0, 128)

def generate_gradient(size):
    base = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    gradient = Image.new('RGBA', (1, size), color=0)
    for y in range(size):
        ratio = y / size
        r = int(GRADIENT_COLORS[0][0] * (1 - ratio) + GRADIENT_COLORS[1][0] * ratio)
        g = int(GRADIENT_COLORS[0][1] * (1 - ratio) + GRADIENT_COLORS[1][1] * ratio)
        b = int(GRADIENT_COLORS[0][2] * (1 - ratio) + GRADIENT_COLORS[1][2] * ratio)
        gradient.putpixel((0, y), (r, g, b, 255))
    return gradient.resize((size, size))

def draw_3d_text(draw, position, text, font, fill, shadow_offset=3):
    x, y = position
    # Draw shadow
    draw.text((x + shadow_offset, y + shadow_offset), text, font=font, fill=SHADOW_COLOR)
    draw.text((x, y), text, font=font, fill=fill)

def draw_icon(size):
    img = generate_gradient(size).copy()
    draw = ImageDraw.Draw(img)
    try:
        font_main = ImageFont.truetype("arialbd.ttf", size // 2)
        font_overlay = ImageFont.truetype("arial.ttf", size // 4)
    except:
        font_main = ImageFont.load_default()
        font_overlay = ImageFont.load_default()

    # Main Q letter
    q_bbox = draw.textbbox((0, 0), ICON_TEXT, font=font_main)
    q_w = q_bbox[2] - q_bbox[0]
    q_h = q_bbox[3] - q_bbox[1]
    q_x = (size - q_w) // 2
    q_y = (size - q_h) // 2

    draw_3d_text(draw, (q_x, q_y), ICON_TEXT, font_main, FONT_COLOR)

    # Overlay A letter on top of Q (bottom-right)
    a_bbox = draw.textbbox((0, 0), ICON_OVERLAY, font=font_overlay)
    a_w = a_bbox[2] - a_bbox[0]
    a_h = a_bbox[3] - a_bbox[1]
    a_x = q_x + q_w - a_w // 2
    a_y = q_y + q_h - a_h // 2

    draw_3d_text(draw, (a_x, a_y), ICON_OVERLAY, font_overlay, (255, 200, 255, 255))
    return img

def save_multiple_formats(images):
    icon_base = images[256]
    icon_base.save(OUTPUT_DIR / "icon-256.png", format="PNG")
    icon_base.save(OUTPUT_DIR / "icon.webp", format="WEBP")
    icon_base.save(OUTPUT_DIR / "icon.ico", sizes=[(s, s) for s in SIZES])
    icon_base.save(OUTPUT_DIR / "icon.icns", sizes=[(s, s) for s in SIZES])

    # SVG fallback with gradient
    with open(OUTPUT_DIR / "icon.svg", "w") as f:
        f.write(f"""<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#14143c"/>
      <stop offset="100%" stop-color="#5a1478"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <text x="50%" y="55%" text-anchor="middle" font-size="130" fill="white" font-family="Arial" font-weight="bold">Q</text>
  <text x="65%" y="72%" text-anchor="middle" font-size="60" fill="#ffc8ff" font-family="Arial">A</text>
</svg>""")

def generate_all_icons():
    print("🎨 Generating 3D-styled Q+A icons with transparent background...")
    images = {}
    for size in SIZES:
        img = draw_icon(size)
        images[size] = img
    save_multiple_formats(images)
    print("✅ All icons saved to:", OUTPUT_DIR)

if __name__ == "__main__":
    generate_all_icons()
