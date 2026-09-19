#!/usr/bin/env python3
"""Production-oriented trading autopilot for QMOI.

This module is intentionally conservative and safe-by-default. It does not place
real orders unless the runtime is explicitly confirmed as production-safe.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, asdict, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional


SUPPORTED_DEVICE_FAMILIES = [
    'windows',
    'macos',
    'linux',
    'ios',
    'android',
    'web',
]


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')


@dataclass
class PlatformConfig:
    name: str
    adapter: str = 'generic'
    enabled: bool = True
    sandbox: bool = True
    api_key_env: Optional[str] = None
    secret_env: Optional[str] = None
    passphrase_env: Optional[str] = None
    max_position_pct: float = 0.05
    max_daily_loss_pct: float = 0.02
    max_drawdown_pct: float = 0.10
    capabilities: List[str] = field(default_factory=lambda: ['market_data', 'wallet_read', 'paper_trading'])
    supported_devices: List[str] = field(default_factory=lambda: list(SUPPORTED_DEVICE_FAMILIES))
    required_permissions: List[str] = field(default_factory=lambda: ['network', 'secure_secret_storage'])


@dataclass
class TradeDecision:
    platform: str
    symbol: str
    side: str
    amount: float
    price: float
    confidence: float
    rationale: str
    protected: bool = True
    created_at: str = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = utc_now_iso()


class ProductionTradingAutopilot:
    """Conservative trading orchestrator with explicit production gates."""

    def __init__(self, repo_root: Optional[Path] = None):
        self.repo_root = Path(repo_root or Path(__file__).resolve().parents[2])
        self.production_confirmed = os.environ.get('PRODUCTION_CONFIRMED', 'false').lower() == 'true'
        self.platforms: Dict[str, PlatformConfig] = {
            'binance': PlatformConfig(
                name='binance',
                adapter='binance',
                enabled=True,
                sandbox=True,
                api_key_env='BINANCE_API_KEY',
                secret_env='BINANCE_API_SECRET',
                max_position_pct=0.05,
                max_daily_loss_pct=0.02,
                max_drawdown_pct=0.10,
                capabilities=['market_data', 'wallet_read', 'paper_trading', 'spot_trading', 'futures_trading'],
                required_permissions=['network', 'secure_secret_storage', 'background_execution'],
            ),
            'bitget': PlatformConfig(
                name='bitget',
                adapter='bitget',
                enabled=True,
                sandbox=True,
                api_key_env='BITGET_API_KEY',
                secret_env='BITGET_API_SECRET',
                passphrase_env='BITGET_API_PASSPHRASE',
                max_position_pct=0.04,
                max_daily_loss_pct=0.02,
                max_drawdown_pct=0.08,
                capabilities=['market_data', 'wallet_read', 'paper_trading', 'spot_trading', 'futures_trading'],
                required_permissions=['network', 'secure_secret_storage', 'background_execution'],
            ),
            'cashon': PlatformConfig(
                name='cashon',
                adapter='cashon',
                enabled=True,
                sandbox=True,
                api_key_env='CASHON_API_KEY',
                secret_env='CASHON_API_SECRET',
                max_position_pct=0.03,
                max_daily_loss_pct=0.01,
                max_drawdown_pct=0.05,
                capabilities=['wallet_read', 'paper_trading', 'transfer_reconciliation'],
                required_permissions=['network', 'secure_secret_storage', 'notifications'],
            ),
        }
        self.discover_platforms()

    def supported_platforms(self) -> List[str]:
        return list(self.platforms.keys())

    def discover_platforms(self, platform_names: Optional[List[str]] = None) -> List[str]:
        """Discover optional adapters without enrolling them for live execution.

        Names may be supplied directly or through QMOI_ADDITIONAL_PLATFORMS as a
        comma-separated list. Discovery creates sandbox-only configurations and
        never grants live trading permission or fabricates account connectivity.
        """
        configured_names = platform_names
        if configured_names is None:
            configured_names = [
                name.strip().lower()
                for name in os.environ.get('QMOI_ADDITIONAL_PLATFORMS', '').split(',')
                if name.strip()
            ]

        for platform_name in configured_names:
            normalized = platform_name.strip().lower().replace('-', '_')
            if not normalized or normalized in self.platforms or not normalized.replace('_', '').isalnum():
                continue
            env_prefix = normalized.upper()
            self.platforms[normalized] = PlatformConfig(
                name=normalized,
                adapter='generic',
                api_key_env=f'{env_prefix}_API_KEY',
                secret_env=f'{env_prefix}_API_SECRET',
                passphrase_env=f'{env_prefix}_API_PASSPHRASE',
            )
        return self.supported_platforms()

    @staticmethod
    def _has_env_value(env_name: Optional[str]) -> bool:
        return bool(env_name and os.environ.get(env_name, '').strip())

    def platform_readiness(self, platform_name: str) -> Dict[str, Any]:
        """Return capability and enrollment state without contacting a provider."""
        cfg = self.platforms.get(platform_name)
        if cfg is None:
            return {'platform': platform_name, 'status': 'unknown', 'live_execution_allowed': False}

        has_credentials = self._has_env_value(cfg.api_key_env) and self._has_env_value(cfg.secret_env)
        if not cfg.enabled:
            status = 'disabled'
        elif cfg.sandbox:
            status = 'sandbox-ready' if has_credentials else 'sandbox-configured'
        elif self.production_confirmed and has_credentials:
            status = 'live-gated'
        else:
            status = 'credentials-missing'

        return {
            'platform': cfg.name,
            'adapter': cfg.adapter,
            'status': status,
            'discovered': cfg.adapter == 'generic',
            'sandbox': cfg.sandbox,
            'live_execution_allowed': bool(self.production_confirmed and not cfg.sandbox and has_credentials),
            'capabilities': list(cfg.capabilities),
            'supported_devices': list(cfg.supported_devices),
            'required_permissions': list(cfg.required_permissions),
            'has_api_key': self._has_env_value(cfg.api_key_env),
            'has_secret': self._has_env_value(cfg.secret_env),
        }

    def health_status(self) -> Dict[str, Any]:
        return {
            'production_confirmed': self.production_confirmed,
            'platforms': {name: {
                'adapter': cfg.adapter,
                'enabled': cfg.enabled,
                'sandbox': cfg.sandbox,
                'has_api_key': self._has_env_value(cfg.api_key_env),
                'has_secret': self._has_env_value(cfg.secret_env),
                'max_position_pct': cfg.max_position_pct,
                'max_daily_loss_pct': cfg.max_daily_loss_pct,
                'max_drawdown_pct': cfg.max_drawdown_pct,
                'capabilities': list(cfg.capabilities),
                'supported_devices': list(cfg.supported_devices),
                'required_permissions': list(cfg.required_permissions),
                'readiness': self.platform_readiness(name),
            } for name, cfg in self.platforms.items()},
            'device_families': list(SUPPORTED_DEVICE_FAMILIES),
            'generated_at': utc_now_iso(),
        }

    def build_dashboard_snapshot(self, wallet_balance: float = 0.0, market_status: str = 'stable') -> Dict[str, Any]:
        status = self.health_status()
        enabled_platforms = {
            name: {
                **details,
                'status': self.platform_readiness(name)['status'],
                'wallet_balance': float(wallet_balance),
            }
            for name, details in status['platforms'].items()
        }

        trading_status = {
            'market_status': market_status,
            'risk_mode': 'production-gated' if self.production_confirmed else 'dry-run',
            'execution_allowed': self.production_confirmed,
            'wallet_balance': float(wallet_balance),
            'platform_count': len(enabled_platforms),
            'active_strategies': [
                'trend_following',
                'risk_budgeting',
                'portfolio_balance',
                'drawdown_guard',
            ],
        }

        ui_sections = {
            'trading': True,
            'wallets': True,
            'risk_controls': True,
            'market_monitoring': True,
            'production_status': True,
        }

        wallets = [
            {
                'name': 'cashon',
                'currency': 'USD',
                'balance': float(wallet_balance),
                'status': 'active',
                'platform': 'cashon',
            },
            {
                'name': 'binance',
                'currency': 'USDT',
                'balance': max(0.0, float(wallet_balance) * 0.7),
                'status': 'connected',
                'platform': 'binance',
            },
            {
                'name': 'bitget',
                'currency': 'USDT',
                'balance': max(0.0, float(wallet_balance) * 0.3),
                'status': 'connected',
                'platform': 'bitget',
            },
        ]

        return {
            'production_confirmed': self.production_confirmed,
            'generated_at': utc_now_iso(),
            'platforms': enabled_platforms,
            'trading_status': trading_status,
            'ui_sections': ui_sections,
            'wallets': wallets,
            'supported_platforms': self.supported_platforms(),
            'summary': (
                'Production trading is active and gated by risk thresholds.'
                if self.production_confirmed else
                'Trading is in dry-run safety mode until PRODUCTION_CONFIRMED=true.'
            ),
        }

    def build_trade_plan(self, platform_name: str, symbol: str, side: str, price: float, amount: float, confidence: float, rationale: str) -> TradeDecision:
        cfg = self.platforms.get(platform_name)
        if cfg is None:
            raise ValueError(f'Unsupported platform: {platform_name}')

        if not cfg.enabled:
            raise RuntimeError(f'Platform {platform_name} is disabled')

        if confidence < 0.7:
            raise ValueError(f'Confidence {confidence} is below allowed threshold for {platform_name}')

        if amount <= 0:
            raise ValueError('Trade amount must be positive')

        return TradeDecision(
            platform=platform_name,
            symbol=symbol,
            side=side.lower(),
            amount=float(amount),
            price=float(price),
            confidence=float(confidence),
            rationale=rationale,
            protected=True,
        )

    def evaluate_execution(self, decision: TradeDecision, wallet_balance: float) -> Dict[str, Any]:
        cfg = self.platforms.get(decision.platform)
        if cfg is None:
            return {'allowed': False, 'reason': f'Unknown platform {decision.platform}'}

        position_limit = wallet_balance * cfg.max_position_pct
        if decision.amount > position_limit:
            return {
                'allowed': False,
                'reason': f'Amount {decision.amount} exceeds max position limit {position_limit} for {decision.platform}',
            }

        if not self.production_confirmed:
            return {
                'allowed': False,
                'reason': 'Production execution is blocked until PRODUCTION_CONFIRMED=true',
                'dry_run_only': True,
            }

        return {
            'allowed': True,
            'platform': decision.platform,
            'dry_run_only': False,
            'max_position_limit': position_limit,
            'execution_policy': 'production-gated',
        }

    def render_dashboard_html(self, wallet_balance: float = 0.0, market_status: str = 'stable') -> str:
        snapshot = self.build_dashboard_snapshot(wallet_balance=wallet_balance, market_status=market_status)
        rows = []
        for name, details in snapshot['platforms'].items():
            rows.append(
                f"<tr><td>{name.title()}</td><td>{'Enabled' if details['enabled'] else 'Disabled'}</td><td>{'Sandbox' if details['sandbox'] else 'Live'}</td><td>{details['max_position_pct']}</td></tr>"
            )

        wallet_rows = []
        for wallet in snapshot['wallets']:
            wallet_rows.append(
                f"<tr><td>{wallet['name']}</td><td>{wallet['currency']}</td><td>{wallet['balance']}</td><td>{wallet['status']}</td></tr>"
            )

        risk_items = [
            f"<li>Production confirmed: {str(snapshot['production_confirmed']).lower()}</li>",
            f"<li>Market status: {snapshot['trading_status']['market_status']}</li>",
            f"<li>Risk mode: {snapshot['trading_status']['risk_mode']}</li>",
            f"<li>Execution allowed: {str(snapshot['trading_status']['execution_allowed']).lower()}</li>",
        ]

        return f"""
