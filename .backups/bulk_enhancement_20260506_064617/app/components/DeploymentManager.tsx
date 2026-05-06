import React from 'react';

export default function DeploymentManager() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Deployment Manager</h3>
      <p className="text-slate-400 mb-4">Application deployment and release management.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm">Current Deployment</span>
            <span className="text-green-400 font-semibold">v2.1.3 - Production</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">99.8%</div>
              <div className="text-xs text-slate-400">Success Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">3.2min</div>
              <div className="text-xs text-slate-400">Avg Deploy</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">24</div>
              <div className="text-xs text-slate-400">This Month</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Deployment Pipeline</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">✓</span>
              </div>
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Build</div>
                <div className="text-slate-400 text-xs">Completed 5 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">✓</span>
              </div>
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Test</div>
                <div className="text-slate-400 text-xs">All tests passed</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">○</span>
              </div>
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Deploy to Staging</div>
                <div className="text-slate-400 text-xs">In progress...</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-slate-400 text-xs font-semibold">○</span>
              </div>
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Deploy to Production</div>
                <div className="text-slate-400 text-xs">Pending approval</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            New Deployment
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-sm font-medium">
            Rollback
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
