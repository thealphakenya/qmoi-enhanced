import React, { useEffect, useState } from 'react';
import type { AvatarConfig } from './avatarsConfig';

export default function AviatorGalleryPanel() {
  const [avatars, setAvatars] = useState<AvatarConfig[]>([]);
  const [selected, setSelected] = useState<string>('default');
  useEffect(() => {
    fetch('/api/qmoi/avatars')
      .then(res => res.json())
      .then(data => setAvatars(data.avatars || []));
  }, []);
  const handleSelect = (id: string) => {
    setSelected(id);
    fetch('/api/qmoi/avatars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'switch', avatarId: id })
    });
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Aviator Gallery</h2>
      <div className="flex flex-wrap gap-6">
        {avatars.map(avatar => (
          <div key={avatar.id} className={`p-4 border rounded shadow w-48 ${selected === avatar.id ? 'ring-2 ring-cyan-500' : ''}`}
            onClick={() => handleSelect(avatar.id)} style={{ cursor: 'pointer' }}>
            <img src={avatar.assetPath} alt={avatar.name} className="w-24 h-24 mx-auto mb-2" />
            <div className="font-semibold text-center">{avatar.name}</div>
            <div className="text-xs text-gray-500 text-center">{avatar.description}</div>
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {avatar.features.map(f => <span key={f} className="bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded text-xs">{f}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded">Click an avatar to select. (Live preview coming soon.)</div>
    </div>
  );
} 