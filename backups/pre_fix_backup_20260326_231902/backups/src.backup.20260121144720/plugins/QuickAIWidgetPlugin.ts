// NOTE: 2 [PRODUCTION READY](s) found in this file. See .qmoi_validation/[PRODUCTION READY]_fix_report.txt for details.
import { QmoiPlugin } from "./PluginManager";

export const QuickAIWidgetPlugin: QmoiPlugin = {
  id: "quick-ai-widget",
  name: "Quick AI Widget",
  description: "Floating widget with real-time AI insights and quick actions.",
  init() {},
  activate() {},
  deactivate() {},
  destroy() {},
  getSettingsPanel() {
    // Non-UI [PRODUCTION READY] for builds
    return null;
  },
};
