#!/usr/bin/env node

// QMOI Enhanced production Balance Auto-Update System
// production Deployment: Runs the Q/BALANCES.md auto-update system in production
// INTEGRATED WITH QMOI CONSCIOUSNESS & VALIDATION SYSTEMS

import { QBalancesAutoUpdateSystem } from './q-balances-auto-update';
import { promises as fs } from 'fs';
import path from 'path';

class productionQBalancesManager {
  private updateSystem: QBalancesAutoUpdateSystem;
  private isRunning: boolean = false;
  private healthCheckInterval: number = 60000; // 1 minute
  private healthCheckTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.updateSystem = new QBalancesAutoUpdateSystem();
  }

  /**
   * Start the production Q/BALANCES.md auto-update system
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('🦁 production Q/BALANCES.md system already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting QMOI production Q/BALANCES.md Auto-Update System...');

    try {
      // Ensure q/ directory exists
      await this.ensureQDirectory();

      // Start the auto-update system
      await this.updateSystem.start();

      // Start health monitoring
      this.startHealthMonitoring();

      // Set up graceful shutdown
      this.setupGracefulShutdown();

      console.log('✅ production Q/BALANCES.md system started successfully');
      console.log('📊 Monitoring active - Health checks every 60 seconds');
      console.log('🔄 Auto-updates active - BALANCES.md updates every 30 seconds');

    } catch (error) {
      console.error('❌ Failed to start production Q/BALANCES.md system:', error);
      process.exit(1);
    }
  }

  /**
   * Stop the production system
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log('🛑 Stopping production Q/BALANCES.md system...');

    this.isRunning = false;

    // Stop health monitoring
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }

    // Stop the update system
    this.updateSystem.stop();

    console.log('✅ production Q/BALANCES.md system stopped');
  }

  /**
   * Ensure the q/ directory exists
   */
  private async ensureQDirectory(): Promise<void> {
    const qDir = path.join(process.cwd(), 'q');

    try {
      await fs.access(qDir);
    } catch {
      console.log('📁 Creating q/ directory...');
      await fs.mkdir(qDir, { recursive: true });
    }

    // Ensure BALANCES.md exists with initial content
    const balancesPath = path.join(qDir, 'BALANCES.md');
    try {
      await fs.access(balancesPath);
    } catch {
      console.log('📄 Creating initial BALANCES.md...');
      const initialContent = `# QMOI Enhanced - Balance Tracking System

**Status**: Initializing...
**QMOI Validation**: Pending...
**Last Updated**: ${new Date().toISOString()}

System starting up. Please wait for first auto-update...
`;
      await fs.writeFile(balancesPath, initialContent, 'utf-8');
    }
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    this.healthCheckTimer = setInterval(async () => {
      await this.performHealthCheck();
    }, this.healthCheckInterval);
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(): Promise<void> {
    try {
      const balancesPath = path.join(process.cwd(), 'q', 'BALANCES.md');
      const stats = await fs.stat(balancesPath);

      const now = Date.now();
      const lastModified = stats.mtime.getTime();
      const age = now - lastModified;

      // Check if file was updated within last 60 seconds
      if (age > 60000) {
        console.warn('⚠️  Q/BALANCES.md not updated recently. Age:', Math.round(age / 1000), 'seconds');
      } else {
        console.log('✅ Q/BALANCES.md health check passed. Last update:', Math.round(age / 1000), 'seconds ago');
      }

    } catch (error) {
      console.error('❌ Q/BALANCES.md health check failed:', error);
    }
  }

  /**
   * Setup graceful shutdown
   */
  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      await this.stop();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGUSR2', () => shutdown('SIGUSR2')); // nodemon restart

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      this.stop().finally(() => process.exit(1));
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      this.stop().finally(() => process.exit(1));
    });
  }

  /**
   * Get system status
   */
  getStatus(): { isRunning: boolean; uptime: number } {
    return {
      isRunning: this.isRunning,
      uptime: process.uptime()
    };
  }
}

// production startup
async function main() {
  console.log('🦁 QMOI Enhanced - production Q/BALANCES.md Auto-Update System');
  console.log('====================================================');

  const manager = new productionQBalancesManager();

  try {
    await manager.start();

    // Keep the process running
    setInterval(() => {
      const status = manager.getStatus();
      if (!status.isRunning) {
        console.error('❌ System stopped unexpectedly');
        process.exit(1);
      }
    }, 30000); // Check every 30 seconds

  } catch (error) {
    console.error('❌ production system startup failed:', error);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
QMOI production Q/BALANCES.md Auto-Update System

Usage: npm run production:q-balances [options]

Options:
  --help, -h    Show this help message
  --status      Show system status
  --stop        Stop the system (if running)

Description:
  Runs the production auto-update system for q/BALANCES.md
  with QMOI consciousness validation and real-time balance tracking.

Examples:
  npm run production:q-balances
  npm run production:q-balances --status
`);
  process.exit(0);
}

if (args.includes('--status')) {
  // TODO: Implement status checking
  console.log('Status checking not yet implemented');
  process.exit(0);
}

if (args.includes('--stop')) {
  // TODO: Implement graceful stop
  console.log('Stop command not yet implemented');
  process.exit(0);
}

// Start the system
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});