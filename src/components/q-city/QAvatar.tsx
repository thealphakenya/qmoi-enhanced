import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const AVATAR_TYPES = ['human', 'animal', 'robot', 'abstract', 'fantasy', 'cyberpunk', 'nature', 'space'];
const ENVIRONMENTS = ['Office', 'Nature', 'Space', 'Cyberpunk', 'Fantasy', 'Beach', 'Mountain', 'City', 'Home'];

export default function QAvatar() {
  const [open, setOpen] = useState(true);
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qavatar-settings') || '{}'); } catch { return {}; }
  });
  const [drag, setDrag] = useState({ x: 100, y: 100 });
  const ref = useRef<HTMLDivElement>(null);

  function saveSettings(newSettings: any) {
    setSettings(newSettings);
    localStorage.setItem('qavatar-settings', JSON.stringify(newSettings));
  }

  return (
    <motion.div
      ref={ref}
      className="fixed z-50 cursor-move"
      style={{ left: drag.x, top: drag.y, width: 120, height: 120 }}
      drag
      dragMomentum={false}
      dragConstraints={{ left: 0, top: 0, right: window.innerWidth - 120, bottom: window.innerHeight - 120 }}
      onDragEnd={(_, info) => setDrag({ x: info.point.x, y: info.point.y })}
      aria-label="Q-Avatar floating assistant"
      tabIndex={0}
      role="button"
      onKeyDown={e => { if (e.key === 'Enter') setOpen(o => !o); }}
    >
      <motion.div animate={{ scale: open ? 1 : 0.5, rotate: open ? 0 : 20 }} transition={{ type: 'spring' }}>
        <img src="/placeholder-logo.png" alt="Q-Avatar" className="rounded-full shadow-lg border-4 border-cyan-400" style={{ width: 100, height: 100 }} />
        <button className="absolute top-2 right-2 bg-cyan-700 text-white rounded-full p-1" onClick={() => setOpen(o => !o)} aria-label={open ? 'Minimize Q-Avatar' : 'Expand Q-Avatar'}>{open ? '-' : '+'}</button>
      </motion.div>
      {open && (
        <div className="absolute left-0 top-28 w-64 bg-gray-900 text-white rounded shadow-lg p-4" style={{ zIndex: 100 }}>
          <h3 className="font-bold text-cyan-400 mb-2">Q-Avatar Settings</h3>
          <label className="block mb-2">Avatar Type
            <select value={settings.type || 'human'} onChange={e => saveSettings({ ...settings, type: e.target.value })} className="ml-2 bg-gray-800 text-white">
              {AVATAR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block mb-2">Environment
            <select value={settings.env || 'Office'} onChange={e => saveSettings({ ...settings, env: e.target.value })} className="ml-2 bg-gray-800 text-white">
              {ENVIRONMENTS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </label>
          <label className="block mb-2">Quality
            <select value={settings.quality || 'high'} onChange={e => saveSettings({ ...settings, quality: e.target.value })} className="ml-2 bg-gray-800 text-white">
              {['low','medium','high','ultra','ai-enhanced'].map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </label>
          <button className="mt-2 px-3 py-1 bg-cyan-700 rounded" onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </motion.div>
  );
} 