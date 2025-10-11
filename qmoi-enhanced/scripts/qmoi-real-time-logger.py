#!/usr/bin/env python3
I Real-Time Logger System
Comprehensive real-time logging system for QCity with master-only access
"""

import os
import sys
import json
import logging
import threading
import time
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path
import sqlite3
import hashlib
import gzip
import base64

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s,handlers=[
        logging.FileHandler('qmoi-real-time-logger.log'),
        logging.StreamHandler()
    ]
)

class QMOIRealTimeLogger:
    def __init__(self):
        self.master_access = True  # Master-only access
        self.log_database = 'qmoi_logs.db    self.log_files_dir = Path('qmoi_logs')
        self.log_files_dir.mkdir(exist_ok=True)
        
        # Initialize database
        self.init_database()
        
        # Log categories
        self.log_categories = {
          activity_logs:     performance_logs:            error_logs:],
         revenue_logs:       evolution_logs:       research_logs:       learning_logs:        master_request_logs': []
        }
        
        # Real-time logging
        self.real_time_logging = True
        self.offline_mode = False
        self.auto_save =true
        self.file_rotation =true
        self.backup_system = True
        
        # Start real-time logging
        self.start_real_time_logging()
    
    def init_database(self):
       Initialize SQLite database for logging"""
        try:
            conn = sqlite3connect(self.log_database)
            cursor = conn.cursor()
            
            # Create tables for each log category
            tables =               REATE TABLE IF NOT EXISTS activity_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    category TEXT NOT NULL,
                    action TEXT NOT NULL,
                    details TEXT,
                    user_id TEXT,
                    session_id TEXT,
                    ip_address TEXT,
                    user_agent TEXT
                )""",
                
                REATE TABLE IF NOT EXISTS performance_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    metric_name TEXT NOT NULL,
                    metric_value REAL NOT NULL,
                    unit TEXT,
                    context TEXT,
                    system_component TEXT
                )""",
                
                REATE TABLE IF NOT EXISTS error_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    error_type TEXT NOT NULL,
                    error_message TEXT NOT NULL,
                    stack_trace TEXT,
                    severity TEXT NOT NULL,
                    component TEXT,
                    user_id TEXT,
                    session_id TEXT
                )""",
                
                REATE TABLE IF NOT EXISTS revenue_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    revenue_type TEXT NOT NULL,
                    amount REAL NOT NULL,
                    currency TEXT DEFAULT 'KES',
                    source TEXT,
                    platform TEXT,
                    user_id TEXT,
                    transaction_id TEXT
                )""",
                
                REATE TABLE IF NOT EXISTS evolution_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    evolution_type TEXT NOT NULL,
                    component TEXT NOT NULL,
                    changes TEXT,
                    performance_impact REAL,
                    success_rate REAL,
                    user_feedback TEXT
                )""",
                
                REATE TABLE IF NOT EXISTS research_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    research_type TEXT NOT NULL,
                    source TEXT NOT NULL,
                    topic TEXT NOT NULL,
                    findings TEXT,
                    relevance_score REAL,
                    implementation_status TEXT
                )""",
                
                REATE TABLE IF NOT EXISTS learning_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    learning_type TEXT NOT NULL,
                    topic TEXT NOT NULL,
                    knowledge_gained TEXT,
                    skill_improvement REAL,
                    confidence_score REAL,
                    application_status TEXT
                )""",
                
                REATE TABLE IF NOT EXISTS master_request_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    request_type TEXT NOT NULL,
                    request_details TEXT NOT NULL,
                    priority TEXT NOT NULL,
                    status TEXT NOT NULL,
                    implementation_time REAL,
                    success_rate REAL,
                    master_feedback TEXT
                )   ]
            
            for table in tables:
                cursor.execute(table)
            
            conn.commit()
            conn.close()
            logging.info("Database initialized successfully")
            
        except Exception as e:
            logging.error(f"Failed to initialize database: {e}")
    
    def log_activity(self, category: str, action: str, details: str = ser_id: str = None, session_id: str = None):
     Log activitywith comprehensive details"""
        try:
            log_entry =[object Object]
          timestamp:datetime.now().isoformat(),
         category': category,
                actionn,
                details': details,
                user_id': user_id,
           session_id': session_id,
                ip_address:self.get_client_ip(),
                user_agent': self.get_user_agent()
            }
            
            # Add to memory
            self.log_categories['activity_logs'].append(log_entry)
            
            # Save to database
            self.save_to_database('activity_logs', log_entry)
            
            # Save to file
            self.save_to_file('activity_logs', log_entry)
            
            logging.info(f"Activity logged: {category} - {action}")
            
        except Exception as e:
            logging.error(f"Failed to log activity: {e}")
    
    def log_performance(self, metric_name: str, metric_value: float, unit: str = context: str = , component: str = "):erformance metrics"""
        try:
            log_entry =[object Object]
          timestamp:datetime.now().isoformat(),
            metric_name': metric_name,
             metric_value': metric_value,
            unitt,
                context': context,
               system_component': component
            }
            
            # Add to memory
            self.log_categories['performance_logs'].append(log_entry)
            
            # Save to database
            self.save_to_database('performance_logs', log_entry)
            
            # Save to file
            self.save_to_file('performance_logs', log_entry)
            
            logging.info(f"Performance logged: {metric_name} = {metric_value} {unit}")
            
        except Exception as e:
            logging.error(f"Failed to log performance: {e}")
    
    def log_error(self, error_type: str, error_message: str, stack_trace: str =, severity: str = "medium", component: str = ser_id: str = None, session_id: str = None):
        with comprehensive details"""
        try:
            log_entry =[object Object]
          timestamp:datetime.now().isoformat(),
           error_type': error_type,
              error_message: error_message,
            stack_trace': stack_trace,
         severity': severity,
          component': component,
                user_id': user_id,
           session_id': session_id
            }
            
            # Add to memory
            self.log_categories['error_logs'].append(log_entry)
            
            # Save to database
            self.save_to_database('error_logs', log_entry)
            
            # Save to file
            self.save_to_file('error_logs', log_entry)
            
            logging.error(f"Error logged: {error_type} - {error_message}")
            
        except Exception as e:
            logging.error(f"Failed to log error: {e}")
    
    def log_revenue(self, revenue_type: str, amount: float, currency: str = KES", source: str =, platform: str = ser_id: str = None, transaction_id: str = None):
    revenue activities"""
        try:
            log_entry =[object Object]
          timestamp:datetime.now().isoformat(),
             revenue_type': revenue_type,
                amountt,
         currency': currency,
                sourcee,
         platform': platform,
                user_id': user_id,
               transaction_id: transaction_id
            }
            
            # Add to memory
            self.log_categories['revenue_logs'].append(log_entry)
            
            # Save to database
            self.save_to_database('revenue_logs', log_entry)
            
            # Save to file
            self.save_to_file('revenue_logs', log_entry)
            
            logging.info(fRevenue logged: {revenue_type} - {amount} {currency}")
            
        except Exception as e:
            logging.error(f"Failed to log revenue: {e}")
    
    def log_evolution(self, evolution_type: str, component: str, changes: str, performance_impact: float = 0uccess_rate: float = 00user_feedback: str = "):olution activities"""
        try:
            log_entry =[object Object]
          timestamp:datetime.now().isoformat(),
               evolution_type': evolution_type,
          component': component,
                changes': changes,
           performance_impact': performance_impact,
             success_rate': success_rate,
              user_feedback': user_feedback
            }
            
            # Add to memory
            self.log_categories[evolution_logs'].append(log_entry)
            
            # Save to database
            self.save_to_database('evolution_logs', log_entry)
            
            # Save to file
            self.save_to_file('evolution_logs', log_entry)
            
            logging.info(fEvolution logged: {evolution_type} - {component}")
            
        except Exception as e:
            logging.error(f"Failed to log evolution: {e}")
    
    def log_research(self, research_type: str, source: str, topic: str, findings: str, relevance_score: float = 00lementation_status: str = "pending):esearch activities"""
        try:
            log_entry =[object Object]
          timestamp:datetime.now().isoformat(),
              research_type: research_type,
                sourcee,
              topicc,
         findings': findings,
                relevance_score: relevance_score,
             implementation_status': implementation_status
            }
            
            # Add to memory
            self.log_categories['research_logs'].append(log_entry)
            
            # Save to database
            self.save_to_database('research_logs', log_entry)
            
            # Save to file
            self.save_to_file('research_logs', log_entry)
            
            logging.info(f"Research logged:[object Object]research_type} - {topic}")
            
        except Exception as e:
            logging.error(f"Failed to log research: {e}")
    
    def log_learning(self, learning_type: str, topic: str, knowledge_gained: str, skill_improvement: float = 0.0, confidence_score: float = 0.0, application_status: str = "pending):earning activities"""
        try:
            log_entry =[object Object]
          timestamp:datetime.now().isoformat(),
              learning_type: learning_type,
              topicc,
               knowledge_gained': knowledge_gained,
                skill_improvement': skill_improvement,
               confidence_score': confidence_score,
          application_status': application_status
            }
            
            # Add to memory
            self.log_categories['learning_logs'].append(log_entry)
            
            # Save to database
            self.save_to_database('learning_logs', log_entry)
            
            # Save to file
            self.save_to_file('learning_logs', log_entry)
            
            logging.info(f"Learning logged:[object Object]learning_type} - {topic}")
            
        except Exception as e:
            logging.error(f"Failed to log learning: {e}")
    
    def log_master_request(self, request_type: str, request_details: str, priority: str =normal, status: str = "pending", implementation_time: float = 0uccess_rate: float = 0.0, master_feedback: str = "):og master requests"""
        try:
            log_entry =[object Object]
          timestamp:datetime.now().isoformat(),
             request_type': request_type,
                request_details: request_details,
         priority': priority,
                statuss,
             implementation_time': implementation_time,
             success_rate': success_rate,
                master_feedback: master_feedback
            }
            
            # Add to memory
            self.log_categories['master_request_logs'].append(log_entry)
            
            # Save to database
            self.save_to_database('master_request_logs', log_entry)
            
            # Save to file
            self.save_to_file('master_request_logs', log_entry)
            
            logging.info(f"Master request logged: {request_type} - {priority}")
            
        except Exception as e:
            logging.error(f"Failed to log master request: {e}")
    
    def save_to_database(self, table_name: str, log_entry: Dict):
       Save log entry to database"""
        try:
            conn = sqlite3connect(self.log_database)
            cursor = conn.cursor()
            
            # Get column names and values
            columns = list(log_entry.keys())
            values = list(log_entry.values())
            [PRODUCTION IMPLEMENTATION REQUIRED]s = ,.join(['? for _ in columns])
            
            query = f"INSERT INTO {table_name} ([object Object],.join(columns)}) VALUES ({[PRODUCTION IMPLEMENTATION REQUIRED]s})"
            cursor.execute(query, values)
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logging.error(fFailed to save to database: {e}")
    
    def save_to_file(self, category: str, log_entry: Dict):
       Save log entry to file"""
        try:
            # Create category directory
            category_dir = self.log_files_dir / category
            category_dir.mkdir(exist_ok=True)
            
            # Create time-based file
            timestamp = datetime.now()
            date_str = timestamp.strftime('%Y-%m-%d')
            time_str = timestamp.strftime('%H')
            
            filename = f"{date_str}_{time_str}.json          filepath = category_dir / filename
            
            # Load existing logs or create new
            if filepath.exists():
                with open(filepath, r, encoding='utf-8') as f:
                    logs = json.load(f)
            else:
                logs = []
            
            # Add new log entry
            logs.append(log_entry)
            
            # Save to file
            with open(filepath, w, encoding='utf-8') as f:
                json.dump(logs, f, indent=2, ensure_ascii=False)
            
            # Compress old files
            self.compress_old_files(category_dir)
            
        except Exception as e:
            logging.error(fFailed to save to file: {e}")
    
    def compress_old_files(self, directory: Path):
     ress old log files for storage efficiency"""
        try:
            for file_path in directory.glob('*.json'):
                # Skip already compressed files
                if file_path.suffix == '.gz':
                    continue
                
                # Compress files older than 1 day
                file_age = time.time() - file_path.stat().st_mtime
                if file_age > 86400                   with open(file_path, 'rb') as f_in:
                        with gzip.open(f"{file_path}.gz", 'wb') as f_out:
                            f_out.writelines(f_in)
                    
                    # Remove original file
                    file_path.unlink()
                    
        except Exception as e:
            logging.error(f"Failed to compress files: {e}")
    
    def get_client_ip(self) -> str:
       client IP address"""
        try:
            # This would be implemented based on the actual environment
            return "1270.1
        except:
            return unknown 
    def get_user_agent(self) -> str:
       Get user agent"""
        try:
            # This would be implemented based on the actual environment
            returnQMOI-Real-Time-Logger
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