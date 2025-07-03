import React, { useEffect, useState } from 'react';

export default function PluginPanel() {
  const [plugins, setPlugins] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/qcity/plugins')
      .then(r => r.json())
      .then(data => setPlugins(data.plugins || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Plugins</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? <div className="text-gray-400">Loading...</div> : (
        <ul className="text-xs text-gray-300">
          {plugins.map((p, i) => (
            <li key={i} className="mb-1 flex items-center gap-2">
              <span>{p}</span>
              <button className="px-2 py-1 bg-gray-700 rounded text-white text-xs">Disable</button>
              <span className="text-green-400">Loaded</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 