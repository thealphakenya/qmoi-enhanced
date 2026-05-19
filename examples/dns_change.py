#!/usr/bin/env python3
"""DNS change stub."""
import logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def update_dns_record(domain: str, record_name: str, target: str) -> bool:
    logger.info(f'Updating DNS record {record_name} for {domain} to {target}')
    return True

if __name__ == '__main__':
    print(update_dns_record('example.com', 'www', '1.2.3.4'))
