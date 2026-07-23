import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <SearchX className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Page not found</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-2.5 transition-colors">
          Go home
        </Link>
      </div>
    </div>
  );
}