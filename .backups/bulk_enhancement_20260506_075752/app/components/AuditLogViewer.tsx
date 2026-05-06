import React from 'react';

export default function AuditLogViewer() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Audit Log Viewer</h3>
      <p className="text-slate-400 mb-4">System activity audit logs and event tracking.</p>
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-300 text-sm">Recent Activity</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs">Filter</button>
            <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs">Export</button>
          </div>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <div className="flex gap-3 p-2 bg-slate-700 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-slate-300 text-sm">User login successful</div>
              <div className="text-slate-400 text-xs">john.doe@example.com • 2 minutes ago</div>
            </div>
          </div>
          <div className="flex gap-3 p-2 bg-slate-700 rounded">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-slate-300 text-sm">Data export completed</div>
              <div className="text-slate-400 text-xs">sarah.miller@example.com • 15 minutes ago</div>
            </div>
          </div>
          <div className="flex gap-3 p-2 bg-slate-700 rounded">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-slate-300 text-sm">Security scan initiated</div>
              <div className="text-slate-400 text-xs">system • 1 hour ago</div>
            </div>
          </div>
          <div className="flex gap-3 p-2 bg-slate-700 rounded">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-slate-300 text-sm">Failed login attempt</div>
              <div className="text-slate-400 text-xs">unknown • 2 hours ago</div>
            </div>
          </div>
          <div className="flex gap-3 p-2 bg-slate-700 rounded">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="text-slate-300 text-sm">Configuration updated</div>
              <div className="text-slate-400 text-xs">admin@example.com • 3 hours ago</div>
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
