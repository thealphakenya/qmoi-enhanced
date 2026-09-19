#!/usr/bin/env python3
"""Rotate an encrypted named secret safely.

Usage:
  python scripts/qmoi_rotate_secret.py --name github --token <NEW_TOKEN> [--store-keyring] [--confirm-write]

This will overwrite .qmoi/{name}_token.enc with the new encrypted secret.
"""
import argparse
from pathlib import Path


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--name', required=True, help='Name of the secret (e.g., github, ngrok)')
    p.add_argument('--token', required=True, help='New token value')
    p.add_argument('--store-keyring', action='store_true')
    p.add_argument('--confirm-write', action='store_true', help='Confirm writing token to disk')
    args = p.parse_args()

    if args.token.startswith('ghp_') and not args.confirm_write:
        print('Refusing to write GitHub token without --confirm-write')
        return

    from scripts.qmoi_secret_manager import encrypt_named_secret, generate_master_key, store_master_key_in_keyring, get_master_key

    # ensure master key exists
    mk = get_master_key()
    if mk is None:
        print('No master key present. Generating a new one. Consider storing it in keyring with --store-keyring')
        key = generate_master_key()
        if args.store_keyring:
            ok = store_master_key_in_keyring(key)
            if ok:
                print('Stored new master key in keyring')
            else:
                print('Failed to store in keyring; set QMOI_MASTER_KEY env var manually')
        else:
            print('New master key generated. Set QMOI_MASTER_KEY environment variable to:')
            print(key.decode())

    out = encrypt_named_secret(args.token, args.name)
    print(f'Rotated secret for {args.name}; written to {out}')


if __name__ == '__main__':
    main()
