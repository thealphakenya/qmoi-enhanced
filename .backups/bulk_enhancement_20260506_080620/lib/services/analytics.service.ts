/**
 * Analytics Service - Production API Integration
 * Handles system metrics, performance monitoring, and analytics
 */

import { apiService, type ApiResponse } from './api.service';

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  timestamp: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  lastCheck: string;
  checks: Record<string, boolean>;
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  lastUpdated: string;
}

export interface ErrorLog {
  id: string;
  type: string;
  message: string;
  stack: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  metadata?: Record<string, unknown>;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  databaseQueryTime: number;
  errorRate: number;
  requestsPerSecond: number;
}

class AnalyticsService {
  /**
   * Get current system metrics
   */
  async getSystemMetrics(): Promise<ApiResponse<SystemMetrics>> {
    return apiService.get<SystemMetrics>('/analytics/metrics');
  }

  /**
   * Get system health status
   */
  async getHealthStatus(): Promise<ApiResponse<HealthStatus>> {
    return apiService.get<HealthStatus>('/analytics/health');
  }

  /**
   * Get analytics data
   */
  async getAnalytics(timeRange: 'day' | 'week' | 'month' = 'day'): Promise<ApiResponse<AnalyticsData>> {
    return apiService.get<AnalyticsData>(`/analytics/data?range=${timeRange}`);
  }

  /**
   * Get error logs
   */
  async getErrorLogs(limit: number = 50, offset: number = 0): Promise<ApiResponse<ErrorLog[]>> {
    return apiService.get<ErrorLog[]>(`/analytics/errors?limit=${limit}&offset=${offset}`);
  }

  /**
   * Report error
   */
  async reportError(error: Omit<ErrorLog, 'id' | 'timestamp'>): Promise<ApiResponse<ErrorLog>> {
    return apiService.post<ErrorLog>('/analytics/errors', error);
  }

  /**
   * Mark error as resolved
   */
  async resolveError(errorId: string): Promise<ApiResponse<ErrorLog>> {
    return apiService.patch<ErrorLog>(`/analytics/errors/${errorId}`, { resolved: true });
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(): Promise<ApiResponse<PerformanceMetrics>> {
    return apiService.get<PerformanceMetrics>('/analytics/performance');
  }

  /**
   * Track event
   */
  async trackEvent(eventName: string, eventData: Record<string, unknown>): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post<{ success: boolean }>('/analytics/events', {
      event: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(timeRange: 'day' | 'week' | 'month' = 'day'): Promise<ApiResponse<Record<string, number>>> {
    return apiService.get<Record<string, number>>(`/analytics/usage?range=${timeRange}`);
  }
}

export const analyticsService = new AnalyticsService();
