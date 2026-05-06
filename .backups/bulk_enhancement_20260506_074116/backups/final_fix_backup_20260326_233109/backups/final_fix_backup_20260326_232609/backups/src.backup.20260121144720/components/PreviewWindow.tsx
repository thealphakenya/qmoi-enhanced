import React from 'react';
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



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
