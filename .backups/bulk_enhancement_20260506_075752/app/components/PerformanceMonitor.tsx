import React from 'react';

export default function PerformanceMonitor() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Performance Monitor</h3>
      <p className="text-slate-400 mb-4">System performance metrics and optimization tools.</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">98.5%</div>
          <div className="text-slate-300 text-sm">Uptime</div>
          <div className="text-xs text-slate-400 mt-1">Last 30 days</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">245ms</div>
          <div className="text-slate-300 text-sm">Avg Response</div>
          <div className="text-xs text-slate-400 mt-1">API calls</div>
        </div>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="text-slate-300 text-sm mb-3">Resource Usage</div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">CPU</span>
              <span className="text-slate-300">45%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '45%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Memory</span>
              <span className="text-slate-300">67%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{width: '67%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Storage</span>
              <span className="text-slate-300">23%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{width: '23%'}}></div>
            </div>
          </div>
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
