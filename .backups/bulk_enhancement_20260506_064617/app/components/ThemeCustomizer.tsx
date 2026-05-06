import React from 'react';

export default function ThemeCustomizer() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Theme Customizer</h3>
      <p className="text-slate-400 mb-4">UI personalization and theme customization controls.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-slate-300 text-sm mb-2">Dark Theme</div>
          <div className="w-full h-8 bg-slate-900 rounded border border-slate-600"></div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <div className="text-slate-300 text-sm mb-2">Light Theme</div>
          <div className="w-full h-8 bg-gray-100 rounded border border-gray-300"></div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm text-slate-300 mb-2">Accent Colors</div>
        <div className="flex gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
          <div className="w-6 h-6 bg-green-500 rounded-full"></div>
          <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
          <div className="w-6 h-6 bg-red-500 rounded-full"></div>
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
