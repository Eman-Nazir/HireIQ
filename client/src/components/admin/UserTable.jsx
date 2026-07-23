import { Trash2, Shield, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUpdateUserRole, useDeleteUser } from '../../hooks/useAdmin';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export default function UserTable({ users }) {
  const { user: currentUser } = useAuth();
  const { mutate: updateRole } = useUpdateUserRole();
  const { mutate: deleteUser } = useDeleteUser();
  const { showToast } = useToast();

  const handleRoleChange = (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = newRole === 'admin'
      ? `Grant admin access to ${u.email}? They will be able to manage all users and see platform-wide data.`
      : `Revoke admin access from ${u.email}?`;

    if (!window.confirm(confirmMsg)) return;

    updateRole(
      { id: u._id, role: newRole },
      {
        onSuccess: () => showToast(`${u.email} is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}`, 'success'),
        onError: () => showToast('Failed to update role', 'error'),
      }
    );
  };

  const handleDelete = (u) => {
    if (!window.confirm(`Permanently delete ${u.email}? This also deletes their resumes and applications.`)) return;

    deleteUser(u._id, {
      onSuccess: () => showToast(`${u.email} deleted`, 'success'),
      onError: () => showToast('Failed to delete user', 'error'),
    });
  };

  return (
      <div className="rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-x-auto">

      <table className="w-full text-sm min-w-[600px] ">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-muted)] text-xs">
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Email</th>
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Joined</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]">
              <td className="px-5 py-3 text-[var(--color-text-primary)]">
                <Link to={`/admin/users/${u._id}`} className="hover:text-primary-500 transition-colors">
                  {u.name}
                </Link>
              </td>
              <td className="px-5 py-3 text-[var(--color-text-secondary)]">{u.email}</td>
              <td className="px-5 py-3">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-amber-50 text-amber-700' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'}`}>
                  {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}{u.role}
                  {u.isProtected && <span className="ml-1 text-[10px] opacity-70">(protected)</span>}
                </span>
              </td>
              <td className="px-5 py-3 text-[var(--color-text-muted)]">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="px-5 py-3 text-right">
                {u._id !== currentUser?.id && !u.isProtected && (
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleRoleChange(u)} className="text-xs text-[var(--color-text-secondary)] hover:text-amber-600 px-2 py-1 rounded transition-colors">
                      {u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                    </button>
                    <button onClick={() => handleDelete(u)} className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


