import React from "react";

export default function LCHub() {
  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">LC Hub</h1>
        <p className="text-slate-300 mb-8">Central hub for lifecycle coordination and cross-service messaging.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-3">Workflow Control</h2>
            <p className="text-slate-400">Manage lifecycle events, triggers, and dependency orchestration.</p>
          </div>
          <div className="rounded-2xl bg-slate-900 p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-3">Channel Health</h2>
            <p className="text-slate-400">Review channel status and communication metrics in real time.</p>
          </div>
        </div>
      </div>
    </main>
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
