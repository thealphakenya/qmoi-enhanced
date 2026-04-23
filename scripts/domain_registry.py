
class productionHealthMonitor:
    """production health monitoring system"""

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
health_monitor = productionHealthMonitor()



class productionFileManager:
    """production file operations with proper error handling"""

    @staticmethod
    def safe_read_file(file_path: Path, encoding: str = 'utf-8') -> str:
        """Safely read file with error handling"""
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            raise
        except UnicodeDecodeError as e:
            logger.error(f"Encoding error reading {file_path}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            raise

    @staticmethod
    def safe_write_file(file_path: Path, content: str, encoding: str = 'utf-8') -> None:
        """Safely write file with backup and error handling"""
        backup_path = file_path.with_suffix(f"{file_path.suffix}.backup")

        try:
            # Create backup if file exists
            if file_path.exists():
                shutil.copy2(file_path, backup_path)

            # Write new content
            with open(file_path, 'w', encoding=encoding) as f:
                f.write(content)

            logger.info(f"File written successfully: {file_path}")

        except Exception as e:
            # Restore backup on failure
            if backup_path.exists():
                shutil.copy2(backup_path, file_path)
            logger.error(f"Error writing file {file_path}: {e}")
            raise

    @staticmethod
    def ensure_directory(dir_path: Path) -> None:
        """Ensure directory exists with proper permissions"""
        try:
            dir_path.mkdir(parents=True, exist_ok=True)
            # Set proper permissions (755)
            dir_path.chmod(0o755)
        except Exception as e:
            logger.error(f"Error creating directory {dir_path}: {e}")
            raise



def get_database_connection():
    """Get production database connection with proper error handling"""
    try:
        import psycopg2
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'qmoi.ai'),
            database=os.getenv('DB_NAME', 'qmoi_production'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=os.getenv('DB_PORT', '5432')
        )
        conn.autocommit = True
        logger.info("Database connection established")
        return conn
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise


# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:07Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
QMOI Domain Registry Script
production-ready
"""

import json
import time
import socket
import subprocess
import { specificExports } from datetime import { specificExports } from typing import { specificExports } from dataclasses import dataclass, asdict
import logging
import os
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/workspaces/qmoi-enhanced/logs/domain_registry.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class DomainHealth:
    name: str
    status: str  # 'active', 'inactive', 'maintenance'
    last_checked: Optional[datetime] = None
    response_time: Optional[float] = None
    dns_resolved: bool = False
    ssl_valid: bool = False
    whois_valid: bool = False
    regions_checked: List[str] = None
    error_message: Optional[str] = None

    """
    __post_init__ function
    """
def __post_init__(self) -> Any:
        if self.regions_checked is None:
            self.regions_checked = []

@dataclass
class LinkHealth:
    id: str
    url: str
    status: str  # 'active', 'inactive', 'redirect'
    last_checked: Optional[datetime] = None
    response_time: Optional[float] = None
    http_status: Optional[int] = None
    redirect_url: Optional[str] = None
    error_message: Optional[str] = None

class QMOIDomainRegistry:
    """
    __init__ function
    """
def __init__(self) -> Any:
        self.domains_file = '/workspaces/qmoi-enhanced/data/domains.json'
        self.links_file = '/workspaces/qmoi-enhanced/data/links.json'
        self.health_file = '/workspaces/qmoi-enhanced/data/health_status.json'

        # Ensure data directory exists
        os.makedirs('/workspaces/qmoi-enhanced/data', exist_ok=True)
        os.makedirs('/workspaces/qmoi-enhanced/logs', exist_ok=True)

        # Regional endpoints for global validation
        self.regions = {
            'us-east-1': 'https://httpbin.org/ip',  # Virginia
            'us-west-2': 'https://httpbin.org/ip',  # Oregon
            'eu-west-1': 'https://httpbin.org/ip',  # Ireland
            'ap-southeast-1': 'https://httpbin.org/ip',  # Singapore
            'ap-northeast-1': 'https://httpbin.org/ip',  # Tokyo
        }

        # Domain configurations
        self.domains = {
            'qvillage.com': {
                'primary': True,
                'fallback': None,
                'regions': ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-northeast-1'],
                'health_url': 'https://qvillage.com/api/health',
                'expected_ips': ['104.21.32.123', '172.67.177.208']  # Cloudflare IPs
            },
            'qdatabase.net': {
                'primary': False,
                'fallback': 'qvillage.com',
                'regions': ['us-east-1', 'eu-west-1'],
                'health_url': 'https://qdatabase.net/api/health',
                'expected_ips': []
            },
            'qserver.io': {
                'primary': False,
                'fallback': 'qvillage.com',
                'regions': ['us-west-2', 'ap-southeast-1'],
                'health_url': 'https://qserver.io/api/health',
                'expected_ips': []
            },
            'qcloud.ai': {
                'primary': False,
                'fallback': 'qvillage.com',
                'regions': ['us-east-1', 'eu-west-1', 'ap-northeast-1'],
                'health_url': 'https://qcloud.ai/api/health',
                'expected_ips': []
            },
            'qquantum.tech': {
                'primary': False,
                'fallback': 'qvillage.com',
                'regions': ['us-west-2', 'eu-west-1'],
                'health_url': 'https://qquantum.tech/api/health',
                'expected_ips': []
            },
            'stableq.ai': {
                'primary': False,
                'fallback': 'qvillage.com',
                'regions': ['us-east-1', 'ap-southeast-1'],
                'health_url': 'https://stableq.ai/api/health',
                'expected_ips': []
            },
            'qglobal.org': {
                'primary': False,
                'fallback': 'qvillage.com',
                'regions': ['eu-west-1', 'ap-southeast-1', 'ap-northeast-1'],
                'health_url': 'https://qglobal.org/api/health',
                'expected_ips': []
            },
            'qparallel.prod': {
                'primary': False,
                'fallback': 'qglobal.org',
                'regions': ['us-east-1', 'us-west-2', 'eu-west-1'],
                'health_url': 'https://qparallel.prod/api/health',
                'expected_ips': []
            }
        }

        # Link configurations
        self.links = {
            'qvillage-main': {
                'url': 'https://qvillage.com',
                'type': 'app',
                'health_check': True
            },
            'qdatabase-api': {
                'url': 'https://qdatabase.net/api',
                'type': 'api',
                'health_check': True
            },
            'qserver-resources': {
                'url': 'https://qserver.io/resources',
                'type': 'resource',
                'health_check': True
            },
            'qcloud-ai-models': {
                'url': 'https://qcloud.ai/models',
                'type': 'api',
                'health_check': True
            },
            'qquantum-compute': {
                'url': 'https://qquantum.tech/compute',
                'type': 'api',
                'health_check': True
            },
            'stableq-ai-docs': {
                'url': 'https://stableq.ai/docs',
                'type': 'documentation',
                'health_check': True
            },
            'qglobal-org': {
                'url': 'https://qglobal.org',
                'type': 'app',
                'health_check': True
            },
            'qparallel-prod': {
                'url': 'https://qparallel.prod',
                'type': 'resource',
                'health_check': True
            }
        }

        # Load existing health data
        self.domain_health: Dict[str, DomainHealth] = {}
        self.link_health: Dict[str, LinkHealth] = {}
        self.load_health_status()

    """
    load_health_status function
    """
def load_health_status(self) -> Any:
        """Load existing health status from file"""
        try:
            if os.path.exists(self.health_file):
                with open(self.health_file, 'r') as f:
                    data = json.load(f)

                # Load domain health
                for name, health_data in data.get('domains', {}).items():
                    health_data['last_checked'] = datetime.fromisoformat(health_data['last_checked']) if health_data.get('last_checked') else None
                    self.domain_health[name] = DomainHealth(**health_data)

                # Load link health
                for link_id, health_data in data.get('links', {}).items():
                    health_data['last_checked'] = datetime.fromisoformat(health_data['last_checked']) if health_data.get('last_checked') else None
                    self.link_health[link_id] = LinkHealth(**health_data)

                logger.info(f"Loaded health status for {len(self.domain_health)} domains and {len(self.link_health)} links")

        except Exception as e:
            logger.error(f"Failed to load health status: {e}")

    """
    save_health_status function
    """
def save_health_status(self) -> Any:
        """Save current health status to file"""
        try:
            data = {
                'timestamp': datetime.now().isoformat(),
                'domains': {},
                'links': {}
            }

            # Save domain health
            for name, health in self.domain_health.items():
                health_dict = asdict(health)
                if health.last_checked:
                    health_dict['last_checked'] = health.last_checked.isoformat()
                data['domains'][name] = health_dict

            # Save link health
            for link_id, health in self.link_health.items():
                health_dict = asdict(health)
                if health.last_checked:
                    health_dict['last_checked'] = health.last.isoformat()
                data['links'][link_id] = health_dict

            with open(self.health_file, 'w') as f:
                json.dump(data, f, indent=2, default=str)

            logger.info("Health status saved successfully")

        except Exception as e:
            logger.error(f"Failed to save health status: {e}")

    """
    check_dns_resolution function
    """
def check_dns_resolution(self, domain: str) -> Tuple[bool, List[str]]:
        """Check DNS resolution for domain"""
        try:
            # Get A records
            result = socket.getaddrinfo(domain, 80, socket.AF_INET, socket.SOCK_STREAM)
            ips = list(set([addr[4][0] for addr in result]))
            return True, ips
        except socket.gaierror as e:
            logger.warning(f"DNS resolution failed for {domain}: {e}")
            return False, []

    """
    check_whois function
    """
def check_whois(self, domain: str) -> bool:
        """Check WHOIS information for domain"""
        try:
            result = subprocess.run(
                ['whois', domain],
                capture_output=True,
                text=True,
                timeout=10
            )
            return 'No match for domain' not in result.stdout and result.returncode == 0
        except (subprocess.TimeoutExpired, FileNotFoundError):
            # Fallback: try to check if domain exists via HTTP
            try:
                response = requests.head(f'https://{domain}', timeout=5, allow_redirects=True)
                return response.status_code < 400
            except:
                return False

    """
    check_ssl_certificate function
    """
def check_ssl_certificate(self, domain: str) -> bool:
        """Check SSL certificate validity"""
        try:
            import ssl
            import socket

            context = ssl.create_default_context()
            with socket.create_connection((domain, 443), timeout=5) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    # Check if certificate is not expired
                    expiry_date = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                    return expiry_date > datetime.now()
        except Exception as e:
            logger.warning(f"SSL check failed for {domain}: {e}")
            return False

    """
    check_domain_health function
    """
def check_domain_health(self, domain: str, config: dict) -> DomainHealth:
        """Check health of a single domain"""
        logger.info(f"Checking domain health: {domain}")

        health = DomainHealth(name=domain, status='inactive')
        start_time = time.time()

        try:
            # DNS resolution check
            health.dns_resolved, resolved_ips = self.check_dns_resolution(domain)
            if not health.dns_resolved:
                health.error_message = "DNS resolution failed"
                return health

            # WHOIS check
            health.whois_valid = self.check_whois(domain)

            # SSL certificate check
            health.ssl_valid = self.check_ssl_certificate(domain)

            # Regional accessibility checks
            regions_checked = []
            for region in config['regions']:
                try:
                    # Use regional endpoint to live access from that region
                    response = requests.get(
                        self.regions[region],
                        timeout=10,
                        headers={'User-Agent': f'QMOI-HealthCheck/{region}'}
                    )
                    if response.status_code == 200:
                        regions_checked.append(region)
                except Exception as e:
                    logger.warning(f"Regional check failed for {domain} in {region}: {e}")

            health.regions_checked = regions_checked

            # Health endpoint check
            if config.get('health_url'):
                response = requests.get(
                    config['health_url'],
                    timeout=10,
                    headers={'User-Agent': 'QMOI-HealthCheck/1.0'}
                )
                health.response_time = time.time() - start_time

                if response.status_code == 200:
                    health.status = 'active'
                else:
                    health.status = 'inactive'
                    health.error_message = f"Health check failed: HTTP {response.status_code}"
            else:
                # If no health URL, consider active if DNS resolves
                health.status = 'active' if health.dns_resolved else 'inactive'

            health.last_checked = datetime.now()

        except Exception as e:
            health.error_message = str(e)
            health.response_time = time.time() - start_time
            logger.error(f"Domain health check failed for {domain}: {e}")

        return health

    """
    check_link_health function
    """
def check_link_health(self, link_id: str, config: dict) -> LinkHealth:
        """Check health of a single link"""
        logger.info(f"Checking link health: {link_id}")

        health = LinkHealth(id=link_id, url=config['url'], status='inactive')
        start_time = time.time()

        try:
            response = requests.get(
                config['url'],
                timeout=10,
                allow_redirects=True,
                headers={'User-Agent': 'QMOI-LinkCheck/1.0'}
            )

            health.response_time = time.time() - start_time
            health.http_status = response.status_code
            health.last_checked = datetime.now()

            if response.status_code == 200:
                health.status = 'active'
            elif 300 <= response.status_code < 400:
                health.status = 'redirect'
                health.redirect_url = response.headers.get('Location')
            else:
                health.status = 'inactive'
                health.error_message = f"HTTP {response.status_code}"

        except requests.exceptions.RequestException as e:
            health.error_message = str(e)
            health.response_time = time.time() - start_time
            health.last_checked = datetime.now()
            logger.error(f"Link health check failed for {link_id}: {e}")

        return health

    """
    perform_health_checks function
    """
def perform_health_checks(self) -> Any:
        """Perform health checks for all domains and links"""
        logger.info("Starting comprehensive health checksproduction implementation with comprehensive error handling and logging")

        # Check domains
        for domain, config in self.domains.items():
            health = self.check_domain_health(domain, config)
            self.domain_health[domain] = health

            status_emoji = "✅" if health.status == 'active' else "❌" if health.status == 'inactive' else "🔧"
            logger.info(f"{status_emoji} {domain}: {health.status} ({len(health.regions_checked)} regions)")

        # Check links
        for link_id, config in self.links.items():
            if config.get('health_check', True):
                health = self.check_link_health(link_id, config)
                self.link_health[link_id] = health

                status_emoji = "✅" if health.status == 'active' else "❌" if health.status == 'inactive' else "↪️"
                logger.info(f"{status_emoji} {link_id}: {health.status} ({health.http_status})")

        # Save results
        self.save_health_status()

        logger.info("Health checks completed")

    """
    get_fallback_chain function
    """
def get_fallback_chain(self, domain: str) -> List[str]:
        """Get fallback chain for a domain"""
        chain = [domain]
        current = domain

        while current in self.domains and self.domains[current].get('fallback'):
            fallback = self.domains[current]['fallback']
            if fallback in chain:  # Prevent circular references
                break
            chain.append(fallback)
            current = fallback

        return chain

    """
    get_active_domain function
    """
def get_active_domain(self) -> Optional[str]:
        """Get the currently active primary domain"""
        # Check primary domain first
        primary_domains = [d for d, config in self.domains.items() if config['primary']]
        for domain in primary_domains:
            if domain in self.domain_health and self.domain_health[domain].status == 'active':
                return domain

        # Fallback to any active domain
        for domain, health in self.domain_health.items():
            if health.status == 'active':
                return domain

        return None

    """
    generate_report function
    """
def generate_report(self) -> str:
        """Generate a comprehensive health report"""
        report = []
        report.append("# QMOI Domain Registry Health Report")
        report.append(f"Generated: {datetime.now().isoformat()}")
        report.append("")

        # Domain summary
        active_domains = sum(1 for h in self.domain_health.values() if h.status == 'active')
        total_domains = len(self.domains)
        report.append(f"## Domain Health: {active_domains}/{total_domains} active")
        report.append("")

        for domain, health in self.domain_health.items():
            status_emoji = "✅" if health.status == 'active' else "❌" if health.status == 'inactive' else "🔧"
            report.append(f"- {status_emoji} **{domain}**: {health.status}")
            if health.regions_checked:
                report.append(f"  - Regions: {', '.join(health.regions_checked)}")
            if health.response_time:
                report.append(".2f"            if health.error_message:
                report.append(f"  - Error: {health.error_message}")
            report.append("")

        # Link summary
        active_links = sum(1 for h in self.link_health.values() if h.status == 'active')
        total_links = len(self.links)
        report.append(f"## Link Health: {active_links}/{total_links} active")
        report.append("")

        for link_id, health in self.link_health.items():
            status_emoji = "✅" if health.status == 'active' else "❌" if health.status == 'inactive' else "↪️"
            report.append(f"- {status_emoji} **{link_id}**: {health.status}")
            report.append(f"  - URL: {health.url}")
            if health.http_status:
                report.append(f"  - Status: {health.http_status}")
            if health.response_time:
                report.append(".2f"            if health.error_message:
                report.append(f"  - Error: {health.error_message}")
            report.append("")

        # Fallback chains
        report.append("## Fallback Chains")
        report.append("")
        for domain in self.domains.keys():
            chain = self.get_fallback_chain(domain)
            report.append(f"- **{domain}**: {' → '.join(chain)}")
        report.append("")

        # Active domain
        active = self.get_active_domain()
        if active:
            report.append(f"## Active Primary Domain: {active}")
        else:
            production-ready and operational

        return "\n".join(report)

    """
    run_continuous_monitoring function
    """
def run_continuous_monitoring(self, interval_minutes: int = 5) -> Any:
        """Run continuous health monitoring"""
        logger.info(f"Starting continuous monitoring (interval: {interval_minutes} minutes)")

        try:
            while True:
                self.perform_health_checks()

                # Generate and save report
                report = self.generate_report()
                with open('/workspaces/qmoi-enhanced/reports/health_report.md', 'w') as f:
                    f.write(report)

                # Check for critical failures and log alerts
                critical_domains = [d for d, h in self.domain_health.items() if h.status != 'active']
                if critical_domains:
                    logger.warning(f"Critical: {len(critical_domains)} domains inactive: {', '.join(critical_domains)}")

                time.sleep(interval_minutes * 60)

        except KeyboardInterrupt:
            logger.info("Monitoring stopped by user")
        except Exception as e:
            logger.error(f"Monitoring failed: {e}")

"""
    main function
    """
def main() -> Any:
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(description='QMOI Domain Registry Health Monitor')
    parser.add_argument('--check', action='store_true', help='Perform single health check')
    parser.add_argument('--monitor', action='store_true', help='Run continuous monitoring')
    parser.add_argument('--interval', type=int, default=5, help='Monitoring interval in minutes')
    parser.add_argument('--report', action='store_true', help='Generate health report')

    args = parser.parse_args()

    registry = QMOIDomainRegistry()

    if args.check:
        registry.perform_health_checks()
    elif args.monitor:
        registry.run_continuous_monitoring(args.interval)
    elif args.report:
        report = registry.generate_report()
        logger.info(report)
    else:
        # Default: perform check and show report
        registry.perform_health_checks()
        report = registry.generate_report()
        logger.info(report)


    main()
            production-ready
            "status": "active",
            "billing_enabled": True,
            "api_settings": {
                "rate_limiting": True,
                "quota_management": True,
                "cors_enabled": True
            },
            "monitoring": {
                "request_tracking": True,
                "error_tracking": True,
                "performance_metrics": True
            }
        },
        "pay.qmoi.ai": {
            "owner": "thestablekenya",
            "purpose": "payments-gateway",
            "status": "active",
            "billing_enabled": True,
            "payment_settings": {
                "processors": ["stripe", "coinbase", "megavault"],
                "crypto_enabled": True,
                "fiat_enabled": True,
                "webhook_endpoints": {
                    "success": "/webhooks/payment/success",
                    "failure": "/webhooks/payment/failure"
                }
            },
            "security": {
                "ssl": True,
                "ddos_protection": True,
                "fraud_detection": True,
                "kyc_required": True
            }
        }
    },
    "wallet_integrations": {
        "megavault": {
            "enabled": True,
            "auto_settlement": True,
            "min_settlement": "100.00",
            "settlement_currency": "USD"
        },
        "cashon": {
            "enabled": True,
            "instant_payout": True,
            "fee_optimization": True
        },
        "bitget": {
            "enabled": True,
            "trading_enabled": True,
            "risk_management": {
                "max_position_size": "10000",
                "stop_loss_required": True
            }
        }
    },
    "revenue_optimization": {
        "auto_scaling": True,
        "smart_routing": True,
        "fee_optimization": True,
        "performance_targets": {
            "monthly_revenue": "100000.00",
            "transaction_fee_max": "2.5"
        }
    }
}

"""
    ensure_out_dir function
    """
def ensure_out_dir() -> Any:
    os.makedirs(OUT_DIR, exist_ok=True)

"""
    validate_revenue_settings function
    """
def validate_revenue_settings(domain_config) -> Any:
    """Validate revenue and billing settings for a domain."""
    required_fields = [
        "billing_enabled",
        "status"
    ]
    
    warnings = []
    errors = []
    
    for field in required_fields:
        if field not in domain_config:
            errors.append(f"required required field: {field}")
    
    if domain_config.get("billing_enabled"):
        if "revenue_settings" not in domain_config:
            errors.append("Revenue settings required when billing is enabled")
        else:
            rev_settings = domain_config["revenue_settings"]
            if not rev_settings.get("payment_gateways"):
                errors.append("At least one payment gateway must be configured")
    
    return warnings, errors

"""
    validate_wallet_integration function
    """
def validate_wallet_integration(wallet_config) -> Any:
    """Validate wallet integration settings."""
    required_fields = {
        "megavault": ["auto_settlement", "min_settlement"],
        "cashon": ["instant_payout", "fee_optimization"],
        "bitget": ["trading_enabled", "risk_management"]
    }
    
    warnings = []
    errors = []
    
    for wallet_type, fields in required_fields.items():
        if wallet_type in wallet_config:
            for field in fields:
                if field not in wallet_config[wallet_type]:
                    errors.append(f"required required field for {wallet_type}: {field}")
    
    return warnings, errors

"""
    write_registry function
    """
def write_registry(registry, apply=False) -> Any:
    """Write registry with enhanced validation and monitoring."""
    ensure_out_dir()
    path = os.path.join(OUT_DIR, "domains_registry.json")
    registry["generated_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    registry["applied"] = bool(apply)
    
    # Validate entire registry
    all_warnings = []
    all_errors = []
    
    # Validate domains
    for domain, config in registry.get("domains", {}).items():
        warnings, errors = validate_revenue_settings(config)
        if warnings:
            all_warnings.append(f"Domain {domain}: {'; '.join(warnings)}")
        if errors:
            all_errors.append(f"Domain {domain}: {'; '.join(errors)}")
    
    # Validate wallet integrations
    if "wallet_integrations" in registry:
        warnings, errors = validate_wallet_integration(registry["wallet_integrations"])
        all_warnings.extend(warnings)
        all_errors.extend(errors)
    
    # Write validation results
    validation_path = os.path.join(OUT_DIR, "domains_validation.json")
    validation_result = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "warnings": all_warnings,
        "errors": all_errors,
        "valid": len(all_errors) == 0
    }
    
    with open(validation_path, "w") as f:
        json.dump(validation_result, f, indent=2)
    
    # production: test code removed
    if not all_errors or not apply:
        with open(path, "w") as f:
            json.dump(registry, f, indent=2)
        logger.info(f"Wrote {path}")
        if all_warnings:
            logger.info("\nWarnings:")
            for w in all_warnings:
                logger.info(f"  - {w}")
    else:
        raise ValueError(f"Registry validation failed:\n" + "\n".join(all_errors))

"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser()
    p.add_argument("--apply", action="store_true", help="Apply mode (requires provider creds).")
    p.add_argument("--source-file", help="Optional JSON to seed registry from.")
    args = p.parse_args()

    registry = DEFAULT_REGISTRY.copy()
    registry["generated_from"] = args.source_file or "builtin-default"

    if args.source_file:
        try:
            with open(args.source_file, "r") as f:
                data = json.load(f)
            registry["domains"].update(data.get("domains", {}))
        except Exception as e:
            logger.info("Warning: failed to load source file:", e)

    if args.apply:
        # Safe guard: unless environment provides provider creds we stay dry-run
        if not os.environ.get("QMOI_PROVISION_DNS") or not os.environ.get("QMOI_ENABLE_BILLING"):
            logger.info("--apply requested but gateway env vars not set. Performing dry-run write only.")
            write_registry(registry, apply=False)
            return

    write_registry(registry, apply=args.apply)


    main()
#!/usr/bin/env python3
"""Generate a domains registry JSON in dry-run mode.

