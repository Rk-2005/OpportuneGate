import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import toast from 'react-hot-toast';

export const useApplications = (filters = {}) => {
  const queryClient = useQueryClient();

  // Get applications
  const { data, isLoading, error } = useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/applications/my-applications?${params.toString()}`);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  // Apply to opportunity mutation
  const applyMutation = useMutation({
    mutationFn: async (opportunityId) => {
      const response = await api.post('/applications', { opportunityId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Application submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    },
  });

  // Update application status mutation (for admin/company)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes, interviewDate, interviewTime }) => {
      const response = await api.patch(`/applications/${id}/status`, {
        status,
        notes,
        interviewDate,
        interviewTime,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application status updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update application status');
    },
  });

  // Get applications by opportunity (for admin/company)
  const getApplicationsByOpportunity = async (opportunityId) => {
    const response = await api.get(`/applications/opportunity/${opportunityId}`);
    return response.data;
  };

  return {
    applications: data?.applications || [],
    pagination: data?.pagination,
    isLoading,
    error,
    applyToOpportunity: applyMutation.mutate,
    updateApplicationStatus: updateStatusMutation.mutate,
    isApplying: applyMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    getApplicationsByOpportunity,
  };
};
