#!/usr/bin/env python3
"""
QMOI Security Monitor
Comprehensive security monitoring system with real-time threat detection,
vulnerability scanning, and security analytics.
"""

import os
import sys
import json
import time
import hashlib
import subprocess
import re
import glob
import shutil
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import logging
import sqlite3
import psutil
import requests
import asyncio
import aiohttp
from collections import defaultdict, Counter
import threading
import queue

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi_security.log'),
        logging.StreamHandler()
    ]
)

class QMOISecurityMonitor:
    def __init__(self):
        self.root_dir = Path.cwd()
        self.logs_dir = self.root_dir / "logs"
        self.logs_dir.mkdir(exist_ok=True)
        
        self.db_path = self.root_dir / "data" / "qmoi_security.db"
        self.db_path.parent.mkdir(exist_ok=True)
        
        self.security_state = {
            "timestamp": datetime.now().isoformat(),
            "threats_detected": [],
            "vulnerabilities": [],
            "security_events": [],
            "integrity_checks": [],
            "access_logs": [],
            "risk_assessment": {},
            "security_score": 100.0
        }
        
        self.alert_queue = queue.Queue()
        self.monitoring_active = False
        
        self.init_database()
        self.load_security_config()
    
    def init_database(self):
        """Initialize security database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Security events table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS security_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    event_type TEXT,
                    severity TEXT,
                    description TEXT,
                    source TEXT,
                    ip_address TEXT,
                    user_agent TEXT,
                    resolved BOOLEAN DEFAULT FALSE
                )
            ''')
            
            # Threat detection table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS threat_detection (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    threat_type TEXT,
                    confidence REAL,
                    source TEXT,
                    target TEXT,
                    description TEXT,
                    blocked BOOLEAN DEFAULT FALSE
                )
            ''')
            
            # Vulnerability scan table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS vulnerability_scan (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    vulnerability_type TEXT,
                    severity TEXT,
                    file_path TEXT,
                    line_number INTEGER,
                    description TEXT,
                    cve_id TEXT,
                    fixed BOOLEAN DEFAULT FALSE
                )
            ''')
            
            # Integrity checks table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS integrity_checks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    file_path TEXT,
                    original_hash TEXT,
                    current_hash TEXT,
                    status TEXT,
                    modified BOOLEAN DEFAULT FALSE
                )
            ''')
            
            # Access logs table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS access_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    user_id TEXT,
                    action TEXT,
                    resource TEXT,
                    ip_address TEXT,
                    success BOOLEAN,
                    session_id TEXT
                )
            ''')
            
            conn.commit()
            conn.close()
            logging.info("Security database initialized successfully")
            
        except Exception as e:
            logging.error(f"Error initializing security database: {e}")
    
    def load_security_config(self):
        """Load security configuration"""
        self.security_config = {
            "monitoring_enabled": True,
            "real_time_scanning": True,
            "vulnerability_scan_interval": 3600,  # 1 hour
            "integrity_check_interval": 1800,     # 30 minutes
            "threat_detection_sensitivity": 0.7,
            "auto_block_threats": True,
            "alert_master_on_critical": True,
            "backup_critical_files": True,
            "scan_file_types": [".py", ".ts", ".tsx", ".js", ".jsx", ".json", ".md"],
            "exclude_patterns": ["node_modules", ".git", "logs", "*.log"],
            "suspicious_patterns": [
                r"eval\s*\(",
                r"exec\s*\(",
                r"__import__\s*\(",
                r"os\.system\s*\(",
                r"subprocess\.call\s*\(",
                r"password\s*=\s*['\"][^'\"]+['\"]",
                r"api_key\s*=\s*['\"][^'\"]+['\"]",
                r"secret\s*=\s*['\"][^'\"]+['\"]"
            ]
        }
    
    def start_monitoring(self):
        """Start real-time security monitoring"""
        try:
            self.monitoring_active = True
            logging.info("Starting QMOI Security Monitoring")
            
            # Start monitoring threads
            threads = []
            
            # File integrity monitoring
            integrity_thread = threading.Thread(target=self.monitor_file_integrity, daemon=True)
            integrity_thread.start()
            threads.append(integrity_thread)
            
            # Network activity monitoring
            network_thread = threading.Thread(target=self.monitor_network_activity, daemon=True)
            network_thread.start()
            threads.append(network_thread)
            
            # Process monitoring
            process_thread = threading.Thread(target=self.monitor_processes, daemon=True)
            process_thread.start()
            threads.append(process_thread)
            
            # Alert processing
            alert_thread = threading.Thread(target=self.process_alerts, daemon=True)
            alert_thread.start()
            threads.append(alert_thread)
            
            logging.info(f"Security monitoring started with {len(threads)} threads")
            
        except Exception as e:
            logging.error(f"Error starting security monitoring: {e}")
    
    def stop_monitoring(self):
        """Stop security monitoring"""
        self.monitoring_active = False
        logging.info("Security monitoring stopped")
    
    def monitor_file_integrity(self):
        """Monitor file integrity in real-time"""
        try:
            file_hashes = {}
            
            while self.monitoring_active:
                # Scan critical files
                critical_files = self.get_critical_files()
                
                for file_path in critical_files:
                    current_hash = self.calculate_file_hash(file_path)
                    
                    if file_path in file_hashes:
                        if file_hashes[file_path] != current_hash:
                            # File modified
                            self.detect_file_modification(file_path, file_hashes[file_path], current_hash)
                    
                    file_hashes[file_path] = current_hash
                
                time.sleep(self.security_config["integrity_check_interval"])
                
        except Exception as e:
            logging.error(f"Error in file integrity monitoring: {e}")
    
    def get_critical_files(self) -> List[Path]:
        """Get list of critical files to monitor"""
        critical_files = []
        
        try:
            # Core system files
            core_patterns = [
                "**/*.py",
                "**/*.ts",
                "**/*.tsx",
                "**/*.js",
                "**/*.jsx",
                "**/package.json",
                "**/requirements.txt",
                "**/*.md"
            ]
            
            for pattern in core_patterns:
                files = list(self.root_dir.glob(pattern))
                for file_path in files:
                    # Skip excluded patterns
                    if not any(exclude in str(file_path) for exclude in self.security_config["exclude_patterns"]):
                        critical_files.append(file_path)
            
            return critical_files[:100]  # Limit to 100 files for performance
            
        except Exception as e:
            logging.error(f"Error getting critical files: {e}")
            return []
    
    def calculate_file_hash(self, file_path: Path) -> str:
        """Calculate SHA-256 hash of file"""
        try:
            if not file_path.exists():
                return ""
            
            hash_sha256 = hashlib.sha256()
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_sha256.update(chunk)
            
            return hash_sha256.hexdigest()
            
        except Exception as e:
            logging.error(f"Error calculating file hash for {file_path}: {e}")
            return ""
    
    def detect_file_modification(self, file_path: Path, original_hash: str, current_hash: str):
        """Detect and handle file modification"""
        try:
            event = {
                "type": "file_modification",
                "file_path": str(file_path),
                "original_hash": original_hash,
                "current_hash": current_hash,
                "timestamp": datetime.now().isoformat(),
                "severity": "medium"
            }
            
            # Store in database
            self.store_security_event(event)
            
            # Add to alert queue
            self.alert_queue.put({
                "type": "file_modification",
                "message": f"File modified: {file_path}",
                "severity": "medium",
                "details": event
            })
            
            logging.warning(f"File modification detected: {file_path}")
            
        except Exception as e:
            logging.error(f"Error detecting file modification: {e}")
    
    def monitor_network_activity(self):
        """Monitor network activity for suspicious behavior"""
        try:
            while self.monitoring_active:
                # Check for suspicious network connections
                connections = psutil.net_connections()
                
                for conn in connections:
                    if conn.status == 'ESTABLISHED':
                        # Check for suspicious patterns
                        if self.is_suspicious_connection(conn):
                            self.detect_suspicious_connection(conn)
                
                time.sleep(60)  # Check every minute
                
        except Exception as e:
            logging.error(f"Error in network activity monitoring: {e}")
    
    def is_suspicious_connection(self, conn) -> bool:
        """Check if connection is suspicious"""
        try:
            # Check for connections to suspicious ports
            suspicious_ports = [22, 23, 3389, 5900, 5432, 3306]
            
            if conn.raddr and conn.raddr.port in suspicious_ports:
                return True
            
            # Check for connections to suspicious IPs
            suspicious_ips = ["0.0.0.0", "127.0.0.1"]
            if conn.raddr and conn.raddr.ip in suspicious_ips:
                return True
            
            return False
            
        except:
            return False
    
    def detect_suspicious_connection(self, conn):
        """Detect and handle suspicious connection"""
        try:
            event = {
                "type": "suspicious_connection",
                "local_address": f"{conn.laddr.ip}:{conn.laddr.port}" if conn.laddr else "unknown",
                "remote_address": f"{conn.raddr.ip}:{conn.raddr.port}" if conn.raddr else "unknown",
                "status": conn.status,
                "timestamp": datetime.now().isoformat(),
                "severity": "high"
            }
            
            # Store in database
            self.store_security_event(event)
            
            # Add to alert queue
            self.alert_queue.put({
                "type": "suspicious_connection",
                "message": f"Suspicious connection detected: {event['remote_address']}",
                "severity": "high",
                "details": event
            })
            
            logging.warning(f"Suspicious connection detected: {event['remote_address']}")
            
        except Exception as e:
            logging.error(f"Error detecting suspicious connection: {e}")
    
    def monitor_processes(self):
        """Monitor system processes for suspicious activity"""
        try:
            while self.monitoring_active:
                # Check for suspicious processes
                processes = psutil.process_iter(['pid', 'name', 'cmdline', 'cpu_percent', 'memory_percent'])
                
                for proc in processes:
                    try:
                        if self.is_suspicious_process(proc):
                            self.detect_suspicious_process(proc)
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        continue
                
                time.sleep(300)  # Check every 5 minutes
                
        except Exception as e:
            logging.error(f"Error in process monitoring: {e}")
    
    def is_suspicious_process(self, proc) -> bool:
        """Check if process is suspicious"""
        try:
            # Check for high CPU usage
            if proc.info['cpu_percent'] > 80:
                return True
            
            # Check for high memory usage
            if proc.info['memory_percent'] > 50:
                return True
            
            # Check for suspicious process names
            suspicious_names = ["crypto", "miner", "botnet", "backdoor", "keylogger"]
            process_name = proc.info['name'].lower()
            
            if any(name in process_name for name in suspicious_names):
                return True
            
            return False
            
        except:
            return False
    
    def detect_suspicious_process(self, proc):
        """Detect and handle suspicious process"""
        try:
            event = {
                "type": "suspicious_process",
                "pid": proc.info['pid'],
                "name": proc.info['name'],
                "cpu_percent": proc.info['cpu_percent'],
                "memory_percent": proc.info['memory_percent'],
                "timestamp": datetime.now().isoformat(),
                "severity": "medium"
            }
            
            # Store in database
            self.store_security_event(event)
            
            # Add to alert queue
            self.alert_queue.put({
                "type": "suspicious_process",
                "message": f"Suspicious process detected: {proc.info['name']} (PID: {proc.info['pid']})",
                "severity": "medium",
                "details": event
            })
            
            logging.warning(f"Suspicious process detected: {proc.info['name']} (PID: {proc.info['pid']})")
            
        except Exception as e:
            logging.error(f"Error detecting suspicious process: {e}")
    
    def process_alerts(self):
        """Process security alerts"""
        try:
            while self.monitoring_active:
                try:
                    alert = self.alert_queue.get(timeout=1)
                    self.handle_alert(alert)
                except queue.Empty:
                    continue
                
        except Exception as e:
            logging.error(f"Error processing alerts: {e}")
    
    def handle_alert(self, alert: Dict[str, Any]):
        """Handle security alert"""
        try:
            alert_type = alert.get("type", "unknown")
            severity = alert.get("severity", "low")
            message = alert.get("message", "Unknown alert")
            
            # Log alert
            logging.warning(f"SECURITY ALERT [{severity.upper()}]: {message}")
            
            # Handle based on severity
            if severity == "critical":
                self.handle_critical_alert(alert)
            elif severity == "high":
                self.handle_high_alert(alert)
            elif severity == "medium":
                self.handle_medium_alert(alert)
            else:
                self.handle_low_alert(alert)
            
            # Notify master if configured
            if self.security_config["alert_master_on_critical"] and severity == "critical":
                self.notify_master(alert)
            
        except Exception as e:
            logging.error(f"Error handling alert: {e}")
    
    def handle_critical_alert(self, alert: Dict[str, Any]):
        """Handle critical security alert"""
        try:
            # Immediate response actions
            logging.critical(f"CRITICAL SECURITY ALERT: {alert['message']}")
            
            # Backup critical files
            if self.security_config["backup_critical_files"]:
                self.backup_critical_files()
            
            # Block suspicious connections
            if self.security_config["auto_block_threats"]:
                self.block_suspicious_activity(alert)
            
        except Exception as e:
            logging.error(f"Error handling critical alert: {e}")
    
    def handle_high_alert(self, alert: Dict[str, Any]):
        """Handle high severity security alert"""
        try:
            logging.error(f"HIGH SECURITY ALERT: {alert['message']}")
            
            # Monitor closely
            self.increase_monitoring_frequency()
            
        except Exception as e:
            logging.error(f"Error handling high alert: {e}")
    
    def handle_medium_alert(self, alert: Dict[str, Any]):
        """Handle medium severity security alert"""
        try:
            logging.warning(f"MEDIUM SECURITY ALERT: {alert['message']}")
            
            # Log for analysis
            self.log_security_event(alert)
            
        except Exception as e:
            logging.error(f"Error handling medium alert: {e}")
    
    def handle_low_alert(self, alert: Dict[str, Any]):
        """Handle low severity security alert"""
        try:
            logging.info(f"LOW SECURITY ALERT: {alert['message']}")
            
            # Just log for reference
            self.log_security_event(alert)
            
        except Exception as e:
            logging.error(f"Error handling low alert: {e}")
    
    def backup_critical_files(self):
        """Backup critical files"""
        try:
            backup_dir = self.root_dir / "backups" / f"security_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            backup_dir.mkdir(parents=True, exist_ok=True)
            
            critical_files = self.get_critical_files()
            
            for file_path in critical_files[:50]:  # Limit to 50 files
                if file_path.exists():
                    backup_path = backup_dir / file_path.name
                    shutil.copy2(file_path, backup_path)
            
            logging.info(f"Critical files backed up to {backup_dir}")
            
        except Exception as e:
            logging.error(f"Error backing up critical files: {e}")
    
    def block_suspicious_activity(self, alert: Dict[str, Any]):
        """Block suspicious activity"""
        try:
            alert_type = alert.get("type", "")
            
            if alert_type == "suspicious_connection":
                # Block IP address
                details = alert.get("details", {})
                remote_ip = details.get("remote_address", "").split(":")[0]
                if remote_ip:
                    self.block_ip_address(remote_ip)
            
            elif alert_type == "suspicious_process":
                # Terminate process
                details = alert.get("details", {})
                pid = details.get("pid")
                if pid:
                    self.terminate_process(pid)
            
            logging.info(f"Blocked suspicious activity: {alert_type}")
            
        except Exception as e:
            logging.error(f"Error blocking suspicious activity: {e}")
    
    def block_ip_address(self, ip_address: str):
        """Block IP address"""
        try:
            # This is a [PRODUCTION IMPLEMENTATION REQUIRED] - in a real system, you would use firewall rules
            logging.info(f"Blocking IP address: {ip_address}")
            
            # Store blocked IP
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO threat_detection 
                (threat_type, confidence, source, target, description, blocked)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                "ip_block",
                0.9,
                ip_address,
                "system",
                f"IP address {ip_address} blocked due to suspicious activity",
                True
            ))
            conn.commit()
            conn.close()
            
        except Exception as e:
            logging.error(f"Error blocking IP address: {e}")
    
    def terminate_process(self, pid: int):
        """Terminate suspicious process"""
        try:
            # This is a [PRODUCTION IMPLEMENTATION REQUIRED] - in a real system, you would use process management
            logging.info(f"Terminating process: {pid}")
            
            # Store terminated process
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO threat_detection 
                (threat_type, confidence, source, target, description, blocked)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                "process_termination",
                0.8,
                str(pid),
                "system",
                f"Process {pid} terminated due to suspicious activity",
                True
            ))
            conn.commit()
            conn.close()
            
        except Exception as e:
            logging.error(f"Error terminating process: {e}")
    
    def increase_monitoring_frequency(self):
        """Increase monitoring frequency for high alerts"""
        try:
            # Reduce intervals temporarily
            self.security_config["integrity_check_interval"] = 300  # 5 minutes
            self.security_config["vulnerability_scan_interval"] = 1800  # 30 minutes
            
            logging.info("Increased monitoring frequency due to high security alert")
            
        except Exception as e:
            logging.error(f"Error increasing monitoring frequency: {e}")
    
    def log_security_event(self, alert: Dict[str, Any]):
        """Log security event"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO security_events 
                (event_type, severity, description, source, resolved)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                alert.get("type", "unknown"),
                alert.get("severity", "low"),
                alert.get("message", "Unknown alert"),
                "security_monitor",
                False
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logging.error(f"Error logging security event: {e}")
    
    def notify_master(self, alert: Dict[str, Any]):
        """Notify master about critical security alert"""
        try:
            # Create notification file
            notification_file = self.logs_dir / "master_security_alert.json"
            
            notification_data = {
                "timestamp": datetime.now().isoformat(),
                "alert": alert,
                "system_status": self.get_system_security_status(),
                "action_required": True
            }
            
            with open(notification_file, 'w') as f:
                json.dump(notification_data, f, indent=2)
            
            logging.critical(f"MASTER NOTIFICATION: Critical security alert - {alert['message']}")
            
        except Exception as e:
            logging.error(f"Error notifying master: {e}")
    
    def get_system_security_status(self) -> Dict[str, Any]:
        """Get current system security status"""
        try:
            conn = sqlite3.connect(self.db_path)
            
            # Get recent security events
            cursor = conn.execute('''
                SELECT COUNT(*) as total_events,
                       COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_events,
                       COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_events,
                       COUNT(CASE WHEN resolved = 0 THEN 1 END) as unresolved_events
                FROM security_events 
                WHERE timestamp >= datetime('now', '-24 hours')
            ''')
            
            event_stats = cursor.fetchone()
            
            # Get threat statistics
            cursor = conn.execute('''
                SELECT COUNT(*) as total_threats,
                       COUNT(CASE WHEN blocked = 1 THEN 1 END) as blocked_threats
                FROM threat_detection 
                WHERE timestamp >= datetime('now', '-24 hours')
            ''')
            
            threat_stats = cursor.fetchone()
            
            conn.close()
            
            return {
                "total_events_24h": event_stats[0] if event_stats else 0,
                "critical_events_24h": event_stats[1] if event_stats else 0,
                "high_events_24h": event_stats[2] if event_stats else 0,
                "unresolved_events": event_stats[3] if event_stats else 0,
                "total_threats_24h": threat_stats[0] if threat_stats else 0,
                "blocked_threats_24h": threat_stats[1] if threat_stats else 0,
                "security_score": self.calculate_security_score(),
                "monitoring_active": self.monitoring_active
            }
            
        except Exception as e:
            logging.error(f"Error getting system security status: {e}")
            return {}
    
    def calculate_security_score(self) -> float:
        """Calculate overall security score"""
        try:
            conn = sqlite3.connect(self.db_path)
            
            # Get recent security events
            cursor = conn.execute('''
                SELECT severity, COUNT(*) as count
                FROM security_events 
                WHERE timestamp >= datetime('now', '-24 hours')
                GROUP BY severity
            ''')
            
            events = cursor.fetchall()
            conn.close()
            
            score = 100.0
            
            for severity, count in events:
                if severity == "critical":
                    score -= count * 20
                elif severity == "high":
                    score -= count * 10
                elif severity == "medium":
                    score -= count * 5
                elif severity == "low":
                    score -= count * 1
            
            return max(0, score)
            
        except Exception as e:
            logging.error(f"Error calculating security score: {e}")
            return 50.0
    
    def store_security_event(self, event: Dict[str, Any]):
        """Store security event in database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO security_events 
                (event_type, severity, description, source, resolved)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                event.get("type", "unknown"),
                event.get("severity", "low"),
                json.dumps(event),
                "security_monitor",
                False
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logging.error(f"Error storing security event: {e}")
    
    def run_vulnerability_scan(self) -> List[Dict[str, Any]]:
        """Run comprehensive vulnerability scan"""
        vulnerabilities = []
        
        try:
            logging.info("Starting vulnerability scan")
            
            # Scan for suspicious patterns in code
            code_vulnerabilities = self.scan_code_vulnerabilities()
            vulnerabilities.extend(code_vulnerabilities)
            
            # Scan for configuration vulnerabilities
            config_vulnerabilities = self.scan_config_vulnerabilities()
            vulnerabilities.extend(config_vulnerabilities)
            
            # Scan for dependency vulnerabilities
            dependency_vulnerabilities = self.scan_dependency_vulnerabilities()
            vulnerabilities.extend(dependency_vulnerabilities)
            
            # Store vulnerabilities
            self.store_vulnerabilities(vulnerabilities)
            
            logging.info(f"Vulnerability scan completed: {len(vulnerabilities)} vulnerabilities found")
            return vulnerabilities
            
        except Exception as e:
            logging.error(f"Error in vulnerability scan: {e}")
            return vulnerabilities
    
    def scan_code_vulnerabilities(self) -> List[Dict[str, Any]]:
        """Scan code for security vulnerabilities"""
        vulnerabilities = []
        
        try:
            # Scan all code files
            code_files = []
            code_files.extend(self.root_dir.glob("**/*.py"))
            code_files.extend(self.root_dir.glob("**/*.ts"))
            code_files.extend(self.root_dir.glob("**/*.tsx"))
            code_files.extend(self.root_dir.glob("**/*.js"))
            code_files.extend(self.root_dir.glob("**/*.jsx"))
            
            for file_path in code_files:
                if any(exclude in str(file_path) for exclude in self.security_config["exclude_patterns"]):
                    continue
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Check for suspicious patterns
                for pattern in self.security_config["suspicious_patterns"]:
                    matches = re.finditer(pattern, content, re.IGNORECASE)
                    
                    for match in matches:
                        line_number = content[:match.start()].count('\n') + 1
                        
                        vulnerability = {
                            "type": "code_vulnerability",
                            "severity": "high",
                            "file_path": str(file_path),
                            "line_number": line_number,
                            "pattern": pattern,
                            "description": f"Suspicious pattern found: {pattern}",
                            "timestamp": datetime.now().isoformat()
                        }
                        
                        vulnerabilities.append(vulnerability)
            
        except Exception as e:
            logging.error(f"Error scanning code vulnerabilities: {e}")
        
        return vulnerabilities
    
    def scan_config_vulnerabilities(self) -> List[Dict[str, Any]]:
        """Scan configuration files for vulnerabilities"""
        vulnerabilities = []
        
        try:
            config_files = [
                "package.json",
                "requirements.txt",
                "next.config.mjs",
                "tailwind.config.ts",
                ".env",
                ".env.local"
            ]
            
            for config_file in config_files:
                config_path = self.root_dir / config_file
                
                if config_path.exists():
                    with open(config_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Check for hardcoded secrets
                    secret_patterns = [
                        r"password\s*[:=]\s*['\"][^'\"]+['\"]",
                        r"secret\s*[:=]\s*['\"][^'\"]+['\"]",
                        r"api_key\s*[:=]\s*['\"][^'\"]+['\"]",
                        r"token\s*[:=]\s*['\"][^'\"]+['\"]"
                    ]
                    
                    for pattern in secret_patterns:
                        if re.search(pattern, content, re.IGNORECASE):
                            vulnerability = {
                                "type": "config_vulnerability",
                                "severity": "critical",
                                "file_path": str(config_path),
                                "line_number": 0,
                                "pattern": pattern,
                                "description": f"Hardcoded secret found in {config_file}",
                                "timestamp": datetime.now().isoformat()
                            }
                            
                            vulnerabilities.append(vulnerability)
            
        except Exception as e:
            logging.error(f"Error scanning config vulnerabilities: {e}")
        
        return vulnerabilities
    
    def scan_dependency_vulnerabilities(self) -> List[Dict[str, Any]]:
        """Scan dependencies for known vulnerabilities"""
        vulnerabilities = []
        
        try:
            # Check package.json for outdated dependencies
            package_json = self.root_dir / "package.json"
            
            if package_json.exists():
                with open(package_json, 'r') as f:
                    package_data = json.load(f)
                
                # This is a [PRODUCTION IMPLEMENTATION REQUIRED] - in a real system, you would check against vulnerability databases
                # For now, we'll just check for some common vulnerable packages
                vulnerable_packages = [
                    "lodash",  # Example vulnerable package
                    "moment",  # Example vulnerable package
                ]
                
                dependencies = package_data.get("dependencies", {})
                dev_dependencies = package_data.get("devDependencies", {})
                
                all_deps = {**dependencies, **dev_dependencies}
                
                for package, version in all_deps.items():
                    if package in vulnerable_packages:
                        vulnerability = {
                            "type": "dependency_vulnerability",
                            "severity": "medium",
                            "file_path": str(package_json),
                            "line_number": 0,
                            "pattern": package,
                            "description": f"Potentially vulnerable dependency: {package}@{version}",
                            "timestamp": datetime.now().isoformat()
                        }
                        
                        vulnerabilities.append(vulnerability)
            
        except Exception as e:
            logging.error(f"Error scanning dependency vulnerabilities: {e}")
        
        return vulnerabilities
    
    def store_vulnerabilities(self, vulnerabilities: List[Dict[str, Any]]):
        """Store vulnerabilities in database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            for vuln in vulnerabilities:
                cursor.execute('''
                    INSERT INTO vulnerability_scan 
                    (vulnerability_type, severity, file_path, line_number, description, fixed)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    vuln["type"],
                    vuln["severity"],
                    vuln["file_path"],
                    vuln["line_number"],
                    vuln["description"],
                    False
                ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logging.error(f"Error storing vulnerabilities: {e}")
    
    def run_comprehensive_security_analysis(self):
        """Run comprehensive security analysis"""
        try:
            logging.info("Starting QMOI Security Analysis")
            
            # Start monitoring
            self.start_monitoring()
            
            # Run vulnerability scan
            vulnerabilities = self.run_vulnerability_scan()
            
            # Get security status
            security_status = self.get_system_security_status()
            
            # Compile results
            results = {
                "timestamp": datetime.now().isoformat(),
                "vulnerabilities": vulnerabilities,
                "security_status": security_status,
                "monitoring_active": self.monitoring_active,
                "summary": {
                    "total_vulnerabilities": len(vulnerabilities),
                    "critical_vulnerabilities": len([v for v in vulnerabilities if v["severity"] == "critical"]),
                    "high_vulnerabilities": len([v for v in vulnerabilities if v["severity"] == "high"]),
                    "security_score": security_status.get("security_score", 0),
                    "events_24h": security_status.get("total_events_24h", 0),
                    "threats_24h": security_status.get("total_threats_24h", 0)
                }
            }
            
            # Save results
            results_file = self.logs_dir / "qmoi_security_analysis.json"
            with open(results_file, 'w') as f:
                json.dump(results, f, indent=2)
            
            # Print summary
            summary = results.get("summary", {})
            print(f"\nQMOI Security Analysis Summary:")
            print(f"Security Score: {summary.get('security_score', 0):.1f}%")
            print(f"Total Vulnerabilities: {summary.get('total_vulnerabilities', 0)}")
            print(f"Critical Vulnerabilities: {summary.get('critical_vulnerabilities', 0)}")
            print(f"High Vulnerabilities: {summary.get('high_vulnerabilities', 0)}")
            print(f"Events (24h): {summary.get('events_24h', 0)}")
            print(f"Threats (24h): {summary.get('threats_24h', 0)}")
            print(f"Monitoring Active: {self.monitoring_active}")
            
            logging.info("QMOI Security Analysis completed successfully")
            
        except Exception as e:
            logging.error(f"Error in comprehensive security analysis: {e}")
            print(f"Error: {e}")

def main():
    monitor = QMOISecurityMonitor()
    monitor.run_comprehensive_security_analysis()

if __name__ == "__main__":
    main() 