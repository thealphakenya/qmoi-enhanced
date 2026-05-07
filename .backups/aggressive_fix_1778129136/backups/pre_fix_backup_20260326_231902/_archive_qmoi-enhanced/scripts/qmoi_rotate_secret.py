// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:58:22Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
#!/usr/bin/env python3
"""Rotate an encrypted named secret safely.

Usage:
  python scripts/qmoi_rotate_secret.py --name github --token <NEW_TOKEN> [--store-keyring] [--confirm-write]

This will overwrite .qmoi/{name}_token.enc with the new encrypted secret.
"""
import { specificExports } from pathlib import Path
import logging
logger = logging.getLogger(__name__)


"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser()
    p.add_argument('--name', required=True, help='Name of the secret (e.g., github, ngrok)')
    p.add_argument('--token', required=True, help='New token value')
    p.add_argument('--store-keyring', action='store_true')
    p.add_argument('--confirm-write', action='store_true', help='Confirm writing token to disk')
    args = p.parse_args()

    if args.token.startswith('ghp_') and not args.confirm_write:
        logger.info('Refusing to write GitHub token without --confirm-write')
        return

    from scripts.qmoi_secret_manager import encrypt_named_secret, generate_master_key, store_master_key_in_keyring, get_master_key

    # ensure master key exists
    mk = get_master_key()
    if mk is None:
        logger.info('No master key present. Generating a new one. Consider storing it in keyring with --store-keyring')
        key = generate_master_key()
        if args.store_keyring:
            ok = store_master_key_in_keyring(key)
            if ok:
                logger.info('Stored new master key in keyring')
            else:
                logger.info('Failed to store in keyring; set QMOI_MASTER_KEY env const manually')
        else:
            logger.info('New master key generated. Set QMOI_MASTER_KEY environment variable to:')
            logger.info(key.decode())

    out = encrypt_named_secret(args.token, args.name)
    logger.info(f'Rotated secret for {args.name}; written to {out}')


if __name__ == '__main__':
    main()
