export default function Input({ icon: Icon, className = '', ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />}
      <input
        className={`w-full rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] py-2.5 text-sm
          text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
          focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500
          ${Icon ? 'pl-10 pr-3' : 'px-3'} ${className}`}
        {...props}
      />
    </div>
  );
}