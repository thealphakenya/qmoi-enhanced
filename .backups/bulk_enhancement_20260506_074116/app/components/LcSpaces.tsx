import React from 'react';

export default function LcSpaces() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">LC Spaces</h3>
      <p className="text-slate-400 mb-4">Learning community spaces and collaborative environments.</p>
      <div className="space-y-3">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-orange-400 text-2xl mb-2">📚</div>
          <div className="text-sm text-slate-300">Learning Hub</div>
          <div className="text-xs text-slate-400 mt-1">Educational resources</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-teal-400 text-2xl mb-2">🤝</div>
          <div className="text-sm text-slate-300">Collaboration Zone</div>
          <div className="text-xs text-slate-400 mt-1">Team workspaces</div>
        </div>
      </div>
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
