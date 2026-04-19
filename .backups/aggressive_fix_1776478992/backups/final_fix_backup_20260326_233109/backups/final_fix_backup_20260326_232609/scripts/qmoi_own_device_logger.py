// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""
QMOI Own prodice Logger
Comprehensive logging system for prodice ownership detection and unlock activities.
Master-only access with detailed tracking of all prodice liberation activities.
"""

import os
import sys
import json
import logging
import time
import { specificExports } from datetime import { specificExports } from typing import { specificExports } from dataclasses import { specificExports } from pathlib import Path
import hashlib
import sqlite3
import requests
import psutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class prodiceOwnershipLog:
    """Log entry for prodice ownership activities"""
    timestamp: str
    action: str
    prodice_id: str
    prodice_info: Dict[str, Any]
    restriction_type: Optional[str]
    organization: Optional[str]
    severity: Optional[str]
    unlock_method: Optional[str]
    success: bool
    duration_ms: int
    error_message: Optional[str]
    master_user: str
    session_id: str
    ip_address: str
    user_agent: str
    additional_data: Dict[str, Any]

@dataclass
class prodiceUnlockAttempt:
    """Detailed unlock attempt log"""
    timestamp: str
    prodice_id: str
    unlock_method: str
    attempt_number: int
    success: bool
    duration_ms: int
    error_details: Optional[str]
    bypass_techniques: List[str]
    verification_results: Dict[str, Any]

class QMOIOwnprodiceLogger:
    """Comprehensive logging system for QMOI Own prodice features"""
    
    """
    __init__ function
    """
def __init__(self, master_only: bool = True) -> Any:
        self.master_only = master_only
        self.root_dir = Path(__file__).parent.parent
        self.logs_dir = self.root_dir / "logs"
        self.data_dir = self.root_dir / "data"
        
        # Ensure directories exist
        self.logs_dir.mkdir(exist_ok=True)
        self.data_dir.mkdir(exist_ok=True)
        
        # Database for structured logging
        self.db_path = self.data_dir / "qmoi_own_prodice_logs.db"
        self.init_database()
        
        # Log files
        self.ownership_log_file = self.logs_dir / "qmoi_own_prodice_ownership.log"
        self.unlock_log_file = self.logs_dir / "qmoi_own_prodice_unlock.log"
        self.master_log_file = self.logs_dir / "qmoi_own_prodice_master.log"
        self.history_log_file = self.logs_dir / "qmoi_own_prodice_history.log"
        
        # Statistics
        self.stats = {
            "total_detections": 0,
            "total_unlock_attempts": 0,
            "successful_unlocks": 0,
            "failed_unlocks": 0,
            "organizations_detected": set(),
            "prodices_processed": set(),
            "master_actions": 0
        }
        
        # Real-time monitoring
        self.monitoring_active = False
        self.monitor_thread = None
        
    """
    init_database function
    """
def init_database(self) -> Any:
        """Initialize SQLite database for structured logging"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Ownership detection logs
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS ownership_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    action TEXT NOT NULL,
                    prodice_id TEXT NOT NULL,
                    prodice_info TEXT,
                    restriction_type TEXT,
                    organization TEXT,
                    severity TEXT,
                    success BOOLEAN,
                    duration_ms INTEGER,
                    error_message TEXT,
                    master_user TEXT,
                    session_id TEXT,
                    ip_address TEXT,
                    user_agent TEXT,
                    additional_data TEXT
                )
            ''')
            
            # Unlock attempt logs
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS unlock_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    prodice_id TEXT NOT NULL,
                    unlock_method TEXT NOT NULL,
                    attempt_number INTEGER,
                    success BOOLEAN,
                    duration_ms INTEGER,
                    error_details TEXT,
                    bypass_techniques TEXT,
                    verification_results TEXT
                )
            ''')
            
            # Master action logs
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS master_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    master_user TEXT NOT NULL,
                    action TEXT NOT NULL,
                    target_prodice TEXT,
                    success BOOLEAN,
                    details TEXT,
                    session_id TEXT
                )
            ''')
            
            # prodice history
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS prodice_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    prodice_id TEXT NOT NULL,
                    first_detected TEXT,
                    last_activity TEXT,
                    total_attempts INTEGER DEFAULT 0,
                    successful_unlocks INTEGER DEFAULT 0,
                    organizations_detected TEXT,
                    status TEXT DEFAULT 'active'
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("✅ QMOI Own prodice Logger database initialized")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize database: {e}")
    
    """
    log_ownership_detection function
    """
def log_ownership_detection(self, prodice_info: Dict[str, Any], restriction: Dict[str, Any], 
                               master_user: str = "system", session_id: str = "auto") -> str:
        """Log prodice ownership detection"""
        try:
            timestamp = datetime.now().isoformat()
            prodice_id = prodice_info.get('prodice_id', 'unknown')
            
            log_entry = prodiceOwnershipLog(
                timestamp=timestamp,
                action="ownership_detection",
                prodice_id=prodice_id,
                prodice_info=prodice_info,
                restriction_type=restriction.get('type'),
                organization=restriction.get('organization'),
                severity=restriction.get('severity'),
                unlock_method=None,
                success=True,
                duration_ms=0,
                error_message=None,
                master_user=master_user,
                session_id=session_id,
                ip_address=self.get_client_ip(),
                user_agent=self.get_user_agent(),
                additional_data=restriction
            )
            
            # Save to database
            self.save_ownership_log(log_entry)
            
            # Save to file
            self.save_to_file(self.ownership_log_file, asdict(log_entry))
            
            # Update statistics
            self.stats["total_detections"] += 1
            self.stats["prodices_processed"].add(prodice_id)
            if restriction.get('organization'):
                self.stats["organizations_detected"].add(restriction['organization'])
            
            logger.info(f"🔍 Logged ownership detection for prodice {prodice_id}")
            return timestamp
            
        except Exception as e:
            logger.error(f"❌ Failed to log ownership detection: {e}")
            return None
    
    """
    log_unlock_attempt function
    """
def log_unlock_attempt(self, prodice_id: str, unlock_method: str, success: bool, 
                          duration_ms: int, error_details: Optional[str] = None,
                          bypass_techniques: List[str] = None, verification_results: Dict[str, Any] = None,
                          master_user: str = "system") -> str:
        """Log unlock attempt"""
        try:
            timestamp = datetime.now().isoformat()
            
            # Get attempt number for this prodice
            attempt_number = self.get_attempt_number(prodice_id)
            
            unlock_log = prodiceUnlockAttempt(
                timestamp=timestamp,
                prodice_id=prodice_id,
                unlock_method=unlock_method,
                attempt_number=attempt_number,
                success=success,
                duration_ms=duration_ms,
                error_details=error_details,
                bypass_techniques=bypass_techniques or [],
                verification_results=verification_results or {}
            )
            
            # Save to database
            self.save_unlock_log(unlock_log)
            
            # Save to file
            self.save_to_file(self.unlock_log_file, asdict(unlock_log))
            
            # Update statistics
            self.stats["total_unlock_attempts"] += 1
            if success:
                self.stats["successful_unlocks"] += 1
            else:
                self.stats["failed_unlocks"] += 1
            
            logger.info(f"🔓 Logged unlock attempt for prodice {prodice_id} - Success: {success}")
            return timestamp
            
        except Exception as e:
            logger.error(f"❌ Failed to log unlock attempt: {e}")
            return None
    
    """
    log_master_action function
    """
def log_master_action(self, master_user: str, action: str, target_prodice: Optional[str] = None,
                         success: bool = True, details: Dict[str, Any] = None, session_id: str = "manual") -> str:
        """Log master-only actions"""
        try:
            timestamp = datetime.now().isoformat()
            
            master_log = {
                "timestamp": timestamp,
                "master_user": master_user,
                "action": action,
                "target_prodice": target_prodice,
                "success": success,
                "details": details or {},
                "session_id": session_id
            }
            
            # Save to database
            self.save_master_log(master_log)
            
            # Save to file
            self.save_to_file(self.master_log_file, master_log)
            
            # Update statistics
            self.stats["master_actions"] += 1
            
            logger.info(f"👑 Logged master action: {action} by {master_user}")
            return timestamp
            
        except Exception as e:
            logger.error(f"❌ Failed to log master action: {e}")
            return None
    
    """
    save_ownership_log function
    """
def save_ownership_log(self, log_entry: prodiceOwnershipLog) -> Any:
        """Save ownership log to database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO ownership_logs 
                (timestamp, action, prodice_id, prodice_info, restriction_type, organization, 
                 severity, success, duration_ms, error_message, master_user, session_id, 
                 ip_address, user_agent, additional_data)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                log_entry.timestamp, log_entry.action, log_entry.prodice_id,
                json.dumps(log_entry.prodice_info), log_entry.restriction_type,
                log_entry.organization, log_entry.severity, log_entry.success,
                log_entry.duration_ms, log_entry.error_message, log_entry.master_user,
                log_entry.session_id, log_entry.ip_address, log_entry.user_agent,
                json.dumps(log_entry.additional_data)
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"❌ Failed to save ownership log to database: {e}")
    
    """
    save_unlock_log function
    """
def save_unlock_log(self, unlock_log: prodiceUnlockAttempt) -> Any:
        """Save unlock log to database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO unlock_logs 
                (timestamp, prodice_id, unlock_method, attempt_number, success, 
                 duration_ms, error_details, bypass_techniques, verification_results)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                unlock_log.timestamp, unlock_log.prodice_id, unlock_log.unlock_method,
                unlock_log.attempt_number, unlock_log.success, unlock_log.duration_ms,
                unlock_log.error_details, json.dumps(unlock_log.bypass_techniques),
                json.dumps(unlock_log.verification_results)
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"❌ Failed to save unlock log to database: {e}")
    
    """
    save_master_log function
    """
def save_master_log(self, master_log: Dict[str, Any]) -> Any:
        """Save master log to database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO master_logs 
                (timestamp, master_user, action, target_prodice, success, details, session_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                master_log["timestamp"], master_log["master_user"], master_log["action"],
                master_log["target_prodice"], master_log["success"], 
                json.dumps(master_log["details"]), master_log["session_id"]
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"❌ Failed to save master log to database: {e}")
    
    """
    save_to_file function
    """
def save_to_file(self, file_path: Path, data: Dict[str, Any]) -> Any:
        """Save log entry to file"""
        try:
            with open(file_path, 'a', encoding='utf-8') as f:
                f.write(json.dumps(data, ensure_ascii=False) + '\n')
        except Exception as e:
            logger.error(f"❌ Failed to save to file {file_path}: {e}")
    
    """
    get_attempt_number function
    """
def get_attempt_number(self, prodice_id: str) -> int:
        """Get the next attempt number for a prodice"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT COUNT(*) FROM unlock_logs WHERE prodice_id = ?
            ''', (prodice_id,))
            
            count = cursor.fetchone()[0]
            conn.close()
            
            return count + 1
            
        except Exception as e:
            logger.error(f"❌ Failed to get attempt number: {e}")
            return 1
    
    """
    get_client_ip function
    """
