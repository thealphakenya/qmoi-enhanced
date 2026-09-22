import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DeviceSettingsPanel() {
  const [wallpaper, setWallpaper] = useState<string>('');
  const [appearance, setAppearance] = useState<{ theme: string; font: string }>({ theme: 'light', font: 'rounded' });
  const [apps, setApps] = useState<string[]>(['com.example.wallet', 'com.example.lchub']);

  function handleWallpaperChange(e: React.ChangeEvent<HTMLInputElement>) {
    setWallpaper(e.target.value);
  }
  function handleThemeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setAppearance((prev) => ({ ...prev, theme: e.target.value }));
  }
  function handleFontChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setAppearance((prev) => ({ ...prev, font: e.target.value }));
  }
  function handleAppAdd() {
    const app = prompt('Enter app package or name:');
    if (app) setApps((prev) => [...prev, app]);
  }
  function handleAppRemove(app: string) {
    setApps((prev) => prev.filter((a) => a !== app));
  }

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Device Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <label className="block mb-1">Wallpaper URL</label>
          <input type="text" value={wallpaper} onChange={handleWallpaperChange} className="w-full p-1 rounded bg-gray-900 text-green-200" placeholder="/path/to/wallpaper.jpg" />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Theme</label>
          <select value={appearance.theme} onChange={handleThemeChange} className="w-full p-1 rounded bg-gray-900 text-green-200">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Font</label>
          <select value={appearance.font} onChange={handleFontChange} className="w-full p-1 rounded bg-gray-900 text-green-200">
            <option value="rounded">Rounded</option>
            <option value="mono">Monospace</option>
            <option value="serif">Serif</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Installed Apps</label>
          <ul className="mb-2">
            {apps.map((app) => (
              <li key={app} className="flex items-center justify-between mb-1">
                <span>{app}</span>
                <Button size="sm" variant="outline" onClick={() => handleAppRemove(app)}>Remove</Button>
              </li>
            ))}
          </ul>
          <Button size="sm" onClick={handleAppAdd}>Add App</Button>
        </div>
        <div className="mt-4 text-xs text-gray-400">Changes will be applied by the AI to your device automatically and safely.</div>
      </CardContent>
    </Card>
  );
}
