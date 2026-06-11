export { qmoiMemoryService } from "./memory";
export { default as logAuthEvent } from "./memory";
export * from "./persistence";

// Convenience adapter: import from `app/lib/auth` in app code to reach canonical
// auth utilities while legacy duplicates are migrated.