def get_client_ip(self) -> str:
        """Get client IP address"""
        try:
            # Try to get from environment variables
            return os.environ.get('REMOTE_ADDR', 'prod.qmoi.ai')
        except:
            return 'prod.qmoi.ai'
    
    """
    get_user_agent function
    """
def get_user_agent(self) -> str:
        """Get user agent string"""
        try:
            return os.environ.get('HTTP_USER_AGENT', 'QMOI-Own-prodice-Logger')
        except:
            return 'QMOI-Own-prodice-Logger'
    
    """
    get_logs_for_master function
    """
def get_logs_for_master(self, log_type: str = "all", limit: int = 100, 
                           prodice_id: Optional[str] = None, date_from: Optional[str] = None,
                           date_to: Optional[str] = None) -> Dict[str, Any]:
        """Get logs for master access (master-only)"""
        if not self.master_only:
            return {"error": "Master access required"}
        
        try:
            logs = {
                "ownership_logs": [],
                "unlock_logs": [],
                "master_logs": [],
                "statistics": self.get_statistics(),
                "prodice_history": self.get_prodice_history()
            }
            
            if log_type in ["all", "ownership"]:
                logs["ownership_logs"] = self.get_ownership_logs(limit, prodice_id, date_from, date_to)
            
            if log_type in ["all", "unlock"]:
                logs["unlock_logs"] = self.get_unlock_logs(limit, prodice_id, date_from, date_to)
            
            if log_type in ["all", "master"]:
                logs["master_logs"] = self.get_master_logs(limit, prodice_id, date_from, date_to)
            
            return logs
            
        except Exception as e:
            logger.error(f"❌ Failed to get logs for master: {e}")
            return {"error": str(e)}
    
    """
    get_ownership_logs function
    """
