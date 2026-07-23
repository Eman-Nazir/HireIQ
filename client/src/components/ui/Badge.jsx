const variants = {
  default: 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]',
  primary: 'bg-primary-50 text-primary-600',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}