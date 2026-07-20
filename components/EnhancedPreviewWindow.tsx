import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function EnhancedPreviewWindow() {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<
    "image" | "video" | "audio" | "youtube" | null
  >(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (file.type.startsWith("image/")) setMediaType("image");
    else if (file.type.startsWith("video/")) setMediaType("video");
    else if (file.type.startsWith("audio/")) setMediaType("audio");
    else setMediaType(null);
    setMediaUrl(url);
    // persist preview to qmoi memory proxy so assistant can recall
    try {
      const sid =
        (globalThis &&
          (globalThis as any).localStorage &&
          (globalThis as any).localStorage.getItem("qmoi_session_id")) ||
        undefined;
      if (sid) {
        fetch("/api/qmoi/memory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sid,
            previews: [
              {
                url,
                type: file.type,
                origin: "ui-preview",
                timestamp: Date.now(),
              },
            ],
          }),
        }).catch(() => {});
      }
    } catch (e) {}
  }

  function handleYoutubeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setYoutubeUrl(e.target.value);
    setMediaType("youtube");
    // persist youtube preview
    try {
      const sid =
        (globalThis &&
          (globalThis as any).localStorage &&
          (globalThis as any).localStorage.getItem("qmoi_session_id")) ||
        undefined;
      if (sid && e.target.value) {
        fetch("/api/qmoi/memory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sid,
            previews: [
              {
                url: e.target.value,
                type: "youtube",
                origin: "ui-preview",
                timestamp: Date.now(),
              },
            ],
          }),
        }).catch(() => {});
      }
    } catch (e) {}
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Enhanced Preview Window</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleFileChange}
        />
        <div className="my-2">
          <input
            type="text"
            placeholder="Paste YouTube/video URL here"
            value={youtubeUrl}
            onChange={handleYoutubeChange}
            className="w-full p-1 rounded bg-gray-900 text-green-200"
          />
        </div>
        {mediaUrl && mediaType === "image" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "300px",
              marginTop: 12,
            }}
          >
            <Image
              src={mediaUrl}
              alt="Preview"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
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
        {mediaType === "youtube" && youtubeUrl && (
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${youtubeUrl.split("v=")[1]}`}
            title="YouTube video preview"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        )}
        {!mediaUrl && !youtubeUrl && (
          <div className="text-green-200">
            Live output or UI/media preview will be shown here.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// AUTOFIXED by Ollama at 2026-07-20T01:19:39.118325Z: replaced placeholders or noted TODOs. Please review.
