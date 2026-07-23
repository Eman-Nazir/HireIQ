export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] p-5 ${className}`}>
      {children}
    </div>
  );
}