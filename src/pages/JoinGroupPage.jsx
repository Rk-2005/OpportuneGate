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

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await api.get(`/groups/join/${inviteCode}`);
        const data = response.data;
        
        setGroup(data.group);
        
        // If user is already logged in, automatically attempt to join
        if (user && user.role === 'STUDENT') {
          toast.success('Automatically joining group...');
          handleJoinGroup();
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

  const handleJoinGroup = async () => {
    if (!user) {
      toast.error('Please log in to join the group');
      navigate(`/login?inviteCode=${inviteCode}`);
      return;
    }

    setIsJoining(true);
    try {
      await joinGroup.mutateAsync(inviteCode);
      toast.success('Successfully joined the group!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to join group:', error);
      toast.error(error.response?.data?.message || 'Failed to join group');
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

          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupPage;
