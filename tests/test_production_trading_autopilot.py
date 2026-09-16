import os
import unittest

from scripts.trading.production_trading_autopilot import ProductionTradingAutopilot


class ProductionTradingAutopilotTests(unittest.TestCase):
    def setUp(self):
        os.environ['PRODUCTION_CONFIRMED'] = 'true'

    def tearDown(self):
        os.environ.pop('PRODUCTION_CONFIRMED', None)

    def test_health_status_reports_platforms(self):
        bot = ProductionTradingAutopilot()
        status = bot.health_status()
        self.assertTrue(status['production_confirmed'])
        self.assertIn('binance', status['platforms'])
        self.assertIn('bitget', status['platforms'])
        self.assertIn('cashon', status['platforms'])
        self.assertIn('capabilities', status['platforms']['binance'])
        self.assertIn('windows', status['platforms']['binance']['supported_devices'])

    def test_discovery_adds_sandbox_only_platform_without_live_authority(self):
        bot = ProductionTradingAutopilot()
        bot.discover_platforms(['kraken'])

        readiness = bot.platform_readiness('kraken')

        self.assertEqual(readiness['adapter'], 'generic')
        self.assertTrue(readiness['sandbox'])
        self.assertFalse(readiness['live_execution_allowed'])
        self.assertEqual(readiness['status'], 'sandbox-configured')
        self.assertIn('secure_secret_storage', readiness['required_permissions'])

    def test_configured_additional_platforms_are_discovered_from_environment(self):
        os.environ['QMOI_ADDITIONAL_PLATFORMS'] = 'okx, bybit'
        try:
            bot = ProductionTradingAutopilot()
            self.assertIn('okx', bot.supported_platforms())
            self.assertIn('bybit', bot.supported_platforms())
            self.assertFalse(bot.platform_readiness('okx')['live_execution_allowed'])
        finally:
            os.environ.pop('QMOI_ADDITIONAL_PLATFORMS', None)

    def test_build_trade_plan_rejects_low_confidence(self):
        bot = ProductionTradingAutopilot()
        with self.assertRaises(ValueError):
            bot.build_trade_plan(
                platform_name='binance',
                symbol='BTC/USDT',
                side='buy',
                price=60000,
                amount=0.02,
                confidence=0.69,
                rationale='Too risky',
            )

    def test_evaluate_execution_blocks_unconfirmed_production(self):
        os.environ.pop('PRODUCTION_CONFIRMED', None)
        bot = ProductionTradingAutopilot()
        decision = bot.build_trade_plan(
            platform_name='binance',
            symbol='BTC/USDT',
            side='buy',
            price=60000,
            amount=0.01,
            confidence=0.85,
            rationale='Dry run only',
        )
        result = bot.evaluate_execution(decision, wallet_balance=5000)
        self.assertFalse(result['allowed'])
        self.assertTrue(result.get('dry_run_only', False))

    def test_evaluate_execution_allows_within_limits_when_confirmed(self):
        bot = ProductionTradingAutopilot()
        decision = bot.build_trade_plan(
            platform_name='binance',
            symbol='BTC/USDT',
            side='buy',
            price=60000,
            amount=0.01,
            confidence=0.85,
            rationale='Within safe exposure',
        )
        result = bot.evaluate_execution(decision, wallet_balance=5000)
        self.assertTrue(result['allowed'])
        self.assertFalse(result.get('dry_run_only', True))

    def test_dashboard_snapshot_includes_ui_and_trading_status(self):
        bot = ProductionTradingAutopilot()
        snapshot = bot.build_dashboard_snapshot(wallet_balance=5000.0, market_status='stable')

        self.assertIn('trading_status', snapshot)
        self.assertIn('ui_sections', snapshot)
        self.assertIn('platforms', snapshot)
        self.assertIn('binance', snapshot['platforms'])
        self.assertIn('bitget', snapshot['platforms'])
        self.assertIn('cashon', snapshot['platforms'])
        self.assertIn('wallets', snapshot)
        self.assertTrue(snapshot['ui_sections']['trading'])
        self.assertIn('market_status', snapshot['trading_status'])

    def test_render_dashboard_html_includes_core_sections(self):
        bot = ProductionTradingAutopilot()
        html = bot.render_dashboard_html(wallet_balance=5000.0, market_status='stable')

        self.assertIn('QMOI Trading Dashboard', html)
        self.assertIn('Trading Overview', html)
        self.assertIn('Platform Status', html)
        self.assertIn('Wallets', html)
        self.assertIn('Risk Controls', html)


if __name__ == '__main__':
    unittest.main()
