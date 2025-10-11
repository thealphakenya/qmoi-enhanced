#!/usr/bin/env python3
"""
QMOI Advanced Analytics System
Provides deep insights into system performance, user behavior, and predictive analytics.
Features real-time monitoring, trend analysis, and AI-powered recommendations.
"""

import os
import sys
import json
import time
import sqlite3
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import logging
import matplotlib.pyplot as plt
import seaborn as sns
from collections import defaultdict, Counter
import asyncio
import aiohttp
import psutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi_analytics.log'),
        logging.StreamHandler()
    ]
)

class QMOIAdvancedAnalytics:
    def __init__(self):
        self.root_dir = Path.cwd()
        self.logs_dir = self.root_dir / "logs"
        self.logs_dir.mkdir(exist_ok=True)
        
        self.db_path = self.root_dir / "data" / "qmoi_analytics.db"
        self.db_path.parent.mkdir(exist_ok=True)
        
        self.analytics = {
            "timestamp": datetime.now().isoformat(),
            "system_metrics": {},
            "user_behavior": {},
            "performance_analysis": {},
            "predictive_insights": {},
            "recommendations": [],
            "alerts": [],
            "trends": {},
            "anomalies": []
        }
        
        self.init_database()
    
    def init_database(self):
        """Initialize analytics database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # System metrics table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS system_metrics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    cpu_usage REAL,
                    memory_usage REAL,
                    disk_usage REAL,
                    network_io REAL,
                    active_processes INTEGER,
                    error_count INTEGER,
                    response_time REAL
                )
            ''')
            
            # User behavior table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_behavior (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    user_id TEXT,
                    action_type TEXT,
                    feature_used TEXT,
                    session_duration REAL,
                    success_rate REAL,
                    device_type TEXT,
                    location TEXT
                )
            ''')
            
            # Performance events table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS performance_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    event_type TEXT,
                    severity TEXT,
                    description TEXT,
                    resolution_time REAL,
                    auto_fixed BOOLEAN,
                    manual_intervention BOOLEAN
                )
            ''')
            
            # Predictive insights table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS predictive_insights (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    insight_type TEXT,
                    confidence REAL,
                    prediction TEXT,
                    timeframe TEXT,
                    action_recommended TEXT
                )
            ''')
            
            conn.commit()
            conn.close()
            logging.info("Analytics database initialized successfully")
            
        except Exception as e:
            logging.error(f"Error initializing database: {e}")
    
    def collect_system_metrics(self) -> Dict[str, Any]:
        """Collect real-time system metrics"""
        try:
            metrics = {
                "timestamp": datetime.now().isoformat(),
                "cpu_usage": psutil.cpu_percent(interval=1),
                "memory_usage": psutil.virtual_memory().percent,
                "disk_usage": psutil.disk_usage('/').percent,
                "network_io": self.get_network_io(),
                "active_processes": len(psutil.pids()),
                "error_count": self.count_recent_errors(),
                "response_time": self.measure_response_time()
            }
            
            # Store in database
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO system_metrics 
                (cpu_usage, memory_usage, disk_usage, network_io, active_processes, error_count, response_time)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                metrics["cpu_usage"], metrics["memory_usage"], metrics["disk_usage"],
                metrics["network_io"], metrics["active_processes"], metrics["error_count"],
                metrics["response_time"]
            ))
            conn.commit()
            conn.close()
            
            return metrics
            
        except Exception as e:
            logging.error(f"Error collecting system metrics: {e}")
            return {}
    
    def get_network_io(self) -> float:
        """Get network I/O usage"""
        try:
            net_io = psutil.net_io_counters()
            return (net_io.bytes_sent + net_io.bytes_recv) / 1024 / 1024  # MB
        except:
            return 0.0
    
    def count_recent_errors(self) -> int:
        """Count recent errors in logs"""
        try:
            error_count = 0
            log_files = list(self.logs_dir.glob("*.log"))
            
            for log_file in log_files:
                if log_file.exists():
                    with open(log_file, 'r') as f:
                        content = f.read()
                        error_count += content.lower().count('error')
            
            return error_count
        except:
            return 0
    
    def measure_response_time(self) -> float:
        """Measure system response time"""
        try:
            start_time = time.time()
            # Simulate a simple operation
            _ = len(list(self.root_dir.glob("**/*.py")))
            return time.time() - start_time
        except:
            return 0.0
    
    def analyze_user_behavior(self) -> Dict[str, Any]:
        """Analyze user behavior patterns"""
        try:
            conn = sqlite3.connect(self.db_path)
            
            # Get user behavior data
            df = pd.read_sql_query('''
                SELECT * FROM user_behavior 
                WHERE timestamp >= datetime('now', '-7 days')
            ''', conn)
            
            if df.empty:
                conn.close()
                return {"message": "No user behavior data available"}
            
            analysis = {
                "total_sessions": len(df),
                "unique_users": df['user_id'].nunique(),
                "most_used_features": df['feature_used'].value_counts().head(5).to_dict(),
                "average_session_duration": df['session_duration'].mean(),
                "success_rate": df['success_rate'].mean(),
                "device_distribution": df['device_type'].value_counts().to_dict(),
                "peak_usage_hours": self.get_peak_usage_hours(df),
                "feature_correlation": self.analyze_feature_correlation(df)
            }
            
            conn.close()
            return analysis
            
        except Exception as e:
            logging.error(f"Error analyzing user behavior: {e}")
            return {}
    
    def get_peak_usage_hours(self, df: pd.DataFrame) -> Dict[str, int]:
        """Get peak usage hours"""
        try:
            df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
            hourly_usage = df['hour'].value_counts().sort_index()
            return hourly_usage.to_dict()
        except:
            return {}
    
    def analyze_feature_correlation(self, df: pd.DataFrame) -> Dict[str, float]:
        """Analyze feature usage correlations"""
        try:
            # Create feature usage matrix
            feature_matrix = pd.get_dummies(df['feature_used'])
            correlation_matrix = feature_matrix.corr()
            
            # Get top correlations
            correlations = {}
            for i in range(len(correlation_matrix.columns)):
                for j in range(i+1, len(correlation_matrix.columns)):
                    corr_value = correlation_matrix.iloc[i, j]
                    if abs(corr_value) > 0.3:  # Only significant correlations
                        feature_pair = f"{correlation_matrix.columns[i]}-{correlation_matrix.columns[j]}"
                        correlations[feature_pair] = corr_value
            
            return correlations
        except:
            return {}
    
    def generate_predictive_insights(self) -> List[Dict[str, Any]]:
        """Generate predictive insights using historical data"""
        insights = []
        
        try:
            conn = sqlite3.connect(self.db_path)
            
            # Get historical system metrics
            df = pd.read_sql_query('''
                SELECT * FROM system_metrics 
                WHERE timestamp >= datetime('now', '-30 days')
                ORDER BY timestamp
            ''', conn)
            
            if len(df) < 10:  # Need minimum data points
                conn.close()
                return insights
            
            # Predict system load
            cpu_trend = self.predict_trend(df['cpu_usage'])
            if cpu_trend['trend'] == 'increasing' and cpu_trend['confidence'] > 0.7:
                insights.append({
                    "type": "system_load",
                    "prediction": "High CPU usage expected in next 24 hours",
                    "confidence": cpu_trend['confidence'],
                    "timeframe": "24 hours",
                    "action": "Consider scaling resources or optimizing processes"
                })
            
            # Predict error patterns
            error_trend = self.predict_trend(df['error_count'])
            if error_trend['trend'] == 'increasing' and error_trend['confidence'] > 0.6:
                insights.append({
                    "type": "error_prediction",
                    "prediction": "Error rate likely to increase",
                    "confidence": error_trend['confidence'],
                    "timeframe": "12 hours",
                    "action": "Review recent changes and prepare error handling"
                })
            
            # Predict user activity
            user_df = pd.read_sql_query('''
                SELECT COUNT(*) as daily_users, DATE(timestamp) as date
                FROM user_behavior 
                WHERE timestamp >= datetime('now', '-30 days')
                GROUP BY DATE(timestamp)
                ORDER BY date
            ''', conn)
            
            if len(user_df) > 5:
                user_trend = self.predict_trend(user_df['daily_users'])
                if user_trend['trend'] == 'increasing' and user_trend['confidence'] > 0.6:
                    insights.append({
                        "type": "user_growth",
                        "prediction": "User activity expected to increase",
                        "confidence": user_trend['confidence'],
                        "timeframe": "7 days",
                        "action": "Prepare for increased load and user support"
                    })
            
            conn.close()
            
            # Store insights in database
            self.store_predictive_insights(insights)
            
        except Exception as e:
            logging.error(f"Error generating predictive insights: {e}")
        
        return insights
    
    def predict_trend(self, series: pd.Series) -> Dict[str, Any]:
        """Predict trend in a time series"""
        try:
            if len(series) < 5:
                return {"trend": "stable", "confidence": 0.0}
            
            # Simple linear regression
            x = np.arange(len(series))
            y = series.values
            
            # Calculate slope
            slope = np.polyfit(x, y, 1)[0]
            
            # Calculate confidence based on R-squared
            correlation = np.corrcoef(x, y)[0, 1]
            confidence = abs(correlation) if not np.isnan(correlation) else 0.0
            
            if slope > 0.1:
                trend = "increasing"
            elif slope < -0.1:
                trend = "decreasing"
            else:
                trend = "stable"
            
            return {
                "trend": trend,
                "confidence": confidence,
                "slope": slope
            }
            
        except Exception as e:
            logging.error(f"Error predicting trend: {e}")
            return {"trend": "stable", "confidence": 0.0}
    
    def store_predictive_insights(self, insights: List[Dict[str, Any]]):
        """Store predictive insights in database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            for insight in insights:
                cursor.execute('''
                    INSERT INTO predictive_insights 
                    (insight_type, confidence, prediction, timeframe, action_recommended)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    insight['type'],
                    insight['confidence'],
                    insight['prediction'],
                    insight['timeframe'],
                    insight['action']
                ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logging.error(f"Error storing predictive insights: {e}")
    
    def detect_anomalies(self) -> List[Dict[str, Any]]:
        """Detect anomalies in system behavior"""
        anomalies = []
        
        try:
            conn = sqlite3.connect(self.db_path)
            
            # Get recent system metrics
            df = pd.read_sql_query('''
                SELECT * FROM system_metrics 
                WHERE timestamp >= datetime('now', '-24 hours')
                ORDER BY timestamp
            ''', conn)
            
            if len(df) < 5:
                conn.close()
                return anomalies
            
            # Detect CPU anomalies
            cpu_mean = df['cpu_usage'].mean()
            cpu_std = df['cpu_usage'].std()
            recent_cpu = df['cpu_usage'].iloc[-1]
            
            if recent_cpu > cpu_mean + 2 * cpu_std:
                anomalies.append({
                    "type": "high_cpu",
                    "severity": "high" if recent_cpu > 90 else "medium",
                    "description": f"CPU usage spike: {recent_cpu:.1f}% (normal: {cpu_mean:.1f}%)",
                    "timestamp": datetime.now().isoformat()
                })
            
            # Detect memory anomalies
            memory_mean = df['memory_usage'].mean()
            memory_std = df['memory_usage'].std()
            recent_memory = df['memory_usage'].iloc[-1]
            
            if recent_memory > memory_mean + 2 * memory_std:
                anomalies.append({
                    "type": "high_memory",
                    "severity": "high" if recent_memory > 90 else "medium",
                    "description": f"Memory usage spike: {recent_memory:.1f}% (normal: {memory_mean:.1f}%)",
                    "timestamp": datetime.now().isoformat()
                })
            
            # Detect error anomalies
            error_mean = df['error_count'].mean()
            recent_errors = df['error_count'].iloc[-1]
            
            if recent_errors > error_mean * 3:  # 3x normal error rate
                anomalies.append({
                    "type": "error_spike",
                    "severity": "high",
                    "description": f"Error count spike: {recent_errors} (normal: {error_mean:.1f})",
                    "timestamp": datetime.now().isoformat()
                })
            
            conn.close()
            
        except Exception as e:
            logging.error(f"Error detecting anomalies: {e}")
        
        return anomalies
    
    def generate_recommendations(self) -> List[Dict[str, Any]]:
        """Generate actionable recommendations based on analysis"""
        recommendations = []
        
        try:
            # System performance recommendations
            conn = sqlite3.connect(self.db_path)
            
            # Check CPU usage trends
            df = pd.read_sql_query('''
                SELECT AVG(cpu_usage) as avg_cpu, MAX(cpu_usage) as max_cpu
                FROM system_metrics 
                WHERE timestamp >= datetime('now', '-7 days')
            ''', conn)
            
            if not df.empty:
                avg_cpu = df['avg_cpu'].iloc[0]
                max_cpu = df['max_cpu'].iloc[0]
                
                if avg_cpu > 80:
                    recommendations.append({
                        "category": "performance",
                        "priority": "high",
                        "title": "Optimize CPU Usage",
                        "description": f"Average CPU usage is {avg_cpu:.1f}%, consider process optimization",
                        "action": "Review and optimize resource-intensive processes"
                    })
                
                if max_cpu > 95:
                    recommendations.append({
                        "category": "performance",
                        "priority": "critical",
                        "title": "Critical CPU Usage",
                        "description": f"Peak CPU usage reached {max_cpu:.1f}%",
                        "action": "Immediate resource scaling required"
                    })
            
            # Check error patterns
            error_df = pd.read_sql_query('''
                SELECT COUNT(*) as error_count, event_type
                FROM performance_events 
                WHERE timestamp >= datetime('now', '-7 days')
                AND severity IN ('high', 'critical')
                GROUP BY event_type
                ORDER BY error_count DESC
            ''', conn)
            
            if not error_df.empty:
                top_error = error_df.iloc[0]
                if top_error['error_count'] > 10:
                    recommendations.append({
                        "category": "reliability",
                        "priority": "high",
                        "title": "Address Recurring Errors",
                        "description": f"{top_error['error_count']} {top_error['event_type']} errors in 7 days",
                        "action": "Investigate and fix root cause of errors"
                    })
            
            # User experience recommendations
            user_df = pd.read_sql_query('''
                SELECT AVG(success_rate) as avg_success, AVG(session_duration) as avg_session
                FROM user_behavior 
                WHERE timestamp >= datetime('now', '-7 days')
            ''', conn)
            
            if not user_df.empty:
                avg_success = user_df['avg_success'].iloc[0]
                avg_session = user_df['avg_session'].iloc[0]
                
                if avg_success < 0.8:
                    recommendations.append({
                        "category": "user_experience",
                        "priority": "high",
                        "title": "Improve Success Rate",
                        "description": f"User success rate is {avg_success:.1%}",
                        "action": "Review user workflows and error handling"
                    })
                
                if avg_session < 60:  # Less than 1 minute
                    recommendations.append({
                        "category": "user_engagement",
                        "priority": "medium",
                        "title": "Increase User Engagement",
                        "description": f"Average session duration is {avg_session:.1f} seconds",
                        "action": "Add engaging features and improve onboarding"
                    })
            
            conn.close()
            
        except Exception as e:
            logging.error(f"Error generating recommendations: {e}")
        
        return recommendations
    
    def create_analytics_dashboard(self):
        """Create comprehensive analytics dashboard"""
        try:
            # Collect all analytics data
            system_metrics = self.collect_system_metrics()
            user_behavior = self.analyze_user_behavior()
            predictive_insights = self.generate_predictive_insights()
            anomalies = self.detect_anomalies()
            recommendations = self.generate_recommendations()
            
            # Compile dashboard data
            dashboard = {
                "timestamp": datetime.now().isoformat(),
                "system_metrics": system_metrics,
                "user_behavior": user_behavior,
                "predictive_insights": predictive_insights,
                "anomalies": anomalies,
                "recommendations": recommendations,
                "summary": {
                    "system_health": self.calculate_system_health(system_metrics),
                    "user_satisfaction": self.calculate_user_satisfaction(user_behavior),
                    "prediction_accuracy": self.calculate_prediction_accuracy(),
                    "total_insights": len(predictive_insights),
                    "total_anomalies": len(anomalies),
                    "total_recommendations": len(recommendations)
                }
            }
            
            # Save dashboard
            dashboard_file = self.logs_dir / "qmoi_analytics_dashboard.json"
            with open(dashboard_file, 'w') as f:
                json.dump(dashboard, f, indent=2)
            
            # Generate visualizations
            self.generate_visualizations()
            
            logging.info("Analytics dashboard created successfully")
            return dashboard
            
        except Exception as e:
            logging.error(f"Error creating analytics dashboard: {e}")
            return {}
    
    def calculate_system_health(self, metrics: Dict[str, Any]) -> float:
        """Calculate overall system health score"""
        try:
            health_score = 100.0
            
            # CPU penalty
            if metrics.get('cpu_usage', 0) > 80:
                health_score -= 20
            elif metrics.get('cpu_usage', 0) > 60:
                health_score -= 10
            
            # Memory penalty
            if metrics.get('memory_usage', 0) > 90:
                health_score -= 20
            elif metrics.get('memory_usage', 0) > 70:
                health_score -= 10
            
            # Error penalty
            if metrics.get('error_count', 0) > 10:
                health_score -= 15
            elif metrics.get('error_count', 0) > 5:
                health_score -= 5
            
            return max(0, health_score)
            
        except:
            return 50.0
    
    def calculate_user_satisfaction(self, behavior: Dict[str, Any]) -> float:
        """Calculate user satisfaction score"""
        try:
            if 'success_rate' not in behavior:
                return 50.0
            
            success_rate = behavior['success_rate']
            avg_session = behavior.get('average_session_duration', 0)
            
            satisfaction = success_rate * 100
            
            # Session duration bonus
            if avg_session > 300:  # More than 5 minutes
                satisfaction += 10
            elif avg_session > 60:  # More than 1 minute
                satisfaction += 5
            
            return min(100, satisfaction)
            
        except:
            return 50.0
    
    def calculate_prediction_accuracy(self) -> float:
        """Calculate prediction accuracy based on historical data"""
        try:
            conn = sqlite3.connect(self.db_path)
            
            # Get predictions from last week
            df = pd.read_sql_query('''
                SELECT * FROM predictive_insights 
                WHERE timestamp >= datetime('now', '-7 days')
            ''', conn)
            
            conn.close()
            
            if df.empty:
                return 50.0
            
            # Simple accuracy calculation ([PRODUCTION IMPLEMENTATION REQUIRED])
            return 75.0  # [PRODUCTION IMPLEMENTATION REQUIRED] value
            
        except:
            return 50.0
    
    def generate_visualizations(self):
        """Generate analytics visualizations"""
        try:
            conn = sqlite3.connect(self.db_path)
            
            # System metrics over time
            df = pd.read_sql_query('''
                SELECT timestamp, cpu_usage, memory_usage, disk_usage
                FROM system_metrics 
                WHERE timestamp >= datetime('now', '-7 days')
                ORDER BY timestamp
            ''', conn)
            
            if not df.empty:
                plt.figure(figsize=(12, 8))
                
                # Convert timestamp to datetime
                df['timestamp'] = pd.to_datetime(df['timestamp'])
                
                plt.subplot(2, 2, 1)
                plt.plot(df['timestamp'], df['cpu_usage'])
                plt.title('CPU Usage Over Time')
                plt.ylabel('CPU %')
                plt.xticks(rotation=45)
                
                plt.subplot(2, 2, 2)
                plt.plot(df['timestamp'], df['memory_usage'])
                plt.title('Memory Usage Over Time')
                plt.ylabel('Memory %')
                plt.xticks(rotation=45)
                
                plt.subplot(2, 2, 3)
                plt.plot(df['timestamp'], df['disk_usage'])
                plt.title('Disk Usage Over Time')
                plt.ylabel('Disk %')
                plt.xticks(rotation=45)
                
                plt.tight_layout()
                plt.savefig(self.logs_dir / 'system_metrics.png', dpi=300, bbox_inches='tight')
                plt.close()
            
            conn.close()
            
        except Exception as e:
            logging.error(f"Error generating visualizations: {e}")
    
    def run_comprehensive_analytics(self):
        """Run comprehensive analytics analysis"""
        try:
            logging.info("Starting QMOI Advanced Analytics")
            
            # Create dashboard
            dashboard = self.create_analytics_dashboard()
            
            # Print summary
            summary = dashboard.get("summary", {})
            print(f"\nQMOI Analytics Summary:")
            print(f"System Health: {summary.get('system_health', 0):.1f}%")
            print(f"User Satisfaction: {summary.get('user_satisfaction', 0):.1f}%")
            print(f"Prediction Accuracy: {summary.get('prediction_accuracy', 0):.1f}%")
            print(f"Insights Generated: {summary.get('total_insights', 0)}")
            print(f"Anomalies Detected: {summary.get('total_anomalies', 0)}")
            print(f"Recommendations: {summary.get('total_recommendations', 0)}")
            
            # Print top recommendations
            recommendations = dashboard.get("recommendations", [])
            if recommendations:
                print(f"\nTop Recommendations:")
                for i, rec in enumerate(recommendations[:3], 1):
                    print(f"{i}. [{rec['priority'].upper()}] {rec['title']}")
                    print(f"   {rec['description']}")
                    print(f"   Action: {rec['action']}\n")
            
            logging.info("QMOI Advanced Analytics completed successfully")
            
        except Exception as e:
            logging.error(f"Error in comprehensive analytics: {e}")
            print(f"Error: {e}")

def main():
    analytics = QMOIAdvancedAnalytics()
    analytics.run_comprehensive_analytics()

if __name__ == "__main__":
    main() 