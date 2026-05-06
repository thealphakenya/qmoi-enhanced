import React from 'react';

export default function WorkflowAutomationEngine() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Workflow Automation Engine</h3>
      <p className="text-slate-400 mb-4">Automated workflow creation and process management.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm">Active Workflows</span>
            <span className="text-green-400 font-semibold">18 running</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-blue-400">12</div>
              <div className="text-xs text-slate-400">Automated</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">4</div>
              <div className="text-xs text-slate-400">Semi-auto</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">2</div>
              <div className="text-xs text-slate-400">Manual</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Workflow Performance</div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Task Completion Rate</span>
                <span className="text-slate-300">94.2%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Average Processing Time</span>
                <span className="text-slate-300">2.3 min</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Recent Workflows</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">User Onboarding</div>
                <div className="text-slate-400 text-xs">Automated • 45 tasks completed</div>
              </div>
              <div className="text-green-400 text-xs">Running</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Data Processing Pipeline</div>
                <div className="text-slate-400 text-xs">Semi-automated • 12 tasks pending</div>
              </div>
              <div className="text-yellow-400 text-xs">Paused</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Create Workflow
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-sm font-medium">
            View All
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
