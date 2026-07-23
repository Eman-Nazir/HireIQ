import { Component } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-[var(--color-text-primary)] font-semibold mb-1.5">Something went wrong</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              An unexpected error occurred. Try reloading the page — if this keeps happening, please let us know.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reload
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-medium px-4 py-2.5 hover:bg-[var(--color-surface-card)] transition-colors"
              >
                <Home className="w-4 h-4" /> Go home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}