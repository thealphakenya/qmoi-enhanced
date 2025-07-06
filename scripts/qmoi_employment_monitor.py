#!/usr/bin/env python3
"""
QMOI Employment Monitor
Monitors employment system and employee performance
"""

import os
import sys
import json
import time
import logging
from datetime import datetime, timedelta
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from models.latest.qmoi_enhanced_model import QMOIEnhancedSystem

class QMOIEmploymentMonitor:
    def __init__(self):
        self.logger = self._setup_logging()
        self.qmoi_system = QMOIEnhancedSystem()
        self.employment_report = {
            "timestamp": datetime.now().isoformat(),
            "employment_status": "unknown",
            "total_employees": 0,
            "active_employees": 0,
            "total_positions": 0,
            "employee_performance": {},
            "department_stats": {},
            "alerts": [],
            "recommendations": []
        }
    
    def _setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/employment_monitor.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger(__name__)
    
    def check_employment_status(self):
        """Check current employment status"""
        try:
            employment_data = self.qmoi_system.get_employment_status()
            
            if employment_data:
                self.employment_report["total_employees"] = employment_data.get("total_employees", 0)
                self.employment_report["active_employees"] = employment_data.get("active_employees", 0)
                self.employment_report["total_positions"] = employment_data.get("total_positions", 0)
                self.employment_report["employee_performance"] = employment_data.get("employee_performance", {})
                self.employment_report["department_stats"] = employment_data.get("department_stats", {})
                
                # Calculate fill rate
                if self.employment_report["total_positions"] > 0:
                    fill_rate = (self.employment_report["active_employees"] / self.employment_report["total_positions"]) * 100
                else:
                    fill_rate = 0
                
                self.employment_report["fill_rate"] = fill_rate
                
            else:
                self.employment_report["alerts"].append("Employment data not available")
                
        except Exception as e:
            self.employment_report["alerts"].append(f"Employment status check failed: {str(e)}")
    
    def analyze_employee_performance(self):
        """Analyze individual employee performance"""
        employee_performance = self.employment_report["employee_performance"]
        
        for employee_id, performance_data in employee_performance.items():
            try:
                productivity = performance_data.get("productivity", 0)
                efficiency = performance_data.get("efficiency", 0)
                revenue_generated = performance_data.get("revenue_generated", 0)
                
                # Calculate overall performance score
                performance_score = (productivity + efficiency) / 2
                
                # Update performance data
                employee_performance[employee_id]["performance_score"] = performance_score
                employee_performance[employee_id]["status"] = self._get_employee_status(performance_score)
                
                # Generate alerts for underperforming employees
                if performance_score < 50:
                    self.employment_report["alerts"].append(f"Employee {employee_id} underperforming: {performance_score:.1f}%")
                    self.employment_report["recommendations"].append(f"Provide training or support for employee {employee_id}")
                
                # Highlight high performers
                if performance_score > 90:
                    self.employment_report["recommendations"].append(f"Consider promotion or bonus for employee {employee_id}")
                
            except Exception as e:
                self.employment_report["alerts"].append(f"Performance analysis failed for employee {employee_id}: {str(e)}")
    
    def _get_employee_status(self, performance_score):
        """Get status for an employee based on performance"""
        if performance_score >= 90:
            return "excellent"
        elif performance_score >= 75:
            return "good"
        elif performance_score >= 50:
            return "satisfactory"
        else:
            return "needs_improvement"
    
    def analyze_department_performance(self):
        """Analyze department performance"""
        department_stats = self.employment_report["department_stats"]
        
        for department, stats in department_stats.items():
            try:
                avg_productivity = stats.get("avg_productivity", 0)
                total_revenue = stats.get("total_revenue", 0)
                employee_count = stats.get("employee_count", 0)
                
                # Calculate department efficiency
                if employee_count > 0:
                    efficiency = total_revenue / employee_count
                else:
                    efficiency = 0
                
                # Update department stats
                department_stats[department]["efficiency"] = efficiency
                department_stats[department]["status"] = self._get_department_status(avg_productivity, efficiency)
                
                # Generate department-specific recommendations
                if avg_productivity < 60:
                    self.employment_report["recommendations"].append(f"Improve productivity in {department} department")
                
                if efficiency < 10000:  # $10k per employee
                    self.employment_report["recommendations"].append(f"Optimize efficiency in {department} department")
                
            except Exception as e:
                self.employment_report["alerts"].append(f"Department analysis failed for {department}: {str(e)}")
    
    def _get_department_status(self, productivity, efficiency):
        """Get status for a department based on metrics"""
        if productivity >= 80 and efficiency >= 15000:
            return "excellent"
        elif productivity >= 60 and efficiency >= 10000:
            return "good"
        elif productivity >= 40 and efficiency >= 5000:
            return "satisfactory"
        else:
            return "needs_improvement"
    
    def check_employment_trends(self):
        """Check employment trends over time"""
        try:
            # Load historical employment data
            history_file = Path("logs/employment_history.json")
            if history_file.exists():
                with open(history_file, "r") as f:
                    historical_data = json.load(f)
                
                if len(historical_data) >= 2:
                    # Calculate trends
                    recent_data = historical_data[-5:]  # Last 5 data points
                    
                    # Employee growth trend
                    employee_counts = [d.get("active_employees", 0) for d in recent_data]
                    if len(employee_counts) >= 2:
                        employee_trend = "growing" if employee_counts[-1] > employee_counts[0] else "declining"
                        growth_rate = ((employee_counts[-1] - employee_counts[0]) / employee_counts[0]) * 100 if employee_counts[0] > 0 else 0
                        
                        self.employment_report["trends"] = {
                            "employee_trend": employee_trend,
                            "growth_rate": growth_rate
                        }
                        
                        # Alert for declining employment
                        if employee_trend == "declining" and abs(growth_rate) > 10:
                            self.employment_report["alerts"].append(f"Employment declining: {abs(growth_rate):.1f}% decrease")
                            self.employment_report["recommendations"].append("Investigate employment decline and implement recruitment strategies")
            
        except Exception as e:
            self.employment_report["alerts"].append(f"Employment trend analysis failed: {str(e)}")
    
    def check_employment_targets(self):
        """Check if employment targets are being met"""
        active_employees = self.employment_report["active_employees"]
        total_positions = self.employment_report["total_positions"]
        fill_rate = self.employment_report.get("fill_rate", 0)
        
        if fill_rate >= 95:
            self.employment_report["employment_status"] = "fully_staffed"
        elif fill_rate >= 80:
            self.employment_report["employment_status"] = "well_staffed"
            self.employment_report["alerts"].append(f"Employment fill rate: {fill_rate:.1f}%")
        elif fill_rate >= 60:
            self.employment_report["employment_status"] = "moderately_staffed"
            self.employment_report["alerts"].append(f"Low employment fill rate: {fill_rate:.1f}%")
            self.employment_report["recommendations"].append("Increase recruitment efforts")
        else:
            self.employment_report["employment_status"] = "understaffed"
            self.employment_report["alerts"].append(f"Critical employment fill rate: {fill_rate:.1f}%")
            self.employment_report["recommendations"].append("Urgent recruitment needed")
    
    def generate_employment_score(self):
        """Generate overall employment performance score"""
        score = 100
        
        # Base score on fill rate
        fill_rate = self.employment_report.get("fill_rate", 0)
        score = min(100, fill_rate)
        
        # Deduct points for alerts
        score -= len(self.employment_report["alerts"]) * 5
        
        # Deduct points for underperforming employees
        underperforming_employees = sum(1 for emp in self.employment_report["employee_performance"].values() 
                                      if emp.get("status") == "needs_improvement")
        score -= underperforming_employees * 3
        
        # Deduct points for underperforming departments
        underperforming_departments = sum(1 for dept in self.employment_report["department_stats"].values() 
                                        if dept.get("status") == "needs_improvement")
        score -= underperforming_departments * 5
        
        # Ensure score doesn't go below 0
        score = max(0, score)
        
        self.employment_report["employment_score"] = score
        
        # Set employment status based on score
        if score >= 90:
            self.employment_report["employment_status"] = "excellent"
        elif score >= 75:
            self.employment_report["employment_status"] = "good"
        elif score >= 50:
            self.employment_report["employment_status"] = "fair"
        else:
            self.employment_report["employment_status"] = "poor"
    
    def save_employment_report(self):
        """Save employment report to file"""
        try:
            # Ensure logs directory exists
            Path("logs").mkdir(exist_ok=True)
            
            # Save detailed report
            with open("logs/employment_report.json", "w") as f:
                json.dump(self.employment_report, f, indent=2)
            
            # Save to history
            history_file = Path("logs/employment_history.json")
            historical_data = []
            
            if history_file.exists():
                with open(history_file, "r") as f:
                    historical_data = json.load(f)
            
            # Add current data to history
            current_data = {
                "timestamp": self.employment_report["timestamp"],
                "active_employees": self.employment_report["active_employees"],
                "total_positions": self.employment_report["total_positions"],
                "fill_rate": self.employment_report.get("fill_rate", 0),
                "employment_score": self.employment_report.get("employment_score", 0)
            }
            
            historical_data.append(current_data)
            
            # Keep only last 1000 entries
            if len(historical_data) > 1000:
                historical_data = historical_data[-1000:]
            
            with open(history_file, "w") as f:
                json.dump(historical_data, f, indent=2)
            
            # Save summary report
            summary = {
                "timestamp": self.employment_report["timestamp"],
                "employment_status": self.employment_report["employment_status"],
                "active_employees": self.employment_report["active_employees"],
                "total_positions": self.employment_report["total_positions"],
                "fill_rate": self.employment_report.get("fill_rate", 0),
                "employment_score": self.employment_report.get("employment_score", 0),
                "alerts_count": len(self.employment_report["alerts"]),
                "recommendations_count": len(self.employment_report["recommendations"])
            }
            
            with open("logs/employment_summary.json", "w") as f:
                json.dump(summary, f, indent=2)
                
            self.logger.info(f"Employment report saved. Score: {self.employment_report.get('employment_score', 0)}")
            
        except Exception as e:
            self.logger.error(f"Failed to save employment report: {str(e)}")
    
    def run_employment_check(self):
        """Run complete employment check"""
        self.logger.info("Starting QMOI employment check...")
        
        try:
            # Check employment status
            self.check_employment_status()
            
            # Analyze employee performance
            self.analyze_employee_performance()
            
            # Analyze department performance
            self.analyze_department_performance()
            
            # Check employment trends
            self.check_employment_trends()
            
            # Check employment targets
            self.check_employment_targets()
            
            # Generate employment score
            self.generate_employment_score()
            
            # Save report
            self.save_employment_report()
            
            # Log results
            self.logger.info(f"Employment check completed. Status: {self.employment_report['employment_status']}")
            self.logger.info(f"Active employees: {self.employment_report['active_employees']}")
            self.logger.info(f"Total positions: {self.employment_report['total_positions']}")
            self.logger.info(f"Fill rate: {self.employment_report.get('fill_rate', 0):.1f}%")
            self.logger.info(f"Employment score: {self.employment_report.get('employment_score', 0)}")
            
            if self.employment_report["alerts"]:
                self.logger.warning(f"Employment alerts: {len(self.employment_report['alerts'])}")
            if self.employment_report["recommendations"]:
                self.logger.info(f"Employment recommendations: {len(self.employment_report['recommendations'])}")
            
            return self.employment_report
            
        except Exception as e:
            self.logger.error(f"Employment check failed: {str(e)}")
            self.employment_report["alerts"].append(f"Employment check failed: {str(e)}")
            self.save_employment_report()
            return self.employment_report

def main():
    """Main function"""
    monitor = QMOIEmploymentMonitor()
    report = monitor.run_employment_check()
    
    # Exit with error code if employment is poor
    if report["employment_status"] == "poor":
        sys.exit(1)
    elif report["employment_status"] == "fair":
        sys.exit(2)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main() 