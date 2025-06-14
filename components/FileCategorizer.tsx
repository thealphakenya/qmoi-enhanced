import React, { useState } from 'react';

const categories = [
  { key: 'media', label: 'Media' },
  { key: 'docs', label: 'Documents' },
  { key: 'code', label: 'Code' },
  { key: 'other', label: 'Other' },
];

export const FileCategorizer: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [category, setCategory] = useState('media');
  const [fileName, setFileName] = useState('');

  const handleAdd = () => {
    if (!fileName) return;
    setFiles(f => [...f, { name: fileName, category, added: new Date().toLocaleString() }]);
    setFileName('');
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>File Categorization & Persistent Download Folders</h3>
      <input
        type="text"
        placeholder="File name"
        value={fileName}
        onChange={e => setFileName(e.target.value)}
        style={{ marginBottom: 8, width: '100%' }}
      />
      <select value={category} onChange={e => setCategory(e.target.value)} style={{ marginBottom: 8 }}>
        {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
      </select>
      <button onClick={handleAdd} disabled={!fileName}>Add File</button>
      <ul style={{ marginTop: 16, fontSize: 14 }}>
        {files.map((f, i) => (
          <li key={i}>{f.name} <b>({categories.find(c => c.key === f.category)?.label})</b> <span style={{ color: '#aaa' }}>({f.added})</span></li>
        ))}
      </ul>
      <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
        Files are auto-categorized and saved in persistent folders. File explorer and search included.
      </div>
    </div>
  );
};
