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
  CheckCircle,
  Clock,
  Send,
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
  const [activeNav, setActiveNav] = useState('dashboard');

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
  const totalStudents = 125;

  // Mock companies data
  const companies = [
    {
      id: 1,
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png',
      students: [
        { id: 1, name: 'Vishal Kriplani', status: 'Placed', package: '48 LPA', department: 'CSE', email: 'VishalKriplani@google.com', phone: '+91 9876543210' },
        { id: 2, name: 'Jane Smith', status: 'Interview', package: '42 LPA', department: 'IT', email: 'jane.smith@example.com', phone: '+91 9876543211' },
        { id: 3, name: 'Pratham Khilani', status: 'Applied', package: 'Pending', department: 'ECE', email: 'Pratham@gmail.com', phone: '+91 9876543212' },
        { id: 4, name: 'Ritesh Kriplani', status: 'Placed', package: '48 LPA', department: 'CSE', email: 'Ritesh_Kriplani@google.com', phone: '+91 9876543213' },
        { id: 5, name: 'David Brown', status: 'Interview', package: 'Pending', department: 'IT', email: 'david.brown@example.com', phone: '+91 9876543214' }
      ]
    },
    {
      id: 2,
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png',
      students: [
        { id: 1, name: 'Jayesh Kriplani', status: 'Placed', package: '38 LPA', department: 'CSE', email: 'kriplanijj@rknec.edu', phone: '+91 87679550106' },
        { id: 2, name: 'David Warner', status: 'Rejected', package: 'N/A', department: 'IT', email: 'david.Warner@gmail.com', phone: '+91 9876543216' },
        { id: 3, name: 'Alex Chen', status: 'Interview', package: '35 LPA', department: 'ECE', email: 'alex.chen@example.com', phone: '+91 9876543217' },
        { id: 4, name: 'Aditi ', status: 'Applied', package: 'Pending', department: 'ME', email: 'Aditi@gmail.com', phone: '+91 9876543218' }
      ]
    },
    {
      id: 3,
      name: 'Meta',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.png',
      students: [
        { id: 1, name: 'Vedant Siraskar', status: 'Placed', package: '50 LPA', department: 'CSE', email: 'vedant_siraskar@gmail.com', phone: '+91 9876543219' },
        { id: 2, name: 'Vedant Khasbage', status: 'Placed', package: '48 LPA', department: 'IT', email: 'vedant_khasbage@gmail.com', phone: '+91 9876543220' },
     //   { id: 3, name: 'Ryan Kumar', status: 'Final Round', package: 'Pending', department: 'ECE', email: 'ryan.kumar@example.com', phone: '+91 9876543221' },
        { id: 4, name: 'Priya Sharma', status: 'Technical Round', package: 'Pending', department: 'CSE', email: 'priya.sharma@example.com', phone: '+91 9876543222' },
       // { id: 5, name: 'Kevin Patel', status: 'Applied', package: 'Pending', department: 'IT', email: 'kevin.patel@example.com', phone: '+91 9876543223' }
      ]
    },
    {
      id: 4,
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png',
      students: [
        { id: 1, name: 'Prathamesh Ghodmare', status: 'Placed', package: '35 LPA', department: 'CSE', email: 'Prathamesh@gmail.com', phone: '+91 9876543224' },
        { id: 2, name: 'Arnav Patel', status: 'Applied', package: 'Pending', department: 'ME', email: 'Arnav.patel@gamil.com', phone: '+91 9876543225' },
        { id: 3, name: 'Lisa ', status: 'HR Round', package: 'Pending', department: 'IT', email: 'lisa@gmail.com', phone: '+91 9876543226' }
      ]
    },
    {
      id: 5,
      name: 'Apple',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png',
      students: [
        { id: 1, name: 'Usha Sahu', status: 'Placed', package: '55 LPA', department: 'CSE', email: 'Usha.Sahu@gmail.com', phone: '+91 9876543227' },
        { id: 2, name: 'Raju ', status: 'Technical Round', package: 'Pending', department: 'IT', email: 'Raju@example.com', phone: '+91 9876543228' },
       // { id: 3, name: 'Emma Roberts', status: 'Applied', package: 'Pending', department: 'ECE', email: 'emma.roberts@example.com', phone: '+91 9876543229' }
      ]
    },
    {
      id: 6,
      name: 'Netflix',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png',
      students: [
        { id: 1, name: 'Shivanand Gupta', status: 'Placed', package: '60 LPA', department: 'CSE', email: 'shiv@gmail.com', phone: '+91 9876543230' },
         { id: 2, name: 'Rupesh Katariya (brilliantt student)', status: 'Placed', package: '1 CR', department: 'CSE', email: 'rupesh.katariya@gmail.com', phone: '+91 9876543230' },
     //   { id: 2, name: 'James Wilson', status: 'Final Round', package: 'Pending', department: 'IT', email: 'james.wilson@example.com', phone: '+91 9876543231' },
        //{ id: 3, name: 'Sophia Brown', status: 'Technical Round', package: 'Pending', department: 'CSE', email: 'sophia.brown@example.com', phone: '+91 9876543232' }
      ]
    }
  ];

  const [selectedCompany, setSelectedCompany] = useState(null);

  // Categorize students into different sections
  const categorizeStudents = (students) => {
    return {
      placed: students.filter(student => 
        student.status === 'Placed' || student.status === 'Final Round'
      ),
      interview: students.filter(student => 
        student.status.includes('Round') && !student.status.includes('Final')
      ),
      applied: students.filter(student => 
        student.status === 'Applied'
      ),
      rejected: students.filter(student => 
        student.status === 'Rejected'
      )
    };
  };

  const StudentCard = ({ student }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{student.name}</h4>
          <p className="text-sm text-gray-600">{student.department}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            student.status === 'Placed' || student.status === 'Final Round'
              ? 'bg-green-100 text-green-800'
              : student.status === 'Rejected'
              ? 'bg-red-100 text-red-800'
              : student.status.includes('Round')
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {student.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Package:</span>
          <span className="font-medium text-gray-900">{student.package}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Email:</span>
          <span className="font-medium text-gray-900">{student.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phone:</span>
          <span className="font-medium text-gray-900">{student.phone}</span>
        </div>
      </div>
    </div>
  );

  const StudentSection = ({ title, students, icon, color, emptyMessage }) => (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-lg ${color} mr-3`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {title} <span className="text-gray-600">({students.length})</span>
        </h3>
      </div>
      
      {students.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );

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
                OpportunityGate
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
          <div className="flex space-x-8 items-center">
            {/* Dashboard */}
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeNav === 'dashboard'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            
            {/* Companies */}
            <button
              onClick={() => setActiveNav('companies')}
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeNav === 'companies'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Companies
            </button>
             <button
              onClick={() => setActiveNav('Analytics')}
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeNav === 'Analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            {/* Other Links - Coming Soon */}
            {["Students"].map((item) => (
              <div key={item} className="relative group">
                <button
                  className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2 cursor-not-allowed"
                  disabled
                >
                  {item}
                </button>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Coming Soon
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeNav === 'dashboard' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-gray-600">
                Manage your college's placement activities and student progress.
              </p>
            </div>

            {/* ... (rest of dashboard content remains same) ... */}
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
          </>
        )}
        {activeNav === 'Analytics' && (
  <div className="p-6 bg-gray-50 min-h-screen">
    {/* Header Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-gray-600 font-medium">Total Students</h3>
          <div className="text-2xl">👥</div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">125</div>
        <div className="text-green-600 text-sm font-medium">+5% from last year</div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-gray-600 font-medium">Placed Students</h3>
          <div className="text-2xl"></div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
        <div className="text-green-600 text-sm font-medium">+8% this month</div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-gray-600 font-medium">Placement Rate</h3>
          <div className="text-2xl"></div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">1.92%</div>
        <div className="text-green-600 text-sm font-medium">+0.8% growth</div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-gray-600 font-medium">Avg Package</h3>
          <div className="text-2xl"></div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">47.2 LPA</div>
        <div className="text-green-600 text-sm font-medium">+12% increase</div>
      </div>
    </div>

    {/* Charts Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Placement Trends Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Placement Trends</h3>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 6 Months</option>
            <option>Last Year</option>
            <option>All Time</option>
          </select>
        </div>
        <div className="h-64">
          <div className="flex items-end justify-between h-48 gap-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
              <div key={month} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-600 mb-2">{month}</div>
                <div className="w-full bg-gray-100 rounded-t-lg relative h-40">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg absolute bottom-0 transition-all duration-500"
                    style={{height: `${[15, 25, 40, 30, 60, 80][index]}%`}}
                  ></div>
                </div>
                <div className="text-sm font-medium text-gray-900 mt-2">{[3, 5, 8, 6, 12, 16][index]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Department Distribution</h3>
        </div>
        <div className="space-y-4">
          {[
            {dept: 'CSE', percentage: 65, color: 'bg-blue-500'},
            {dept: 'IT', percentage: 20, color: 'bg-green-500'},
            {dept: 'ECE', percentage: 10, color: 'bg-yellow-500'},
            {dept: 'ME', percentage: 5, color: 'bg-red-500'}
          ].map((item, index) => (
            <div key={item.dept} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <span className="text-sm font-medium text-gray-700">{item.dept}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                    style={{width: `${item.percentage}%`}}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Performance - Full Width */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Company Performance</h3>
        </div>
        <div className="space-y-4">
          {companies.map(company => {
            const placedCount = company.students.filter(s => s.status === 'Placed').length;
            const totalStudents = company.students.length;
            const placementRate = totalStudents > 0 ? (placedCount / totalStudents * 100).toFixed(1) : 0;
            
            return (
              <div key={company.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4 flex-1">
                  <img src={company.logo} alt={company.name} className="w-10 h-10 object-contain" />
                  <span className="font-medium text-gray-900">{company.name}</span>
                </div>
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-green-500 transition-all duration-500"
                      style={{width: `${placementRate}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-16">{placementRate}%</span>
                </div>
                <div className="text-sm text-gray-600 w-24 text-right">
                  {placedCount}/{totalStudents} placed
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
        </div>
        <div className="space-y-4">
          {[
            {status: 'Placed', count: 24, color: 'bg-green-500'},
            {status: 'Interview', count: 8, color: 'bg-blue-500'},
            {status: 'Applied', count: 15, color: 'bg-yellow-500'},
            {status: 'Rejected', count: 3, color: 'bg-red-500'},
            {status: 'Technical Round', count: 5, color: 'bg-purple-500'}
          ].map(item => (
            <div key={item.status} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm font-medium text-gray-700">{item.status}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{item.count} students</span>
                <span className="text-sm font-semibold text-gray-900 w-12">
                  {((item.count / 55) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Top Performers */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
      </div>
      <div className="space-y-3">
        {companies.flatMap(company => 
          company.students
            .filter(student => student.status === 'Placed')
            .map(student => ({...student, company: company.name}))
        )
        .sort((a, b) => {
          const aPackage = parseInt(a.package) || 0;
          const bPackage = parseInt(b.package) || 0;
          return bPackage - aPackage;
        })
        .slice(0, 5)
        .map((student, index) => (
          <div key={student.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                index === 0 ? 'bg-yellow-500' : 
                index === 1 ? 'bg-gray-400' : 
                index === 2 ? 'bg-orange-500' : 'bg-blue-500'
              }`}>
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{student.name}</div>
                <div className="text-sm text-gray-600">{student.company}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 text-lg">{student.package}</div>
              <div className="text-sm text-gray-600">{student.department}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
        {activeNav === 'companies' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
              <p className="text-gray-600">
                View company details and student placement information.
              </p>
            </div>

            {selectedCompany ? (
              <div>
                {/* Company Header */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedCompany.logo}
                        alt={selectedCompany.name}
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {selectedCompany.name}
                        </h3>
                        <p className="text-gray-600">
                          {selectedCompany.students.length} students associated
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCompany(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Back to Companies
                    </button>
                  </div>
                </div>

                {/* Student Sections */}
                <div className="space-y-6">
                  {(() => {
                    const categorized = categorizeStudents(selectedCompany.students);
                    return (
                      <>
                        <StudentSection
                          title="Placed & Final Round"
                          students={categorized.placed}
                          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                          color="bg-green-100"
                          emptyMessage="No students placed yet"
                        />
                        
                        <StudentSection
                          title="In Interview Process"
                          students={categorized.interview}
                          icon={<Clock className="h-5 w-5 text-yellow-600" />}
                          color="bg-yellow-100"
                          emptyMessage="No students in interview process"
                        />
                        
                        <StudentSection
                          title="Applied"
                          students={categorized.applied}
                          icon={<Send className="h-5 w-5 text-blue-600" />}
                          color="bg-blue-100"
                          emptyMessage="No students applied yet"
                        />

                        {categorized.rejected.length > 0 && (
                          <StudentSection
                            title="Rejected"
                            students={categorized.rejected}
                            icon={<Users className="h-5 w-5 text-red-600" />}
                            color="bg-red-100"
                            emptyMessage=""
                          />
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <div
                    key={company.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedCompany(company)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-12 h-12 object-contain rounded-lg"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {company.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {company.students.length} students
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Placed:</span>
                        <span className="font-medium">
                          {company.students.filter(s => s.status === 'Placed' || s.status === 'Final Round').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>In Process:</span>
                        <span className="font-medium">
                          {company.students.filter(s => s.status.includes('Round') && !s.status.includes('Final')).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Applied:</span>
                        <span className="font-medium">
                          {company.students.filter(s => s.status === 'Applied').length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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