"""
production Revenue System Module
Real production revenue collection and management system.
"""

import asyncio
import os
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from scripts.database_manager import ProductionDatabaseManager
from scripts.api_client import ProductionAPIClient
from scripts.logging_system import ProductionLogger

logger = logging.getLogger(__name__)

class ProductionRevenueSystem:
    """production revenue collection and management system"""

    def __init__(self):
        self.db = ProductionDatabaseManager()
        self.api_client = ProductionAPIClient(
            base_url=os.getenv('REVENUE_API_URL', 'https://api.qmoi.ai'),
            api_key=os.getenv('REVENUE_API_KEY')
        )
        self.logger = ProductionLogger.get_instance('revenue_system')

    async def collect_revenue_async(self) -> Dict[str, Any]:
        """Asynchronously collect revenue from multiple sources"""
        try:
            tasks = [
                self._collect_subscription_revenue(),
                self._collect_transaction_revenue(),
                self._collect_advertising_revenue(),
                self._collect_affiliate_revenue()
            ]

            results = await asyncio.gather(*tasks, return_exceptions=True)
            total_revenue = 0
            revenue_breakdown = {}

            for result in results:
                if isinstance(result, Exception):
                    logger.error(f"Revenue collection error: {result}")
                    continue
                if isinstance(result, dict):
                    for source, amount in result.items():
                        total_revenue += amount
                        revenue_breakdown[source] = revenue_breakdown.get(source, 0) + amount

            await self._store_revenue_data(total_revenue, revenue_breakdown)

            return {
                'total_revenue': total_revenue,
                'breakdown': revenue_breakdown,
                'timestamp': datetime.now().isoformat(),
                'status': 'success'
            }

    
    except Exception as e:
            logger.error(f"Revenue collection failed: {e}")
            raise

    async def _collect_subscription_revenue(self) -> Dict[str, float]:
        """Collect subscription-based revenue"""
        try:
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.api_client.get('/subscriptions/revenue')
            )
            return {'subscriptions': response.get('amount', 0.0)}
    
    except Exception as e:
            logger.error(f"Subscription revenue collection failed: {e}")
            return {'subscriptions': 0.0}

    async def _collect_transaction_revenue(self) -> Dict[str, float]:
        """Collect transaction-based revenue"""
        try:
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.api_client.get('/transactions/revenue')
            )
            return {'transactions': response.get('amount', 0.0)}
    
    except Exception as e:
            logger.error(f"Transaction revenue collection failed: {e}")
            return {'transactions': 0.0}

    async def _collect_advertising_revenue(self) -> Dict[str, float]:
        """Collect advertising revenue"""
        try:
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.api_client.get('/advertising/revenue')
            )
            return {'advertising': response.get('amount', 0.0)}
    
    except Exception as e:
            logger.error(f"Advertising revenue collection failed: {e}")
            return {'advertising': 0.0}

    async def _collect_affiliate_revenue(self) -> Dict[str, float]:
        """Collect affiliate revenue"""
        try:
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.api_client.get('/affiliate/revenue')
            )
            return {'affiliate': response.get('amount', 0.0)}
    
    except Exception as e:
            logger.error(f"Affiliate revenue collection failed: {e}")
            return {'affiliate': 0.0}

    async def _store_revenue_data(self, total: float, breakdown: Dict[str, float]) -> None:
        """Store revenue data in database"""
        try:
            def store_data():
                query = """
                INSERT INTO revenue_data (timestamp, total_amount, breakdown, created_at)
                VALUES (?, ?, ?, ?)
                """
                params = (
                    datetime.now().isoformat(),
                    total,
                    json.dumps(breakdown),
                    datetime.now().isoformat()
                )
                self.db.execute_update(query, params)

            await asyncio.get_event_loop().run_in_executor(None, store_data)
            logger.info(f"Stored revenue data: ${total}")
    
    except Exception as e:
            logger.error(f"Failed to store revenue data: {e}")
            raise

    def get_revenue_report(self, days: int = 30) -> Dict[str, Any]:
        """Get revenue report for specified period"""
        try:
            cutoff_date = (datetime.now() - timedelta(days=days)).isoformat()
            query = """
            SELECT timestamp, total_amount, breakdown
            FROM revenue_data
            WHERE timestamp >= ?
            ORDER BY timestamp DESC
            """
            results = self.db.execute_query(query, (cutoff_date,))
            total_revenue = sum(row['total_amount'] for row in results)
            daily_breakdown = {}
            for row in results:
                date = row['timestamp'][:10]
                daily_breakdown[date] = daily_breakdown.get(date, 0) + row['total_amount']
            return {
                'total_revenue': total_revenue,
                'daily_breakdown': daily_breakdown,
                'record_count': len(results),
                'period_days': days
            }
    
    except Exception as e:
            logger.error(f"Failed to get revenue report: {e}")
            return {'error': str(e)}

    def process_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a payment"""
        try:
            required_fields = ['amount', 'currency', 'payment_method']
            for field in required_fields:
                if field not in payment_data:
                    raise ValueError(f"Missing required field: {field}")
            response = self.api_client.post('/payments/process', payment_data)
            payment_record = {
                'payment_id': response.get('payment_id'),
                'amount': payment_data['amount'],
                'currency': payment_data['currency'],
                'status': response.get('status', 'processed'),
                'timestamp': datetime.now().isoformat()
            }
            query = """
            INSERT INTO payments (payment_id, amount, currency, status, timestamp)
            VALUES (?, ?, ?, ?, ?)
            """
            params = (
                payment_record['payment_id'],
                payment_record['amount'],
                payment_record['currency'],
                payment_record['status'],
                payment_record['timestamp']
            )
            self.db.execute_update(query, params)
            logger.info(f"Processed payment: {payment_record['payment_id']}")
            return payment_record
    
    except Exception as e:
            logger.error(f"Payment processing failed: {e}")
            raise

    def get_payment_history(self, user_id: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Get payment history"""
        try:
            if user_id:
                query = """
                SELECT * FROM payments
                WHERE user_id = ?
                ORDER BY timestamp DESC
                LIMIT ?
                """
                params = (user_id, limit)
            else:
                query = """
                SELECT * FROM payments
                ORDER BY timestamp DESC
                LIMIT ?
                """
                params = (limit,)
            results = self.db.execute_query(query, params)
            return results
    
    except Exception as e:
            logger.error(f"Failed to get payment history: {e}")
            return []

    def calculate_revenue_metrics(self) -> Dict[str, Any]:
        """Calculate revenue metrics and KPIs"""
        try:
            report = self.get_revenue_report(30)
            if 'error' in report:
                raise Exception(report['error'])
            daily_revenue = report['daily_breakdown']
            total_revenue = report['total_revenue']
            days_with_revenue = len([d for d in daily_revenue.values() if d > 0])
            avg_daily_revenue = total_revenue / 30 if 30 > 0 else 0
            revenue_per_active_day = total_revenue / days_with_revenue if days_with_revenue > 0 else 0
            return {
                'total_revenue_30d': total_revenue,
                'avg_daily_revenue': avg_daily_revenue,
                'revenue_per_active_day': revenue_per_active_day,
                'active_days': days_with_revenue,
                'total_days': 30,
                'activity_rate': days_with_revenue / 30 * 100
            }
    
    except Exception as e:
            logger.error(f"Failed to calculate revenue metrics: {e}")
            return {'error': str(e)}