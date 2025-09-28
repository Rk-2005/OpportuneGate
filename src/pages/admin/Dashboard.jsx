import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useOpportunities } from '../../hooks/useOpportunities';
import { useApplications } from '../../hooks/useApplications';
import { useNotifications } from '../../hooks/useNotifications';
import { useSocket } from '../../hooks/useSocket';
import PostOpportunityModal from '../../components/PostOpportunityModal';
import InterviewScheduler from '../../components/InterviewScheduler';
import AdminOpportunitiesView from '../../components/AdminOpportunitiesView';
import CreateGroupModal from '../../components/CreateGroupModal';
import GroupManagement from '../../components/GroupManagement';
import GroupChatModal from '../../components/GroupChatModal';
import {
  LogOut,
  Bell,
  Users,
  Building,
  Plus,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isPostingOpportunity, setIsPostingOpportunity] = useState(false);

  // Initialize real-time socket connection
  useSocket();

  // Get real data
  const { opportunities, isLoading: opportunitiesLoading } = useOpportunities();
  const { applications, isLoading: applicationsLoading } = useApplications();
  const { notifications, unreadCount, isLoading: notificationsLoading } = useNotifications();

  // Calculate real stats
  const totalOpportunities = opportunities.length;
  const totalApplications = applications.length;
  const placedApplications = applications.filter(
    (app) => app.status === 'PLACED'
  ).length;
  const placementRate =
    totalApplications > 0
      ? Math.round((placedApplications / totalApplications) * 100)
      : 0;

  // Show loading state if any data is loading
  const isLoading = opportunitiesLoading || applicationsLoading || notificationsLoading;

  const handlePostOpportunity = () => {
    setIsPostingOpportunity(true);
    setIsPostModalOpen(true);
  };

  const handlePostModalClose = () => {
    setIsPostModalOpen(false);
    setIsPostingOpportunity(false);
  };

  // Mock student count (would come from API in real app)
  const totalStudents = 1250;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Small Loading Indicator */}
      {isLoading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2 border">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-700">Loading...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                OpportuneGate
              </h1>
              <span className="ml-4 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Admin
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a
              href="#"
              className="border-b-2 border-green-500 py-4 px-1 text-sm font-medium text-green-600"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Students
            </a>
            <a
              href="#"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Opportunities
            </a>
            <a
              href="#"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Analytics
            </a>
            <a
              href="#"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              College
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600">
            Manage your college's placement activities and student progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalStudents.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Placed Students
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {placedApplications}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Placement Rate
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {placementRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Opportunities
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalOpportunities}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'groups'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Group Management
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'opportunities'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Opportunities
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Applications */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Recent Applications
                </h3>
                {applications.length === 0 ? (
                  <p className="text-gray-600">No applications yet</p>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((application) => (
                      <div
                        key={application.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            {application.student?.profile?.firstName}{' '}
                            {application.student?.profile?.lastName} applied for{' '}
                            {application.opportunity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(
                              new Date(application.appliedAt),
                              'MMM dd, yyyy HH:mm'
                            )}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            application.status === 'PLACED'
                              ? 'bg-green-100 text-green-800'
                              : application.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {application.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interview Scheduler */}
              <div className="lg:col-span-2">
                <InterviewScheduler />
              </div>
            </div>

            {/* Posted Opportunities */}
            <div className="mt-6">
              <AdminOpportunitiesView />
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={handlePostOpportunity}
                  disabled={isPostingOpportunity}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPostingOpportunity ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-3"></div>
                  ) : (
                    <Plus className="h-4 w-4 mr-3" />
                  )}
                  {isPostingOpportunity ? 'Opening...' : 'Post New Opportunity'}
                </button>
                <button className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Users className="h-4 w-4 mr-3" />
                  View All Students
                </button>
                <button className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Generate Reports
                </button>
                <button className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Building className="h-4 w-4 mr-3" />
                  Manage College Profile
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'groups' && (
          <GroupManagement onCreateGroup={() => setIsCreateGroupModalOpen(true)} />
        )}

        {activeTab === 'opportunities' && <AdminOpportunitiesView />}
      </main>

      {/* Modals */}
      <PostOpportunityModal
        isOpen={isPostModalOpen}
        onClose={handlePostModalClose}
      />

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
      />

      <GroupChatModal
        group={selectedGroup}
        isOpen={isGroupChatOpen}
        onClose={() => {
          setIsGroupChatOpen(false);
          setSelectedGroup(null);
        }}
      />
    </div>
  );
};

export default AdminDashboard;
