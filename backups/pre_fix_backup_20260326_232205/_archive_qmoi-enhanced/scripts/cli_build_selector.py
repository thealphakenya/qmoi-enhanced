// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:18Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
import argparse
import subprocess

choices = ["windows", "mac", "linux", "android", "ios", "chromebook", "raspberrypi", "smarttv", "qcity"]
parser = argparse.ArgumentParser()
parser.add_argument("--device", choices=choices, nargs='+', required=True)
args = parser.parse_args()

for d in args.device:
    subprocess.run(["python", "scripts/qmoi-app-builder.py", d])
