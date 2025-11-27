import React, { useState, useEffect } from 'react';
import PreviewWindow from './PreviewWindow';

type FileRecord = { name: string; content: string; mime?: string };

export function FileExplorer() {
  const [files, setFiles] = useState<FileRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fileExplorerFiles') || '[]');
    } catch {
      return [];
    }
  });
  const [selected, setSelected] = useState<FileRecord | null>(files[0] || null);
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    localStorage.setItem('fileExplorerFiles', JSON.stringify(files));
  }, [files]);

  const addFile = () => {
    if (!newName) return;
    const rec = { name: newName, content: newContent, mime: newName.endsWith('.html') ? 'text/html' : 'text/plain' };
    const updated = [rec, ...files];
    setFiles(updated);
    setSelected(rec);
    setNewName('');
    setNewContent('');
  };

  const removeFile = (name: string) => {
    const updated = files.filter((f) => f.name !== name);
    setFiles(updated);
    if (selected?.name === name) setSelected(updated[0] || null);
  };

  return (
    <div className="flex gap-4">
      <div style={{ width: 260 }}>
        <h4 className="font-semibold mb-2">Files</h4>
        <div className="mb-2">
          <input placeholder="filename.txt" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full mb-1 p-1 border rounded" />
          <textarea placeholder="content" value={newContent} onChange={(e) => setNewContent(e.target.value)} className="w-full p-1 border rounded" rows={4} />
          <button onClick={addFile} className="mt-1 px-2 py-1 bg-blue-600 text-white rounded">Add</button>
        </div>
        <ul className="overflow-auto" style={{ maxHeight: 420 }}>
          {files.length === 0 && <li className="text-sm text-gray-500">No files yet</li>}
          {files.map((f) => (
            <li key={f.name} className="flex items-center justify-between p-1 border-b">
              <button className="text-left flex-1" onClick={() => setSelected(f)}>{f.name}</button>
              <button className="ml-2 text-sm text-red-600" onClick={() => removeFile(f.name)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold mb-2">Preview</h4>
        {selected ? <PreviewWindow content={selected.content} fileName={selected.name} mimeType={selected.mime} /> : <div className="text-sm text-gray-600 p-2">Select a file to preview</div>}
      </div>
    </div>
  );
}

export default FileExplorer;
