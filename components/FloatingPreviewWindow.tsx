import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FaTimes, FaDownload, FaPlay, FaPause, FaVolumeUp, FaExpand } from 'react-icons/fa';

// Utility for file download
function downloadFile(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

interface PreviewContent {
  type: string;
  url: string;
}

interface FloatingPreviewWindowProps {
  onClose: () => void;
  content: PreviewContent | null;
  onContentChange: (content: PreviewContent | null) => void;
}

export function FloatingPreviewWindow({ onClose, content, onContentChange }: FloatingPreviewWindowProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!open) return (
    <Button className="fixed bottom-4 right-4 z-50" onClick={() => setOpen(true)}>Open Preview</Button>
  );

  return (
    <Card className={`fixed bottom-4 right-4 w-96 shadow-lg ${isFullscreen ? 'w-screen h-screen' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between p-2">
        <CardTitle className="text-sm">Preview Window</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={handleFullscreen}>
            <FaExpand />
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <FaTimes />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {content ? (
          <div className="space-y-2">
            {content.type.startsWith('video/') && (
              <video
                src={content.url}
                controls
                className="w-full rounded"
                autoPlay={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            )}
            {content.type.startsWith('image/') && (
              <img src={content.url} alt="Preview" className="w-full rounded" />
            )}
            {content.type.startsWith('audio/') && (
              <audio
                src={content.url}
                controls
                className="w-full"
                autoPlay={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            )}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handlePlayPause}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </Button>
              <div className="flex items-center gap-2 flex-1">
                <FaVolumeUp />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full"
                />
      </div>
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <FaDownload />
        </Button>
            </div>
            {downloadProgress > 0 && (
              <div className="space-y-1">
                <Progress value={downloadProgress} className="w-full" />
                <p className="text-xs text-gray-500">Downloading... {downloadProgress.toFixed(1)}%</p>
              </div>
            )}
      </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No content to preview
    </div>
        )}
      </CardContent>
    </Card>
  );
}
