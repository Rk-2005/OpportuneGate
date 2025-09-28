import React, { useState } from 'react';
import { Users, Link, Copy, Check, Settings, Trash2, Eye, EyeOff, MessageSquare, Plus, User, Mail, Calendar, X } from 'lucide-react';
import { useGroups } from '../hooks/useGroups';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const GroupManagement = ({ onCreateGroup }) => {
  const { user } = useAuth();
  const { getAdminGroups, regenerateInviteCode, toggleGroupStatus, deleteGroup } = useGroups();
  const [copiedCodes, setCopiedCodes] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showMembers, setShowMembers] = useState({});
  const [groupMembers, setGroupMembers] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  const { data: groupsData, isLoading, error } = getAdminGroups();

  const handleCopyInviteCode = async (inviteCode) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/join-group/${inviteCode}`);
      setCopiedCodes(prev => ({ ...prev, [inviteCode]: true }));
      toast.success('Invite link copied to clipboard!');
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedCodes(prev => ({ ...prev, [inviteCode]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy invite link');
    }
  };

  const handleRegenerateInviteCode = async (groupId) => {
    setLoadingStates(prev => ({ ...prev, [`regenerate-${groupId}`]: true }));
    try {
      await regenerateInviteCode.mutateAsync(groupId);
      toast.success('Invite code regenerated successfully!');
    } catch (error) {
      console.error('Failed to regenerate invite code:', error);
      toast.error(error.response?.data?.message || 'Failed to regenerate invite code');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`regenerate-${groupId}`]: false }));
    }
  };

  const handleToggleStatus = async (groupId) => {
    setLoadingStates(prev => ({ ...prev, [`toggle-${groupId}`]: true }));
    try {
      await toggleGroupStatus.mutateAsync(groupId);
      toast.success('Group status updated successfully!');
    } catch (error) {
      console.error('Failed to toggle status:', error);
      toast.error(error.response?.data?.message || 'Failed to update group status');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`toggle-${groupId}`]: false }));
    }
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    if (window.confirm(`Are you sure you want to delete the group "${groupName}"? This action cannot be undone.`)) {
      setLoadingStates(prev => ({ ...prev, [`delete-${groupId}`]: true }));
      try {
        await deleteGroup.mutateAsync(groupId);
        toast.success('Group deleted successfully!');
      } catch (error) {
        console.error('Failed to delete group:', error);
        toast.error(error.response?.data?.message || 'Failed to delete group');
      } finally {
        setLoadingStates(prev => ({ ...prev, [`delete-${groupId}`]: false }));
      }
    }
  };

  const handleOpenChat = (group) => {
    setSelectedGroup(group);
    setIsChatOpen(true);
  };

  const handleShowMembers = async (groupId) => {
    setLoadingStates(prev => ({ ...prev, [`members-${groupId}`]: true }));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://opportunegate-backend.onrender.com/'}/api/groups/${groupId}/members`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setGroupMembers(prev => ({ ...prev, [groupId]: data.members }));
        setShowMembers(prev => ({ ...prev, [groupId]: true }));
      } else {
        toast.error(data.message || 'Failed to load members');
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoadingStates(prev => ({ ...prev, [`members-${groupId}`]: false }));
    }
  };

  const handleHideMembers = (groupId) => {
    setShowMembers(prev => ({ ...prev, [groupId]: false }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Failed to load groups. Please try again.</p>
      </div>
    );
  }

  const groups = groupsData?.groups || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Users className="h-6 w-6 mr-2 text-blue-600" />
          Group Management
        </h2>
        <button
          onClick={onCreateGroup}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No groups created yet</h3>
          <p className="text-gray-600 mb-4">Create your first group to start managing targeted opportunities.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                        group.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {group.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {group.description && (
                      <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {group._count?.members || 0} members
                      <span className="mx-2">•</span>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {group._count?.messages || 0} messages
                      <span className="mx-2">•</span>
                      Created {format(new Date(group.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Invite Link</p>
                      <p className="text-sm text-gray-600 font-mono">
                        {window.location.origin}/join-group/{group.inviteCode}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCopyInviteCode(group.inviteCode)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy invite link"
                      >
                        {copiedCodes[group.inviteCode] ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleRegenerateInviteCode(group.id)}
                        disabled={loadingStates[`regenerate-${group.id}`]}
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Regenerate invite code"
                      >
                        {loadingStates[`regenerate-${group.id}`] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                        ) : (
                          <Link className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenChat(group)}
                    className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </button>
                  <button
                    onClick={() => showMembers[group.id] ? handleHideMembers(group.id) : handleShowMembers(group.id)}
                    disabled={loadingStates[`members-${group.id}`]}
                    className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingStates[`members-${group.id}`] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2"></div>
                    ) : (
                      <Users className="h-4 w-4 mr-2" />
                    )}
                    {showMembers[group.id] ? 'Hide Members' : 'View Members'}
                  </button>
                  <button
                    onClick={() => handleToggleStatus(group.id)}
                    disabled={loadingStates[`toggle-${group.id}`]}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      group.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {loadingStates[`toggle-${group.id}`] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    ) : group.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id, group.name)}
                    disabled={loadingStates[`delete-${group.id}`]}
                    className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingStates[`delete-${group.id}`] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Delete
                  </button>
                </div>

                {/* Members Section */}
                {showMembers[group.id] && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Group Members ({groupMembers[group.id]?.length || 0})</h4>
                      <button
                        onClick={() => handleHideMembers(group.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {groupMembers[group.id]?.length > 0 ? (
                      <div className="space-y-2">
                        {groupMembers[group.id].map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {member.user.profile?.firstName} {member.user.profile?.lastName}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {member.user.email}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Joined {format(new Date(member.joinedAt), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No members yet</p>
                        <p className="text-xs">Share the invite link to get students to join</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
