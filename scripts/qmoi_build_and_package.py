import os
import subprocess
import shutil


def build_pwa(source_dir, output_dir, binary_name):
    if not os.path.exists(source_dir) or not os.listdir(source_dir):
        print(f"[SKIP] PWA source missing or empty: {source_dir}")
        return
    os.chdir(source_dir)
    subprocess.run(["npm", "install"], check=True)
    subprocess.run(["npm", "run", "build"], check=True)
    build_dir = (
        os.path.join(source_dir, "dist")
        if os.path.exists("dist")
        else os.path.join(source_dir, "build")
    )
    binary_path = os.path.join(output_dir, binary_name)
    shutil.make_archive(binary_path.replace(".qcapp", ""), "zip", build_dir)
    os.rename(binary_path.replace(".qcapp", ".zip"), binary_path)
    print(f"Packaged PWA as {binary_path}")


def build_smarttv(source_dir, output_dir, binary_name):
    if not os.path.exists(source_dir) or not os.listdir(source_dir):
        print(f"[SKIP] SmartTV source missing or empty: {source_dir}")
        return
    os.chdir(source_dir)
    # Example: For web-based SmartTV app
    subprocess.run(["npm", "install"], check=True)
    subprocess.run(["npm", "run", "build"], check=True)
    build_dir = (
        os.path.join(source_dir, "dist")
        if os.path.exists("dist")
        else os.path.join(source_dir, "build")
    )
    binary_path = os.path.join(output_dir, binary_name)
    shutil.make_archive(binary_path.replace(".tvapp", ""), "zip", build_dir)
    os.rename(binary_path.replace(".tvapp", ".zip"), binary_path)
    print(f"Packaged SmartTV app as {binary_path}")


if __name__ == "__main__":
    # Example usage: build QCity PWA and SmartTV app
    qcity_src = "../frontend/qcity-pwa"
    qcity_out = "./Qmoi_apps/qcity/"
    os.makedirs(qcity_out, exist_ok=True)
    build_pwa(qcity_src, qcity_out, "qcity.qcapp")

    smarttv_src = "../frontend/smarttv-app"
    smarttv_out = "./Qmoi_apps/smarttv/"
    os.makedirs(smarttv_out, exist_ok=True)
    build_smarttv(smarttv_src, smarttv_out, "qmoi_ai.tvapp")
