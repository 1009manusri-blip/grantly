import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Safe console logging for debugging
    console.error('GRANTLY Runtime Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      window.location.href = window.location.pathname;
    } catch {
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#F4F7FF] via-[#EAF1FF] to-[#F4F7FF] text-[#172554] font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-blue-200/80 shadow-[0_12px_40px_rgb(65,105,225,0.08)] text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold font-['Space_Grotesk'] text-[#172554]">
                Something interrupted this view
              </h1>
              <p className="text-xs text-[#506184] leading-relaxed">
                An unexpected interface issue occurred. Your saved progress is stored safely in your browser.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#4169E1] hover:bg-[#3252BF] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#4169E1]/20 active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#EAF1FF] hover:bg-[#D5E4FF] text-[#4169E1] text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>
            </div>

            {this.state.error && (
              <details className="text-left text-[11px] text-[#506184] bg-[#F4F7FF] p-3 rounded-xl border border-blue-100/70">
                <summary className="cursor-pointer font-bold text-[#172554]">
                  Technical diagnostic details
                </summary>
                <p className="mt-2 font-mono text-[10px] text-red-600 break-words">
                  {this.state.error.toString()}
                </p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
