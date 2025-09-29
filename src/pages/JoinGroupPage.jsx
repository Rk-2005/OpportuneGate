import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowRight, CheckCircle, AlertCircle, User } from 'lucide-react';
import { useGroups } from '../hooks/useGroups';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import api from '../config/api';

const JoinGroupPage = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { joinGroup } = useGroups();
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(null);
  const [autoJoinAttempted, setAutoJoinAttempted] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await api.get(`/groups/join/${inviteCode}`);
        const data = response.data;
        
        setGroup(data.group);
        setError(null);
        
        // If user is already logged in and is a student, automatically attempt to join
        if (user && user.role === 'STUDENT' && data.group.isActive && !autoJoinAttempted) {
          console.log('Auto-joining group for logged-in student');
          setAutoJoinAttempted(true);
          
          // Add a small delay to ensure the group data is set and avoid race conditions
          setTimeout(() => {
            // Double-check user is still logged in before auto-joining
            const currentToken = localStorage.getItem('token');
            if (currentToken && user) {
              console.log('Token exists, proceeding with auto-join');
              toast.success('Automatically joining group...');
              handleJoinGroup();
            } else {
              console.log('User token missing, redirecting to login');
              navigate(`/login?inviteCode=${inviteCode}`);
            }
          }, 2000);
        } else if (user && user.role !== 'STUDENT') {
          console.log('User is not a student, cannot auto-join');
        } else if (!data.group.isActive) {
          console.log('Group is not active, cannot auto-join');
        } else if (!user) {
          console.log('User not logged in, redirecting to login');
          navigate(`/login?inviteCode=${inviteCode}`);
        }
      } catch (error) {
        console.error('Failed to fetch group:', error);
        setError(error.response?.data?.message || 'Failed to load group information');
      } finally {
        setIsLoading(false);
      }
    };

    if (inviteCode) {
      fetchGroup();
    }
  }, [inviteCode, user]);

  // Monitor user state changes
  useEffect(() => {
    console.log('JoinGroupPage: User state changed:', user);
    if (user === null && !isLoading) {
      console.log('JoinGroupPage: User became null, redirecting to login');
      navigate(`/login?inviteCode=${inviteCode}`);
    }
  }, [user, isLoading, navigate, inviteCode]);

  const handleJoinGroup = async () => {
    if (!user) {
      toast.error('Please log in to join the group');
      navigate(`/login?inviteCode=${inviteCode}`);
      return;
    }

    if (user.role !== 'STUDENT') {
      toast.error('Only students can join groups');
      return;
    }

    console.log('Starting to join group, user:', user);
    
    // Double-check auth before proceeding
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      console.log('No token found during join, redirecting to login');
      navigate(`/login?inviteCode=${inviteCode}`);
      return;
    }
    
    setIsJoining(true);
    try {
      const result = await joinGroup.mutateAsync(inviteCode);
      console.log('Join group result:', result);
      toast.success('Successfully joined the group!');
      
      // Verify user is still authenticated before navigation
      setTimeout(() => {
        const tokenAfterJoin = localStorage.getItem('token');
        if (tokenAfterJoin) {
          console.log('Navigating to student dashboard');
          navigate('/student/dashboard');
        } else {
          console.log('Token lost after join, redirecting to login');
          navigate('/login');
        }
      }, 1500);
    } catch (error) {
      console.error('Failed to join group:', error);
      
      // Check if it's an auth error
      if (error.response?.status === 401) {
        console.log('Auth error during join, redirecting to login');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to join group');
      }
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading group information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invite Link</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Group not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center mb-2">
            <Users className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-semibold">Join Group</h1>
          </div>
          <p className="text-blue-100">You've been invited to join a placement group</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h2>
            {group.description && (
              <p className="text-gray-600 text-sm mb-4">{group.description}</p>
            )}
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>Admin: {group.admin.profile?.firstName} {group.admin.profile?.lastName}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{group._count?.members || 0} members</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Created {format(new Date(group.createdAt), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>

          {!group.isActive ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 font-medium">This group is no longer active</p>
              </div>
              <p className="text-red-600 text-sm mt-1">
                The admin has deactivated this group. You cannot join at this time.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-700 font-medium">Group is active</p>
              </div>
              <p className="text-green-600 text-sm mt-1">
                You can join this group to receive targeted opportunities and updates.
              </p>
            </div>
          )}

          {/* Show message if user is logged in but not a student */}
          {user && user.role !== 'STUDENT' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <p className="text-yellow-700 font-medium">Only students can join groups</p>
              </div>
              <p className="text-yellow-600 text-sm mt-1">
                You are logged in as {user.role.toLowerCase()}. Only students can join placement groups.
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            {!user ? (
              <button
                onClick={() => navigate(`/login?inviteCode=${inviteCode}`)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Login to Join
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : user.role !== 'STUDENT' ? (
              <button
                disabled
                className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed transition-colors flex items-center justify-center"
              >
                Cannot Join
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleJoinGroup}
                disabled={!group.isActive || isJoining}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isJoining ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Joining...
                  </>
                ) : (
                  <>
                    Join Group
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupPage;
