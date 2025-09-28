import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useOpportunities } from '../../hooks/useOpportunities';
import { useApplications } from '../../hooks/useApplications';
import { useNotifications } from '../../hooks/useNotifications';
import { useSocket } from '../../hooks/useSocket';
import { LogOut, Bell, Users, Briefcase, Plus, TrendingUp, FileText, Calendar, Eye, MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const CompanyDashboard = () => {
  const { user, logout } = useAuth();
  
  // Initialize real-time socket connection
  useSocket();
  
  // Get real data
  const { opportunities } = useOpportunities();
  const { applications } = useApplications();
  const { notifications, unreadCount } = useNotifications();
  
  // Calculate real stats
  const activeJobs = opportunities.filter(opp => new Date(opp.applicationDeadline) > new Date()).length;
  const totalApplicants = applications.length;
  const interviewsScheduled = applications.filter(app => app.status === 'INTERVIEW').length;
  const hiredThisMonth = applications.filter(app => 
    app.status === 'PLACED' && 
    new Date(app.updatedAt).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">OpportuneGate</h1>
              <span className="ml-4 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                Company
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
                  <p className="font-medium text-gray-900">{user?.company?.name || user?.profile?.firstName} {user?.profile?.lastName}</p>
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
            <a href="#" className="border-b-2 border-purple-500 py-4 px-1 text-sm font-medium text-purple-600">
              Dashboard
            </a>
            <a href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Opportunities
            </a>
            <a href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Applicants
            </a>
            <a href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Analytics
            </a>
            <a href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Profile
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Company Dashboard</h2>
          <p className="text-gray-600">Manage your job postings and track applicant progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{activeJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                <p className="text-2xl font-semibold text-gray-900">{totalApplicants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                <p className="text-2xl font-semibold text-gray-900">{interviewsScheduled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hired This Month</p>
                <p className="text-2xl font-semibold text-gray-900">{hiredThisMonth}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
            {applications.length === 0 ? (
              <p className="text-gray-600">No applications yet</p>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{application.opportunity.title}</p>
                      <p className="text-xs text-gray-500">
                        {application.profile?.firstName} {application.profile?.lastName} • Applied {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      application.status === 'APPLIED' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'APTITUDE' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'TECHNICAL' ? 'bg-orange-100 text-orange-800' :
                      application.status === 'INTERVIEW' ? 'bg-purple-100 text-purple-800' :
                      application.status === 'PLACED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Plus className="h-4 w-4 mr-3" />
                Post New Job
              </button>
              <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Users className="h-4 w-4 mr-3" />
                View All Applicants
              </button>
              <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <TrendingUp className="h-4 w-4 mr-3" />
                Schedule Interviews
              </button>
              <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Briefcase className="h-4 w-4 mr-3" />
                Manage Company Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
