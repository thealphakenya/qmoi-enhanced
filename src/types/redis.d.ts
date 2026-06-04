declare module 'redis' {
  export interface RedisClientOptions {
    url?: string;
  }

  export interface RedisClient {
    connect(): Promise<void>;
    on(event: string, listener: (...args: any[]) => void): void;
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<string>;
  }

  export function createClient(options?: RedisClientOptions): RedisClient;
}
