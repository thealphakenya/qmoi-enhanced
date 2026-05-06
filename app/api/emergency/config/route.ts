import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const configType = url.searchParams.get('type') || 'all';

    // Get emergency configuration settings
    const [
      emergencyConfig,
      configHistory,
      systemSettings,
      alertThresholds
    ] = await Promise.all([
      getEmergencyConfiguration(),
      prisma.systemMetric.findMany({
        where: {
          category: 'emergency',
          subsystem: 'config',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      getSystemSettings(),
      getAlertThresholds(),
    ]);

    // Filter configuration by type if specified
    let filteredConfig = emergencyConfig;
    if (configType !== 'all') {
      filteredConfig = emergencyConfig.filter(c => c.category === configType);
    }

    return NextResponse.json({
      success: true,
      emergency: {
        config: {
          status: 'operational',
          totalSettings: emergencyConfig.length,
          categories: [...new Set(emergencyConfig.map(c => c.category))],
        },
        configuration: filteredConfig,
        systemSettings,
        alertThresholds,
        recentChanges: configHistory.slice(0, 10).map(c => ({
          setting: c.dimensions?.setting || 'unknown',
          oldValue: c.dimensions?.oldValue || null,
          newValue: c.dimensions?.newValue || null,
          changedBy: c.dimensions?.changedBy || 'system',
          timestamp: c.createdAt.toISOString(),
        })),
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Emergency config status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch emergency configuration",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, setting, value, category, reason } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required" },
        { status: 400 }
      );
    }

    if (action === 'update_setting' && (!setting || value === undefined)) {
      return NextResponse.json(
        { success: false, error: "Setting name and value are required for configuration update" },
        { status: 400 }
      );
    }

    if (action === 'update_setting') {
      // Update emergency configuration setting
      const updateResult = await updateEmergencySetting(setting, value, reason);

      // Log the configuration change
      await prisma.auditLog.create({
        data: {
          userId: 'system',
          username: 'emergency_system',
          action: 'emergency_config_updated',
          resource: 'emergency',
          details: JSON.stringify({
            setting,
            oldValue: updateResult.oldValue,
            newValue: value,
            reason: reason?.substring(0, 200),
            category: updateResult.category,
          }),
          riskLevel: 'high',
          status: 'success',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: `Emergency setting '${setting}' updated`,
        setting: {
          name: setting,
          oldValue: updateResult.oldValue,
          newValue: value,
          category: updateResult.category,
          updatedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'reset_to_defaults') {
      // Reset emergency configuration to defaults
      const resetResult = await resetEmergencyConfig();

      // Log the reset
      await prisma.auditLog.create({
        data: {
          userId: 'system',
          username: 'emergency_system',
          action: 'emergency_config_reset',
          resource: 'emergency',
          details: JSON.stringify({
            settingsReset: resetResult.settingsReset,
            reason: reason?.substring(0, 200),
          }),
          riskLevel: 'critical',
          status: 'success',
        } as any,
      });

      return NextResponse.json({
        success: true,
        message: 'Emergency configuration reset to defaults',
        reset: {
          settingsReset: resetResult.settingsReset,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'update_thresholds') {
      const { thresholds } = body;

      if (!thresholds || typeof thresholds !== 'object') {
        return NextResponse.json(
          { success: false, error: "Valid thresholds object is required" },
          { status: 400 }
        );
      }

      // Update alert thresholds
      const thresholdResult = await updateAlertThresholds(thresholds);

      return NextResponse.json({
        success: true,
        message: 'Alert thresholds updated',
        thresholds: thresholdResult,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'backup_config') {
      // Backup current emergency configuration
      const backupResult = await backupEmergencyConfig();

      return NextResponse.json({
        success: true,
        message: 'Emergency configuration backed up',
        backup: {
          id: backupResult.backupId,
          timestamp: backupResult.timestamp,
          settingsCount: backupResult.settingsCount,
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'restore_config') {
      const { backupId } = body;

      if (!backupId) {
        return NextResponse.json(
          { success: false, error: "Backup ID is required for restoration" },
          { status: 400 }
        );
      }

      // Restore emergency configuration from backup
      const restoreResult = await restoreEmergencyConfig(backupId);

      return NextResponse.json({
        success: true,
        message: 'Emergency configuration restored from backup',
        restore: {
          backupId,
          settingsRestored: restoreResult.settingsRestored,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'validate_config') {
      // Validate current emergency configuration
      const validationResult = await validateEmergencyConfig();

      return NextResponse.json({
        success: true,
        validation: {
          isValid: validationResult.isValid,
          errors: validationResult.errors,
          warnings: validationResult.warnings,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'update_setting', 'reset_to_defaults', 'update_thresholds', 'backup_config', 'restore_config', or 'validate_config'." },
      { status: 400 }
    );

  } catch (error) {
    logger.error('Emergency config action error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process emergency config action",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

async function getEmergencyConfiguration(): Promise<Array<{
  name: string;
  value: any;
  category: string;
  description: string;
  type: string;
  lastUpdated: string;
}>> {
  // In a real implementation, this would fetch from database
  // For now, return sample emergency configuration
  return [
    {
      name: 'emergency_lockdown_auto_trigger',
      value: true,
      category: 'lockdown',
      description: 'Automatically trigger lockdown on critical alerts',
      type: 'boolean',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'emergency_sms_enabled',
      value: true,
      category: 'communication',
      description: 'Enable emergency SMS notifications',
      type: 'boolean',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'emergency_dispatch_timeout',
      value: 300,
      category: 'dispatch',
      description: 'Timeout for emergency dispatch in seconds',
      type: 'number',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'emergency_wipe_confirmation_required',
      value: true,
      category: 'wipe',
      description: 'Require confirmation code for data wipe operations',
      type: 'boolean',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'emergency_alert_cooldown',
      value: 60,
      category: 'alerts',
      description: 'Cooldown period between emergency alerts in seconds',
      type: 'number',
      lastUpdated: new Date().toISOString(),
    },
    {
      name: 'emergency_backup_frequency',
      value: 'daily',
      category: 'backup',
      description: 'Frequency of emergency configuration backups',
      type: 'string',
      lastUpdated: new Date().toISOString(),
    },
  ];
}

async function getSystemSettings(): Promise<{
  maintenanceMode: boolean;
  debugMode: boolean;
  logLevel: string;
  maxConcurrentOperations: number;
}> {
  return {
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info',
    maxConcurrentOperations: 10,
  };
}

async function getAlertThresholds(): Promise<{
  criticalCpuUsage: number;
  criticalMemoryUsage: number;
  criticalDiskUsage: number;
  maxFailedLogins: number;
  alertCooldownMinutes: number;
}> {
  return {
    criticalCpuUsage: 95,
    criticalMemoryUsage: 90,
    criticalDiskUsage: 85,
    maxFailedLogins: 5,
    alertCooldownMinutes: 15,
  };
}

async function updateEmergencySetting(
  setting: string,
  value: any,
  reason?: string
): Promise<{
  oldValue: any;
  category: string;
}> {
  // Get current configuration
  const config = await getEmergencyConfiguration();
  const settingConfig = config.find(c => c.name === setting);

  if (!settingConfig) {
    throw new Error(`Setting '${setting}' not found`);
  }

  const oldValue = settingConfig.value;
  const category = settingConfig.category;

  // Validate value type
  if (typeof value !== settingConfig.type) {
    throw new Error(`Invalid value type for setting '${setting}'. Expected ${settingConfig.type}, got ${typeof value}`);
  }

  // Update setting in database (simulated)
  // In real implementation, this would update a configuration table

  // Log the change
  await prisma.systemMetric.create({
    data: {
      metricType: 'emergency',
      metricName: 'config_updated',
      value: 1,
      unit: 'update',
      category: 'emergency',
      subsystem: 'config',
      dimensions: JSON.stringify({
        setting,
        oldValue,
        newValue: value,
        reason: reason || 'Configuration update',
        category,
        updatedBy: 'api',
      }),
      tags: JSON.stringify(['emergency', 'config', 'updated']),
      source: 'api',
      collectedBy: 'emergency-config-api',
    },
  });

  return { oldValue, category };
}

async function resetEmergencyConfig() {
  // Reset configuration to defaults
  const defaultConfig = await getDefaultEmergencyConfig();
  let settingsReset = 0;

  for (const setting of defaultConfig) {
    await updateEmergencySetting(setting.name, setting.value, 'Reset to defaults');
    settingsReset++;
  }

  return { settingsReset };
}

async function updateAlertThresholds(thresholds: any): Promise<any> {
  // Validate thresholds
  const requiredFields = ['criticalCpuUsage', 'criticalMemoryUsage', 'criticalDiskUsage', 'maxFailedLogins', 'alertCooldownMinutes'];
  for (const field of requiredFields) {
    if (!(field in thresholds)) {
      throw new Error(`Missing required threshold field: ${field}`);
    }
    if (typeof thresholds[field] !== 'number') {
      throw new Error(`Invalid type for threshold ${field}. Expected number.`);
    }
  }

  // Update thresholds (simulated)
  // In real implementation, this would update threshold settings

  // Log the update
  await prisma.systemMetric.create({
    data: {
      metricType: 'emergency',
      metricName: 'thresholds_updated',
      value: 1,
      unit: 'update',
      category: 'emergency',
      subsystem: 'config',
      dimensions: JSON.stringify({
        thresholds: JSON.stringify(thresholds),
        updatedBy: 'api',
      }),
      tags: JSON.stringify(['emergency', 'config', 'thresholds']),
      source: 'api',
      collectedBy: 'emergency-config-api',
    },
  });

  return thresholds;
}

async function backupEmergencyConfig() {
  const config = await getEmergencyConfiguration();
  const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();

  // Create backup record
  await prisma.systemMetric.create({
    data: {
      metricType: 'emergency',
      metricName: 'config_backup',
      value: 1,
      unit: 'backup',
      category: 'emergency',
      subsystem: 'config',
      dimensions: JSON.stringify({
        backupId,
        timestamp,
        settingsCount: config.length,
        config: JSON.stringify(config),
      }),
      tags: JSON.stringify(['emergency', 'config', 'backup']),
      source: 'api',
      collectedBy: 'emergency-config-api',
    },
  });

  return { backupId, timestamp, settingsCount: config.length };
}

async function restoreEmergencyConfig(backupId: string): Promise<{
  settingsRestored: number;
}> {
  // Find backup
  const backup = await prisma.systemMetric.findFirst({
    where: {
      metricType: 'emergency',
      metricName: 'config_backup',
      dimensions: { contains: `"backupId":"${backupId}"` },
    },
  });

  if (!backup) {
    throw new Error('Backup not found');
  }

  const dimensions = JSON.parse(backup.dimensions || '{}');
  const config = JSON.parse(dimensions.config || '[]');

  let settingsRestored = 0;
  for (const setting of config) {
    await updateEmergencySetting(setting.name, setting.value, `Restored from backup ${backupId}`);
    settingsRestored++;
  }

  return { settingsRestored };
}

async function validateEmergencyConfig(): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
}>> {
  const config = await getEmergencyConfiguration();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required settings exist
  const requiredSettings = ['emergency_lockdown_auto_trigger', 'emergency_sms_enabled'];
  for (const required of requiredSettings) {
    if (!config.find(c => c.name === required)) {
      errors.push(`Missing required setting: ${required}`);
    }
  }

  // Validate value ranges
  for (const setting of config) {
    if (setting.type === 'number' && (setting.value < 0 || setting.value > 1000000)) {
      warnings.push(`Setting ${setting.name} has unusual value: ${setting.value}`);
    }
  }

  // Check for conflicting settings
  const lockdownEnabled = config.find(c => c.name === 'emergency_lockdown_auto_trigger')?.value;
  const smsEnabled = config.find(c => c.name === 'emergency_sms_enabled')?.value;

  if (lockdownEnabled && !smsEnabled) {
    warnings.push('Lockdown is enabled but SMS notifications are disabled');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

async function getDefaultEmergencyConfig(): Promise<Array<{
  name: string;
  value: any;
}>> {
  return [
    { name: 'emergency_lockdown_auto_trigger', value: false },
    { name: 'emergency_sms_enabled', value: true },
    { name: 'emergency_dispatch_timeout', value: 300 },
    { name: 'emergency_wipe_confirmation_required', value: true },
    { name: 'emergency_alert_cooldown', value: 60 },
    { name: 'emergency_backup_frequency', value: 'daily' },
  ];
}
