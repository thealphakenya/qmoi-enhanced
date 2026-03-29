#!/usr/bin/env node

// QMOI Enhanced Production Balance Auto-Update System
// Complete production deployment with database, monitoring, and auto-updates
// INTEGRATED WITH QMOI CONSCIOUSNESS & VALIDATION SYSTEMS

import { BalanceDatabaseManager } from '../lib/balance/balance-database-manager';
import { BalanceMonitoringSystem } from '../lib/balance/balance-monitoring';
import { BalanceAutoUpdateSystem } from './balance-auto-update';
import { QMOIConsciousness } from '../lib/financial-consciousness';
import { promises as fs } from 'fs';
import path from 'path';

interface ProductionConfig {
  database: {
    host: string;
    user: string;
    password: string;
    database: string;
    port?: number;
  };
  monitoring: {
    enabled: boolean;
    intervalSeconds: number;
  };
  autoUpdate: {
    enabled: boolean;
    intervalSeconds: number;
  };
  qmoi: {
    enabled: boolean;
    validationIntervalSeconds: number;
  };
}

class QMOIProductionBalanceSystem {
  private config: ProductionConfig;
  private dbManager: BalanceDatabaseManager;
  private monitoringSystem: BalanceMonitoringSystem;
  private autoUpdateSystem: BalanceAutoUpdateSystem;
  private qmoiConsciousness: QMOIConsciousness;
  private isRunning: boolean = false;

  constructor(config: ProductionConfig) {
    this.config = config;
    this.dbManager = new BalanceDatabaseManager(config.database);
    this.monitoringSystem = new BalanceMonitoringSystem(this.dbManager);
    this.autoUpdateSystem = new BalanceAutoUpdateSystem();
    this.qmoiConsciousness = new QMOIConsciousness();
  }

