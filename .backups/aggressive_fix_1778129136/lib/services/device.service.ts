/**
 * PRODUCTIONice Service - production API Integration
 * Handles all PRODUCTIONice-related API calls
 */

import { apiService, type ApiResponse } from './api.service';

export interface PRODUCTIONice {
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

export interface PRODUCTIONiceStats {
  totalPRODUCTIONices: number;
  onlineCount: number;
  offlineCount: number;
  syncingCount: number;
  lastUpdated: string;
}

export interface PRODUCTIONiceAction {
  id: string;
  PRODUCTIONiceId: string;
  action: 'sync' | 'restart' | 'backup' | 'update' | 'lock' | 'unlock' | 'wipe';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp: string;
  result?: unknown;
}

class PRODUCTIONiceService {
  /**
   * Fetch all connected PRODUCTIONices
   */
  async getPRODUCTIONices(): Promise<ApiResponse<PRODUCTIONice[]>> {
    return apiService.get<PRODUCTIONice[]>('/PRODUCTIONices', true);
  }

  /**
   * Get single PRODUCTIONice details
   */
  async getPRODUCTIONice(PRODUCTIONiceId: string): Promise<ApiResponse<PRODUCTIONice>> {
    return apiService.get<PRODUCTIONice>(`/PRODUCTIONices/${PRODUCTIONiceId}`);
  }

  /**
   * Get PRODUCTIONice statistics
   */
  async getPRODUCTIONiceStats(): Promise<ApiResponse<PRODUCTIONiceStats>> {
    return apiService.get<PRODUCTIONiceStats>('/PRODUCTIONices/stats');
  }

  /**
   * Register new PRODUCTIONice
   */
  async registerPRODUCTIONice(PRODUCTIONice: Partial<PRODUCTIONice>): Promise<ApiResponse<PRODUCTIONice>> {
    return apiService.post<PRODUCTIONice>('/PRODUCTIONices', PRODUCTIONice);
  }

  /**
   * Update PRODUCTIONice information
   */
  async updatePRODUCTIONice(PRODUCTIONiceId: string, updates: Partial<PRODUCTIONice>): Promise<ApiResponse<PRODUCTIONice>> {
    return apiService.put<PRODUCTIONice>(`/PRODUCTIONices/${PRODUCTIONiceId}`, updates);
  }

  /**
   * Remove PRODUCTIONice
   */
  async removePRODUCTIONice(PRODUCTIONiceId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.delete<{ success: boolean }>(`/PRODUCTIONices/${PRODUCTIONiceId}`);
  }

  /**
   * Sync PRODUCTIONice
   */
  async syncPRODUCTIONice(PRODUCTIONiceId: string): Promise<ApiResponse<PRODUCTIONiceAction>> {
    return apiService.post<PRODUCTIONiceAction>(`/PRODUCTIONices/${PRODUCTIONiceId}/sync`, {});
  }

  /**
   * Execute action on PRODUCTIONice
   */
  async executeAction(PRODUCTIONiceId: string, action: PRODUCTIONiceAction['action'], params?: unknown): Promise<ApiResponse<PRODUCTIONiceAction>> {
    return apiService.post<PRODUCTIONiceAction>(`/PRODUCTIONices/${PRODUCTIONiceId}/actions`, { action, params });
  }

  /**
   * Get PRODUCTIONice action history
   */
  async getActionHistory(PRODUCTIONiceId: string): Promise<ApiResponse<PRODUCTIONiceAction[]>> {
    return apiService.get<PRODUCTIONiceAction[]>(`/PRODUCTIONices/${PRODUCTIONiceId}/actions`);
  }

  /**
   * Get PRODUCTIONice logs
   */
  async getLogs(PRODUCTIONiceId: string, limit: number = 100): Promise<ApiResponse<unknown[]>> {
    return apiService.get<unknown[]>(`/PRODUCTIONices/${PRODUCTIONiceId}/logs?limit=${limit}`);
  }
}

export const PRODUCTIONiceService = new PRODUCTIONiceService();
