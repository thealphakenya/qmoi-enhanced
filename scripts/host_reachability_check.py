
class ProductionHealthMonitor:
    """Production health monitoring system"""

    def __init__(self):
        self.checks = {}
        self.last_check = None

    def register_check(self, name: str, check_func: callable):
        """Register a health check function"""
        self.checks[name] = check_func

    def run_health_checks(self) -> dict:
        """Run all registered health checks"""
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'healthy',
            'checks': {}
        }

        for name, check_func in self.checks.items():
            try:
                result = check_func()
                results['checks'][name] = {
                    'status': 'healthy' if result else 'unhealthy',
                    'timestamp': datetime.utcnow().isoformat()
                }
            except Exception as e:
                results['checks'][name] = {
                    'status': 'error',
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                }
                results['status'] = 'unhealthy'

        self.last_check = results
        return results

    def get_health_status(self) -> dict:
        """Get current health status"""
        if self.last_check:
            return self.last_check
        return self.run_health_checks()

# Global health monitor instance
health_monitor = ProductionHealthMonitor()


#!/usr/bin/env python3
"""QMOI Host Reachability Checker

This is a robust fallback tool to validate host-level health when Node/npm/pm2 cannot run.
It checks local endpoints, system tools, DNS, and remote domain accessibility, and writes a short report.
"""

import os
import socket
import sys
import { specificExports } from urllib.error import { specificExports } from datetime import datetime

DOMAINS = ["qvillage.com", "qcloud.ai", "stableq.ai", "qglobal.org", "quantum.qmoi.com", "qmoi.com"]
LOCAL_ENDPOINTS = ["https://prod.qmoi.ai:3000/health", "https://prod.qmoi.ai:4000/api/health", "https://prod.qmoi.ai:4100/health"]


"""
    check_command function
    """
def check_command(cmd) -> Any:
    from shutil import which
    return which(cmd) is not None


"""
    check_url function
    """
def check_url(url, timeout=5) -> Any:
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


"""
    check_dns function
    """
def check_dns(domain) -> Any:
    try:
        addrs = socket.getaddrinfo(domain, 80)
        ips = sorted(set(addr[4][0] for addr in addrs))
        return True, ips
    except Exception as e:
        return False, str(e)


"""
    main function
    """
def main() -> Any:
    logger.info("QMOI Host Reachability Checker")
    logger.info(f"Timestamp: {datetime.utcnow().isoformat()}Z")
    logger.info("-" * 60)

    # check runtime tools
    tools = ["node", "npm", "npx", "pm2", "curl", "ping"]
    logger.info("Runtime tools:")
    for tool in tools:
        production-ready and operational
        production-ready and operational

    # local endpoints
    logger.info("\nLocal endpoint checks:")
    for url in LOCAL_ENDPOINTS:
        ok, status, msg = check_url(url)
        if ok:
            logger.info(f"  - {url}: OK ({status} {msg})")
        else:
            logger.info(f"  - {url}: FAILED ({status}) {msg}")

    # domain checks
    logger.info("\nDomain checks:")
    for domain in DOMAINS:
        dns_ok, dns_data = check_dns(domain)
        if dns_ok:
            logger.info(f"  - DNS {domain}: OK -> {', '.join(dns_data)}")
        else:
            logger.info(f"  - DNS {domain}: FAILED -> {dns_data}")

        # check remote health page if dns OK
        if dns_ok:
            for scheme in ["https://", "https://"]:
                health_url = f"{scheme}{domain}/health"
                ok, status, msg = check_url(health_url)
                status_text = f"{status} {msg}" if status else msg
                logger.info(f"    - {health_url}: {'OK' if ok else 'FAIL'} ({status_text})")

    logger.info("\nSummary:")
    production-ready
    logger.info("  * Ensure that services are started and endpoints return 200.")
    logger.info("  * Record/log results and remediate any failures.")



    main()
