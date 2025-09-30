import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useApplications } from '../../hooks/useApplications';
import { useNotifications } from '../../hooks/useNotifications';
import { useOpportunities } from '../../hooks/useOpportunities';
import { useSocket } from '../../hooks/useSocket';
import UpskillSuggestions from '../../components/UpskillSuggestions';
import { analyzeSkillGap } from '../../utils/skillGapAnalysis';
import ProfileCompletionTracker from '../../components/ProfileCompletionTracker';
import ApplicationStatusTracker from '../../components/ApplicationStatusTracker';
import StudentOpportunities from './Opportunities';
import { LogOut, User, Bell, Briefcase, FileText, Plus, Eye, Calendar, MapPin, Building } from 'lucide-react';
import { format } from 'date-fns';
import Applications from '../../components/Applications';
import Profile from '../../components/Profile';

// Real-time notifications panel
const NotificationsPanel = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {unreadCount}
          </span>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications</p>
      ) : (
        <div className="space-y-3">
          {notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${
                notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
              }`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          ))}
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
};


// Applications list with real data
const ApplicationsList = () => {
  const { applications, isLoading } = useApplications();
  
  const getStatusColor = (status) => {
    const colors = {
      APPLIED: 'bg-blue-100 text-blue-800',
      APTITUDE: 'bg-yellow-100 text-yellow-800',
      TECHNICAL: 'bg-orange-100 text-orange-800',
      INTERVIEW: 'bg-purple-100 text-purple-800',
      PLACED: 'bg-green-100 text-green-800',
      NOT_PLACED: 'bg-red-100 text-red-800',
      REJECTED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">My Applications</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">My Applications</h3>
      
      {applications.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No applications yet</p>
          <Link
            to="/student/opportunities"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Browse Opportunities
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div key={application.id} className="space-y-4">
              {/* Application Summary */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {application.opportunity.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {application.opportunity.company?.name || application.opportunity.college?.name}
                    </p>
                    <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Applied {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                      </span>
                      {application.interviewDate && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Interview: {format(new Date(application.interviewDate), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {application.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              {/* Status Tracker */}
              <ApplicationStatusTracker application={application} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Skill Gap Analysis Component
const SkillGapAnalysis = () => {
  const { user } = useAuth();
  const { opportunities } = useOpportunities();
  const [showUpskill, setShowUpskill] = useState(false);
  
  const studentSkills = user?.profile?.skills || [];
  
  // Find opportunities with skill gaps
  const opportunitiesWithGaps = opportunities.filter(opportunity => {
    if (!opportunity.requirements || opportunity.requirements.length === 0) return false;
    const skillGap = analyzeSkillGap(studentSkills, opportunity.requirements);
    return skillGap.hasGap;
  }).slice(0, 3); // Show top 3 opportunities with gaps
  
  if (opportunitiesWithGaps.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Skill Gap Analysis</h3>
        <button
          onClick={() => setShowUpskill(!showUpskill)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showUpskill ? 'Hide' : 'View All'} Suggestions
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        You have skill gaps in {opportunitiesWithGaps.length} opportunities. 
        Consider upskilling to improve your eligibility.
      </p>
      
      <div className="space-y-3">
        {opportunitiesWithGaps.map((opportunity) => {
          const skillGap = analyzeSkillGap(studentSkills, opportunity.requirements);
          return (
            <div key={opportunity.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{opportunity.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Missing {skillGap.missingSkills.length} skills
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {skillGap.missingSkills.slice(0, 2).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {skillGap.missingSkills.length > 2 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                      +{skillGap.missingSkills.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {showUpskill && (
        <div className="mt-4">
          <UpskillSuggestions
            studentSkills={studentSkills}
            requiredSkills={opportunitiesWithGaps[0]?.requirements || []}
            opportunityTitle="Multiple Opportunities"
            onClose={() => setShowUpskill(false)}
          />
        </div>
      )}
    </div>
  );
};

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Initialize real-time socket connection
  useSocket();

  // Get loading states
  const { isLoading: profileLoading } = useProfile();
  const { isLoading: applicationsLoading } = useApplications();
  const { isLoading: notificationsLoading } = useNotifications();
  const { isLoading: opportunitiesLoading } = useOpportunities();

  // Show loading state if any data is loading
  const isLoading = profileLoading || applicationsLoading || notificationsLoading || opportunitiesLoading;

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
              <h1 className="text-xl font-semibold text-gray-900">OpportunityGate</h1>
              <span className="ml-4 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Student
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.profile?.firstName} {user?.profile?.lastName}</p>
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
            <Link 
              to="/student/dashboard" 
              className={`border-b-2 py-4 px-1 text-sm font-medium ${
                location.pathname === '/student/dashboard' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/student/opportunities" 
              className={`border-b-2 py-4 px-1 text-sm font-medium ${
                location.pathname === '/student/opportunities' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Opportunities
            </Link >
            
            <Link to="/student/applications" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Applications
            </Link>
            <Link to="/student/profile" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/dashboard" element={
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.profile?.firstName}!</h2>
                <p className="text-gray-600">Here's what's happening with your applications and opportunities.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <ProfileCompletionTracker />
                  <SkillGapAnalysis />
                  <ApplicationsList />
                </div>
                
                <div className="space-y-6">
                  <NotificationsPanel />
                  
                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link to="/student/opportunities" className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <Briefcase className="h-4 w-4 mr-3" />
                        Browse Opportunities
                      </Link>
                      <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <FileText className="h-4 w-4 mr-3" />
                        Update Profile
                      </button>
                      <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <User className="h-4 w-4 mr-3" />
                        View Applications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          } />
           <Route path="/profile" element={<Profile />} />
          <Route path="/opportunities" element={<StudentOpportunities />} />
           <Route path="/applications" element={<Applications />} />
          <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
