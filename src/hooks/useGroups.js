import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/api';

// Hook for group management
export const useGroups = () => {
  const queryClient = useQueryClient();

  // Get admin's groups
  const getAdminGroups = () => {
    return useQuery({
      queryKey: ['adminGroups'],
      queryFn: async () => {
        const response = await api.get('/groups/admin');
        return response.data;
      }
    });
  };

  // Get user's groups
  const getUserGroups = () => {
    return useQuery({
      queryKey: ['userGroups'],
      queryFn: async () => {
        const response = await api.get('/groups/my-groups');
        return response.data;
      }
    });
  };

  // Create group
  const createGroup = useMutation({
    mutationFn: async (groupData) => {
      const response = await api.post('/groups', groupData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGroups'] });
    }
  });

  // Join group by invite code
  const joinGroup = useMutation({
    mutationFn: async (inviteCode) => {
      console.log('Sending join group request for invite code:', inviteCode);
      const response = await api.post(`/groups/join/${inviteCode}`);
      console.log('Join group response:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Join group mutation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
    },
    onError: (error) => {
      console.error('Join group mutation error:', error);
    }
  });

  // Regenerate invite code
  const regenerateInviteCode = useMutation({
    mutationFn: async (groupId) => {
      const response = await api.patch(`/groups/${groupId}/regenerate-invite`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGroups'] });
    }
  });

  // Toggle group status
  const toggleGroupStatus = useMutation({
    mutationFn: async (groupId) => {
      const response = await api.patch(`/groups/${groupId}/toggle-status`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGroups'] });
    }
  });

  // Delete group
  const deleteGroup = useMutation({
    mutationFn: async (groupId) => {
      const response = await api.delete(`/groups/${groupId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGroups'] });
    }
  });

  return {
    getAdminGroups,
    getUserGroups,
    createGroup,
    joinGroup,
    regenerateInviteCode,
    toggleGroupStatus,
    deleteGroup
  };
};

// Hook for group messages
export const useGroupMessages = (groupId) => {
  const queryClient = useQueryClient();

  // Get group messages
  const getMessages = (page = 1, limit = 50) => {
    return useQuery({
      queryKey: ['groupMessages', groupId, page],
      queryFn: async () => {
        const response = await api.get(`/groups/${groupId}/messages?page=${page}&limit=${limit}`);
        return response.data;
      },
      enabled: !!groupId
    });
  };

  // Send message
  const sendMessage = useMutation({
    mutationFn: async (content) => {
      const response = await api.post(`/groups/${groupId}/messages`, { content });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupMessages', groupId] });
    }
  });

  // Get group members
  const getMembers = () => {
    return useQuery({
      queryKey: ['groupMembers', groupId],
      queryFn: async () => {
        const response = await api.get(`/groups/${groupId}/members`);
        return response.data;
      },
      enabled: !!groupId
    });
  };

  // Remove member
  const removeMember = useMutation({
    mutationFn: async (userId) => {
      const response = await api.delete(`/groups/${groupId}/members/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupMembers', groupId] });
    }
  });

  return {
    getMessages,
    sendMessage,
    getMembers,
    removeMember
  };
};
