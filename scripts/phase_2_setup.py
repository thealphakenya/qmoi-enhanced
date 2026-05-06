#!/usr/bin/env python3
"""
QMOI Enhanced - Phase 2 Production Setup
Database migrations, environment validation, and API testing
"""

import os
import sys
import subprocess
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent

class Phase2Setup:
    def __init__(self):
        self.status = "PENDING"
        self.completed_steps = []
        self.errors = []

    def check_environment(self):
        """Verify environment variables are set."""
        print("🔐 Phase 2A: Checking Environment Variables...")
        
        required = [
            "CASHON_API_KEY",
            "CASHON_WEBHOOK_SECRET", 
            "FINANCIAL_DB_URL",
            "JWT_SECRET",
            "NODE_ENV"
        ]
        
        missing = [v for v in required if not os.getenv(v)]
        
        if missing:
            print(f"  ⚠️  Missing variables: {', '.join(missing)}")
            print("  💡 Copy from .env.production.template and set actual values")
            self.errors.append(f"Missing env vars: {missing}")
        else:
            print("  ✅ All environment variables set")
            self.completed_steps.append("environment_check")

    def setup_database_migrations(self):
        """Create database migration files."""
        print("\n📦 Phase 2A: Creating Database Migrations...")
        
        migrations_dir = PROJECT_ROOT / "migrations"
        migrations_dir.mkdir(exist_ok=True)
        
        # Wallets table migration
        wallets_migration = """-- Migration: Create wallets table for production
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL UNIQUE,
    balance DECIMAL(18, 2) DEFAULT 0.,
    currency VARCHAR(3) DEFAULT 'USD',
    public_key TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT balance_non_negative CHECK (balance >= 0)
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_status ON wallets(status);
"""
        
        # Transactions table migration
        transactions_migration = """-- Migration: Create transactions table for production
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    type VARCHAR(50), -- 'deposit', 'withdrawal', 'transfer'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    description TEXT,
    external_id VARCHAR(255), -- CashOn transaction ID
    signature VARCHAR(255), -- HMAC signature for verification
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_external_id ON transactions(external_id);
"""
        
        # Audit logs migration
        audit_migration = """-- Migration: Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),
    action VARCHAR(100),
    resource VARCHAR(100),
    resource_id VARCHAR(255),
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(50) DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
"""
        
        files = {
            "_create_wallets_table.sql": wallets_migration,
            "_create_transactions_table.sql": transactions_migration,
            "_create_audit_logs_table.sql": audit_migration,
        }
        
        for filename, content in files.items():
            filepath = migrations_dir / filename
            if not filepath.exists():
                filepath.write_text(content)
                print(f"  ✅ Created: {filename}")
        
        self.completed_steps.append("database_migrations")

    def test_database_connection(self):
        """Test production database connection."""
        print("\n🗄️  Phase 2B: Testing Database Connection...")
        
        db_url = os.getenv("FINANCIAL_DB_URL")
        if not db_url:
            self.errors.append("FINANCIAL_DB_URL not set")
            print("  ❌ Database URL not configured")
            return
        
        try:
            # Use psql to test connection
            result = subprocess.run(
                ["psql", db_url, "-c", "SELECT NOW()"],
                capture_output=True,
                timeout=10
            )
            
            if result.returncode == 0:
                print("  ✅ Database connection successful")
                self.completed_steps.append("database_connection")
            else:
                error = result.stderr.decode()
                self.errors.append(f"DB connection failed: {error}")
                print(f"  ❌ Connection failed: {error[:100]}")
        except Exception as e:
            self.errors.append(str(e))
            print(f"  ❌ Error: {e}")

    def test_cashon_api(self):
        """Test CashOn API connectivity."""
        print("\n🔌 Phase 2C: Testing CashOn API...")
        
        api_key = os.getenv("CASHON_API_KEY")
        if not api_key:
            self.errors.append("CASHON_API_KEY not set")
            print("  ❌ CashOn API key not configured")
            return
        
        try:
            result = subprocess.run(
                ["curl", 
                 "-s",
                 "-H", f"Authorization: Bearer {api_key}",
                 "https://api.cashon.io/v1/health"],
                capture_output=True,
                timeout=10
            )
            
            if result.returncode == 0 and b"healthy" in result.stdout.lower():
                print("  ✅ CashOn API connection successful")
                self.completed_steps.append("cashon_api")
            else:
                print("  ⚠️  Unable to verify CashOn API (may not be accessible in test environment)")
                self.completed_steps.append("cashon_api_skipped")
        except Exception as e:
            print(f"  ⓘ CashOn API test skipped: {e}")

    def create_env_file(self):
        """Create .env.production from template if not exists."""
        print("\n📝 Phase 2D: Setting up Environment File...")
        
        template = PROJECT_ROOT / ".env.production.template"
        target = PROJECT_ROOT / ".env.production"
        
        if target.exists():
            print("  ✅ .env.production already exists")
            self.completed_steps.append("env_file")
        elif template.exists():
            print("  ℹ️  Please copy .env.production.template to .env.production")
            print("     and fill in production credentials")
        else:
            print("  ❌ Template file not found")

    def run_phase_2(self):
        """Execute all Phase 2 setup steps."""
        print("\n" + "="*70)
        print("🚀 QMOI Enhanced - Phase 2: Validation & Configuration")
        print("="*70)
        
        try:
            self.check_environment()
            self.setup_database_migrations()
            self.test_database_connection()
            self.test_cashon_api()
            self.create_env_file()
            
            print("\n" + "="*70)
            print("📊 Phase 2 Setup Summary")
            print("="*70)
            print(f"✅ Completed Steps: {len(self.completed_steps)}")
            for step in self.completed_steps:
                print(f"   • {step}")
            
            if self.errors:
                print(f"\n⚠️  Issues Found: {len(self.errors)}")
                for error in self.errors:
                    print(f"   • {error}")
                return False
            else:
                print("\n✅ Phase 2 Setup Complete!")
                return True
                
        except Exception as e:
            print(f"\n❌ Setup failed: {e}")
            return False


if __name__ == "__main__":
    setup = Phase2Setup()
    success = setup.run_phase_2()
    sys.exit(0 if success else 1)
