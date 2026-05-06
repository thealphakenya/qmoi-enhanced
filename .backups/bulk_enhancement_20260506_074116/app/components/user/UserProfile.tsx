import React from "react";

export default function UserProfile() {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="text-2xl font-semibold text-white mb-3">User Profile</h2>
      <p className="text-slate-400">Review account details, profile settings, and role permissions.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 text-slate-300">
        <div className="rounded-2xl bg-slate-950 p-4">Name: Jane Doe</div>
        <div className="rounded-2xl bg-slate-950 p-4">Role: Administrator</div>
      </div>
    </section>
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
