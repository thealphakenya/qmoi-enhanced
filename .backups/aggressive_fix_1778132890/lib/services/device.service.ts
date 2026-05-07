/**
 * Device Service - production API Integration
 * Handles all device-related API calls
 */

import { apiService, type ApiResponse } from './api.service';

export interface Device {
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

export interface DeviceStats {
  totalDevices: number;
  onlineCount: number;
  offlineCount: number;
  syncingCount: number;
  lastUpdated: string;
}

export interface DeviceAction {
  id: string;
  deviceId: string;
  action: 'sync' | 'restart' | 'backup' | 'update' | 'lock' | 'unlock' | 'wipe';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp: string;
  result?: unknown;
}

class DeviceService {
  /**
   * Fetch all connected devices
   */
  async getDevices(): Promise<ApiResponse<Device[]>> {
    return apiService.get<Device[]>('/devices', true);
  }

  /**
   * Get single device details
   */
  async getDevice(deviceId: string): Promise<ApiResponse<Device>> {
    return apiService.get<Device>(`/devices/${deviceId}`);
  }

  /**
   * Get device statistics
   */
  async getDeviceStats(): Promise<ApiResponse<DeviceStats>> {
    return apiService.get<DeviceStats>('/devices/stats');
  }

  /**
   * Register new device
   */
  async registerDevice(device: Partial<Device>): Promise<ApiResponse<Device>> {
    return apiService.post<Device>('/devices', device);
  }

  /**
   * Update device information
   */
  async updateDevice(deviceId: string, updates: Partial<Device>): Promise<ApiResponse<Device>> {
    return apiService.put<Device>(`/devices/${deviceId}`, updates);
  }

  /**
   * Remove device
   */
  async removeDevice(deviceId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`/devices/${deviceId}`);
  }

  /**
   * Sync device
   */
  async syncDevice(deviceId: string): Promise<ApiResponse<DeviceAction>> {
    return apiService.post<DeviceAction>(`/devices/${deviceId}/sync`, {});
  }

  /**
   * Execute action on device
   */
  async executeAction(deviceId: string, action: DeviceAction['action'], params?: unknown): Promise<ApiResponse<DeviceAction>> {
    return apiService.post<DeviceAction>(`/devices/${deviceId}/actions`, { action, params });
  }

  /**
   * Get device action history
   */
  async getActionHistory(deviceId: string): Promise<ApiResponse<DeviceAction[]>> {
    return apiService.get<DeviceAction[]>(`/devices/${deviceId}/actions`);
  }

  /**
   * Get device logs
   */
  async getLogs(deviceId: string, limit: number = 100): Promise<ApiResponse<unknown[]>> {
    return apiService.get<unknown[]>(`/devices/${deviceId}/logs?limit=${limit}`);
  }
}

export const deviceService = new DeviceService();
