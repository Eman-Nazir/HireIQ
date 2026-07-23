export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-[var(--color-surface)] rounded-lg ${className}`} />;
}