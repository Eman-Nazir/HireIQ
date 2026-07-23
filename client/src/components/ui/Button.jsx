import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]',
};

export default function Button({ children, variant = 'primary', isLoading = false, disabled = false, className = '', ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={`rounded-lg font-medium py-2.5 px-4 text-sm flex items-center justify-center gap-2
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}