#!/usr/bin/env python3
"""Generate platform icon sets from master images for apps marked in tools/icon_report.json.

Produces PWA icons, Windows .ico, macOS .iconset (folder), iOS AppIcon.appiconset, and Linux PNGs.
Updates PWA manifest icon entries when missing.

This script uses Pillow and optionally cairosvg (for SVG masters).
"""
import json
import os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ICON_REPORT = ROOT / 'tools' / 'icon_report.json'
DISCOVERED = ROOT / 'tools' / 'discovered_assets.json'

def ensure_dir(p):
    p.mkdir(parents=True, exist_ok=True)

def load_report():
    if not ICON_REPORT.exists():
        print('No tools/icon_report.json found. Run tools/check_icons.py first.')
        return None
    return json.loads(ICON_REPORT.read_text())

def choose_master(app_entry):
    # prefer existing pwa icon, then assets/icons/<app>.png/svg, then public/icon-256.png
    # return Path or None
    candidates = []
    # pwa icons
    for p in app_entry.get('pwa_icons', []):
        if isinstance(p, str) and not p.startswith('MISSING:'):
            candidates.append(Path(p))
    # common assets
    assets_dir = ROOT / 'assets' / 'icons'
    if assets_dir.exists():
        for ext in ['png','svg','jpg','jpeg']:
            p = assets_dir / f"{app_entry['app']}.{ext}"
            if p.exists():
                candidates.append(p)
    # fallback to any icon in assets/icons
    if assets_dir.exists():
        for f in assets_dir.iterdir():
            if f.suffix.lower() in ('.png','.svg'):
                candidates.append(f)
    # public icon
    pub = ROOT / 'public' / 'icon-256.png'
    if pub.exists():
        candidates.append(pub)

    # return first readable image
    from PIL import Image as PILImage
    def is_valid_image(p):
        try:
            if not p.exists() or p.stat().st_size == 0:
                return False
            if p.suffix.lower() == '.svg':
                return True
            with PILImage.open(p) as im:
                im.verify()
            return True
        except Exception:
            return False

    for c in candidates:
        try:
            if is_valid_image(c):
                return c
        except Exception:
            continue
    return None

def rasterize_if_svg(path, size):
    # If path is svg, try cairosvg to convert to bytes, else fail
    if path.suffix.lower() == '.svg':
        try:
            import cairosvg
            png_bytes = cairosvg.svg2png(url=str(path), output_width=size, output_height=size)
            from io import BytesIO
            return Image.open(BytesIO(png_bytes)).convert('RGBA')
        except Exception:
            print('cairosvg not available or failed; skipping svg', path)
            return None
    else:
        try:
            im = Image.open(path).convert('RGBA')
            return im
        except Exception as e:
            print('Failed to open master', path, e)
            return None

def generate_pngs(master, sizes, out_dir, basename='icon'):
    ensure_dir(out_dir)
    generated = []
    for s in sizes:
        out = out_dir / f"{basename}-{s}x{s}.png"
        if master.suffix.lower() == '.svg':
            im = rasterize_if_svg(master, s)
            if im is None:
                continue
            im = im.resize((s,s), Image.LANCZOS)
        else:
            im = Image.open(master).convert('RGBA')
            im = im.resize((s,s), Image.LANCZOS)
        im.save(out)
        generated.append(out)
    return generated

def generate_ico(master, sizes, out_file):
    # Pillow supports saving multi-size .ico
    if master.suffix.lower() == '.svg':
        im = rasterize_if_svg(master, max(sizes))
        if im is None:
            return False
    else:
        im = Image.open(master).convert('RGBA')
    icons = [im.resize((s,s), Image.LANCZOS) for s in sizes]
    icons[0].save(out_file, format='ICO', sizes=[(s,s) for s in sizes])
    return True

