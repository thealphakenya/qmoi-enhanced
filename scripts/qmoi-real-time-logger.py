#!/usr/bin/env python3
"""QMOI Real-Time Logger (minimal, parser-safe implementation).

This file implements a small, well-formed subset of the original logger so
automation can run formatters and tests. It intentionally keeps behavior
simple: JSON file append and a tiny SQLite table for activity/performance.
"""

from __future__ import annotations

import gzip
import json
import logging
import sqlite3
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List


logger = logging.getLogger("qmoi_real_time_logger")
logger.setLevel(logging.INFO)
if not logger.handlers:
    fh = logging.FileHandler("qmoi-real-time-logger.log")
    sh = logging.StreamHandler()
    fmt = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    fh.setFormatter(fmt)
    sh.setFormatter(fmt)
    logger.addHandler(fh)
    logger.addHandler(sh)


class QMOIRealTimeLogger:
    """Compact, safe-to-run logger used during repo-cleanup automation."""

    def __init__(self, db_path: str = "qmoi_logs.db", logs_dir: str = "qmoi_logs") -> None:
        self.log_database = db_path
        self.log_files_dir = Path(logs_dir)
        self.log_files_dir.mkdir(parents=True, exist_ok=True)

        self.log_categories: Dict[str, List[Dict[str, Any]]] = {
            "activity_logs": [],
            "performance_logs": [],
            "error_logs": [],
        }

        self.init_database()

    def init_database(self) -> None:
        try:
            conn = sqlite3.connect(self.log_database)
            cursor = conn.cursor()
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS activity_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    category TEXT NOT NULL,
                    action TEXT NOT NULL,
                    details TEXT
                )
                """
            )
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS performance_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    metric_name TEXT NOT NULL,
                    metric_value REAL NOT NULL,
                    unit TEXT
                )
                """
            )
            conn.commit()
            conn.close()
        except Exception as exc:
            logger.error("Failed to initialize database: %s", exc)

    def save_to_database(self, table: str, payload: Dict[str, Any]) -> None:
        try:
            conn = sqlite3.connect(self.log_database)
            cursor = conn.cursor()
            if table == "activity_logs":
                cursor.execute(
                    "INSERT INTO activity_logs (timestamp, category, action, details) VALUES (?, ?, ?, ?)",
                    (
                        payload.get("timestamp"),
                        payload.get("category"),
                        payload.get("action"),
                        json.dumps(payload.get("details")),
                    ),
                )
            elif table == "performance_logs":
                cursor.execute(
                    "INSERT INTO performance_logs (timestamp, metric_name, metric_value, unit) VALUES (?, ?, ?, ?)",
                    (
                        payload.get("timestamp"),
                        payload.get("metric_name"),
                        payload.get("metric_value"),
                        payload.get("unit"),
                    ),
                )
            conn.commit()
            conn.close()
        except Exception as exc:
            logger.error("Failed to save to database: %s", exc)

    def save_to_file(self, category: str, payload: Dict[str, Any]) -> None:
        try:
            path = self.log_files_dir / f"{category}.jsonl"
            with open(path, "a", encoding="utf-8") as fh:
                fh.write(json.dumps(payload, default=str) + "\n")
        except Exception as exc:
            logger.error("Failed to save to file: %s", exc)

    def compress_old_files(self, directory: Path, older_than_seconds: int = 86400) -> None:
        try:
            for file_path in directory.glob("*.jsonl"):
                if file_path.suffix == ".gz":
                    continue
                file_age = time.time() - file_path.stat().st_mtime
                if file_age > older_than_seconds:
                    with open(file_path, "rb") as f_in:
                        with gzip.open(f"{file_path}.gz", "wb") as f_out:
                            f_out.writelines(f_in)
                    file_path.unlink()
        except Exception as exc:
            logger.error("Failed to compress files: %s", exc)

    def log_activity(self, category: str, action: str, details: Any | None = None) -> None:
        payload = {
            "timestamp": datetime.now().isoformat(),
            "category": category,
            "action": action,
            "details": details,
        }
        self.log_categories["activity_logs"].append(payload)
        self.save_to_database("activity_logs", payload)
        self.save_to_file("activity_logs", payload)
        logger.info("Activity logged: %s - %s", category, action)

    def log_performance(self, metric_name: str, metric_value: float, unit: str = "") -> None:
        payload = {
            "timestamp": datetime.now().isoformat(),
            "metric_name": metric_name,
            "metric_value": metric_value,
            "unit": unit,
        }
        self.log_categories["performance_logs"].append(payload)
        self.save_to_database("performance_logs", payload)
        self.save_to_file("performance_logs", payload)
        logger.info("Performance metric logged: %s = %s %s", metric_name, metric_value, unit)

    def log_error(self, error_type: str, error_message: str, stack_trace: str | None = None, severity: str = "medium", component: str | None = None) -> None:
        payload = {
            "timestamp": datetime.now().isoformat(),
            "error_type": error_type,
            "error_message": error_message,
            "stack_trace": stack_trace,
            "severity": severity,
            "component": component,
        }
        self.log_categories["error_logs"].append(payload)
        # For simplicity we reuse activity table for errors in DB (safe, small schema)
        self.save_to_file("error_logs", payload)
        logger.error("Error logged: %s - %s", error_type, error_message)


def _quick_demo() -> None:  # simple smoke test when run directly
    rlogger = QMOIRealTimeLogger()
    rlogger.log_activity("demo", "started", {"detail": "quick demo"})
    rlogger.log_performance("demo_latency_ms", 12.3, "ms")
    rlogger.log_error("demo_error", "something went wrong", "stacktrace")


