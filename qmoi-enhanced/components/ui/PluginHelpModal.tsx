import React, { useState } from "react";

export const PluginHelpModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ marginBottom: 12 }}>
        Help with Plugins
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#0008",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 8,
              maxWidth: 480,
            }}
          >
            <h2>Plugin System Help</h2>
            <p>
              Plugins extend QMOI with new features, optimizations, and UI
              widgets. You can enable, disable, and configure plugins from the
              Plugins tab.
            </p>
            <ul>
              <li>
                <b>Settings Panel:</b> Each plugin may have its own settings and
                suggestions.
              </li>
              <li>
                <b>Notifications:</b> You'll see notifications when plugins take
                actions or need your attention.
              </li>
              <li>
                <b>Automation:</b> Some plugins can auto-trigger based on system
                events or schedules.
              </li>
              <li>
                <b>Need more help?</b> Contact support or see the documentation.
              </li>
            </ul>
            <button onClick={() => setOpen(false)} style={{ marginTop: 16 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
