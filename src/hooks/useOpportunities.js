import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import toast from 'react-hot-toast';

export const useOpportunities = (filters = {}) => {
  const queryClient = useQueryClient();

  // Get opportunities
  const { data, isLoading, error } = useQuery({
    queryKey: ['opportunities', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/api/opportunities?${params.toString()}`);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  // Create opportunity mutation
  const createMutation = useMutation({
    mutationFn: async (opportunityData) => {
      const response = await api.post('/api/opportunities', opportunityData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Opportunity created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create opportunity');
    },
  });

  // Update opportunity mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.put(`/api/opportunities/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Opportunity updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update opportunity');
    },
  });

  // Delete opportunity mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/api/opportunities/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Opportunity deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete opportunity');
    },
  });

  return {
    opportunities: data?.opportunities || [],
    pagination: data?.pagination,
    isLoading,
    error,
    createOpportunity: createMutation.mutate,
    updateOpportunity: updateMutation.mutate,
    deleteOpportunity: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
