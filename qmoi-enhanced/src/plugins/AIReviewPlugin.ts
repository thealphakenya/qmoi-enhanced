import React from "react";
import { QmoiPlugin } from "./PluginManager";

export const AIReviewPlugin: QmoiPlugin = {
  id: "ai-review",
  name: "AI Review",
  description: "Reviews user actions and provides AI-powered feedback.",
  init() {},
  activate() {},
  deactivate() {},
  destroy() {},
  getSettingsPanel() {
    // Mock actions/logs for demonstration
    const actions = [
      { type: "edit", file: "main.py", time: "2m ago" },
      { type: "run", file: "main.py", time: "1m ago" },
      {
        type: "error",
        file: "main.py",
        time: "1m ago",
        message: "SyntaxError: invalid syntax",
      },
    ];
    const feedback = [
      "Consider running tests after editing code.",
      "Fix the syntax error in main.py to proceed.",
      "Use the auto-fix feature for common errors.",
    ];
    return React.createElement(
      "div",
      null,
      React.createElement("h4", null, "AI Review"),
      React.createElement(
        "ul",
        null,
        actions.map((a, i) =>
          React.createElement(
            "li",
            { key: i },
            `${a.type} ${a.file} (${a.time})${a.message ? ` - ${a.message}` : ""}`,
          ),
        ),
      ),
      React.createElement("h5", null, "AI Suggestions"),
      React.createElement(
        "ul",
        null,
        feedback.map((f, i) => React.createElement("li", { key: i }, f)),
      ),
    );
  },
};
