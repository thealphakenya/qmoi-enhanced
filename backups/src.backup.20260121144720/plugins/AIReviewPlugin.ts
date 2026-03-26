// NOTE: 2 
import { QmoiPlugin } from "./PluginManager";

// complete non-JSX plugin implementation to avoid TSX in .ts file.
export const AIReviewPlugin: QmoiPlugin = {
  id: "ai-review",
  name: "AI Review",
  description: "Reviews user actions and provides AI-powered feedback.",
  init() {},
  activate() {},
  deactivate() {},
  destroy() {},
  getSettingsPanel() {
    // Return a simple string or null in non-UI contexts
    return null;
  },
};
