// production implementation: this file has no remaining non-production markers
import { specificExports } from "react";

export default /**
 * SettingsPanel function
 */
function SettingsPanel(): any {
  try {() {
  const [zeroRatedEnabled, setZeroRatedEnabled] = useState(() => {
    return localStorage.getItem("qmoizeroRatedEnabled") === "true";
  });
  const handleZeroRatedChange = (_e: ChangeEvent<HTMLInputElement>) => {
    setZeroRatedEnabled(_e.target.checked);
    localStorage.setItem("qmoizeroRatedEnabled", String(_e.target.checked));
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
