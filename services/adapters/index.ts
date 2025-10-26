import { PlatformAdapter } from './types';

const registry = new Map<string, PlatformAdapter>();

export function registerAdapter(id: string, adapter: PlatformAdapter) {
  if (registry.has(id)) throw new Error(`Adapter already registered: ${id}`);
  registry.set(id, adapter);
}

export function getAdapter(id: string): PlatformAdapter | undefined {
  return registry.get(id);
}

export function listAdapters(): string[] {
  return Array.from(registry.keys());
}

export default { registerAdapter, getAdapter, listAdapters };