def create_mac_iconset(master, out_folder):
    # create .iconset folder with required sizes for iconutil
    ensure_dir(out_folder)
    sizes = [16,32,64,128,256,512,1024]
    for s in sizes:
        normal = out_folder / f"icon_{s}x{s}.png"
        double = out_folder / f"icon_{s}x{s}@2x.png"
        # normal size
        im = rasterize_if_svg(master, s) if master.suffix.lower()=='.svg' else Image.open(master).convert('RGBA')
        im.resize((s,s), Image.LANCZOS).save(normal)
        im.resize((s*2,s*2), Image.LANCZOS).save(double)
    return True

def create_ios_appiconset(master, out_folder):
    ensure_dir(out_folder)
    # minimal common sizes (scale * size)
    sizes = [20,29,40,60,76,83.5,1024]
    entries = []
    for s in sizes:
        for scale in (1,2,3):
            px = int(s * scale)
            name = f"icon-{s}x{s}@{scale}x.png".replace('.5','_5')
            out = out_folder / name
            im = rasterize_if_svg(master, px) if master.suffix.lower()=='.svg' else Image.open(master).convert('RGBA')
            im.resize((px,px), Image.LANCZOS).save(out)
            entries.append({'size':s,'scale':scale,'filename':name})
    # write a minimal Contents.json
    contents = {
        'images': [{'filename': e['filename'], 'size': str(e['size']), 'scale': f"{e['scale']}x"} for e in entries],
        'info': {'version':1,'author':'xcode'}
    }
    (out_folder / 'Contents.json').write_text(json.dumps(contents, indent=2))
    return True

def update_pwa_manifest(app_entry, icons):
    # app_entry gives app name; manifest may be in pwa_apps/<app>/manifest.*
    path = Path(app_entry.get('pwa_manifest_path',''))
    if not path or not path.exists():
        # try to find
        candidates = list((ROOT / 'pwa_apps' / app_entry['app']).glob('manifest.*')) if (ROOT / 'pwa_apps' / app_entry['app']).exists() else []
        if candidates:
            path = candidates[0]
    if not path or not path.exists():
        return False
    try:
        m = json.loads(path.read_text())
    except Exception:
        return False
    # build icons list
    m_icons = []
    for ico in icons:
        rel = os.path.relpath(ico, path.parent)
        m_icons.append({'src': rel.replace('\\','/'), 'sizes': '512x512', 'type':'image/png'})
    m['icons'] = m_icons
    path.write_text(json.dumps(m, indent=2))
    return True

def main():
    report = load_report()
    if report is None:
        return 1
    apps = report.get('apps', [])
    changes = []
    for app in apps:
        name = app['app']
        master = choose_master(app)
        if master is None:
            print('No master image found for', name)
            continue
        print('Using master', master, 'for', name)
        # generate pwa icons
        pwa_out = ROOT / 'pwa_apps' / name / 'icons'
        pwa_sizes = [48,192,512]
        pwa_generated = generate_pngs(master, pwa_sizes, pwa_out, basename='icon')
        # windows ico
        win_dir = ROOT / 'packaging' / 'icons'
        ensure_dir(win_dir)
        ico_file = win_dir / f"{name}.ico"
        generate_ico(master, [16,32,48,256], ico_file)
        # mac iconset
        mac_dir = ROOT / 'packaging' / 'icons' / f"{name}.iconset"
        create_mac_iconset(master, mac_dir)
        # ios appiconset
        ios_dir = ROOT / 'packaging' / 'icons' / name / 'AppIcon.appiconset'
        create_ios_appiconset(master, ios_dir)
        # linux pngs
        linux_dir = ROOT / 'packaging' / 'icons' / name
        generate_pngs(master, [512,192], linux_dir, basename='icon')
        # update pwa manifest if missing icons
        update_pwa_manifest(app, [str(p) for p in pwa_generated])
        changes.append(name)
    # commit generated files
    if changes:
        import subprocess
        subprocess.run(['git','add','pwa_apps','packaging','tools/icon_report.json'], check=False)
        subprocess.run(['git','commit','-m',f'autogen: generate icon sets for {len(changes)} apps: {",".join(changes)}'], check=False)
        subprocess.run(['git','push','origin','HEAD'], check=False)
    print('Done. Generated icons for', len(changes), 'apps')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
