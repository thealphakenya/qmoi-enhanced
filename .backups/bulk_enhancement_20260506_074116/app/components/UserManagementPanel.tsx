import React from 'react';

export default function UserManagementPanel() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">User Management Panel</h3>
      <p className="text-slate-400 mb-4">User account management and role administration.</p>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm">Total Users</span>
            <span className="text-blue-400 font-semibold">12,847</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">8,421</div>
              <div className="text-xs text-slate-400">Active</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">3,126</div>
              <div className="text-xs text-slate-400">Inactive</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">1,300</div>
              <div className="text-xs text-slate-400">Suspended</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-slate-300 text-sm mb-3">Recent Users</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">JD</div>
                <div>
                  <div className="text-slate-300 text-sm">John Doe</div>
                  <div className="text-slate-400 text-xs">Master Admin</div>
                </div>
              </div>
              <div className="text-green-400 text-xs">Active</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">SM</div>
                <div>
                  <div className="text-slate-300 text-sm">Sarah Miller</div>
                  <div className="text-slate-400 text-xs">Sister Admin</div>
                </div>
              </div>
              <div className="text-green-400 text-xs">Active</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">MB</div>
                <div>
                  <div className="text-slate-300 text-sm">Mike Brown</div>
                  <div className="text-slate-400 text-xs">User</div>
                </div>
              </div>
              <div className="text-yellow-400 text-xs">Pending</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
            Add User
          </button>
          <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg text-sm font-medium">
            Manage Roles
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
