// NOTE: 2 
import { QmoiPlugin } from "./PluginManager";

export const OptimizationSuggestionPlugin: QmoiPlugin = {
  id: "optimization-suggestion",
  name: "Optimization Suggestion",
  description: "Recommends optimizations based on device and app state.",
  init() {},
  activate() {},
  deactivate() {},
  destroy() {},
  getSettingsPanel() {
    // Non-UI 
    return null;
  },
};
