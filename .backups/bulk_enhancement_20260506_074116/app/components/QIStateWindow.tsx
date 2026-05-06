import React from 'react';

export default function QIStateWindow() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">QI State Window</h3>
      <p className="text-slate-400 mb-4">Real-time AI state monitoring and intelligence status.</p>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Memory Sync</span>
          <span className="text-green-400">Active</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Learning Mode</span>
          <span className="text-blue-400">Continuous</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Response Quality</span>
          <span className="text-emerald-400">High</span>
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
