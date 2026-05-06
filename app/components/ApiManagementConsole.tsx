import React from 'react';

export default function ApiManagementConsole() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">API Management Console</h3>
      <p className="text-slate-400 mb-4">API endpoint management and monitoring dashboard.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm">API Health</span>
            <span className="text-green-400 font-semibold">All Systems Operational</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">99.9%</div>
              <div className="text-xs text-slate-400">Uptime</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">1.2s</div>
              <div className="text-xs text-slate-400">Avg Response</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">45K</div>
              <div className="text-xs text-slate-400">Requests/min</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">API Endpoints</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">GET /api/users</div>
                <div className="text-slate-400 text-xs">User management endpoint</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-xs">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">POST /api/transactions</div>
                <div className="text-slate-400 text-xs">Transaction processing</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-xs">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">GET /api/analytics</div>
                <div className="text-slate-400 text-xs">Analytics data retrieval</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-400 text-xs">Maintenance</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Add Endpoint
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-sm font-medium">
            API Docs
          </button>
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
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}