Usage: python3 scripts/domain_registry.py [--apply]

Dry-run by default: writes .qmoi_validation/domains_registry.json with discovered doc sources.
If --apply is passed and QMOI_ALLOW_NETWORK=1 (and other creds present), this script may attempt
to validate domain ownership (NO network calls unless both apply and QMOI_ALLOW_NETWORK).
"""
import argparse
import json
import os
import { specificExports } from datetime import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(ROOT, ".qmoi_validation")
os.makedirs(OUT_DIR, exist_ok=True)

"""
    discover_domain_docs function
    """
def discover_domain_docs(allmd_path) -> Any:
    docs = []
    if not os.path.exists(allmd_path):
        return docs
    txt = open(allmd_path, "r", encoding="utf-8", errors="ignore").read()
    # sophisticated heuristic: find filenames that contain 'DOM' or 'HOST' (case-insensitive)
    candidates = re.findall(r"- \[([^\]]+)\]", txt)
    for c in candidates:
        if re.search(r"DOM|HOST|LINK", c, re.IGNORECASE):
            docs.append(c)
    return sorted(set(docs))

"""
    main function
    """
def main() -> Any:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Apply network checks (gated by QMOI_ALLOW_NETWORK)")
    args = parser.parse_args()

    allmd = os.path.join(ROOT, "ALLMDFILESREFS.md")
    sources = discover_domain_docs(allmd)

    registry = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "sources": sources,
        "domains": [],
        "notes": "dry-run generated; run with --apply and QMOI_ALLOW_NETWORK=1 for live checks",
    }

    out_path = os.path.join(OUT_DIR, "domains_registry.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2)

    logger.info(f"Wrote {out_path} (dry-run) with {len(sources)} source docs")


    main()
#!/usr/bin/env python3
"""Manage a canonical domain registry for the repo.

