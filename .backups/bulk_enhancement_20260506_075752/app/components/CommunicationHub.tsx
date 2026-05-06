import React from 'react';

export default function CommunicationHub() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Communication Hub</h3>
      <p className="text-slate-400 mb-4">Unified communication and collaboration platform.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm">Active Channels</span>
            <span className="text-green-400 font-semibold">12 channels</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-blue-400">8</div>
              <div className="text-xs text-slate-400">Team</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">3</div>
              <div className="text-xs text-slate-400">Project</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">1</div>
              <div className="text-xs text-slate-400">General</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Recent Messages</div>
          <div className="space-y-2">
            <div className="flex gap-3 p-2 bg-slate-700 rounded">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">JD</div>
              <div className="flex-1">
                <div className="text-slate-300 text-sm">#qmo-ai-dev</div>
                <div className="text-slate-400 text-xs">John: Updated the AI model configuration</div>
              </div>
              <div className="text-slate-500 text-xs">5m</div>
            </div>
            <div className="flex gap-3 p-2 bg-slate-700 rounded">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">SM</div>
              <div className="flex-1">
                <div className="text-slate-300 text-sm">#space-optimization</div>
                <div className="text-slate-400 text-xs">Sarah: Space optimization completed successfully</div>
              </div>
              <div className="text-slate-500 text-xs">12m</div>
            </div>
            <div className="flex gap-3 p-2 bg-slate-700 rounded">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">MB</div>
              <div className="flex-1">
                <div className="text-slate-300 text-sm">#qcity-updates</div>
                <div className="text-slate-400 text-xs">Mike: New QCity features deployed to staging</div>
              </div>
              <div className="text-slate-500 text-xs">1h</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Communication Tools</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-700 rounded text-center">
              <div className="text-slate-300 text-sm mb-1">Video Calls</div>
              <div className="text-green-400 text-xs">3 active</div>
            </div>
            <div className="p-3 bg-slate-700 rounded text-center">
              <div className="text-slate-300 text-sm mb-1">Voice Channels</div>
              <div className="text-blue-400 text-xs">5 available</div>
            </div>
            <div className="p-3 bg-slate-700 rounded text-center">
              <div className="text-slate-300 text-sm mb-1">File Sharing</div>
              <div className="text-purple-400 text-xs">2.1GB today</div>
            </div>
            <div className="p-3 bg-slate-700 rounded text-center">
              <div className="text-slate-300 text-sm mb-1">Integrations</div>
              <div className="text-yellow-400 text-xs">8 connected</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Start Chat
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-sm font-medium">
            Join Call
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
