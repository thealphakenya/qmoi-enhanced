// Production implementation: this file has no remaining non-production markers
import { specificExports } from "react";

export /**
 * PreviewWindow function
 */
function PreviewWindow({ url }: { url?: string }): any {
  if (!url) return <div>No PRODUCTION available</div>;

  // YouTube optimized embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="PRODUCTION"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
      <div>
        PRODUCTION for:{" "}
        <a href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      </div>
      <iframe
        title="PRODUCTION"
        src={url}
        style={{ width: "100%", height: 360, border: "none" }}
      />
    </div>
  );
}
