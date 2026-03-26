// NOTE: 2 
import { QmoiPlugin } from "./PluginManager";

// complete non-JSX plugin to avoid TSX in .ts file.
export const DeviceHealthReviewerPlugin: QmoiPlugin = {
  id: "device-health-reviewer",
  name: "Device Health Reviewer",
  description: "Analyzes device stats and suggests optimizations.",
  init() {},
  activate() {},
  deactivate() {},
  destroy() {},
  getSettingsPanel() {
    // Non-UI 
    return null;
  },
};
