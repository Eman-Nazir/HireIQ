import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(name);
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'success');
  };

  return (
    <div className="px-8 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Profile</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">Manage your account details.</p>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-xl text-white font-medium">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-lg font-medium text-[var(--color-text-primary)]">{user?.name}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">Full name</label>
            <Input icon={User} value={name} onChange={(e) => setName(e.target.value)} required />
            <Button type="submit" isLoading={isSaving}>Save changes</Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-[var(--color-text-muted)]" />
            <span className="text-[var(--color-text-secondary)]">Email</span>
            <span className="text-[var(--color-text-primary)] ml-auto">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="w-4 h-4 text-[var(--color-text-muted)]" />
            <span className="text-[var(--color-text-secondary)]">Account type</span>
            <span className="text-[var(--color-text-primary)] ml-auto capitalize">{user?.role}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
            <span className="text-[var(--color-text-secondary)]">Member since</span>
            <span className="text-[var(--color-text-primary)] ml-auto">
              {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </Card>

        <Button variant="danger" onClick={handleLogout} className="w-full mt-6">
          <LogOut className="w-4 h-4" /> Log out
        </Button>
      </motion.div>
    </div>
  );
}