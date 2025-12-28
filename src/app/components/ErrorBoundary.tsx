import type React from 'react';
import type {ReactNode, ErrorInfo} from 'react';
import { Component } from 'react';

import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from './ui/button';
import { Card } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    this.props.onReset?.();
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = import.meta.env.DEV;

      return (
        <Card className="p-8 bg-red-500/10 border-red-500/20">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-4 max-w-md mx-auto">
              {this.state.error?.message || 'An unexpected error occurred while loading this section.'}
            </p>

            <div className="flex justify-center gap-2 mb-4">
              <Button
                className="border-red-400/30 text-red-400 hover:bg-red-500/10"
                variant="outline"
                onClick={this.handleReset}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              {isDev && this.state.errorInfo && (
                <Button
                  className="text-gray-400 hover:text-white"
                  variant="ghost"
                  onClick={this.toggleDetails}
                >
                  {this.state.showDetails ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show Details
                    </>
                  )}
                </Button>
              )}
            </div>

            {isDev && this.state.showDetails && this.state.errorInfo && (
              <div className="mt-4 p-4 rounded-lg bg-gray-900/50 border border-white/10 text-left">
                <p className="text-xs font-mono text-red-300 mb-2 break-all">
                  {this.state.error?.stack}
                </p>
                <pre className="text-xs text-gray-500 overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap a component with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
  WithErrorBoundary.displayName = `WithErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithErrorBoundary;
}

export default ErrorBoundary;
