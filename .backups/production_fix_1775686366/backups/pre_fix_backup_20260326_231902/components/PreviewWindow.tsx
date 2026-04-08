// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

//  this file has no remaining non-production markers
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DownloadAppButton } from "@/components/DownloadAppButton";

export default function PreviewWindow({ url }: { url?: string }) {
  // If a URL is provided via props, prefer rendering an external preview
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<
    "image" | "video" | "audio" | null
  >(null);

  // If parent passes a `url`, show it in the preview area
  if (url) {
    // YouTube quick embed support
    const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
    if (youtubeMatch) {
      const id = youtubeMatch[1];
      return (
        <Card className="mb-4 qmoi-card">
          <CardHeader>
            <CardTitle>Preview Window</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 360 }}>
              <iframe
                title="preview"
                src={`https://www.youtube.com/embed/${id}`}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <DownloadAppButton />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-4 qmoi-card">
        <CardHeader>
          <CardTitle>Preview Window</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            Preview for:{" "}
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </div>
          <iframe
            title="preview"
            src={url}
            style={{ width: "100%", height: 360, border: "none" }}
          />
          <DownloadAppButton />
        </CardContent>
      </Card>
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (file.type.startsWith("image/")) setMediaType("image");
    else if (file.type.startsWith("video/")) setMediaType("video");
    else if (file.type.startsWith("audio/")) setMediaType("audio");
    else setMediaType(null);
    setMediaUrl(url);
  }

  return (
    <Card className="mb-4 qmoi-card">
      <CardHeader>
        <CardTitle>Preview Window</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleFileChange}
        />
        {mediaUrl && mediaType === "image" && (
          <img
            src={mediaUrl}
            alt="Preview"
            style={{ maxWidth: "100%", marginTop: 12 }}
          />
        )}
        {mediaUrl && mediaType === "video" && (
          <video
            src={mediaUrl}
            controls
            style={{ maxWidth: "100%", marginTop: 12 }}
          />
        )}
        {mediaUrl && mediaType === "audio" && (
          <audio
            src={mediaUrl}
            controls
            style={{ width: "100%", marginTop: 12 }}
          />
        )}
        {!mediaUrl && (
          <div className="text-green-200">
            Live output or UI preview will be shown here.
          </div>
        )}
        <DownloadAppButton />
      </CardContent>
    </Card>
  );
}
