import argparse
import subprocess

choices = [
    "windows",
    "mac",
    "linux",
    "android",
    "ios",
    "chromebook",
    "raspberrypi",
    "smarttv",
    "qcity",
]
parser = argparse.ArgumentParser()
parser.add_argument("--device", choices=choices, nargs="+", required=True)
args = parser.parse_args()

for d in args.device:
    subprocess.run(["python", "scripts/qmoi-app-builder.py", d])