#!/usr/bin/env python3
"""Generate platform icon sets from master images for apps marked in tools/icon_report.json.

Produces PWA icons, Windows .ico, macOS .iconset (folder), iOS AppIcon.appiconset, and Linux PNGs.
Updates PWA manifest icon entries when missing.

This script uses Pillow and optionally cairosvg (for SVG masters).
"""
import json
import os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ICON_REPORT = ROOT / 'tools' / 'icon_report.json'
DISCOVERED = ROOT / 'tools' / 'discovered_assets.json'

def ensure_dir(p):
    p.mkdir(parents=True, exist_ok=True)

def load_report():
    if not ICON_REPORT.exists():
        print('No tools/icon_report.json found. Run tools/check_icons.py first.')
        return None
    return json.loads(ICON_REPORT.read_text())

def choose_master(app_entry):
    # prefer existing pwa icon, then assets/icons/<app>.png/svg, then public/icon-256.png
    # return Path or None
    candidates = []
    # pwa icons
    for p in app_entry.get('pwa_icons', []):
        if isinstance(p, str) and not p.startswith('MISSING:'):
            candidates.append(Path(p))
    # common assets
    assets_dir = ROOT / 'assets' / 'icons'
    if assets_dir.exists():
        for ext in ['png','svg','jpg','jpeg']:
            p = assets_dir / f"{app_entry['app']}.{ext}"
            if p.exists():
                candidates.append(p)
    # fallback to any icon in assets/icons
    if assets_dir.exists():
        for f in assets_dir.iterdir():
            if f.suffix.lower() in ('.png','.svg'):
                candidates.append(f)
    # public icon
    pub = ROOT / 'public' / 'icon-256.png'
    if pub.exists():
        candidates.append(pub)

    # return first readable image
    for c in candidates:
        if c.exists():
            return c
    return None

def rasterize_if_svg(path, size):
    # If path is svg, try cairosvg to convert to bytes, else fail
    if path.suffix.lower() == '.svg':
        try:
            import cairosvg
            png_bytes = cairosvg.svg2png(url=str(path), output_width=size, output_height=size)
            from io import BytesIO
            return Image.open(BytesIO(png_bytes)).convert('RGBA')
        except Exception:
            print('cairosvg not available or failed; skipping svg', path)
            return None
    else:
        try:
            im = Image.open(path).convert('RGBA')
            return im
        except Exception as e:
            print('Failed to open master', path, e)
            return None

def generate_pngs(master, sizes, out_dir, basename='icon'):
    ensure_dir(out_dir)
    generated = []
    for s in sizes:
        out = out_dir / f"{basename}-{s}x{s}.png"
        if master.suffix.lower() == '.svg':
            im = rasterize_if_svg(master, s)
            if im is None:
                continue
            im = im.resize((s,s), Image.LANCZOS)
        else:
            im = Image.open(master).convert('RGBA')
            im = im.resize((s,s), Image.LANCZOS)
        im.save(out)
        generated.append(out)
    return generated

def generate_ico(master, sizes, out_file):
    # Pillow supports saving multi-size .ico
    if master.suffix.lower() == '.svg':
        im = rasterize_if_svg(master, max(sizes))
        if im is None:
            return False
    else:
        im = Image.open(master).convert('RGBA')
    icons = [im.resize((s,s), Image.LANCZOS) for s in sizes]
    icons[0].save(out_file, format='ICO', sizes=[(s,s) for s in sizes])
    return True

def create_mac_iconset(master, out_folder):
    # create .iconset folder with required sizes for iconutil
    ensure_dir(out_folder)
    sizes = [16,32,64,128,256,512,1024]
    for s in sizes:
        normal = out_folder / f"icon_{s}x{s}.png"
        double = out_folder / f"icon_{s}x{s}@2x.png"
        # normal size
        im = rasterize_if_svg(master, s) if master.suffix.lower()=='.svg' else Image.open(master).convert('RGBA')
        im.resize((s,s), Image.LANCZOS).save(normal)
        im.resize((s*2,s*2), Image.LANCZOS).save(double)
    return True

