#!/usr/bin/env python3
"""
QMOI Revenue Monitor
Monitors revenue generation and performance
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


class QMOIRevenueMonitor:
    def __init__(self):
        self.logger = self._setup_logging()
        self.qmoi_system = QMOIEnhancedSystem()
        self.revenue_report = {
            "timestamp": datetime.now().isoformat(),
            "revenue_status": "unknown",
            "daily_revenue": 0,
            "target_revenue": 100000,
            "revenue_streams": {},
            "performance_metrics": {},
            "alerts": [],
            "recommendations": [],
        }

    def _setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler("logs/revenue_monitor.log"),
                logging.StreamHandler(),
            ],
        )
        return logging.getLogger(__name__)

    def check_revenue_status(self):
        """Check current revenue status"""
        try:
            revenue_data = self.qmoi_system.get_revenue_status()

            if revenue_data:
                self.revenue_report["daily_revenue"] = revenue_data.get(
                    "daily_revenue", 0
                )
                self.revenue_report["target_revenue"] = revenue_data.get(
                    "target_revenue", 100000
                )
                self.revenue_report["revenue_streams"] = revenue_data.get(
                    "revenue_streams", {}
                )

                # Calculate performance percentage
                if self.revenue_report["target_revenue"] > 0:
                    performance_percent = (
                        self.revenue_report["daily_revenue"]
                        / self.revenue_report["target_revenue"]
                    ) * 100
                else:
                    performance_percent = 0

                self.revenue_report["performance_metrics"][
                    "performance_percent"
                ] = performance_percent

            else:
                self.revenue_report["alerts"].append("Revenue data not available")

        except Exception as e:
            self.revenue_report["alerts"].append(
                f"Revenue status check failed: {str(e)}"
            )

    def analyze_revenue_streams(self):
        """Analyze individual revenue streams"""
        revenue_streams = self.revenue_report["revenue_streams"]

        for stream_name, stream_data in revenue_streams.items():
            try:
                current_revenue = stream_data.get("current_revenue", 0)
                target_revenue = stream_data.get("target_revenue", 0)

                if target_revenue > 0:
                    stream_performance = (current_revenue / target_revenue) * 100
                else:
                    stream_performance = 0

                # Update stream data with performance metrics
                revenue_streams[stream_name]["performance_percent"] = stream_performance
                revenue_streams[stream_name]["status"] = self._get_stream_status(
                    stream_performance
                )

                # Generate alerts for underperforming streams
                if stream_performance < 50:
                    self.revenue_report["alerts"].append(
                        f"Revenue stream {stream_name} underperforming: {stream_performance:.1f}%"
                    )
                    self.revenue_report["recommendations"].append(
                        f"Optimize {stream_name} revenue generation"
                    )

            except Exception as e:
                self.revenue_report["alerts"].append(
                    f"Analysis failed for stream {stream_name}: {str(e)}"
                )

    def _get_stream_status(self, performance_percent):
        """Get status for a revenue stream based on performance"""
        if performance_percent >= 100:
            return "exceeding_target"
        elif performance_percent >= 80:
            return "meeting_target"
        elif performance_percent >= 50:
            return "moderate"
        else:
            return "underperforming"

    def check_revenue_trends(self):
        """Check revenue trends over time"""
        try:
            # Load historical revenue data
            history_file = Path("logs/revenue_history.json")
            if history_file.exists():
                with open(history_file, "r") as f:
                    historical_data = json.load(f)

                if len(historical_data) >= 2:
                    # Calculate trend
                    recent_data = historical_data[-5:]  # Last 5 data points
                    revenue_values = [d.get("daily_revenue", 0) for d in recent_data]

                    if len(revenue_values) >= 2:
                        trend = (
                            "increasing"
                            if revenue_values[-1] > revenue_values[0]
                            else "decreasing"
                        )
                        growth_rate = (
                            (
                                (revenue_values[-1] - revenue_values[0])
                                / revenue_values[0]
                            )
                            * 100
                            if revenue_values[0] > 0
                            else 0
                        )

                        self.revenue_report["performance_metrics"]["trend"] = trend
                        self.revenue_report["performance_metrics"][
                            "growth_rate"
                        ] = growth_rate

                        # Alert for declining revenue
                        if trend == "decreasing" and abs(growth_rate) > 10:
                            self.revenue_report["alerts"].append(
                                f"Revenue declining: {abs(growth_rate):.1f}% decrease"
                            )
                            self.revenue_report["recommendations"].append(
                                "Investigate revenue decline and implement corrective measures"
                            )

        except Exception as e:
            self.revenue_report["alerts"].append(
                f"Revenue trend analysis failed: {str(e)}"
            )

    def check_revenue_targets(self):
        """Check if revenue targets are being met"""
        daily_revenue = self.revenue_report["daily_revenue"]
        target_revenue = self.revenue_report["target_revenue"]

        if daily_revenue >= target_revenue:
            self.revenue_report["revenue_status"] = "meeting_target"
            self.revenue_report["performance_metrics"]["target_status"] = "achieved"
        elif daily_revenue >= target_revenue * 0.8:
            self.revenue_report["revenue_status"] = "near_target"
            self.revenue_report["performance_metrics"]["target_status"] = "near"
            self.revenue_report["alerts"].append(
                f"Revenue near target: ${daily_revenue} vs ${target_revenue}"
            )
        else:
            self.revenue_report["revenue_status"] = "below_target"
            self.revenue_report["performance_metrics"]["target_status"] = "below"
            self.revenue_report["alerts"].append(
                f"Revenue below target: ${daily_revenue} vs ${target_revenue}"
            )
            self.revenue_report["recommendations"].append(
                "Implement revenue optimization strategies"
            )

    def generate_revenue_score(self):
        """Generate overall revenue performance score"""
        score = 100

        # Base score on target achievement
        performance_percent = self.revenue_report["performance_metrics"].get(
            "performance_percent", 0
        )
        score = min(100, performance_percent)

        # Deduct points for alerts
        score -= len(self.revenue_report["alerts"]) * 5

        # Deduct points for underperforming streams
        underperforming_streams = sum(
            1
            for stream in self.revenue_report["revenue_streams"].values()
            if stream.get("status") == "underperforming"
        )
        score -= underperforming_streams * 10

        # Ensure score doesn't go below 0
        score = max(0, score)

        self.revenue_report["performance_metrics"]["revenue_score"] = score

        # Set revenue status based on score
        if score >= 90:
            self.revenue_report["revenue_status"] = "excellent"
        elif score >= 75:
            self.revenue_report["revenue_status"] = "good"
        elif score >= 50:
            self.revenue_report["revenue_status"] = "fair"
        else:
            self.revenue_report["revenue_status"] = "poor"

    def save_revenue_report(self):
        """Save revenue report to file"""
        try:
            # Ensure logs directory exists
            Path("logs").mkdir(exist_ok=True)

            # Save detailed report
            with open("logs/revenue_report.json", "w") as f:
                json.dump(self.revenue_report, f, indent=2)

            # Save to history
            history_file = Path("logs/revenue_history.json")
            historical_data = []

            if history_file.exists():
                with open(history_file, "r") as f:
                    historical_data = json.load(f)

            # Add current data to history
            current_data = {
                "timestamp": self.revenue_report["timestamp"],
                "daily_revenue": self.revenue_report["daily_revenue"],
                "target_revenue": self.revenue_report["target_revenue"],
                "revenue_score": self.revenue_report["performance_metrics"].get(
                    "revenue_score", 0
                ),
            }

            historical_data.append(current_data)

            # Keep only last 1000 entries
            if len(historical_data) > 1000:
                historical_data = historical_data[-1000:]

            with open(history_file, "w") as f:
                json.dump(historical_data, f, indent=2)

            # Save summary report
            summary = {
                "timestamp": self.revenue_report["timestamp"],
                "revenue_status": self.revenue_report["revenue_status"],
                "daily_revenue": self.revenue_report["daily_revenue"],
                "target_revenue": self.revenue_report["target_revenue"],
                "revenue_score": self.revenue_report["performance_metrics"].get(
                    "revenue_score", 0
                ),
                "alerts_count": len(self.revenue_report["alerts"]),
                "recommendations_count": len(self.revenue_report["recommendations"]),
            }

            with open("logs/revenue_summary.json", "w") as f:
                json.dump(summary, f, indent=2)

            self.logger.info(
                f"Revenue report saved. Score: {self.revenue_report['performance_metrics'].get('revenue_score', 0)}"
            )

        except Exception as e:
            self.logger.error(f"Failed to save revenue report: {str(e)}")

    def run_revenue_check(self):
        """Run complete revenue check"""
        self.logger.info("Starting QMOI revenue check...")

        try:
            # Check revenue status
            self.check_revenue_status()

            # Analyze revenue streams
            self.analyze_revenue_streams()

            # Check revenue trends
            self.check_revenue_trends()

            # Check revenue targets
            self.check_revenue_targets()

            # Generate revenue score
            self.generate_revenue_score()

            # Save report
            self.save_revenue_report()

            # Log results
            self.logger.info(
                f"Revenue check completed. Status: {self.revenue_report['revenue_status']}"
            )
            self.logger.info(
                f"Daily revenue: ${self.revenue_report['daily_revenue']:,}"
            )
            self.logger.info(
                f"Target revenue: ${self.revenue_report['target_revenue']:,}"
            )
            self.logger.info(
                f"Revenue score: {self.revenue_report['performance_metrics'].get('revenue_score', 0)}"
            )

            if self.revenue_report["alerts"]:
                self.logger.warning(
                    f"Revenue alerts: {len(self.revenue_report['alerts'])}"
                )
            if self.revenue_report["recommendations"]:
                self.logger.info(
                    f"Revenue recommendations: {len(self.revenue_report['recommendations'])}"
                )

            return self.revenue_report

        except Exception as e:
            self.logger.error(f"Revenue check failed: {str(e)}")
            self.revenue_report["alerts"].append(f"Revenue check failed: {str(e)}")
            self.save_revenue_report()
            return self.revenue_report


def main():
    """Main function"""
    monitor = QMOIRevenueMonitor()
    report = monitor.run_revenue_check()

    # Exit with error code if revenue is poor
    if report["revenue_status"] == "poor":
        sys.exit(1)
    elif report["revenue_status"] == "fair":
        sys.exit(2)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
