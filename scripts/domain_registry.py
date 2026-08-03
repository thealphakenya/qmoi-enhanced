#!/usr/bin/env python3
"""Generate a domains registry JSON in dry-run mode.

Behavior:
- By default runs in dry-run and writes `.qmoi_validation/domains_registry.json` with discovered/default entries.
- Accepts --apply (no-op without provider creds).
"""
import argparse
import json
import os
import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(ROOT, ".qmoi_validation")

DEFAULT_REGISTRY = {
    "generated_at": None,
    "source": "domain_registry.py",
    "schema_version": "2.0",
    "domains": {
        "qmoi.ai": {
            "owner": "thealphakenya",
            "purpose": "production-primary",
            "status": "active",
            "billing_enabled": True,
            "revenue_settings": {
                "payment_gateways": ["stripe", "coinbase", "megavault"],
                "auto_renewal": True,
                "billing_cycle": "monthly"
            },
            "security": {
                "ssl": True,
                "ddos_protection": True,
                "access_control": {
                    "ip_whitelist": [],
                    "2fa_required": True
                }
            },
            "monitoring": {
                "uptime_check": True,
                "performance_tracking": True,
                "alert_thresholds": {
                    "response_time_ms": 500,
                    "error_rate_percent": 1.0
                }
            }
        },
        "api.qmoi.ai": {
            "owner": "thealphakenya",
            "purpose": "production-api",
            "status": "active",
            "billing_enabled": True,
            "api_settings": {
                "rate_limiting": True,
                "quota_management": True,
                "cors_enabled": True
            },
            "monitoring": {
                "request_tracking": True,
                "error_tracking": True,
                "performance_metrics": True
            }
        },
        "pay.qmoi.ai": {
            "owner": "thealphakenya",
            "purpose": "payments-gateway",
            "status": "active",
            "billing_enabled": True,
            "payment_settings": {
                "processors": ["stripe", "coinbase", "megavault"],
                "crypto_enabled": True,
                "fiat_enabled": True,
                "webhook_endpoints": {
                    "success": "/webhooks/payment/success",
                    "failure": "/webhooks/payment/failure"
                }
            },
            "security": {
                "ssl": True,
                "ddos_protection": True,
                "fraud_detection": True,
                "kyc_required": True
            }
        }
    },
    "wallet_integrations": {
        "megavault": {
            "enabled": True,
            "auto_settlement": True,
            "min_settlement": "100.00",
            "settlement_currency": "USD"
        },
        "cashon": {
            "enabled": True,
            "instant_payout": True,
            "fee_optimization": True
        },
        "bitget": {
            "enabled": True,
            "trading_enabled": True,
            "risk_management": {
                "max_position_size": "10000",
                "stop_loss_required": True
            }
        }
    },
    "revenue_optimization": {
        "auto_scaling": True,
        "smart_routing": True,
        "fee_optimization": True,
        "performance_targets": {
            "monthly_revenue": "100000.00",
            "transaction_fee_max": "2.5"
        }
    }
}


def ensure_out_dir():
    os.makedirs(OUT_DIR, exist_ok=True)


def validate_revenue_settings(domain_config):
    """Validate revenue and billing settings for a domain."""
    required_fields = [
        "billing_enabled",
        "status"
    ]
    
    warnings = []
    errors = []
    
    for field in required_fields:
        if field not in domain_config:
            errors.append(f"Missing required field: {field}")
    
    if domain_config.get("billing_enabled"):
        if "revenue_settings" not in domain_config:
            errors.append("Revenue settings required when billing is enabled")
        else:
            rev_settings = domain_config["revenue_settings"]
            if not rev_settings.get("payment_gateways"):
                errors.append("At least one payment gateway must be configured")
    
    return warnings, errors

def validate_wallet_integration(wallet_config):
    """Validate wallet integration settings."""
    required_fields = {
        "megavault": ["auto_settlement", "min_settlement"],
        "cashon": ["instant_payout", "fee_optimization"],
        "bitget": ["trading_enabled", "risk_management"]
    }
    
    warnings = []
    errors = []
    
    for wallet_type, fields in required_fields.items():
        if wallet_type in wallet_config:
            for field in fields:
                if field not in wallet_config[wallet_type]:
                    errors.append(f"Missing required field for {wallet_type}: {field}")
    
    return warnings, errors

