import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import nodemailer from 'nodemailer';
import { QCityStatus, QCityError } from '../../hooks/useQCity';
import { logger } from '../utils/logger';
import { NotificationService } from './notification_service';
import { VPNService } from '../../src/services/VPNService';

const execAsync = promisify(exec);

interface FixResult {
  success: boolean;
  fixedIssues: string[];
  remainingIssues: string[];
  logs: string[];
  timestamp: string;
  duration: number;
  errorType?: string;
  stackTrace?: string;
}

interface FixStrategy {
  type: 'lint' | 'dependency' | 'code' | 'config';
  priority: 'low' | 'medium' | 'high' | 'critical';
  approach: 'direct_fix' | 'rollback' | 'alternative_solution';
  confidence: number;
}

class AutoFixService {
  private readonly notificationService: NotificationService;
  private readonly maxRetries = 3;
  private readonly retryDelay = 5000; // 5 seconds

  constructor() {
    this.notificationService = new NotificationService();
  }

  private async runWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    retries = this.maxRetries
  ): Promise<T> {
    await VPNService.ensureSecureConnection();
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        logger.warn(`Retrying ${operationName} after error:`, error);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.runWithRetry(operation, operationName, retries - 1);
      }
      throw error;
    }
  }

  private async runLintFix(): Promise<FixResult> {
    const startTime = Date.now();
    const result: FixResult = {
      success: false,
      fixedIssues: [],
      remainingIssues: [],
      logs: [],
      timestamp: new Date().toISOString(),
      duration: 0
    };

    try {
      logger.info('Starting lint fix process');
      
      // Run ESLint with --fix
      const { stdout: eslintOutput } = await this.runWithRetry(
        () => execAsync('npx eslint . --fix'),
        'ESLint fix'
      );
      result.logs.push('ESLint fix output:', eslintOutput);
      
      // Run Prettier
      const { stdout: prettierOutput } = await this.runWithRetry(
        () => execAsync('npx prettier --write .'),
        'Prettier formatting'
      );
      result.logs.push('Prettier output:', prettierOutput);

      // Run TypeScript compiler
      const { stdout: tscOutput } = await this.runWithRetry(
        () => execAsync('npx tsc --noEmit'),
        'TypeScript check'
      );
      result.logs.push('TypeScript check output:', tscOutput);

      result.success = true;
      logger.info('Lint fix completed successfully');
    } catch (error) {
      result.remainingIssues.push(error.message);
      result.errorType = error.name;
      result.stackTrace = error.stack;
      logger.error('Error during lint fix:', error);
    } finally {
      result.duration = Date.now() - startTime;
    }

    return result;
  }

  private async runDependencyFix(): Promise<FixResult> {
    const startTime = Date.now();
    const result: FixResult = {
      success: false,
      fixedIssues: [],
      remainingIssues: [],
      logs: [],
      timestamp: new Date().toISOString(),
      duration: 0
    };

    try {
      logger.info('Starting dependency fix process');

      // Clean npm cache
      await this.runWithRetry(
        () => execAsync('npm cache clean --force'),
        'npm cache clean'
      );
      result.logs.push('Cleaned npm cache');

      // Remove node_modules and lock files
      await this.runWithRetry(
        () => execAsync('rm -rf node_modules package-lock.json pnpm-lock.yaml'),
        'Remove node_modules and lock files'
      );
      result.logs.push('Removed node_modules and lock files');

      // Reinstall dependencies
      const { stdout: installOutput } = await this.runWithRetry(
        () => execAsync('npm install --legacy-peer-deps'),
        'npm install'
      );
      result.logs.push('Dependency installation output:', installOutput);

      result.success = true;
      logger.info('Dependency fix completed successfully');
    } catch (error) {
      result.remainingIssues.push(error.message);
      result.errorType = error.name;
      result.stackTrace = error.stack;
      logger.error('Error during dependency fix:', error);
    } finally {
      result.duration = Date.now() - startTime;
    }

    return result;
  }

  private async determineFixStrategy(error: QCityError): Promise<FixStrategy> {
    // Analyze error patterns and determine the best fix approach
    const strategy: FixStrategy = {
      type: 'code',
      priority: 'high',
      approach: 'direct_fix',
      confidence: 0.8
    };

    // Enhance strategy based on error type
    if (error.message.includes('lint')) {
      strategy.type = 'lint';
      strategy.confidence = 0.9;
    } else if (error.message.includes('dependency')) {
      strategy.type = 'dependency';
      strategy.confidence = 0.7;
    }

    // Adjust priority based on error severity
    if (error.message.includes('critical') || error.message.includes('fatal')) {
      strategy.priority = 'critical';
    }

    return strategy;
  }

  private async runAIFix(error: QCityError): Promise<FixResult> {
    await VPNService.ensureSecureConnection();
    const startTime = Date.now();
    const result: FixResult = {
      success: false,
      fixedIssues: [],
      remainingIssues: [],
      logs: [],
      timestamp: new Date().toISOString(),
      duration: 0
    };

    try {
      logger.info('Starting AI fix process');
      
      const strategy = await this.determineFixStrategy(error);
      logger.info('Determined fix strategy:', strategy);

      // Call Q-city AI endpoint for fixing
      const response = await this.runWithRetry(
        () => axios.post('/api/qcity/ai/fix', {
          error,
          strategy,
          context: {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            platform: process.platform
          }
        }),
        'AI fix request'
      );

      if (response.data.success) {
        result.fixedIssues.push(error.message);
        result.success = true;
        logger.info('AI fix completed successfully');
      } else {
        result.remainingIssues.push(error.message);
        logger.warn('AI fix did not succeed:', response.data);
      }

      result.logs.push('AI fix attempt:', response.data);
    } catch (error) {
      result.remainingIssues.push(error.message);
      result.errorType = error.name;
      result.stackTrace = error.stack;
      logger.error('Error during AI fix:', error);
    } finally {
      result.duration = Date.now() - startTime;
    }

    return result;
  }

  public async startAutoFix(status: QCityStatus) {
    logger.info('Starting auto-fix process');
    await this.notificationService.sendNotification(
      'Q-city Auto Fix Started',
      'The automated error fixing process has begun.'
    );

    const results: FixResult[] = [];
    const startTime = Date.now();

    try {
      // Run all fix attempts
      if (status.errors.length > 0) {
        for (const error of status.errors) {
          logger.info('Processing error:', error);

          const lintResult = await this.runLintFix();
          results.push(lintResult);

          const depResult = await this.runDependencyFix();
          results.push(depResult);

          const aiResult = await this.runAIFix(error);
          results.push(aiResult);
        }
      }

      // Compile results
      const summary = {
        totalIssues: status.errors.length,
        fixedIssues: results.flatMap(r => r.fixedIssues).length,
        remainingIssues: results.flatMap(r => r.remainingIssues).length,
        logs: results.flatMap(r => r.logs),
        duration: Date.now() - startTime
      };

      // Send completion notification
      await this.notificationService.sendNotification(
        'Q-city Auto Fix Completed',
        `Fix Summary:
        Total Issues: ${summary.totalIssues}
        Fixed Issues: ${summary.fixedIssues}
        Remaining Issues: ${summary.remainingIssues}
        Duration: ${summary.duration}ms
        
        Detailed Logs:
        ${summary.logs.join('\n')}`
      );

      logger.info('Auto-fix process completed', summary);
      return summary;
    } catch (error) {
      logger.error('Error in auto-fix process:', error);
      await this.notificationService.sendNotification(
        'Q-city Auto Fix Error',
        `An error occurred during the auto-fix process:
        Error: ${error.message}
        Stack: ${error.stack}`
      );
      throw error;
    }
  }
}

export const autoFixService = new AutoFixService(); 
