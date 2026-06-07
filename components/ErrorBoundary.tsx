import React from 'react';
import { log as logger } from '@/lib/logger';

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    logger.error('React ErrorBoundary caught an error', error as any, { errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary px-4 py-6 rounded-lg bg-red-50 text-red-700">
          <h2 className="text-lg font-semibold">Something went wrong.</h2>
          <p>Please refresh the page or contact support if the problem persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

