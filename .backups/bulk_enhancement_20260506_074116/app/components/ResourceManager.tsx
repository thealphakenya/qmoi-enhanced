import React from 'react';

export default function ResourceManager() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Resource Manager</h3>
      <p className="text-slate-400 mb-4">System resource allocation and optimization tools.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm">Resource Allocation</span>
            <span className="text-blue-400 font-semibold">Optimized</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">45%</div>
              <div className="text-xs text-slate-400">CPU</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">67%</div>
              <div className="text-xs text-slate-400">Memory</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">23%</div>
              <div className="text-xs text-slate-400">Storage</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">89%</div>
              <div className="text-xs text-slate-400">Network</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Resource Pools</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QMOI AI Compute Pool</div>
                <div className="text-slate-400 text-xs">8 cores allocated • 32GB RAM</div>
              </div>
              <div className="text-green-400 text-xs">Active</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QMOI Space Storage Pool</div>
                <div className="text-slate-400 text-xs">500GB allocated • 120GB used</div>
              </div>
              <div className="text-green-400 text-xs">Active</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QCity Database Pool</div>
                <div className="text-slate-400 text-xs">16 cores allocated • 64GB RAM</div>
              </div>
              <div className="text-yellow-400 text-xs">Scaling</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">QVillage Backup Pool</div>
                <div className="text-slate-400 text-xs">2TB allocated • 800GB used</div>
              </div>
              <div className="text-green-400 text-xs">Active</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Resource Trends</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">CPU Usage Trend</span>
              <span className="text-green-400">↓ 5% from last week</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Memory Efficiency</span>
              <span className="text-blue-400">↑ 12% optimization</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Storage Growth</span>
              <span className="text-yellow-400">+ 45GB this month</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Optimize Resources
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-sm font-medium">
            View Details
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
