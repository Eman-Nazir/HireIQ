import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[var(--color-surface)] transition-colors"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs text-white font-medium">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--color-text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-lg overflow-hidden z-20"
          >
            <div className="px-4 py-3 border-b border-[var(--color-border)]">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{user?.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)] truncate">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-1.5">
                  <Shield className="w-2.5 h-2.5" /> Admin
                </span>
              )}
            </div>

            <div className="py-1">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <User className="w-4 h-4 text-[var(--color-text-muted)]" />
                Profile
              </Link>

              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm text-[var(--color-text-primary)]">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            <div className="py-1 border-t border-[var(--color-border)]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}