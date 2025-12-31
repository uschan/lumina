import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-red-500/20 rounded-2xl p-8 shadow-xl text-center">
              <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h1 className="text-2xl font-bold mb-2">System Malfunction</h1>
              <p className="text-muted-foreground mb-8">
                The laboratory encountered an unexpected anomaly. Our protocols are resetting.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors"
              >
                <RefreshCcw size={16} />
                Reinitialize System
              </button>
            </div>
         </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;