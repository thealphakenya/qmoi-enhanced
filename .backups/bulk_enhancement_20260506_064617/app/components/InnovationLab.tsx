import React from 'react';

export default function InnovationLab() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Innovation Lab</h3>
      <p className="text-slate-400 mb-4">Experimental features and cutting-edge technology development.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm">Active Experiments</span>
            <span className="text-purple-400 font-semibold">12 projects</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">5</div>
              <div className="text-xs text-slate-400">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">4</div>
              <div className="text-xs text-slate-400">In Testing</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">3</div>
              <div className="text-xs text-slate-400">In Development</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Featured Projects</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Quantum AI Processor</div>
                <div className="text-slate-400 text-xs">Next-gen AI processing • 85% complete</div>
              </div>
              <div className="text-blue-400 text-xs">Beta</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Neural Space Networks</div>
                <div className="text-slate-400 text-xs">Advanced space optimization • 67% complete</div>
              </div>
              <div className="text-yellow-400 text-xs">Testing</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Holographic Interfaces</div>
                <div className="text-slate-400 text-xs">3D UI innovation • 42% complete</div>
              </div>
              <div className="text-purple-400 text-xs">Research</div>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
              <div className="flex-1">
                <div className="text-slate-300 text-sm">Autonomous Learning Systems</div>
                <div className="text-slate-400 text-xs">Self-improving AI • 91% complete</div>
              </div>
              <div className="text-green-400 text-xs">Ready</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Innovation Metrics</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">R&D Investment</span>
              <span className="text-green-400">$2.4M this quarter</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Patents Filed</span>
              <span className="text-blue-400">18 this year</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Breakthrough Rate</span>
              <span className="text-purple-400">73% success rate</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Time to Market</span>
              <span className="text-yellow-400">4.2 months avg</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Join Lab
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-sm font-medium">
            View Projects
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
