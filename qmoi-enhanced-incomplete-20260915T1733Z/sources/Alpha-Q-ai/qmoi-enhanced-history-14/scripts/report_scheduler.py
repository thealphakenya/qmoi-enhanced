#!/usr/bin/env python3
"""
Automated report generation task handler.
Coordinates reporting tasks and retries.
"""
import asyncio
import logging
from pathlib import Path
from datetime import datetime, timedelta

logger = logging.getLogger("report_scheduler")

class ReportScheduler:
    """Handles automated report generation and scheduling"""
    
    def __init__(self):
        self.root = Path(__file__).resolve().parents[1]
        self.schedule_file = self.root / '.qmoi_validation' / 'report_schedule.json'
    
    async def schedule_reports(self):
        """Schedule and manage report generation"""
        while True:
            try:
                # Run the enhanced wallet report
                process = await asyncio.create_subprocess_exec(
                    '/workspaces/qmoi-enhanced/.venv_qmoi_control/bin/python',
                    '/workspaces/qmoi-enhanced/scripts/enhanced_wallet_report.py',
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                stdout, stderr = await process.communicate()
                
                if process.returncode != 0:
                    logger.error(f"Report generation failed: {stderr.decode()}")
                else:
                    logger.info("Report generation completed successfully")
                
                # Wait for 15 minutes before next run
                await asyncio.sleep(900)
                
            except Exception as e:
                logger.error(f"Error in report scheduler: {e}")
                await asyncio.sleep(60)  # Wait a minute before retrying

async def main():
    """Main entry point"""
    scheduler = ReportScheduler()
    await scheduler.schedule_reports()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())