def create_ios_appiconset(master, out_folder):
    ensure_dir(out_folder)
    # minimal common sizes (scale * size)
    sizes = [20,29,40,60,76,83.5,1024]
    entries = []
    for s in sizes:
        for scale in (1,2,3):
            px = int(s * scale)
            name = f"icon-{s}x{s}@{scale}x.png".replace('.5','_5')
            out = out_folder / name
            im = rasterize_if_svg(master, px) if master.suffix.lower()=='.svg' else Image.open(master).convert('RGBA')
            im.resize((px,px), Image.LANCZOS).save(out)
            entries.append({'size':s,'scale':scale,'filename':name})
    # write a minimal Contents.json
    contents = {
        'images': [{'filename': e['filename'], 'size': str(e['size']), 'scale': f"{e['scale']}x"} for e in entries],
        'info': {'version':1,'author':'xcode'}
    }
    (out_folder / 'Contents.json').write_text(json.dumps(contents, indent=2))
    return True

def update_pwa_manifest(app_entry, icons):
    # app_entry gives app name; manifest may be in pwa_apps/<app>/manifest.*
    path = Path(app_entry.get('pwa_manifest_path',''))
    if not path or not path.exists():
        # try to find
        candidates = list((ROOT / 'pwa_apps' / app_entry['app']).glob('manifest.*')) if (ROOT / 'pwa_apps' / app_entry['app']).exists() else []
        if candidates:
            path = candidates[0]
    if not path or not path.exists():
        return False
    try:
        m = json.loads(path.read_text())
    except Exception:
        return False
    # build icons list
    m_icons = []
    for ico in icons:
        # derive size from filename if possible
        name = Path(ico).name
        if '-' in name and name.split('-')[-1].startswith(''):
            # keep simple
            pass
        # use relative path
        rel = os.path.relpath(ico, path.parent)
        m_icons.append({'src': rel.replace('\\','/'), 'sizes': '512x512', 'type':'image/png'})
    m['icons'] = m_icons
    path.write_text(json.dumps(m, indent=2))
    return True

def main():
    report = load_report()
    if report is None:
        return 1
    apps = report.get('apps', [])
    changes = []
    for app in apps:
        name = app['app']
        master = choose_master(app)
        if master is None:
            print('No master image found for', name)
            continue
        print('Using master', master, 'for', name)
        # generate pwa icons
        pwa_out = ROOT / 'pwa_apps' / name / 'icons'
        pwa_sizes = [48,192,512]
        pwa_generated = generate_pngs(master, pwa_sizes, pwa_out, basename='icon')
        # windows ico
        win_dir = ROOT / 'packaging' / 'icons'
        ensure_dir(win_dir)
        ico_file = win_dir / f"{name}.ico"
        generate_ico(master, [16,32,48,256], ico_file)
        # mac iconset
        mac_dir = ROOT / 'packaging' / 'icons' / f"{name}.iconset"
        create_mac_iconset(master, mac_dir)
        # ios appiconset
        ios_dir = ROOT / 'packaging' / 'icons' / name / 'AppIcon.appiconset'
        create_ios_appiconset(master, ios_dir)
        # linux pngs
        linux_dir = ROOT / 'packaging' / 'icons' / name
        generate_pngs(master, [512,192], linux_dir, basename='icon')
        # update pwa manifest if missing icons
        update_pwa_manifest(app, [str(p) for p in pwa_generated])
        changes.append(name)
    # commit generated files
    if changes:
        import subprocess
        subprocess.run(['git','add','pwa_apps','packaging','tools/icon_report.json'], check=False)
        subprocess.run(['git','commit','-m',f'autogen: generate icon sets for {len(changes)} apps: {",".join(changes)}'], check=False)
        subprocess.run(['git','push','origin','HEAD'], check=False)
    print('Done. Generated icons for', len(changes), 'apps')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
