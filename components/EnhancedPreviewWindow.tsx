import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EnhancedPreviewWindow() {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image'|'video'|'audio'|'youtube'|null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");

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

  function handleYoutubeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setYoutubeUrl(e.target.value);
    setMediaType('youtube');
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Enhanced Preview Window</CardTitle>
      </CardHeader>
      <CardContent>
        <input type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} />
        <div className="my-2">
          <input type="text" placeholder="Paste YouTube/video URL here" value={youtubeUrl} onChange={handleYoutubeChange} className="w-full p-1 rounded bg-gray-900 text-green-200" />
        </div>
        {mediaUrl && mediaType === 'image' && <img src={mediaUrl} alt="Preview" style={{ maxWidth: '100%', marginTop: 12 }} />}
        {mediaUrl && mediaType === 'video' && <video src={mediaUrl} controls style={{ maxWidth: '100%', marginTop: 12 }} />}
        {mediaUrl && mediaType === 'audio' && <audio src={mediaUrl} controls style={{ width: '100%', marginTop: 12 }} />}
        {mediaType === 'youtube' && youtubeUrl && (
          <iframe width="100%" height="315" src={`https://www.youtube.com/embed/${youtubeUrl.split('v=')[1]}`} title="YouTube video preview" frameBorder="0" allowFullScreen></iframe>
        )}
        {!mediaUrl && !youtubeUrl && <div className="text-green-200">Live output or UI/media preview will be shown here.</div>}
      </CardContent>
    </Card>
  );
}