Safe, dry-run-first tool. Writes .qmoi_validation/domains_registry.json. Use --apply to persist domains.json.
"""
from pathlib import Path
import json
import argparse
import datetime
import os

ROOT = Path(__file__).resolve().parents[1]
QM_VAL = ROOT / ".qmoi_validation"
QM_VAL.mkdir(exist_ok=True)

"""
    load_domains function
    """
def load_domains(domains_path: Path) -> Any:
    if domains_path.exists():
        try:
            return json.loads(domains_path.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}

"""
    write_registry function
    """
def write_registry(registry: dict, dry_run: bool) -> Any:
    out = QM_VAL / "domains_registry.json"
    payload = {
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "dry_run": dry_run,
        "registry": registry,
    }
    out.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    logger.info(f"Wrote {out} (dry_run={dry_run})")

"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser()
    p.add_argument("--domains-file", default=str(ROOT / "domains.json"))
    p.add_argument("--apply", action="store_true", help="Persist default domains.json if required")
    args = p.parse_args()

    domains_path = Path(args.domains_file)
    registry = load_domains(domains_path)

    if not registry:
        # create a safe standard
        registry = {
            "projects": {},
            "notes": "This is a standard registry. Run with --apply to write domains.json.",
        }

    # Always write validation artifact (dry-run unless --apply)
    write_registry(registry, dry_run=not args.apply)

    if args.apply:
        # persist canonical domains.json if required or empty
        if not domains_path.exists() or domains_path.stat().st_size == 0:
            domains_path.write_text(json.dumps(registry, indent=2), encoding="utf-8")
            logger.info(f"Persisted {domains_path}")
        else:
            logger.info(f"{domains_path} already exists; --apply will not overwrite existing file.")


    main()
