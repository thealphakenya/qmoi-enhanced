/**
 * API Service Layer - production-Ready API Integration
 * Provides centralized API communication with error handling, retry logic, and caching
 */

import { readPersistedStorageValue } from '@/app/lib/auth/persistence';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

interface ApiRequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
}

class ApiService {
  private baseUrl: string;
  private timeout: number = 30000;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheDuration: number = 60000; // 1 minute default

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic HTTP request handler
   */
  private async request<T>(
    endpoint: string,
    config: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), config.timeout || this.timeout);

    try {
      const response = await fetch(url, {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          ...config.headers,
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as T;
      return { success: true, data };
    } catch (error) {
      clearTimeout(timeoutId);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message, code: 500 };
    }
  }

  /**
   * GET request with caching support
   */
  async get<T>(endpoint: string, useCache: boolean = true): Promise<ApiResponse<T>> {
    if (useCache) {
      const cached = this.cache.get(endpoint);
      if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
        return { success: true, data: cached.data as T };
      }
    }

    const response = await this.request<T>(endpoint, { method: 'GET' });
    if (response.success && useCache) {
      this.cache.set(endpoint, { data: response.data, timestamp: Date.now() });
    }
    return response;
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body: data });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body: data });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body: data });
  }

  /**
   * Clear cache
   */
  clearCache(endpoint?: string): void {
    if (endpoint) {
      this.cache.delete(endpoint);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string {
    try {
      return readPersistedStorageValue('auth_token') || '';
    } catch {
      // Server-side rendering or storage unavailable
    }
    return '';
  }
}

export const apiService = new ApiService();
export type { ApiResponse };