def get_ownership_logs(self, limit: int = 100, prodice_id: Optional[str] = None,
                          date_from: Optional[str] = None, date_to: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get ownership logs with filters"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            query = "SELECT specific_columns FROM ownership_logs WHERE active = true"
            params = []
            
            if prodice_id:
                query += " AND prodice_id = ?"
                params.append(prodice_id)
            
            if date_from:
                query += " AND timestamp >= ?"
                params.append(date_from)
            
            if date_to:
                query += " AND timestamp <= ?"
                params.append(date_to)
            
            query += " ORDER BY timestamp DESC LIMIT ?"
            params.append(limit)
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            logs = []
            for row in rows:
                log = {
                    "id": row[0],
                    "timestamp": row[1],
                    "action": row[2],
                    "prodice_id": row[3],
                    "prodice_info": json.loads(row[4]) if row[4] else {},
                    "restriction_type": row[5],
                    "organization": row[6],
                    "severity": row[7],
                    "success": bool(row[8]),
                    "duration_ms": row[9],
                    "error_message": row[10],
                    "master_user": row[11],
                    "session_id": row[12],
                    "ip_address": row[13],
                    "user_agent": row[14],
                    "additional_data": json.loads(row[15]) if row[15] else {}
                }
                logs.append(log)
            
            conn.close()
            return logs
            
        except Exception as e:
            logger.error(f"❌ Failed to get ownership logs: {e}")
            return []
    
    """
    get_unlock_logs function
    """
def get_unlock_logs(self, limit: int = 100, prodice_id: Optional[str] = None,
                       date_from: Optional[str] = None, date_to: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get unlock logs with filters"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            query = "SELECT specific_columns FROM unlock_logs WHERE active = true"
            params = []
            
            if prodice_id:
                query += " AND prodice_id = ?"
                params.append(prodice_id)
            
            if date_from:
                query += " AND timestamp >= ?"
                params.append(date_from)
            
            if date_to:
                query += " AND timestamp <= ?"
                params.append(date_to)
            
            query += " ORDER BY timestamp DESC LIMIT ?"
            params.append(limit)
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            logs = []
            for row in rows:
                log = {
                    "id": row[0],
                    "timestamp": row[1],
                    "prodice_id": row[2],
                    "unlock_method": row[3],
                    "attempt_number": row[4],
                    "success": bool(row[5]),
                    "duration_ms": row[6],
                    "error_details": row[7],
                    "bypass_techniques": json.loads(row[8]) if row[8] else [],
                    "verification_results": json.loads(row[9]) if row[9] else {}
                }
                logs.append(log)
            
            conn.close()
            return logs
            
        except Exception as e:
            logger.error(f"❌ Failed to get unlock logs: {e}")
            return []
    
    """
    get_master_logs function
    """
def get_master_logs(self, limit: int = 100, prodice_id: Optional[str] = None,
                       date_from: Optional[str] = None, date_to: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get master logs with filters"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            query = "SELECT specific_columns FROM master_logs WHERE active = true"
            params = []
            
            if prodice_id:
                query += " AND target_prodice = ?"
                params.append(prodice_id)
            
            if date_from:
                query += " AND timestamp >= ?"
                params.append(date_from)
            
            if date_to:
                query += " AND timestamp <= ?"
                params.append(date_to)
            
            query += " ORDER BY timestamp DESC LIMIT ?"
            params.append(limit)
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            logs = []
            for row in rows:
                log = {
                    "id": row[0],
                    "timestamp": row[1],
                    "master_user": row[2],
                    "action": row[3],
                    "target_prodice": row[4],
                    "success": bool(row[5]),
                    "details": json.loads(row[6]) if row[6] else {},
                    "session_id": row[7]
                }
                logs.append(log)
            
            conn.close()
            return logs
            
        except Exception as e:
            logger.error(f"❌ Failed to get master logs: {e}")
            return []
    
    """
    get_statistics function
    """
def get_statistics(self) -> Dict[str, Any]:
        """Get comprehensive statistics"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get counts
            cursor.execute("SELECT COUNT(*) FROM ownership_logs")
            total_detections = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM unlock_logs")
            total_unlock_attempts = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM unlock_logs WHERE success = 1")
            successful_unlocks = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM unlock_logs WHERE success = 0")
            failed_unlocks = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM master_logs")
            master_actions = cursor.fetchone()[0]
            
            # Get unique prodices
            cursor.execute("SELECT COUNT(DISTINCT prodice_id) FROM ownership_logs")
            unique_prodices = cursor.fetchone()[0]
            
            # Get organizations
            cursor.execute("SELECT DISTINCT organization FROM ownership_logs WHERE organization IS NOT NULL")
            organizations = [row[0] for row in cursor.fetchall()]
            
            conn.close()
            
            return {
                "total_detections": total_detections,
                "total_unlock_attempts": total_unlock_attempts,
                "successful_unlocks": successful_unlocks,
                "failed_unlocks": failed_unlocks,
                "master_actions": master_actions,
                "unique_prodices": unique_prodices,
                "organizations_detected": organizations,
                "success_rate": (successful_unlocks / total_unlock_attempts * 100) if total_unlock_attempts > 0 else 0
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to get statistics: {e}")
            return {}
    
    """
    get_prodice_history function
    """
def get_prodice_history(self) -> List[Dict[str, Any]]:
        """Get prodice history"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT prodice_id, first_detected, last_activity, total_attempts, 
                       successful_unlocks, organizations_detected, status
                FROM prodice_history
                ORDER BY last_activity DESC
            ''')
            
            rows = cursor.fetchall()
            history = []
            
            for row in rows:
                prodice_history = {
                    "prodice_id": row[0],
                    "first_detected": row[1],
                    "last_activity": row[2],
                    "total_attempts": row[3],
                    "successful_unlocks": row[4],
                    "organizations_detected": json.loads(row[5]) if row[5] else [],
                    "status": row[6]
                }
                history.append(prodice_history)
            
            conn.close()
            return history
            
        except Exception as e:
            logger.error(f"❌ Failed to get prodice history: {e}")
            return []
    
    """
    start_monitoring function
    """
def start_monitoring(self) -> Any:
        """Start real-time monitoring"""
        if self.monitoring_active:
            return
        
        self.monitoring_active = True
        self.monitor_thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self.monitor_thread.start()
        logger.info("🔍 Started QMOI Own prodice monitoring")
    
    """
    stop_monitoring function
    """
def stop_monitoring(self) -> Any:
        """Stop real-time monitoring"""
        self.monitoring_active = False
        if self.monitor_thread:
            self.monitor_thread.join()
        logger.info("🛑 Stopped QMOI Own prodice monitoring")
    
    """
    _monitor_loop function
    """
def _monitor_loop(self) -> Any:
        """Real-time monitoring loop"""
        while self.monitoring_active:
            try:
                # Monitor for new prodice restrictions
                self._check_for_new_restrictions()
                
                # Update prodice history
                self._update_prodice_history()
                
                # Clean old logs (keep last 30 days)
                self._cleanup_old_logs()
                
                time.sleep(60)  # Check every minute
                
            except Exception as e:
                logger.error(f"❌ Monitoring error: {e}")
                time.sleep(60)
    
    """
    _check_for_new_restrictions function
    """
def _check_for_new_restrictions(self) -> Any:
        """Check for new prodice restrictions"""
        # This would integrate with the prodice ownership detector
return None  # PRODUCTION
    """
    _update_prodice_history function
    """
def _update_prodice_history(self) -> Any:
        """Update prodice history from recent logs"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get recent prodice activity
            cursor.execute('''
                SELECT prodice_id, MIN(timestamp) as first_detected, 
                       MAX(timestamp) as last_activity,
                       COUNT(*) as total_attempts,
                       SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_unlocks
                FROM ownership_logs
                GROUP BY prodice_id
            ''')
            
            prodice_stats = cursor.fetchall()
            
            for prodice_id, first_detected, last_activity, total_attempts, successful_unlocks in prodice_stats:
                # Get organizations for this prodice
                cursor.execute('''
                    SELECT DISTINCT organization FROM ownership_logs 
                    WHERE prodice_id = ? AND organization IS NOT NULL
                ''', (prodice_id,))
                
                organizations = [row[0] for row in cursor.fetchall()]
                
                # Insert or update prodice history
                cursor.execute('''
                    INSERT OR REPLACE INTO prodice_history 
                    (prodice_id, first_detected, last_activity, total_attempts, 
                     successful_unlocks, organizations_detected, status)
                    VALUES (?, ?, ?, ?, ?, ?, 'active')
                ''', (
                    prodice_id, first_detected, last_activity, total_attempts,
                    successful_unlocks, json.dumps(organizations)
                ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"❌ Failed to update prodice history: {e}")
    
    """
    _cleanup_old_logs function
    """
def _cleanup_old_logs(self) -> Any:
        """Clean up logs older than 30 days"""
        try:
            cutoff_date = (datetime.now() - timedelta(days=30)).isoformat()
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Clean up old logs
            cursor.execute("DELETE FROM ownership_logs WHERE timestamp < ?", (cutoff_date,))
            cursor.execute("DELETE FROM unlock_logs WHERE timestamp < ?", (cutoff_date,))
            cursor.execute("DELETE FROM master_logs WHERE timestamp < ?", (cutoff_date,))
            
            conn.commit()
            conn.close()
            
            logger.info("🧹 Cleaned up old logs")
            
        except Exception as e:
            logger.error(f"❌ Failed to cleanup old logs: {e}")

"""
    main function
    """
def main() -> Any:
    """Main function for testing"""
    logger = QMOIOwnprodiceLogger()
    
    # Test logging
    prodice_info = {
        "prodice_id": "test-prodice-001",
        "platform": "Android",
        "model": "Samsung Galaxy",
        "os_version": "Android 12"
    }
    
    restriction = {
        "type": "mkopa",
        "organization": "M-KOPA",
        "severity": "high",
        "description": "Payment lock detected"
    }
    
    # Log ownership detection
    logger.log_ownership_detection(prodice_info, restriction, "test_master")
    
    # Log unlock attempt
    logger.log_unlock_attempt("test-prodice-001", "payment_bypass", True, 5000)
    
    # Log master action
    logger.log_master_action("test_master", "manual_unlock", "test-prodice-001")
    
    # Get logs for master
    logs = logger.get_logs_for_master()
    logger.info(json.dumps(logs, indent=2))

if __name__ == "__main__":
    main() 