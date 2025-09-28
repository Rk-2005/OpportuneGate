import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const queryClient = useQueryClient();

  // Get profile
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (profileData) => {
      const response = await api.put('/profile', profileData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  // Upload resume mutation
  const uploadResumeMutation = useMutation({
    mutationFn: async (resumeUrl) => {
      const response = await api.post('/profile/resume', { resumeUrl });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      toast.success('Resume uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    },
  });

  return {
    profile: data?.profile,
    completionPercentage: data?.completionPercentage || 0,
    isLoading,
    error,
    updateProfile: updateMutation.mutate,
    uploadResume: uploadResumeMutation.mutate,
    isUpdating: updateMutation.isPending,
    isUploadingResume: uploadResumeMutation.isPending,
  };
};
