import React, { useState } from 'react';

const AccessibilitySettingsPanel = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [voiceControl, setVoiceControl] = useState(false);
  const [gestureControl, setGestureControl] = useState(false);
  const [autoConnect, setAutoConnect] = useState(true);

  return (
    <section aria-label="Accessibility and Device Settings" className="p-4 border rounded-lg bg-white dark:bg-gray-900 max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Accessibility & Device Settings</h2>
      <form>
        <label className="flex items-center mb-2">
          <input type="checkbox" checked={highContrast} onChange={e => setHighContrast(e.target.checked)} aria-checked={highContrast} />
          <span className="ml-2">High Contrast Mode</span>
        </label>
        <label className="flex items-center mb-2">
          <input type="checkbox" checked={largeText} onChange={e => setLargeText(e.target.checked)} aria-checked={largeText} />
          <span className="ml-2">Large Text</span>
        </label>
        <label className="flex items-center mb-2">
          <input type="checkbox" checked={screenReader} onChange={e => setScreenReader(e.target.checked)} aria-checked={screenReader} />
          <span className="ml-2">Screen Reader Hints</span>
        </label>
        <label className="flex items-center mb-2">
          <input type="checkbox" checked={voiceControl} onChange={e => setVoiceControl(e.target.checked)} aria-checked={voiceControl} />
          <span className="ml-2">Voice Control</span>
        </label>
        <label className="flex items-center mb-2">
          <input type="checkbox" checked={gestureControl} onChange={e => setGestureControl(e.target.checked)} aria-checked={gestureControl} />
          <span className="ml-2">Gesture Control</span>
        </label>
        <label className="flex items-center mb-2">
          <input type="checkbox" checked={autoConnect} onChange={e => setAutoConnect(e.target.checked)} aria-checked={autoConnect} />
          <span className="ml-2">Auto-Connect to Devices</span>
        </label>
      </form>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">All settings are saved and applied instantly. QMOI will remember your preferences across devices.</p>
    </section>
  );
};

export default AccessibilitySettingsPanel; 