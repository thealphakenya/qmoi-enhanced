#!/usr/bin/env python3
"""QMOI Host Reachability Checker

This is a lightweight fallback tool to validate host-level health when Node/npm/pm2 cannot run.
It checks local endpoints, system tools, DNS, and remote domain accessibility, and writes a short report.
"""

import os
import socket
import sys
import urllib.request
from urllib.error import URLError, HTTPError
from datetime import datetime

DOMAINS = ["qvillage.com", "qcloud.ai", "stableq.ai", "qglobal.org", "quantum.qmoi.com", "qmoi.com"]
LOCAL_ENDPOINTS = ["http://127.0.0.1:3000/health", "http://127.0.0.1:4000/api/health", "http://127.0.0.1:4100/health"]


def check_command(cmd):
    from shutil import which
    return which(cmd) is not None


def check_url(url, timeout=5):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "QMOI-Reachability/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return True, response.getcode(), response.reason
    except HTTPError as e:
        return False, e.code, e.reason
    except URLError as e:
        return False, None, str(e.reason)
    except Exception as e:
        return False, None, str(e)


def check_dns(domain):
    try:
        addrs = socket.getaddrinfo(domain, 80)
        ips = sorted(set(addr[4][0] for addr in addrs))
        return True, ips
    except Exception as e:
        return False, str(e)


def main():
    print("QMOI Host Reachability Checker")
    print(f"Timestamp: {datetime.utcnow().isoformat()}Z")
    print("-" * 60)

    # check runtime tools
    tools = ["node", "npm", "npx", "pm2", "curl", "ping"]
    print("Runtime tools:")
    for tool in tools:
        available = check_command(tool)
        print(f"  - {tool}: {'available' if available else 'missing'}")

    # local endpoints
    print("\nLocal endpoint checks:")
    for url in LOCAL_ENDPOINTS:
        ok, status, msg = check_url(url)
        if ok:
            print(f"  - {url}: OK ({status} {msg})")
        else:
            print(f"  - {url}: FAILED ({status}) {msg}")

    # domain checks
    print("\nDomain checks:")
    for domain in DOMAINS:
        dns_ok, dns_data = check_dns(domain)
        if dns_ok:
            print(f"  - DNS {domain}: OK -> {', '.join(dns_data)}")
        else:
            print(f"  - DNS {domain}: FAILED -> {dns_data}")

        # check remote health page if dns OK
        if dns_ok:
            for scheme in ["https://", "http://"]:
                health_url = f"{scheme}{domain}/health"
                ok, status, msg = check_url(health_url)
                status_text = f"{status} {msg}" if status else msg
                print(f"    - {health_url}: {'OK' if ok else 'FAIL'} ({status_text})")

    print("\nSummary:")
    print("  * Please execute this script on the intended production host after Node/pm2 is installed.")
    print("  * Ensure that services are started and endpoints return 200.")
    print("  * Record/log results and remediate any failures.")


if __name__ == '__main__':
    main()
