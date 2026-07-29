import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}


<!-- MERGED FROM ARCHIVE: /workspaces/qmoi-enhanced/backups/src.backup.20260121144720/components/PreviewWindow.tsx -->
import React from "react";

export function PreviewWindow({ url }: { url?: string }) {
  if (!url) return <div>No preview available</div>;

  // YouTube quick embed support
  const youtubeMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return (
      <div style={{ width: "100%", height: 360 }}>
        <iframe
          title="preview"
          src={`https://www.youtube.com/embed/${id}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}
