import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterAuth = (loggedInUser) => {
    const from = location.state?.from;
    if (from) return navigate(from, { replace: true });
    navigate(loggedInUser.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = isRegisterMode
        ? await register(form.name, form.email, form.password)
        : await login(form.email, form.password);

      showToast(isRegisterMode ? 'Account created successfully' : 'Welcome back!', 'success');
      redirectAfterAuth(result.data.user);
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-primary-500 font-semibold text-xl">HireIQ</span>
        </div>

        <h1 className="text-xl font-semibold text-[var(--color-text-primary)] text-center mb-1">
          {isRegisterMode ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8">
          {isRegisterMode ? 'Start optimizing your job search' : 'Log in to continue to HireIQ'}
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)]
            bg-[var(--color-surface-card)] text-[var(--color-text-primary)] py-2.5 text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-text-muted)]">OR</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
          {isRegisterMode && (
            <Input
              icon={User}
              type="text"
              name="fullname_hireiq"
              autoComplete="off"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <Input
            icon={Mail}
            type="email"
            name="email_hireiq"
            autoComplete="off"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          {/* Password field with show/hide toggle */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password_hireiq"
              autoComplete="new-password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              className="w-full rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] py-2.5 pl-10 pr-10 text-sm
                text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            {isRegisterMode ? 'Create Account' : 'Log In'}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
          {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }} className="text-primary-500 font-medium">
            {isRegisterMode ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}