if __name__ == "__main__":
    _quick_demo()

        except:
            return unknown"
    
    def start_real_time_logging(self):
         real-time logging system""     def real_time_logging_loop():
            while True:
                try:
                    # Auto-save logs periodically
                    if self.auto_save:
                        self.auto_save_logs()
                    
                    # Rotate files if needed
                    if self.file_rotation:
                        self.rotate_log_files()
                    
                    # Create backup if needed
                    if self.backup_system:
                        self.create_backup()
                    
                    time.sleep(60Check every minute
                    
                except Exception as e:
                    logging.error(f"Error in real-time logging loop: {e}")
                    time.sleep(60)
        
        # Start real-time logging in background thread
        logging_thread = threading.Thread(target=real_time_logging_loop, daemon=True)
        logging_thread.start()
        
        logging.info(Real-time logging started")
    
    def auto_save_logs(self):
       Auto-save logs to files"""
        try:
            for category, logs in self.log_categories.items():
                if logs:
                    # Save to file
                    self.save_to_file(category, logs[-1])
                    
        except Exception as e:
            logging.error(f"Failed to auto-save logs: {e}")
    
    def rotate_log_files(self):
   te log files based on size and age"""
        try:
            for category_dir in self.log_files_dir.iterdir():
                if category_dir.is_dir():
                    for file_path in category_dir.glob('*.json'):
                        # Rotate files larger than 10MB or older than 7 days
                        file_size = file_path.stat().st_size
                        file_age = time.time() - file_path.stat().st_mtime
                        
                        if file_size > 1024* 1024 or file_age > 7 * 86400:
                            # Create rotated file
                            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                            rotated_path = file_path.with_name(f"{file_path.stem}_{timestamp}{file_path.suffix}")
                            file_path.rename(rotated_path)
                            
        except Exception as e:
            logging.error(f"Failed to rotate log files: {e}")
    
    def create_backup(self):
      eate backup of log database"""
        try:
            backup_path = f"{self.log_database}.backup"
            if os.path.exists(self.log_database):
                import shutil
                shutil.copy2(self.log_database, backup_path)
                
        except Exception as e:
            logging.error(f"Failed to create backup: {e}")
    
    def get_logs(self, category: str = None, limit: int = 100lters: Dict = None) -> List[Dict]:
      logs with optional filtering"""
        try:
            if category:
                return self.log_categories.get(category, [])[-limit:]
            else:
                all_logs =                for logs in self.log_categories.values():
                    all_logs.extend(logs)
                return sorted(all_logs, key=lambda x: x['timestamp], reverse=True)[:limit]
                
        except Exception as e:
            logging.error(f"Failed to get logs: {e}")
            return []
    
    def search_logs(self, query: str, category: str = None) -> List[Dict]:
         logs for specific query"""
        try:
            results = []
            search_categories = [category] if category else self.log_categories.keys()
            
            for cat in search_categories:
                logs = self.log_categories.get(cat, [])
                for log in logs:
                    # Search in all text fields
                    log_text = json.dumps(log, ensure_ascii=False).lower()
                    if query.lower() in log_text:
                        results.append(log)
            
            return results
            
        except Exception as e:
            logging.error(f"Failed to search logs: {e}")
            return []
    
    def export_logs(self, category: str = None, format: str = "json) -> str:
        logs in specified format"""
        try:
            logs = self.get_logs(category=category, limit=10      
            if format == "json:            return json.dumps(logs, indent=2, ensure_ascii=false)
            elif format == "csv:            import csv
                import io
                output = io.StringIO()
                if logs:
                    writer = csv.DictWriter(output, fieldnames=logs[0].keys())
                    writer.writeheader()
                    writer.writerows(logs)
                return output.getvalue()
            else:
                return str(logs)
                
        except Exception as e:
            logging.error(f"Failed to export logs: {e}")
            return "

def main():
  in function to run real-time logger
    logger = QMOIRealTimeLogger()
    
    if len(sys.argv) > 1
        command = sys.argv[1]
        
        if command == '--test':
            # Test logging functionality
            logger.log_activity("test", "test_action", "Test activity logging")
            logger.log_performance(response_time,05econds", "API call", "backend")
            logger.log_error("test_error", "Test error message, severity=low,component="test")
            logger.log_revenue("test_revenue", 100KES", "test_source",test_platform")
            logger.log_evolution("test_evolution,test_component", "Test changes")
            logger.log_research(test_research", "test_source, test_topic",Test findings")
            logger.log_learning(test_learning, test_topic, t knowledge gained")
            logger.log_master_request("test_request", "Test request details", priority="high")
            
            print("Test logging completed")
            
        elif command == '--get-logs':
            category = sys.argv[2] if len(sys.argv) > 2 else None
            logs = logger.get_logs(category=category, limit=10)
            print(json.dumps(logs, indent=2))
            
        elif command == '--search':
            query = sys.argv[2] if len(sys.argv) > 2 else ""
            category = sys.argv[3] if len(sys.argv) > 3 else None
            results = logger.search_logs(query, category)
            print(json.dumps(results, indent=2))
            
        elif command == '--export':
            category = sys.argv[2] if len(sys.argv) > 2 else None
            format = sys.argv[3] if len(sys.argv) > 3 else json            export_data = logger.export_logs(category, format)
            print(export_data)
            
        else:
            print("Usage:")
            print("  python qmoi-real-time-logger.py --test")
            print("  python qmoi-real-time-logger.py --get-logs [category]")
            print("  python qmoi-real-time-logger.py --search <query> [category]")
            print("  python qmoi-real-time-logger.py --export category] [format]")
    else:
        # Start real-time logging
        print("QMOI Real-Time Logger started")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("Real-time logger stopped)if __name__ == "__main__":
    main() 