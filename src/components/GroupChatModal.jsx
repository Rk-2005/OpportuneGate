import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Users, MessageSquare, User } from 'lucide-react';
import { useGroupMessages } from '../hooks/useGroups';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const GroupChatModal = ({ group, isOpen, onClose }) => {
  const { user } = useAuth();
  const { getMessages, sendMessage, getMembers } = useGroupMessages(group?.id);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: messagesData, isLoading: messagesLoading } = getMessages();
  const { data: membersData, isLoading: membersLoading } = getMembers();

  const messages = messagesData?.messages || [];
  const members = membersData?.members || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setIsSending(true);
    try {
      await sendMessage.mutateAsync(newMessage.trim());
      setNewMessage('');
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{group.name}</h2>
              <p className="text-sm text-gray-600">Broadcast Chat - Admin Only</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600">Start the conversation by sending your first message.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {message.sender.profile?.firstName} {message.sender.profile?.lastName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.createdAt), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 bg-gray-100 rounded-lg p-3">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4 bg-gray-50">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={isSending || !newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Members Sidebar */}
          <div className="w-64 border-l bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Group Members ({members.length})
            </h3>
            {membersLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2 p-2 bg-white rounded-lg">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.user.profile?.firstName} {member.user.profile?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;
