import React from 'react';

export default function SecurityMonitor() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Security Monitor</h3>
      <p className="text-slate-400 mb-4">Real-time security monitoring and threat detection.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Security Status</span>
            <span className="text-green-400 font-semibold">SECURE</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-900 p-2 rounded">
              <div className="text-green-400 text-xs">Firewall</div>
              <div className="text-green-300 text-sm font-semibold">Active</div>
            </div>
            <div className="bg-green-900 p-2 rounded">
              <div className="text-green-400 text-xs">Encryption</div>
              <div className="text-green-300 text-sm font-semibold">Enabled</div>
            </div>
            <div className="bg-green-900 p-2 rounded">
              <div className="text-green-400 text-xs">2FA</div>
              <div className="text-green-300 text-sm font-semibold">Required</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-2">Recent Activity</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Login attempt blocked</span>
              <span className="text-red-400">2 min ago</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Security scan completed</span>
              <span className="text-green-400">15 min ago</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Certificate renewed</span>
              <span className="text-blue-400">1 hour ago</span>
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