  /**
   * Initialize the production system
   */
  async initialize(): Promise<void> {
    console.log('🚀 Initializing QMOI Production Balance System...');

    try {
      // Connect to database
      await this.dbManager.connect();
      console.log('✅ Database connected');

      // Initialize QMOI consciousness
      if (this.config.qmoi.enabled) {
        await this.qmoiConsciousness.initialize();
        console.log('✅ QMOI consciousness initialized');
      }

      // Initialize database schema if needed
      await this.initializeDatabaseSchema();
      console.log('✅ Database schema verified');

      console.log('🎯 QMOI Production Balance System initialized successfully');

    } catch (error) {
      console.error('❌ Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Start all production systems
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Production system already running');
      return;
    }

    this.isRunning = true;
    console.log('🦁 Starting QMOI Production Balance System...');

    try {
      // Start monitoring system
      if (this.config.monitoring.enabled) {
        await this.monitoringSystem.start();
        console.log('✅ Monitoring system started');
      }

      // Start auto-update system
      if (this.config.autoUpdate.enabled) {
        await this.autoUpdateSystem.start();
        console.log('✅ Auto-update system started');
      }

      // Start QMOI validation cycle
      if (this.config.qmoi.enabled) {
        this.startQMOIValidationCycle();
        console.log('✅ QMOI validation cycle started');
      }

      // Start production health checks
      this.startProductionHealthChecks();

      console.log('🎯 All QMOI Production Systems Started Successfully');
      console.log(`📊 Monitoring: ${this.config.monitoring.enabled ? 'ENABLED' : 'DISABLED'}`);
      console.log(`🔄 Auto-Update: ${this.config.autoUpdate.enabled ? 'ENABLED' : 'DISABLED'}`);
      console.log(`🧠 QMOI Validation: ${this.config.qmoi.enabled ? 'ENABLED' : 'DISABLED'}`);

    } catch (error) {
      console.error('❌ Failed to start production systems:', error);
      await this.stop();
      throw error;
    }
  }

  /**
   * Stop all production systems
   */
  async stop(): Promise<void> {
    console.log('🛑 Stopping QMOI Production Balance System...');

    this.isRunning = false;

    try {
      if (this.config.monitoring.enabled) {
        this.monitoringSystem.stop();
      }

      if (this.config.autoUpdate.enabled) {
        this.autoUpdateSystem.stop();
      }

      await this.dbManager.disconnect();

      console.log('✅ All systems stopped gracefully');

    } catch (error) {
      console.error('❌ Error during shutdown:', error);
    }
  }

  /**
   * Initialize database schema
   */
  private async initializeDatabaseSchema(): Promise<void> {
    const schemaPath = path.join(process.cwd(), 'database', 'balance-schema.sql');

    try {
      const schemaSQL = await fs.readFile(schemaPath, 'utf-8');

      // Split into individual statements and execute
      const statements = schemaSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          await this.dbManager['connection']!.execute(statement);
        }
      }

      console.log('📋 Database schema initialized');

    } catch (error) {
      console.error('❌ Failed to initialize database schema:', error);
      throw error;
    }
  }

  /**
   * Start QMOI validation cycle
   */
  private startQMOIValidationCycle(): void {
    const interval = this.config.qmoi.validationIntervalSeconds * 1000;

    setInterval(async () => {
      try {
        await this.performQMOIValidation();
      } catch (error) {
        console.error('❌ QMOI validation cycle failed:', error);
      }
    }, interval);

    // Initial validation
    setTimeout(async () => {
      await this.performQMOIValidation();
    }, 5000); // Start after 5 seconds
  }

  /**
   * Perform comprehensive QMOI validation
   */
  private async performQMOIValidation(): Promise<void> {
    console.log('🧠 Performing QMOI balance validation...');

    try {
      // Get all wallet balances
      const balances = await this.dbManager.getAllWalletBalances();

      // Perform QMOI validation on all balances
      const validationResults = await Promise.all(
        balances.map(async (balance) => {
          const result = await this.qmoiConsciousness.validateBalanceUpdate({
            walletId: balance.walletId,
            balanceType: balance.balanceType,
            previousAmount: balance.amount,
            newAmount: balance.amount, // Re-validation
            reason: 'Periodic QMOI validation'
          });

          return {
            ...balance,
            validationResult: result
          };
        })
      );

      // Update validation status in database
      for (const result of validationResults) {
        if (result.validationResult.isValid) {
          await this.dbManager['connection']!.execute(`
            UPDATE wallet_balances
            SET qmoi_validation_timestamp = NOW(),
                qmoi_validation_hash = ?
            WHERE wallet_id = ? AND balance_type = ?
          `, [
            result.validationResult.validationHash,
            result.walletId,
            result.balanceType
          ]);
        }
      }

      const validCount = validationResults.filter(r => r.validationResult.isValid).length;
      const totalCount = validationResults.length;

      console.log(`✅ QMOI validation completed: ${validCount}/${totalCount} balances validated`);

    } catch (error) {
      console.error('❌ QMOI validation failed:', error);
    }
  }

  /**
   * Start production health checks
   */
  private startProductionHealthChecks(): void {
    // Health check every 5 minutes
    setInterval(async () => {
      await this.performHealthCheck();
    }, 5 * 60 * 1000);

    // Initial health check
    setTimeout(async () => {
      await this.performHealthCheck();
    }, 10000);
  }

  /**
   * Perform comprehensive health check
   */
  private async performHealthCheck(): Promise<void> {
    try {
      console.log('🏥 Performing production health check...');

      const status = await this.monitoringSystem.getSystemStatus();
      const report = await this.monitoringSystem.generateReport();

      // Log health status
      if (status.status === 'healthy') {
        console.log('✅ System health: HEALTHY');
      } else if (status.status === 'warning') {
        console.log('⚠️ System health: WARNING');
      } else {
        console.log('🔴 System health: CRITICAL');
      }

      // Save health report
      const reportPath = path.join(process.cwd(), 'logs', 'health-report-latest.md');
      await fs.mkdir(path.dirname(reportPath), { recursive: true });
      await fs.writeFile(reportPath, report);

      // In a real system, you might send alerts or notifications here
      if (status.status === 'critical') {
        console.error('🚨 CRITICAL SYSTEM ALERT - Immediate attention required!');
      }

    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<any> {
    const monitoringStatus = await this.monitoringSystem.getSystemStatus();

    return {
      ...monitoringStatus,
      systems: {
        database: this.dbManager['connection'] !== null,
        monitoring: this.config.monitoring.enabled,
        autoUpdate: this.config.autoUpdate.enabled,
        qmoi: this.config.qmoi.enabled
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date()
    };
  }

  /**
   * Manual balance update (for testing/admin)
   */
  async manualBalanceUpdate(walletId: string, balanceType: string, amount: number, reason?: string): Promise<void> {
    await this.dbManager.updateWalletBalance({
      walletId,
      balanceType,
      amount,
      reason: reason || 'Manual update'
    });

    console.log(`✅ Manual balance update: ${walletId} ${balanceType} = ${amount}`);
  }

  /**
   * Force reconciliation for all wallets
   */
  async forceReconciliation(): Promise<void> {
    console.log('🔄 Forcing reconciliation for all wallets...');

    const wallets = await this.dbManager.getBalanceSummary();

    for (const wallet of wallets) {
      await this.dbManager.performReconciliation(wallet.wallet_id, 'daily');
    }

    console.log(`✅ Reconciliation completed for ${wallets.length} wallets`);
  }

  /**
   * Process pending auto-update triggers
   */
  async processPendingTriggers(): Promise<void> {
    await this.dbManager.processAutoUpdateTriggers();
    console.log('✅ Pending triggers processed');
  }
}

// Production configuration
const productionConfig: ProductionConfig = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'qmoi_user',
    password: process.env.DB_PASSWORD || 'secure_password',
    database: process.env.DB_NAME || 'qmoi_balances',
    port: parseInt(process.env.DB_PORT || '3306')
  },
  monitoring: {
    enabled: true,
    intervalSeconds: 30
  },
  autoUpdate: {
    enabled: true,
    intervalSeconds: 30
  },
  qmoi: {
    enabled: true,
    validationIntervalSeconds: 30
  }
};

// Main execution
async function main() {
  const system = new QMOIProductionBalanceSystem(productionConfig);

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received shutdown signal...');
    await system.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received termination signal...');
    await system.stop();
    process.exit(0);
  });

  try {
    // Initialize and start
    await system.initialize();
    await system.start();

    // Keep the process running
    console.log('🎯 QMOI Production Balance System is running...');
    console.log('Press Ctrl+C to stop');

    // Optional: Add command-line interface for manual operations
    if (process.argv.length > 2) {
      const command = process.argv[2];

      switch (command) {
        case 'status':
          const status = await system.getSystemStatus();
          console.log(JSON.stringify(status, null, 2));
          break;

        case 'reconcile':
          await system.forceReconciliation();
          break;

        case 'triggers':
          await system.processPendingTriggers();
          break;

        case 'update':
          if (process.argv.length >= 6) {
            const [,, walletId, balanceType, amountStr] = process.argv;
            const amount = parseFloat(amountStr);
            await system.manualBalanceUpdate(walletId, balanceType, amount);
          } else {
            console.log('Usage: npm run balance update <walletId> <balanceType> <amount>');
          }
          break;

        default:
          console.log('Available commands: status, reconcile, triggers, update');
      }

      await system.stop();
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Production system failed:', error);
    await system.stop();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { QMOIProductionBalanceSystem, ProductionConfig };