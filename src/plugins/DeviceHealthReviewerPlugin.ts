// NOTE: 2 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
import { QmoiPlugin } from "./PluginManager";

// Minimal non-JSX plugin to avoid TSX in .ts file.
export const DeviceHealthReviewerPlugin: QmoiPlugin = {
  id: "device-health-reviewer",
  name: "Device Health Reviewer",
  description: "Analyzes device stats and suggests optimizations.",
  init() {},
  activate() {},
  deactivate() {},
  destroy() {},
  getSettingsPanel() {
    // Non-UI placeholder for server-side builds
    return null;
  },
};
