import React, { useEffect, useState } from 'react';
import type { AvatarConfig } from './avatarsConfig';
import { useToast } from '@/components/ui/use-toast';

// Add HelpLink component
const HelpLink: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="ml-2 text-cyan-600 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
    aria-label={`Help: ${label}`}
    tabIndex={0}
    title={`Help: ${label}`}
    style={{ verticalAlign: 'middle' }}
  >
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', marginRight: 2 }}>
      <circle cx="10" cy="10" r="9" stroke="#0891b2" strokeWidth="2" fill="#fff" />
      <text x="10" y="15" textAnchor="middle" fontSize="12" fill="#0891b2" fontFamily="Arial" fontWeight="bold">?</text>
    </svg>
  </a>
);

export default function AviatorGalleryPanel() {
  const [avatars, setAvatars] = useState<AvatarConfig[]>([]);
  const [selected, setSelected] = useState<string>('default');
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

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
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };
  const handleVoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoiceFile(e.target.files?.[0] || null);
  };
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarFile && !voiceFile) return;
    setUploading(true);
    // Stubbed upload
    setTimeout(() => {
      toast({ title: 'Upload Submitted', description: 'Your avatar/voice request has been submitted for review.', variant: 'success' });
      setAvatarFile(null);
      setVoiceFile(null);
      setPreviewUrl(null);
      setUploading(false);
    }, 1200);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center">Aviator Gallery<HelpLink href="/docs/AVATAR.md" label="Avatar Gallery Documentation" /></h2>
      <div className="flex flex-wrap gap-6">
        {avatars.map(avatar => (
          <div key={avatar.id} className={`p-4 border rounded shadow w-48 ${selected === avatar.id ? 'ring-2 ring-cyan-500' : ''}`}
            onClick={() => handleSelect(avatar.id)} style={{ cursor: 'pointer' }} tabIndex={0} aria-label={`Select avatar ${avatar.name}`}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelect(avatar.id); }}>
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
      <form className="mt-8 p-4 bg-white rounded shadow flex flex-col gap-4" onSubmit={handleUpload} aria-label="Upload Avatar or Voice Form">
        <h3 className="font-bold mb-2">Upload New Avatar or Voice</h3>
        <label htmlFor="avatar-upload" className="text-sm">Avatar Image/Animation (.png, .jpg, .gif, .mp4):</label>
        <input
          id="avatar-upload"
          type="file"
          accept=".png,.jpg,.jpeg,.gif,.mp4"
          onChange={handleAvatarChange}
          aria-label="Upload avatar image or animation"
        />
        {previewUrl && <img src={previewUrl} alt="Avatar preview" className="w-24 h-24 object-contain" />}
        <label htmlFor="voice-upload" className="text-sm">Voice Audio (.mp3, .wav):</label>
        <input
          id="voice-upload"
          type="file"
          accept=".mp3,.wav"
          onChange={handleVoiceChange}
          aria-label="Upload avatar voice audio"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-700 text-white rounded mt-2"
          disabled={uploading || (!avatarFile && !voiceFile)}
          aria-label="Submit avatar or voice upload request"
        >{uploading ? 'Uploading...' : 'Submit Upload/Request'}</button>
      </form>
    </div>
  );
} 