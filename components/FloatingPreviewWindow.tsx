import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Utility for file download
function downloadFile(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function FloatingPreviewWindow() {
  const [open, setOpen] = useState(true);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image'|'video'|'audio'|'pdf'|'zip'|'unzip'|'doc'|'browser'|'other'|null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  // Drag logic
  function onMouseDown(e: React.MouseEvent) {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }
  function onMouseMove(e: MouseEvent) {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    }
  }
  function onMouseUp() {
    setDragging(false);
  }
  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });

  // File input handler
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) setMediaType('image');
    else if (file.type.startsWith('video/')) setMediaType('video');
    else if (file.type.startsWith('audio/')) setMediaType('audio');
    else if (file.type === 'application/pdf') setMediaType('pdf');
    else if (file.type === 'application/zip' || file.name.endsWith('.zip')) setMediaType('zip');
    else setMediaType('other');
    setMediaUrl(url);
  }

  // YouTube handler
  function handleYoutubeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setYoutubeUrl(e.target.value);
    setMediaType('video');
  }

  // Browser logic
  const [browserUrl, setBrowserUrl] = useState<string>("");
  function handleBrowserChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBrowserUrl(e.target.value);
    setMediaType('browser');
  }

  // Text/code/doc editing logic
  const [textContent, setTextContent] = useState<string>("");
  function handleTextEdit(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextContent(e.target.value);
    setMediaType('other');
  }

  // Download logic
  function handleDownload() {
    if (mediaUrl && mediaType) {
      const ext = mediaType === 'video' ? 'mp4' : mediaType === 'audio' ? 'mp3' : mediaType;
      downloadFile(mediaUrl, `Alpha-Q-Downloads/${mediaType}.${ext}`);
    } else if (youtubeUrl) {
      // Simulate download options for YouTube
      alert('Choose format/size (simulated). Actual download handled by backend or extension.');
    }
  }

  if (!open) return (
    <Button className="fixed bottom-4 right-4 z-50" onClick={() => setOpen(true)}>Open Preview</Button>
  );

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-gray-900 text-green-200 rounded shadow-lg"
      style={{ left: position.x, top: position.y, width: 420, minHeight: 320, resize: 'both', overflow: 'auto' }}
    >
      <div className="flex justify-between items-center bg-gray-800 p-2 cursor-move rounded-t" onMouseDown={onMouseDown}>
        <span>Floating Preview Window</span>
        <Button size="sm" variant="outline" onClick={() => setOpen(false)}>Close</Button>
      </div>
      <div className="p-4">
        <input type="file" accept="image/*,video/*,audio/*,application/pdf,.zip,.txt,.md,.json,.js,.ts,.tsx,.py,.doc,.docx" onChange={handleFileChange} />
        <div className="my-2">
          <input type="text" placeholder="Paste YouTube/video URL here" value={youtubeUrl} onChange={handleYoutubeChange} className="w-full p-1 rounded bg-gray-900 text-green-200" />
        </div>
        <div className="my-2">
          <input type="text" placeholder="Enter website URL to browse" value={browserUrl} onChange={handleBrowserChange} className="w-full p-1 rounded bg-gray-900 text-green-200" />
        </div>
        {mediaUrl && mediaType === 'image' && <img src={mediaUrl} alt="Preview" style={{ maxWidth: '100%', marginTop: 12 }} />}
        {mediaUrl && mediaType === 'video' && <video src={mediaUrl} controls style={{ maxWidth: '100%', marginTop: 12 }} />}
        {mediaUrl && mediaType === 'audio' && <audio src={mediaUrl} controls style={{ width: '100%', marginTop: 12 }} />}
        {mediaUrl && mediaType === 'pdf' && <iframe src={mediaUrl} width="100%" height="400" title="PDF Preview" />}
        {mediaUrl && (mediaType === 'other' || mediaType === 'text') && (
          <textarea value={textContent} onChange={handleTextEdit} className="w-full h-40 bg-gray-900 text-green-200 rounded p-2 mt-2" placeholder="Edit file content here..." />
        )}
        {mediaType === 'browser' && browserUrl && (
          <iframe src={browserUrl} style={{ width: '100%', height: 300 }} title="Browser Preview" />
        )}
        {mediaType === 'video' && youtubeUrl && (
          <iframe width="100%" height="315" src={`https://www.youtube.com/embed/${youtubeUrl.split('v=')[1]}`} title="YouTube video preview" frameBorder="0" allowFullScreen></iframe>
        )}
        {!mediaUrl && !youtubeUrl && !browserUrl && <div className="text-green-200">Live output or UI/media preview will be shown here.</div>}
      </div>
      <div className="fixed bottom-4 right-4 flex flex-col items-center z-50">
        <Button className="bg-blue-700 text-white rounded-full shadow-lg" style={{ width: 64, height: 64 }} onClick={handleDownload}>
          Download
        </Button>
        <span className="text-xs mt-1">{mediaType === 'video' || youtubeUrl ? 'video or videos' : mediaType}</span>
      </div>
    </div>
  );
}