def write_registry(registry, apply=False):
    """Write registry with enhanced validation and monitoring."""
    ensure_out_dir()
    path = os.path.join(OUT_DIR, "domains_registry.json")
    registry["generated_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    registry["applied"] = bool(apply)
    
    # Validate entire registry
    all_warnings = []
    all_errors = []
    
    # Validate domains
    for domain, config in registry.get("domains", {}).items():
        warnings, errors = validate_revenue_settings(config)
        if warnings:
            all_warnings.append(f"Domain {domain}: {'; '.join(warnings)}")
        if errors:
            all_errors.append(f"Domain {domain}: {'; '.join(errors)}")
    
    # Validate wallet integrations
    if "wallet_integrations" in registry:
        warnings, errors = validate_wallet_integration(registry["wallet_integrations"])
        all_warnings.extend(warnings)
        all_errors.extend(errors)
    
    # Write validation results
    validation_path = os.path.join(OUT_DIR, "domains_validation.json")
    validation_result = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "warnings": all_warnings,
        "errors": all_errors,
        "valid": len(all_errors) == 0
    }
    
    with open(validation_path, "w") as f:
        json.dump(validation_result, f, indent=2)
    
    # Only write registry if validation passes or not in apply mode
    if not all_errors or not apply:
        with open(path, "w") as f:
            json.dump(registry, f, indent=2)
        print(f"Wrote {path}")
        if all_warnings:
            print("\nWarnings:")
            for w in all_warnings:
                print(f"  - {w}")
    else:
        raise ValueError(f"Registry validation failed:\n" + "\n".join(all_errors))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--apply", action="store_true", help="Apply mode (requires provider creds).")
    p.add_argument("--source-file", help="Optional JSON to seed registry from.")
    args = p.parse_args()

    registry = DEFAULT_REGISTRY.copy()
    registry["generated_from"] = args.source_file or "builtin-default"

    if args.source_file:
        try:
            with open(args.source_file, "r") as f:
                data = json.load(f)
            registry["domains"].update(data.get("domains", {}))
        except Exception as e:
            print("Warning: failed to load source file:", e)

    if args.apply:
        # Safe guard: unless environment provides provider creds we stay dry-run
        if not os.environ.get("QMOI_PROVISION_DNS") or not os.environ.get("QMOI_ENABLE_BILLING"):
            print("--apply requested but gateway env vars not set. Performing dry-run write only.")
            write_registry(registry, apply=False)
            return

    write_registry(registry, apply=args.apply)


if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""Generate a domains registry JSON in dry-run mode.

Usage: python3 scripts/domain_registry.py [--apply]

Dry-run by default: writes .qmoi_validation/domains_registry.json with discovered doc sources.
If --apply is passed and QMOI_ALLOW_NETWORK=1 (and other creds present), this script may attempt
to validate domain ownership (NO network calls unless both apply and QMOI_ALLOW_NETWORK).
"""
import argparse
import json
import os
import re
from datetime import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(ROOT, ".qmoi_validation")
os.makedirs(OUT_DIR, exist_ok=True)


def discover_domain_docs(allmd_path):
    docs = []
    if not os.path.exists(allmd_path):
        return docs
    txt = open(allmd_path, "r", encoding="utf-8", errors="ignore").read()
    # simple heuristic: find filenames that contain 'DOM' or 'HOST' (case-insensitive)
    candidates = re.findall(r"- \[([^\]]+)\]", txt)
    for c in candidates:
        if re.search(r"DOM|HOST|LINK", c, re.IGNORECASE):
            docs.append(c)
    return sorted(set(docs))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Apply network checks (gated by QMOI_ALLOW_NETWORK)")
    args = parser.parse_args()

    allmd = os.path.join(ROOT, "ALLMDFILESREFS.md")
    sources = discover_domain_docs(allmd)

    registry = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "sources": sources,
        "domains": [],
        "notes": "dry-run generated; run with --apply and QMOI_ALLOW_NETWORK=1 for live checks",
    }

    out_path = os.path.join(OUT_DIR, "domains_registry.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2)

    print(f"Wrote {out_path} (dry-run) with {len(sources)} source docs")


if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""Manage a canonical domain registry for the repo.

Safe, dry-run-first tool. Writes .qmoi_validation/domains_registry.json. Use --apply to persist domains.json.
"""
from pathlib import Path
import json
import argparse
import datetime
import os


ROOT = Path(__file__).resolve().parents[1]
QM_VAL = ROOT / ".qmoi_validation"
QM_VAL.mkdir(exist_ok=True)


def load_domains(domains_path: Path):
    if domains_path.exists():
        try:
            return json.loads(domains_path.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def write_registry(registry: dict, dry_run: bool):
    out = QM_VAL / "domains_registry.json"
    payload = {
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "dry_run": dry_run,
        "registry": registry,
    }
    out.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {out} (dry_run={dry_run})")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--domains-file", default=str(ROOT / "domains.json"))
    p.add_argument("--apply", action="store_true", help="Persist default domains.json if missing")
    args = p.parse_args()

    domains_path = Path(args.domains_file)
    registry = load_domains(domains_path)

    if not registry:
        # create a safe template
        registry = {
            "projects": {},
            "notes": "This is a template registry. Run with --apply to write domains.json.",
        }

    # Always write validation artifact (dry-run unless --apply)
    write_registry(registry, dry_run=not args.apply)

    if args.apply:
        # persist canonical domains.json if missing or empty
        if not domains_path.exists() or domains_path.stat().st_size == 0:
            domains_path.write_text(json.dumps(registry, indent=2), encoding="utf-8")
            print(f"Persisted {domains_path}")
        else:
            print(f"{domains_path} already exists; --apply will not overwrite existing file.")


if __name__ == "__main__":
    main()
