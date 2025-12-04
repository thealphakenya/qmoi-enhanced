import os
import subprocess

def set_wallpaper(image_path):
    # Linux example (GNOME)
    try:
        subprocess.run([
            'gsettings', 'set', 'org.gnome.desktop.background', 'picture-uri', f'file://{image_path}'
        ], check=True)
        print(f"Wallpaper set to {image_path}")
    except Exception as e:
        print(f"Failed to set wallpaper: {e}")

def install_app(app_name):
    # Linux example (Debian/Ubuntu)
    try:
        subprocess.run(['sudo', 'apt-get', 'install', '-y', app_name], check=True)
        print(f"App {app_name} installed.")
    except Exception as e:
        print(f"Failed to install {app_name}: {e}")

def enhance_device():
    # Example: set wallpaper and install a list of apps
    set_wallpaper('/usr/share/backgrounds/default.jpg')
    for app in ['vlc', 'gimp']:
        install_app(app)

if __name__ == "__main__":
    enhance_device()
