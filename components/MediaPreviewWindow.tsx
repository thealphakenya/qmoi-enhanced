import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function MediaPreviewWindow() {
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'movie'|'youtube'|'audio'|''>('');

  function handlePreview(url: string, type: 'movie'|'youtube'|'audio') {
    setMediaUrl(url);
    setMediaType(type);
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-lg">
      <CardContent>
        <h3 className="font-bold mb-2">Media Preview</h3>
        <div className="mb-2">
          <input type="text" placeholder="Paste movie/YouTube/audio URL" className="border p-1 rounded w-2/3 mr-2" id="media-url" />
          <Button size="sm" onClick={() => {
            const input = document.getElementById('media-url') as HTMLInputElement;
            if (input && input.value) {
              if (input.value.includes('youtube.com') || input.value.includes('youtu.be')) handlePreview(input.value, 'youtube');
              else if (input.value.match(/\.(mp4|webm|mov)$/)) handlePreview(input.value, 'movie');
              else if (input.value.match(/\.(mp3|wav|ogg)$/)) handlePreview(input.value, 'audio');
            }
          }}>Preview</Button>
        </div>
        {mediaUrl && mediaType === 'movie' && (
          <video src={mediaUrl} controls className="w-full rounded" />
        )}
        {mediaUrl && mediaType === 'audio' && (
          <audio src={mediaUrl} controls className="w-full" />
        )}
        {mediaUrl && mediaType === 'youtube' && (
          <iframe
            src={`https://www.youtube.com/embed/${mediaUrl.split('v=')[1] || mediaUrl.split('/').pop()}`}
            className="w-full aspect-video rounded"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="YouTube Preview"
          />
        )}
      </CardContent>
    </Card>
  );
}
