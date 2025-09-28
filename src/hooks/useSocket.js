import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    // Connect to socket
    socketRef.current = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    const socket = socketRef.current;

    // Join user's room
    socket.emit('join', user.id);

    // Listen for new notifications
    socket.on('notification', (notification) => {
      // Invalidate notifications query to refetch
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      // Show toast notification
      toast.success(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    });

    // Listen for application status updates
    socket.on('applicationUpdate', (data) => {
      // Invalidate applications query
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      
      toast.success(`Application status updated: ${data.status}`, {
        description: data.message,
        duration: 5000,
      });
    });

    // Listen for new opportunities
    socket.on('newOpportunity', (opportunity) => {
      // Invalidate opportunities query
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      
      toast.success('New Opportunity Available!', {
        description: opportunity.title,
        duration: 5000,
      });
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, queryClient]);

  return socketRef.current;
};
