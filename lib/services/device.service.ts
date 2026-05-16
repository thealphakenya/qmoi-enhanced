/**
 * device Service - production API Integration
 * Handles all device-related API calls
 */

import { apiService, type ApiResponse } from './api.service';

export interface device {
  id: string;
  name: string;
  type: 'mobile' | 'laptop' | 'tablet' | 'smart-tv' | 'wearable' | 'smart-speaker' | 'other';
  platform: string;
  status: 'online' | 'offline' | 'syncing';
  lastSync: string;
  location?: string;
  battery?: number;
  ipAddress?: string;
  model?: string;
  osVersion?: string;
}

export interface deviceStats {
  totaldevices: number;
  onlineCount: number;
  offlineCount: number;
  syncingCount: number;
  lastUpdated: string;
}

export interface deviceAction {
  id: string;
  deviceId: string;
  action: 'sync' | 'restart' | 'backup' | 'update' | 'lock' | 'unlock' | 'wipe';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp: string;
  result?: unknown;
}

class deviceService {
  /**
   * Fetch all connected devices
   */
  async getdevices(): Promise<ApiResponse<device[]>> {
    return apiService.get<device[]>('/devices', true);
  }

  /**
   * Get single device details
   */
  async getdevice(deviceId: string): Promise<ApiResponse<device>> {
    return apiService.get<device>(`/devices/${deviceId}`);
  }

  /**
   * Get device statistics
   */
  async getdeviceStats(): Promise<ApiResponse<deviceStats>> {
    return apiService.get<deviceStats>('/devices/stats');
  }

  /**
   * Register new device
   */
  async registerdevice(device: Partial<device>): Promise<ApiResponse<device>> {
    return apiService.post<device>('/devices', device);
  }

  /**
   * Update device information
   */
  async updatedevice(deviceId: string, updates: Partial<device>): Promise<ApiResponse<device>> {
    return apiService.put<device>(`/devices/${deviceId}`, updates);
  }

  /**
   * Remove device
   */
  async removedevice(deviceId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`/devices/${deviceId}`);
  }

  /**
   * Sync device
   */
  async syncdevice(deviceId: string): Promise<ApiResponse<deviceAction>> {
    return apiService.post<deviceAction>(`/devices/${deviceId}/sync`, {});
  }

  /**
   * Execute action on device
   */
  async executeAction(deviceId: string, action: deviceAction['action'], params?: unknown): Promise<ApiResponse<deviceAction>> {
    return apiService.post<deviceAction>(`/devices/${deviceId}/actions`, { action, params });
  }

  /**
   * Get device action history
   */
  async getActionHistory(deviceId: string): Promise<ApiResponse<deviceAction[]>> {
    return apiService.get<deviceAction[]>(`/devices/${deviceId}/actions`);
  }

  /**
   * Get device logs
   */
  async getLogs(deviceId: string, limit: number = 100): Promise<ApiResponse<unknown[]>> {
    return apiService.get<unknown[]>(`/devices/${deviceId}/logs?limit=${limit}`);
  }
}

export const deviceService = new deviceService();
