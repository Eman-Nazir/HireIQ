import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Kanban, MessageCircleQuestion, LogOut, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import ThemeToggle from '../components/ui/ThemeToggle';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
  { to: '/job-tracker', label: 'Job Tracker', icon: Kanban },
  { to: '/interview-prep', label: 'Interview Prep', icon: MessageCircleQuestion },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col">
      <header className="h-14 border-b border-[var(--color-border)] bg-[var(--color-surface-card)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4 md:gap-8">
          <button className="md:hidden text-[var(--color-text-primary)]" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/dashboard" className="text-primary-500 font-semibold text-lg">HireIQ</Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'text-primary-500 bg-primary-50' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                }`}>
                <Icon className="w-4 h-4" />{label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink to="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-600 hover:bg-amber-50 transition-colors">
                <Shield className="w-4 h-4" /> Admin
              </NavLink>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <Link to="/profile" className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs text-white font-medium">
            {user?.name?.[0]?.toUpperCase()}
          </Link>
          <button onClick={handleLogout} className="hidden md:block text-[var(--color-text-secondary)] hover:text-red-500 transition-colors" aria-label="Log out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--color-surface-card)] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-primary-500 font-semibold text-lg">HireIQ</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X className="w-5 h-5 text-[var(--color-text-primary)]" /></button>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                    isActive ? 'text-primary-500 bg-primary-50' : 'text-[var(--color-text-secondary)]'
                  }`}>
                  <Icon className="w-4 h-4" />{label}
                </NavLink>
              ))}
              {user?.role === 'admin' && (
                <NavLink to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-amber-600">
                  <Shield className="w-4 h-4" /> Admin
                </NavLink>
              )}
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 mt-4 border-t border-[var(--color-border)] pt-4">
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1"><Outlet /></main>
    </div>
  );
}