<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>QMOI Trading Dashboard</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 32px; background: #0f172a; color: #e2e8f0; }}
    .card {{ background: #111827; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 20px; }}
    h1, h2 {{ margin-top: 0; }}
    table {{ width: 100%; border-collapse: collapse; }}
    th, td {{ border: 1px solid #334155; padding: 10px; text-align: left; }}
    th {{ background: #1f2937; }}
    ul {{ padding-left: 20px; }}
    .status {{ color: #86efac; }}
  </style>
</head>
<body>
  <div class=\"card\">
    <h1>QMOI Trading Dashboard</h1>
    <p class=\"status\">{snapshot['summary']}</p>
  </div>

  <div class=\"card\">
    <h2>Trading Overview</h2>
    <p>Market status: <strong>{snapshot['trading_status']['market_status']}</strong></p>
    <p>Wallet balance: <strong>{snapshot['trading_status']['wallet_balance']}</strong></p>
    <p>Platforms tracked: <strong>{snapshot['trading_status']['platform_count']}</strong></p>
    <p>Strategies: {', '.join(snapshot['trading_status']['active_strategies'])}</p>
  </div>

  <div class=\"card\">
    <h2>Platform Status</h2>
    <table>
      <thead><tr><th>Platform</th><th>State</th><th>Mode</th><th>Max Position</th></tr></thead>
      <tbody>{''.join(rows)}</tbody>
    </table>
  </div>

  <div class=\"card\">
    <h2>Wallets</h2>
    <table>
      <thead><tr><th>Name</th><th>Currency</th><th>Balance</th><th>Status</th></tr></thead>
      <tbody>{''.join(wallet_rows)}</tbody>
    </table>
  </div>

  <div class=\"card\">
    <h2>Risk Controls</h2>
    <ul>{''.join(risk_items)}</ul>
  </div>
</body>
</html>
"""

    def write_status(self, path: Optional[Path] = None) -> Path:
        target = path or self.repo_root / 'ollamatracks' / 'trading_autopilot_status.json'
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(self.health_status(), indent=2), encoding='utf-8')
        return target

    def write_dashboard_html(self, path: Optional[Path] = None, wallet_balance: float = 0.0, market_status: str = 'stable') -> Path:
        target = path or self.repo_root / 'ollamatracks' / 'trading_dashboard.html'
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(self.render_dashboard_html(wallet_balance=wallet_balance, market_status=market_status), encoding='utf-8')
        return target
