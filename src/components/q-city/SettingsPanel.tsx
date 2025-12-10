import React, { useState, ChangeEvent } from "react";

export default function SettingsPanel() {
  const [zeroRatedEnabled, setZeroRatedEnabled] = useState(() => {
    return localStorage.getItem("qmoizeroRatedEnabled") === "true";
  });
  const handleZeroRatedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setZeroRatedEnabled(e.target.checked);
    localStorage.setItem("qmoizeroRatedEnabled", String(e.target.checked));
  };
  return (
    <div className="settings-panel">
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={zeroRatedEnabled}
            onChange={handleZeroRatedChange}
          />
          Always use QMOI Zero Rated for auto-connection
        </label>
        <div className="setting-description">
          When enabled, QMOI will always attempt to use zero-rated internet for
          connectivity.
        </div>
      </div>
    </div>
  );
}
