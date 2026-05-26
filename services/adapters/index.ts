import type { PlatformAdapter } from './types';

const registry = new Map<string, PlatformAdapter>();

export function registerAdapter(id: string, adapter: PlatformAdapter) {
  registry.set(id, adapter);
}

export function getAdapter(id: string): PlatformAdapter | undefined {
  return registry.get(id);
}

export function listAdapters(): string[] {
  return Array.from(registry.keys());
}

export default { registerAdapter, getAdapter, listAdapters };
