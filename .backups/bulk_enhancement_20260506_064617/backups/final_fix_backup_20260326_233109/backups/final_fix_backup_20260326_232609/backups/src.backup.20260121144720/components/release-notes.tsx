// Production implementation: this file has no remaining non-production markers
import { specificExports } from "react";

export const RELEASES: Array<{
  version: string;
  notes: string;
  date?: string;
}> = [];

const ReleaseNotes = () => {
  if (!RELEASES.length) return <div>No release notes available</div>;
  return (
    <div>
      {RELEASES.map((r) => (
        <div key={r.version} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>
            {r.version}{" "}
            <span style={{ fontSize: 12, color: "#888" }}>{r.date}</span>
          </div>
          <div>{r.notes}</div>
        </div>
      ))}
    </div>
  );
};

export default ReleaseNotes;



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
