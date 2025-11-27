import React from 'react';

export interface PreviewWindowProps {
  content?: string;
  fileName?: string;
  mimeType?: string;
}

export function PreviewWindow({ content = '', fileName = 'preview.txt', mimeType = 'text/plain' }: PreviewWindowProps) {
  if (!content) return <div className="p-4 text-sm text-gray-600">No preview available</div>;

  if (mimeType.startsWith('image/')) {
    return (
      <div className="p-2">
        <img src={content} alt={fileName} style={{ maxWidth: '100%' }} />
      </div>
    );
  }

  if (mimeType === 'text/html') {
    return (
      <div className="p-2">
        <iframe title={fileName} srcDoc={content} style={{ width: '100%', height: 400, border: 'none' }} />
      </div>
    );
  }

  return (
    <div className="p-2">
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 400, overflow: 'auto' }}>{content}</pre>
    </div>
  );
}

export default PreviewWindow;
