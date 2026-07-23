import { useState } from 'react';
import { Plus } from 'lucide-react';
import KanbanBoard from '../components/tracker/KanbanBoard';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useCreateApplication } from '../hooks/useApplications';
import { useToast } from '../hooks/useToast';

export default function JobTracker() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ company: '', role: '', roleType: '' });
  const { mutate: createApplication, isPending } = useCreateApplication();
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    createApplication(form, {
      onSuccess: () => {
        setForm({ company: '', role: '', roleType: '' });
        setShowModal(false);
        showToast(`Added ${form.role} at ${form.company}`, 'success');
      },
      onError: (err) => {
        showToast(err?.response?.data?.message || 'Failed to add application', 'error');
      },
    });
  };

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-[var(--color-text-primary)]">Job Tracker</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Drag cards between columns to update status</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="shrink-0 w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Add Application
        </Button>
      </div>

      <KanbanBoard />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Application">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          <Input placeholder="Role (e.g. Frontend Developer)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
          <Input placeholder="Role type (e.g. Frontend, Backend)" value={form.roleType} onChange={(e) => setForm({ ...form, roleType: e.target.value })} />
          <Button type="submit" isLoading={isPending} className="w-full">Add Application</Button>
        </form>
      </Modal>
    </div>
  );
}