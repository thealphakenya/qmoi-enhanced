import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DownloadAppButton } from "@/components/DownloadAppButton"

export function PreviewWindow() {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image'|'video'|'audio'|null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) setMediaType('image');
    else if (file.type.startsWith('video/')) setMediaType('video');
    else if (file.type.startsWith('audio/')) setMediaType('audio');
    else setMediaType(null);
    setMediaUrl(url);
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Preview Window</CardTitle>
      </CardHeader>
      <CardContent>
        <input type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} />
        {mediaUrl && mediaType === 'image' && <img src={mediaUrl} alt="Preview" style={{ maxWidth: '100%', marginTop: 12 }} />}
        {mediaUrl && mediaType === 'video' && <video src={mediaUrl} controls style={{ maxWidth: '100%', marginTop: 12 }} />}
        {mediaUrl && mediaType === 'audio' && <audio src={mediaUrl} controls style={{ width: '100%', marginTop: 12 }} />}
        {!mediaUrl && <div className="text-green-200">Live output or UI preview will be shown here.</div>}
        <DownloadAppButton />
      </CardContent>
    </Card>
  )
}
