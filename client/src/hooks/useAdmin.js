


import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export const usePlatformStats = () => {
  return useQuery({ queryKey: ['admin-stats'], queryFn: async () => (await api.get('/admin/stats')).data.data });
};

export const useAdminUsers = (page = 1) => {
  return useQuery({ queryKey: ['admin-users', page], queryFn: async () => (await api.get(`/admin/users?page=${page}`)).data.data });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }) => (await api.patch(`/admin/users/${id}/role`, { role })).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => { await api.delete(`/admin/users/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });
};

export const useAdminApplications = (page = 1) => {
  return useQuery({ queryKey: ['admin-applications', page], queryFn: async () => (await api.get(`/admin/applications?page=${page}`)).data.data });
};

export const useAuditLogs = (page = 1) => {
  return useQuery({ queryKey: ['admin-audit-logs', page], queryFn: async () => (await api.get(`/admin/audit-logs?page=${page}`)).data.data });
};