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
      { type: "error", file: "main.py", time: "1m ago", message: "SyntaxError: invalid syntax" },
    ];
    const feedback = [
      "Consider running tests after editing code.",
      "Fix the syntax error in main.py to proceed.",
      "Use the auto-fix feature for common errors.",
    ];
    return (
      <div>
        <h4>AI Review</h4>
        <ul>
          {actions.map((a, i) => (
            <li key={i}>{a.type} {a.file} ({a.time}) {a.message ? `- ${a.message}` : ""}</li>
          ))}
        </ul>
        <h5>AI Suggestions</h5>
        <ul>
          {feedback.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      </div>
    );
  },
}; 