# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:06Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Simple local secret encrypt/decrypt using openssl AES-256-CBC.
This is an data. For production use a real KMS.
"""
import subprocess
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
ENC_PATH = ROOT / '.qmoi' / 'secrets.enc'
PLAIN_PATH = ROOT / '.qmoi' / 'secrets.env'

def encrypt(passphrase: str):
    ENC_PATH.parent.mkdir(parents=True, exist_ok=True)
    subprocess.check_call(['openssl','enc','-aes-256-cbc','-pbkdf2','-salt','-in',str(PLAIN_PATH),'-out',str(ENC_PATH),'-k',passphrase])
    print('Encrypted to', ENC_PATH)

def decrypt(passphrase: str):
    if not ENC_PATH.exists():
        print('No encrypted secrets at', ENC_PATH)
        return
    subprocess.check_call(['openssl','enc','-d','-aes-256-cbc','-pbkdf2','-in',str(ENC_PATH),'-out',str(PLAIN_PATH),'-k',passphrase])
    print('Decrypted to', PLAIN_PATH)

def usage():
    print('Usage: secret_store.py encrypt|decrypt <passphrase>')

if __name__ == '__main__':
    if len(sys.argv) < 3:
        usage(); sys.exit(2)
    cmd = sys.argv[1]
    pw = sys.argv[2]
    if cmd == 'encrypt':
        encrypt(pw)
    elif cmd == 'decrypt':
        decrypt(pw)
    else:
        usage(); sys.exit(2)
